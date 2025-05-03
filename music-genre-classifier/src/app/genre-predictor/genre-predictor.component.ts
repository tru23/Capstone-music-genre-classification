import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-genre-predictor',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './genre-predictor.component.html',
  styleUrls: ['./genre-predictor.component.css']
})
export class GenrePredictorComponent implements AfterViewInit, AfterViewChecked {
  selectedFile: File | null = null;
  predictedGenre: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;
  recommendations: { name: string; url: string }[] = [];
  uploadedAudioUrl: string | null = null; // 🔊 preview audio
  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.predictedGenre = null;
      this.errorMessage = null;
      this.recommendations = [];
      this.uploadedAudioUrl = URL.createObjectURL(this.selectedFile); // 🔊 generate preview
    }
  }

  predictGenre(): void {
    if (!this.selectedFile) {
      alert('Please select a file before predicting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.loading = true;
    this.errorMessage = null;

    this.http.post<{ genre: string; recommendations?: { name: string; url: string }[] }>(
      'http://127.0.0.1:5000/predict', 
      formData
    ).subscribe({
      next: (res) => {
        this.predictedGenre = res.genre;
        this.recommendations = res.recommendations || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.predictedGenre = null;
        this.recommendations = [];
        this.errorMessage = err.error?.error || 'Prediction failed. Please try again.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.attachAudioEventListeners();
  }

  ngAfterViewChecked(): void {
    this.attachAudioEventListeners();
  }

  private attachAudioEventListeners(): void {
    const audios: NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio');
    audios.forEach(audio => {
      if (!(audio as any)._listenerAttached) {
        audio.addEventListener('play', () => {
          audios.forEach(other => {
            if (other !== audio) other.pause();
          });
        });
        (audio as any)._listenerAttached = true;
      }
    });
  }
}
