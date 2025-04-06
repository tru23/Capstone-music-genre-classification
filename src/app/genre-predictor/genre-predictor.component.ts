import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genre-predictor',
  standalone: true,
  imports: [CommonModule],  // 👈 Add this line
  templateUrl: './genre-predictor.component.html',
  styleUrls: ['./genre-predictor.component.css']
})
export class GenrePredictorComponent {
  selectedFile: File | null = null;
  predictedGenre: string | null = null;

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  predictGenre(): void {
    if (!this.selectedFile) {
      alert('Please upload a file first.');
      return;
    }

    // Simulate prediction
    this.predictedGenre = 'Jazz';
  }
}
