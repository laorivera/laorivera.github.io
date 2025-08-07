import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-character-box',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './character-box.component.html',
  styleUrl: './character-box.component.css'
})

export class CharacterBoxComponent {
    //selected character's image
    selectedCharacterImage: string = '';
    selectedRaceImage: string = '';

  @Output() characterSelected = new EventEmitter<number>(); 
  @Output() raceSelected = new EventEmitter<string>();

  // List of character classes
  characterClasses: string[] = [ 'No selection',
    'Fighter', 'Barbarian', 'Rogue', 'Wizard', 'Cleric', 
    'Warlock', 'Bard', 'Druid', 'Ranger', 'Sorcerer'
  ];

  characterRaces: string[] = [ 'No selection', 'Elf', 'Dark Elf', 'Felidian', 'Panther', 'Lycan', 'Lizardmen',
    'Mummy', 'Orc', 'Zombie', 'Skeleton', 'Elite Skeleton', 'Nightmare Skeleton', 'Skeleton Champion', 'Frost Walker'
   ]


  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectRace(0); // Reset
    this.selectCharacter(+target.value); // Convert string to number

  }
  onChangeRace(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectRace(+target.value); // Convert string to number
  }
  // Method to toggle or change the selected character
  selectCharacter(index: number) {
    console.log('Character selected:', index); // debug
    this.selectedCharacterImage = `assets/${index}.png`;
    this.characterSelected.emit(index);
  }

  selectRace(index: number) {
    this.selectedRaceImage = `assets/${this.characterRaces[index]}.png`;
    this.raceSelected.emit(this.characterRaces[index]);
  }
}