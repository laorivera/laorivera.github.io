import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoxesGroupComponent } from "./equipment-group/equipment-group.component";
import { StatsComponent } from "./stats/stats.component";
import { CharacterBoxComponent } from "./character-group/character-box/character-box.component";
import { GraphComponent } from "./graph/graph.component"
import { SidebarComponent } from './sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoxesGroupComponent, StatsComponent, CharacterBoxComponent, GraphComponent, SidebarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
}) 

export class AppComponent {
  calculationResult: any = null; // Store the calculation result
  calculationResultWeapon: any = null; // Store the weapon calculation result
  classSelection: number = 0; // Store the selected class
  raceSelection: string = ""; // Store

  

  onClassSelected(classId: number) {
    this.classSelection = classId;
  }

  onRaceSelected(raceId: string) {
    this.raceSelection = raceId;
  }

  onCalculationResultChanged(result: any) {
    this.calculationResult = result; // Update the calculation result
  }
}