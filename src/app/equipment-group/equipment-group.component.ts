import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, ViewChildren, QueryList, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadBoxComponent } from './head-box/head-box.component';
import { ChestBoxComponent } from './chest-box/chest-box.component';
import { GlovesBoxComponent } from './gloves-box/gloves-box.component';
import { PantsBoxComponent } from './pants-box/pants-box.component';
import { BootsBoxComponent } from './boots-box/boots-box.component';
import { NecklaceBoxComponent } from './necklace-box/necklace-box.component';
import { CloakBoxComponent } from './cloak-box/cloak-box.component';
import { RingBoxComponent } from './ring-box/ring-box.component';
import { RingBoxComponentTwo } from './ring-box-two/ring-box.component-two';
import { ApiConfigService } from '../services/api-config.service';
import { PrimaryWeaponBoxComponent } from './primary-weapon-box/primary-weapon-box.component';
import { SecondaryWeaponBoxComponent } from './secondary-weapon-box/secondary-weapon-box.component';


@Component({
  selector: 'app-boxes-group',
  standalone: true,
  imports: [
    CommonModule,
    HeadBoxComponent,
    ChestBoxComponent,
    GlovesBoxComponent,
    PantsBoxComponent,
    BootsBoxComponent,
    NecklaceBoxComponent,
    CloakBoxComponent,
    RingBoxComponent,
    RingBoxComponentTwo,
    PrimaryWeaponBoxComponent,
    SecondaryWeaponBoxComponent
],
  templateUrl: './equipment-group.component.html',
  styleUrl: './equipment-group.component.css'
})


export class BoxesGroupComponent {
   private doubleHandlist: string[] = [
      "Lute",
      "Zweihander",
      "War Maul",
      "Crystal Sword",
      "Quarterstaff",
      "Longsword",
      "Bardiche",
      "Halberd",
      "Spear",
      "Battle Axe",
      "Double Axe",
      "Felling Axe",
      "Longbow",
      "Recurve Bow",
      "Survival Bow",
      "Crossbow",
      "Windlass Crossbow",
      "Ceremonial Staff",
      "Magic Staff",
      "Spellbook",
      "Pavise",
    ]
  private _classSelection: string = "";
  private _raceSelection: string = '';
 //private doubleHanded: boolean = false;
  allclass: string[]= ["", "Fighter", "Barbarian", "Rogue", "Wizard", "Cleric", "Warlock", "Bard", "Ranger", "Soccerer"]
  @Input()
  set classSelection(value: string) {
    this._classSelection = value;
    this.onCharacterSelected();
  }
  
  get classSelection(): string {
    return this._classSelection;
  }

  @Input()
  set raceSelection(value: string) {
    this._raceSelection = value;
    this.onRaceSelected();
  }

  get raceSelection(): string {
    return this._raceSelection;
  }

  @Output() calculationResultChanged = new EventEmitter<any>(); 
  

  @ViewChildren(HeadBoxComponent) headBoxes!: QueryList<HeadBoxComponent>;
  @ViewChildren(ChestBoxComponent) chestBoxes!: QueryList<ChestBoxComponent>;
  @ViewChildren(GlovesBoxComponent) glovesBoxes!: QueryList<GlovesBoxComponent>;
  @ViewChildren(PantsBoxComponent) pantsBoxes!: QueryList<PantsBoxComponent>;
  @ViewChildren(BootsBoxComponent) bootsBoxes!: QueryList<BootsBoxComponent>;
  @ViewChildren(NecklaceBoxComponent) necklaceBoxes!: QueryList<NecklaceBoxComponent>;
  @ViewChildren(CloakBoxComponent) cloakBoxes!: QueryList<CloakBoxComponent>;
  @ViewChildren(RingBoxComponent) ringBoxes!: QueryList<RingBoxComponent>;
  @ViewChildren(PrimaryWeaponBoxComponent) primaryWeaponBoxes!: QueryList<PrimaryWeaponBoxComponent>;



  selectedItems:        {[key: string]: string} = {}; 
  selectedRarites:      {[key: string]: string} = {}; 
  selectedRatings:      {[key: string]: string} = {};
  selectedEnchant:      {[key: string]: string} = {};
  selectedEnchantValue: {[key: string]: number} = {}; 

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  onCharacterSelected() {
    
    if (this.headBoxes) {
      this.headBoxes.forEach(component => component.resetSelection());
    }
    if (this.chestBoxes) {
      this.chestBoxes.forEach(component => component.resetSelection());
    }
    if (this.glovesBoxes) {
      this.glovesBoxes.forEach(component => component.resetSelection());
    }
    if (this.pantsBoxes) {
      this.pantsBoxes.forEach(component => component.resetSelection());
    }
    if (this.necklaceBoxes) {
      this.necklaceBoxes.forEach(component => component.resetSelection());
    }
    if (this.cloakBoxes) {
      this.cloakBoxes.forEach(component => component.resetSelection());
    }
    if (this.ringBoxes) {
      this.ringBoxes.forEach(component => component.resetSelection());
    }
    if (this.primaryWeaponBoxes) {
      this.primaryWeaponBoxes.forEach(component => component.resetSelection());
    }
    
    // Reset all selected values
    this.selectedItems = {};
    this.selectedRarites = {}; 
    this.selectedRatings = {}; 
    this.selectedEnchant = {}; 
    this.selectedEnchantValue = {};
    
    this.calculateCharacter(); // funcion calcula character base
  }

  onRaceSelected() {
    // Reset all selected values
    console.log(this._raceSelection)
    this.calculateEquipment(); // funcion calcula character base
  }


  resetEnchantment(slot: string){
    //console.log(slot)
    for (let i = 1; i <= 5; i++){
      this.selectedEnchant[`enchantment_${slot}type`] = ""
      this.selectedEnchantValue[`enchantment_${slot}value`] = 0;
      this.selectedEnchant[`enchantment_${slot}type${i}`] = "";
      this.selectedEnchantValue[`enchantment_${slot}value${i}`] = 0;
    }
  }

  resetRarity(slot: string){
    //console.log(slot)
    this.selectedRarites[`rarityselect_${slot}`] = "";
  }

  resetRating(slot: string){
    //console.log(slot)
    this.selectedRatings[`armorrating_${slot}`] = "";
  }

  onItemSelected_Helmet(slot: string, itemName: string) {
    console.log(slot)
    console.log(itemName)
    
    const slotType = slot.split('item')[1]; 
   
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
 
    this.resetEnchantment(slotType);

    // new item
    this.selectedItems[slot] = itemName;
    //console.log(slot)
    //console.log(this.selectedItems)
    this.calculateEquipment(); 
  }

  onItemSelected_Chest(slot: string, itemName: string) { 
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
    this.resetEnchantment(slotType);

    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_Gloves(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }

  
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_Pants(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_Boots(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_Cloak(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_Necklace(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_Ring(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
  
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_RingTwo(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}two`]){
      this.resetRarity(slotType);
    }
  
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  onItemSelected_PrimaryWeapon(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
  
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }

  doubleHandedSelected(itemName: string) {
   for (const item of this.doubleHandlist) {
      if (item === itemName) {
        return true; // 
      }
    }
    return false; // Not found in the list
  }
   
  onItemSelected_SecondaryWeapon(slot: string, itemName: string) {
    const slotType = slot.split('item')[1]; 
    //console.log(slotType)
    if (this.selectedRarites[`rarityselect_${slotType}`]){
      this.resetRarity(slotType);
    }
    
    if (this.selectedRatings[`armorrating_${slotType}`]){
      this.resetRating(slotType);
    }
    this.resetEnchantment(slotType);
    this.selectedItems[slot] = itemName;
    this.calculateEquipment(); 
  }


  onRaritySelected(slot: string, rarity: number){ 
    this.selectedRarites[slot] = String(rarity);
    const slotType = slot.split('_')[1]; 
    //console.log(slot)
    // Reset enchantments for this slot
    this.resetEnchantment(slotType);
    this.calculateEquipment();
  }


  onRatingSelected(slot: string, rating: number){
    this.selectedRatings[slot] = String(rating);
    //console.log(this.selectedRatings)
    this.calculateEquipment();
  }

  onEnchantmentSelected_TypeUncommon(slot: string, enchantment: string) {
    // Reset enchantments for this slot
    console.log(this.selectedEnchant[slot])
    console.log(slot)
    const valueSlot = slot.replace('type', 'value');
    console.log(valueSlot)
    this.selectedEnchantValue[valueSlot] = 0;
    console.log(this.selectedEnchantValue[valueSlot])
    this.selectedEnchant[slot] = enchantment;
    console.log(this.selectedEnchant[slot])
    this.calculateEquipment();
  }

  onEnchantmentSelected_ValueUncommon(slot: string, enchantmentValue: number) {
    this.selectedEnchantValue[slot] = enchantmentValue;
    this.calculateEquipment();
  }

  onEnchantmentSelected_TypeRare(slot: string, enchantment: string) {
    // Reset enchantments for this slot
    const valueSlot = slot.replace('type2', 'value2');
    this.selectedEnchantValue[valueSlot] = 0;
    this.selectedEnchant[slot] = enchantment;
    this.calculateEquipment();
  }

  onEnchantmentSelected_ValueRare(slot: string, enchantmentValue: number) {
    this.selectedEnchantValue[slot] = enchantmentValue;
    this.calculateEquipment();
  }

  onEnchantmentSelected_TypeEpic(slot: string, enchantment: string) {
    const valueSlot = slot.replace('type3', 'value3');
    this.selectedEnchantValue[valueSlot] = 0;
    this.selectedEnchant[slot] = enchantment;
    this.calculateEquipment();
  }

  onEnchantmentSelected_ValueEpic(slot: string, enchantmentValue: number) {
    this.selectedEnchantValue[slot] = enchantmentValue;
    this.calculateEquipment();
  }

  onEnchantmentSelected_TypeLegendary(slot: string, enchantment: string) {
    const valueSlot = slot.replace('type4', 'value4');
    this.selectedEnchantValue[valueSlot] = 0;
    this.selectedEnchant[slot] = enchantment;
    this.calculateEquipment();
  }

  onEnchantmentSelected_ValueLegendary(slot: string, enchantmentValue: number) {
    this.selectedEnchantValue[slot] = enchantmentValue;
    this.calculateEquipment();
  }

  onEnchantmentSelected_TypeUnique(slot: string, enchantment: string) {
    const valueSlot = slot.replace('type5', 'value5');
    this.selectedEnchantValue[valueSlot] = 0;
    this.selectedEnchant[slot] = enchantment;
    this.calculateEquipment();
  }

  onEnchantmentSelected_ValueUnique(slot: string, enchantmentValue: number) {
    this.selectedEnchantValue[slot] = enchantmentValue;
    this.calculateEquipment();
  }

  private buildEquipmentPayload(): any {
  const buildEnchant = (slotPrefix: string): any => ({
    TypeU: this.selectedEnchant[`enchantment_${slotPrefix}type`] || '',
    ValueU: this.selectedEnchantValue[`enchantment_${slotPrefix}value`]?.toString() || '0',
    TypeR: this.selectedEnchant[`enchantment_${slotPrefix}type2`] || '',
    ValueR: this.selectedEnchantValue[`enchantment_${slotPrefix}value2`]?.toString() || '0',
    TypeE: this.selectedEnchant[`enchantment_${slotPrefix}type3`] || '',
    ValueE: this.selectedEnchantValue[`enchantment_${slotPrefix}value3`]?.toString() || '0',
    TypeL: this.selectedEnchant[`enchantment_${slotPrefix}type4`] || '',
    ValueL: this.selectedEnchantValue[`enchantment_${slotPrefix}value4`]?.toString() || '0',
    TypeQ: this.selectedEnchant[`enchantment_${slotPrefix}type5`] || '',
    ValueQ: this.selectedEnchantValue[`enchantment_${slotPrefix}value5`]?.toString() || '0',
    TypeA: '',
    ValueA: '0'
  });

  return {
    class: this._classSelection,
    race: this._raceSelection,
    itemSlot: {
      head: {
        name: this.selectedItems['itemhead'] || '',
        rarity: this.selectedRarites['rarityselect_head'] || '0',
        rating: this.selectedRatings['armorrating_head'] || '0',
        enchant: buildEnchant('head')
      },
      chest: {
        name: this.selectedItems['itemchest'] || '',
        rarity: this.selectedRarites['rarityselect_chest'] || '0',
        rating: this.selectedRatings['armorrating_chest'] || '0',
        enchant: buildEnchant('chest')
      },
      hands: {
        name: this.selectedItems['itemgloves'] || '',
        rarity: this.selectedRarites['rarityselect_gloves'] || '0',
        rating: this.selectedRatings['armorrating_gloves'] || '0',
        enchant: buildEnchant('gloves')
      },
      pants: {
        name: this.selectedItems['itempants'] || '',
        rarity: this.selectedRarites['rarityselect_pants'] || '0',
        rating: this.selectedRatings['armorrating_pants'] || '0',
        enchant: buildEnchant('pants')
      },
      foot: {
        name: this.selectedItems['itemboots'] || '',
        rarity: this.selectedRarites['rarityselect_boots'] || '0',
        rating: this.selectedRatings['armorrating_boots'] || '0',
        enchant: buildEnchant('boots')
      },
      back: {
        name: this.selectedItems['itemcloak'] || '',
        rarity: this.selectedRarites['rarityselect_cloak'] || '0',
        rating: this.selectedRatings['armorrating_cloak'] || '0',
        enchant: buildEnchant('cloak')
      },
      necklace: {
        name: this.selectedItems['itemnecklace'] || '',
        rarity: this.selectedRarites['rarityselect_necklace'] || '0',
        rating: '0', // Necklaces might not have ratings
        enchant: buildEnchant('necklace')
      },
      ringOne: {
        name: this.selectedItems['itemring'] || '',
        rarity: this.selectedRarites['rarityselect_ring'] || '0',
        rating: '0', // Rings might not have ratings
        enchant: buildEnchant('ring')
      },
      ringTwo: {
        name: this.selectedItems['itemringtwo'] || '',
        rarity: this.selectedRarites['rarityselect_ringtwo'] || '0',
        rating: '0', // Rings might not have ratings
        enchant: buildEnchant('ringtwo')
      },
      weaponOne: {
        name: this.selectedItems['itemprimaryweapon'] || '',
        rarity: this.selectedRarites['rarityselect_primaryweapon'] || '0',
        rating: this.selectedRatings['armorrating_primaryweapon'] || '0',
        enchant: buildEnchant('primaryweapon')
      },
      weaponTwo: {
        name: this.selectedItems['itemsecondaryweapon'] || '',
        rarity: this.selectedRarites['rarityselect_secondaryweapon'] || '0',
        rating: this.selectedRatings['armorrating_secondaryweapon'] || '0',
        enchant: buildEnchant('secondaryweapon')
      }
    }
  };
}


  // API CALL TO CALCULATE EQUIPMENT
   calculateEquipment() {
    const payload = this.buildEquipmentPayload();
    
    this.apiConfig.postData('/api/', payload).subscribe({
      next: (response) => {
        this.calculationResultChanged.emit(response);
      },
      error: (err) => {
        console.error('Error calculating equipment:', err);
        this.calculationResultChanged.emit(null);
      },
    });
  }

  // API call to calculate character
  calculateCharacter() {
     const payload = this.buildEquipmentPayload();
    
    this.apiConfig.postData('/api/', payload).subscribe({
      next: (response) => {
        this.calculationResultChanged.emit(response);
      },
      error: (err) => {
        console.error('Error calculating equipment:', err);
        this.calculationResultChanged.emit(null);
      },
    });
  }

  fetchCharacterData() {
    const params = new URLSearchParams();
    // ... existing params code ...
    const url = this.apiConfig.getApiUrl(`/charbuilder/${this.classSelection}?${params.toString()}`);
    this.http.get<any>(url).subscribe({
      // ... existing code ...
    });
  }

  fetchCharacterData_NoParams() {
    const url = this.apiConfig.getApiUrl(`/charbuilder/${this._classSelection}`);
    this.http.get<any>(url).subscribe({
      // ... existing code ...
    });
  }

  closeAllDropdownsExcept(except?: any) {
  // Close all equipment dropdowns
  [
    ...this.headBoxes?.toArray() || [],
    ...this.chestBoxes?.toArray() || [],
    ...this.glovesBoxes?.toArray() || [],
    ...this.pantsBoxes?.toArray() || [],
    ...this.bootsBoxes?.toArray() || [],
    ...this.necklaceBoxes?.toArray() || [],
    ...this.cloakBoxes?.toArray() || [],
    ...this.ringBoxes?.toArray() || [],
    ...this.primaryWeaponBoxes?.toArray() || [],
    
  ].forEach(box => {
    if (box !== except) {
      box.showList = false;
    }
  });
}


}