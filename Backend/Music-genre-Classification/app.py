from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import librosa
import numpy as np
import joblib
import scipy.stats

# ==== Configs ====
SAMPLE_RATE = 22050
NUM_MFCC = 20
N_FFT = 2048
HOP_LENGTH = 512

app = Flask(__name__)
CORS(app)

# ==== Load Trained Model ====
model = joblib.load("model/music_genre_model.pkl")

@app.route('/')
def home():
    return "🎶 Music Genre Prediction API is up and running!"

@app.route('/predict', methods=['POST'])
def predict_genre():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file name provided'}), 400

    # Save uploaded file temporarily
    os.makedirs('temp', exist_ok=True)
    filepath = os.path.join('temp', file.filename)
    file.save(filepath)

    try:
        # Load the full audio file
        signal, sr = librosa.load(filepath, sr=SAMPLE_RATE)

        # === Extract all 55 features ===
        chroma_stft = librosa.feature.chroma_stft(y=signal, sr=sr)
        rms = librosa.feature.rms(y=signal)
        spectral_centroid = librosa.feature.spectral_centroid(y=signal, sr=sr)
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=signal, sr=sr)
        rolloff = librosa.feature.spectral_rolloff(y=signal, sr=sr)
        zero_crossing_rate = librosa.feature.zero_crossing_rate(y=signal)
        mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=NUM_MFCC)
        tempo, _ = librosa.beat.beat_track(y=signal, sr=sr)

        # Combine all features
        features = np.hstack([
            np.mean(chroma_stft), np.var(chroma_stft),
            np.mean(rms), np.var(rms),
            np.mean(spectral_centroid), np.var(spectral_centroid),
            np.mean(spectral_bandwidth), np.var(spectral_bandwidth),
            np.mean(rolloff), np.var(rolloff),
            np.mean(zero_crossing_rate), np.var(zero_crossing_rate),
            tempo,
            np.mean(rms),  # energy
            scipy.stats.entropy(np.abs(rms[0])) if rms.any() else 0,
        ])

        for i in range(NUM_MFCC):
            features = np.append(features, [np.mean(mfcc[i]), np.var(mfcc[i])])

        features = features.reshape(1, -1)

        # Predict
        prediction = model.predict(features)
        predicted_genre = prediction[0]

        os.remove(filepath)  # Clean up
        return jsonify({'genre': predicted_genre})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
