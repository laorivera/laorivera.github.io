import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  @Input() calculationResult: any; // recive los stats calculados

  getStatValue(value: number): string {
    return value >= 0 ? 'positive' : 'negative';
  }

  getRoundValue(value: number): number {
    return Math.round(value);
  }

  limitDecimalPlaces(value: number, places: number): string {
    if (value === 0 && !value) {
      return '0';
    }
    return value.toFixed(places);
  }
  
}