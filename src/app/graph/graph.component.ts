import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {
  private chart: Chart | undefined;
  private _calculationResult: any;

  // Getter (optional, only needed if template or other methods need access)
  get calculationResult(): any {
    return this._calculationResult;
  }

  // Setter to handle input and update chart
  @Input()
  set calculationResult(value: any) {
    this._calculationResult = value;

    // Extract values directly in the setter
    const data = [
      value?.stats?.Strength || 0,
      value?.stats?.Vigor || 0,
      value?.stats?.Agility || 0,
      value?.stats?.Dexterity || 0,
      value?.stats?.Will || 0,
      value?.stats?.Knowledge || 0,
      value?.stats?.Resourcefulness || 0
    ];

    // Update chart if it exists
    if (this.chart) {
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('skillChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element with ID "skillChart" not found!');
      return;
    }

    // Initialize the chart with initial (or default) data
    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Strength', 'Vigor', 'Agility', 'Dexterity', 'Will', 'Knowledge', 'Resourcefulness'],
        datasets: [
          {
            label: 'Skill Levels',
            data: this._calculationResult?.stats
              ? [
                  this._calculationResult.stats.Strength || 0,
                  this._calculationResult.stats.Vigor || 0,
                  this._calculationResult.stats.Agility || 0,
                  this._calculationResult.stats.Dexterity || 0,
                  this._calculationResult.stats.Will || 0,
                  this._calculationResult.stats.Knowledge || 0,
                  this._calculationResult.stats.Resourcefulness || 0
                ]
              : [0, 0, 0, 0, 0, 0, 0], // Default data if no input yet
            backgroundColor: 'rgba(187, 183, 208, 0.57)',
            borderColor: 'rgb(144, 47, 28)',
            pointBackgroundColor: 'rgb(144, 47, 28)',
            pointBorderColor: 'rgba(220, 218, 228, 0.88)',
           
          },
        ],
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 40, // Assuming stats are out of 50
            angleLines: {
              display: true,
              color: 'rgba(255, 255, 255, 0.6)',
            },
            
            pointLabels: {
              display: true,
            },
            ticks: {
              display: false,
            },
            grid: {
              circular : true,
              color: 'rgba(131, 129, 129, 0.66)',
            },
          }
        }
      }
    });
  }
}