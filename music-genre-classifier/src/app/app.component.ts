import { Component } from '@angular/core';
import { GenrePredictorComponent } from './genre-predictor/genre-predictor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GenrePredictorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
