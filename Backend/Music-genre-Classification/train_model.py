import pandas as pd
import os
os.makedirs("model", exist_ok=True)  # ✅ Create folder if it doesn't exist
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("data/data.csv")
X = df.drop(["filename", "genre"], axis=1)

# Clean genre column (get only the folder name if it's a path)
df["genre"] = df["genre"].apply(lambda x: os.path.basename(x).capitalize())  # ✅ Ex: '.../disco' -> 'Disco'
y = df["genre"]

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model
joblib.dump(model, "model/music_genre_model.pkl")
print("✅ Model trained and saved.")
