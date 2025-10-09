import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoxesGroupComponent } from "./equipment-group/equipment-group.component";
import { StatsComponent } from "./stats/stats.component";
import { CharacterBoxComponent } from "./character-group/character-box/character-box.component";
import { GraphComponent } from "./graph/graph.component"
import { SidebarComponent } from './sidebar/sidebar.component';
import { CalculationResult, ComputedWeaponStats } from './app.datafetch';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoxesGroupComponent, StatsComponent, CharacterBoxComponent, GraphComponent, SidebarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
}) 

export class AppComponent {
  private createDefaultCalculationResult(): CalculationResult {
  return {
    computedstats: {
      Health: 0,
      MaxHealthBonus: 0,
      ActionSpeed: 0,
      RegularInteractionSpeed: 0,
      MoveSpeed: 0,
      MoveSpeedCalc: 0,
      PhysicalPower: 0,
      PhysicalPowerBonus: 0,
      HealthRecovery: 0,
      ManualDexterity: 0,
      EquipSpeed: 0,
      MagicalPower: 0,
      MagicalPowerBonus: 0,
      BuffDuration: 0,
      MagicRating: 0,
      MagicalDamageReduction: 0,
      DebuffDuration: 0,
      MemoryCapacity: 0,
      MemoryCapacityBonus: 0,
      SpellRecovery: 0,
      SpellCastingSpeed: 0,
      MagicalInteractionSpeed: 0,
      Persuasiveness: 0,
      CooldownReduction: 0,
      PhysicalDamageReduction: 0,
      SpellRecoveryBonus: 0,
      PhysicalHealing: 0,
      MagicalHealing: 0,
      MemorySpellPayload: 0,
      MemoryMusicPayload: 0,
      UtilityEffectiveness: 0,
      Luck: 0,
      ArmorPenetration: 0,
      MagicPenetration: 0,
      HeadshotReduction: 0,
      ProjectileReduction: 0,
      FromArmorRating: 0,
      BonusPhysicalDamageReduction: 0,
      BonusMagicalDamageReduction: 0,
      BonusPhysicalPower: 0,
      BonusMagicalPower: 0,
      TruePhysicalDamage: 0,
      TrueMagicalDamage: 0
    },
    computedstatsweapon: {
      PrimaryWeapon: { Attackone: 0, Attacktwo: 0, Attackthree: 0, Attackfour: 0 },
      SecondaryWeapon: { Attackone: 0, Attacktwo: 0, Attackthree: 0, Attackfour: 0 },
      PrimaryImpactPower: 0,
      SecondaryImpactPower: 0
    },
    stats: {
      Strength: 0,
      Vigor: 0,
      Agility: 0,
      Dexterity: 0,
      Will: 0,
      Knowledge: 0,
      Resourcefulness: 0
    }
  };
}
  calculationResult: CalculationResult = this.createDefaultCalculationResult()
  classSelection: string = ""; 
  raceSelection: string = ""; 

  
  onClassSelected(classId: string) {
    this.classSelection = classId;
  }

  onRaceSelected(raceId: string) {
    this.raceSelection = raceId;
  }

  onCalculationResultChanged(result: any) {
    
    this.calculationResult = result; // Update the calculation result
  }
}