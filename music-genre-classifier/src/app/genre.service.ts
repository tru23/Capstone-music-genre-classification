import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private apiUrl = 'http://localhost:5000/predict';

  constructor(private http: HttpClient) {}

  predictGenre(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ genre: string }>(this.apiUrl, formData);
  }
}
