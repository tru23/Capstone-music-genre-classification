import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-genre-predictor',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './genre-predictor.component.html',
  styleUrls: ['./genre-predictor.component.css']
})
export class GenrePredictorComponent {
  selectedFile: File | null = null;
  predictedGenre: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.predictedGenre = null;
      this.errorMessage = null;
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

    // 🔁 ✅ Update here: use 127.0.0.1 instead of localhost
    this.http.post<{ genre: string }>('http://127.0.0.1:5000/predict', formData).subscribe({
      next: (res) => {
        this.predictedGenre = res.genre;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.predictedGenre = null;
        this.errorMessage = err.error?.error || 'Prediction failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
