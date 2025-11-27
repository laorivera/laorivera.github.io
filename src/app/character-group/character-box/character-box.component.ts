import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-character-box',
  //standalone: true, 
  imports: [],
  templateUrl: './character-box.component.html',
  styleUrl: './character-box.component.css'
})

export class CharacterBoxComponent {
    //selected character's image
  selectedCharacterImage: string = '';
  selectedRaceImage: string = '';

  @Output() characterSelected = new EventEmitter<string>(); 
  @Output() raceSelected = new EventEmitter<string>();

  // List of character classes
  characterClasses: string[] = [ 'No selection',
    'Fighter', 'Barbarian', 'Rogue', 'Wizard', 'Cleric', 
    'Warlock', 'Bard', 'Druid', 'Ranger', 'Sorcerer'
  ];

  characterRaces: string[] = [ 'No selection', 'Elf', 'Dark Elf', 'Felidian', 'Panther', 'Lycan', 'Lizardmen',
    'Mummy', 'Orc', 'Zombie', 'Skeleton', 'Elite Skeleton', 'Nightmare Skeleton', 'Skeleton Champion', 'Frost Walker'
   ]

  characterSkills: string[] = [ 'No selection' ];

  // Map character classes to their available skills
  private classSkillsMap: { [key: string]: string[] } = {
    'No selection': ['No selection'],
    'Fighter': ['No selection', 'Power Strike', 'Shield Bash', 'Charge', 'Whirlwind', 'Berserker Rage'],
    'Barbarian': ['No selection', 'Frenzy', 'Intimidating Shout', 'Bloodlust', 'Rage', 'Brutal Strike'],
    'Rogue': ['No selection', 'Backstab', 'Stealth', 'Poison Strike', 'Shadow Step', 'Lockpick'],
    'Wizard': ['No selection', 'Fireball', 'Ice Bolt', 'Lightning', 'Teleport', 'Magic Shield'],
    'Cleric': ['No selection', 'Heal', 'Bless', 'Turn Undead', 'Divine Smite', 'Protection'],
    'Warlock': ['No selection', 'Dark Bolt', 'Summon Demon', 'Cursed Touch', 'Soul Drain', 'Hellfire'],
    'Bard': ['No selection', 'Inspire', 'Charm', 'Song of Valor', 'Lullaby', 'Battle Hymn'],
    'Druid': ['No selection', 'Nature\'s Wrath', 'Shape Shift', 'Healing Touch', 'Entangle', 'Call Beast'],
    'Ranger': ['No selection', 'Arrow Storm', 'Track', 'Beast Companion', 'Camouflage', 'Hunters Mark'],
    'Sorcerer': ['No selection', 'Arcane Blast', 'Mana Shield', 'Time Warp', 'Elemental Burst', 'Mystic Bolt']
  };

  selectedSkill1: string = '';
  selectedSkill2: string = '';
  selectedSkill3: string = '';
  selectedSkill4: string = '';

  selectedSkill1Image: string = '';
  selectedSkill2Image: string = '';
  selectedSkill3Image: string = '';
  selectedSkill4Image: string = '';

  @Output() skill1Selected = new EventEmitter<string>();
  @Output() skill2Selected = new EventEmitter<string>();
  @Output() skill3Selected = new EventEmitter<string>();
  @Output() skill4Selected = new EventEmitter<string>();

  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectRace(0); // Reset
    this.selectCharacter(+target.value);
    // Reset skills when character changes
    this.resetSkills();
  }
  onChangeRace(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectRace(+target.value); 
  }

  // Get available skills for each slot (excluding already selected skills from other slots)
  getAvailableSkills1(): string[] {
    const selected = [this.selectedSkill2, this.selectedSkill3, this.selectedSkill4].filter(s => s && s !== 'No selection');
    return this.characterSkills.filter(skill => skill === this.selectedSkill1 || !selected.includes(skill));
  }

  getAvailableSkills2(): string[] {
    const selected = [this.selectedSkill1, this.selectedSkill3, this.selectedSkill4].filter(s => s && s !== 'No selection');
    return this.characterSkills.filter(skill => skill === this.selectedSkill2 || !selected.includes(skill));
  }

  getAvailableSkills3(): string[] {
    const selected = [this.selectedSkill1, this.selectedSkill2, this.selectedSkill4].filter(s => s && s !== 'No selection');
    return this.characterSkills.filter(skill => skill === this.selectedSkill3 || !selected.includes(skill));
  }

  getAvailableSkills4(): string[] {
    const selected = [this.selectedSkill1, this.selectedSkill2, this.selectedSkill3].filter(s => s && s !== 'No selection');
    return this.characterSkills.filter(skill => skill === this.selectedSkill4 || !selected.includes(skill));
  }

  private getSkillImagePath(skillName: string): string {
    if (!skillName || skillName === 'No selection') return '';
    // Replace spaces and special characters with underscores for file names
    const sanitized = skillName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    return `assets/${sanitized}.png`;
  }

  onChangeSkill1(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSkill1 = target.value || '';
    this.selectedSkill1Image = this.getSkillImagePath(this.selectedSkill1);
    this.skill1Selected.emit(this.selectedSkill1);
  }

  onChangeSkill2(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSkill2 = target.value || '';
    this.selectedSkill2Image = this.getSkillImagePath(this.selectedSkill2);
    this.skill2Selected.emit(this.selectedSkill2);
  }

  onChangeSkill3(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSkill3 = target.value || '';
    this.selectedSkill3Image = this.getSkillImagePath(this.selectedSkill3);
    this.skill3Selected.emit(this.selectedSkill3);
  }

  onChangeSkill4(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSkill4 = target.value || '';
    this.selectedSkill4Image = this.getSkillImagePath(this.selectedSkill4);
    this.skill4Selected.emit(this.selectedSkill4);
  }

  selectCharacter(index: number) {
    //console.log('Character selected:', index); // debug
    const selectedClass = this.characterClasses[index];
    this.selectedCharacterImage = `assets/${selectedClass}.png`;
    this.characterSelected.emit(selectedClass);
    
    // Update available skills based on selected class
    this.characterSkills = this.classSkillsMap[selectedClass] || ['No selection'];
  }

  resetSkills() {
    this.selectedSkill1 = '';
    this.selectedSkill2 = '';
    this.selectedSkill3 = '';
    this.selectedSkill4 = '';
    this.selectedSkill1Image = '';
    this.selectedSkill2Image = '';
    this.selectedSkill3Image = '';
    this.selectedSkill4Image = '';
    this.skill1Selected.emit('');
    this.skill2Selected.emit('');
    this.skill3Selected.emit('');
    this.skill4Selected.emit('');
  }

  selectRace(index: number) {
    this.selectedRaceImage = `assets/${this.characterRaces[index]}.png`;
    this.raceSelected.emit(this.characterRaces[index]);
  }
}