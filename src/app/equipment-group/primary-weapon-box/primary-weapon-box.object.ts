import { Component, EventEmitter, Input, Output, HostListener, inject } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { ApiConfigService } from '../../services/api-config.service';
//import { BoxesGroupComponent } from "../equipment-group.component";
import { Smanager,FetchManager, } from '../boxes-object';
//import { StateSelection  } from '../state-box.component';
import { ListItem } from '../state-object'; 

interface StateSelection {
    //  rating: string;
        uncommont: string ;
        uncommonv: number ;
         raret: string ;
         rarev: number ;
        epict: string ;
        epicv: number ;
        egendt: string ;
        legendt: string ;
        legendv: number ;
        uniquet: string ;
        uniquev: number ;
}

@Component({
  selector: 'primary-weapon-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './primary-weapon-box.component.html',
  styleUrl: './primary-weapon-box.component.css'
})

export class PrimaryWeaponBoxObject {
    selectedRatingIndex: number = 0;
    showList = false;
    showContextMenu = false;
    rating = "";
    state: StateSelection = {
       // rating: "",
        uncommont: "",
        uncommonv: 0,
        raret:  "",
        rarev:  0,
        epict:  "",
        epicv:  0,
        egendt: "",
        legendt:  "",
        legendv:  0,
        uniquet:  "",
        uniquev: 0
     }
  
    Sm = new Smanager();
    Fm = new FetchManager(this.Sm, 'weaponOne');

    @Input()
    set classSelection(value: string) {
      // Reset all selections when class changes
        this.Sm.resetSelection();
        this.Sm.setclassSelection(value);
        this.Fm.fetchList_Items('/pwolist/');
        
     }
    get classSelection(): string {
         return this.Sm.getclassSelection();
    }
   
    resetSelection() {

    this.showList = false;
    this.state = {
       // rating: "",
        uncommont: "",
        uncommonv: 0,
        raret:  "",
        rarev:  0,
        epict:  "",
        epicv:  0,
        egendt: "",
        legendt:  "",
        legendv:  0,
        uniquet:  "",
        uniquev: 0
     }

    }

    selectItem(item: ListItem) {
    this.Sm.resetSelection();
    this.Sm.setSelectedItem(item);
    console.log(this.Sm.getselectedItem()?.name)
    this.Fm.fetchItemData_Armor("/itemdisplay/");
    this.itemSelected.emit(item.name);
  }

  async onChangeRarity(event: number) { // Reset enchantment values and types // send quety to API // send event to parent // send event to css color box
    try {
    this.Sm.resetEnchant();
    this.Sm.setSelectedRarity(+event);
    
    console.log(this.Sm.getselectedRarity());
    this.rarityBoxColor();
    
    if (this.Sm.getselectedItem() && this.Sm.getselectedItem()?.name) {
    console.log('Rarity change start:', event);
     await this.Fm.fetchList_Rating("/pworatinglist/");
     console.log('Rating fetch complete');
     await this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
     console.log('Enchantment fetch complete');
    }
   // Emit rarity first so parent has it when rating handler runs
   this.raritySelected.emit(this.Sm.getselectedRarity());
   // Use setTimeout to ensure rarity handler completes before rating handler
   setTimeout(() => {
     this.ratingSelected.emit(this.Sm.getselectedRating());
   }, 0);
   this.resetSelection();
  }catch(error){console.error('error');}}

 onChangeRating(event: number) {
    const index = +event;
    console.log("rating weapon: ", index)
    this.Sm.setSelectedRating(this.Sm.getselectedRatingList()?.[index]?? 0);
    console.log(this.Sm.getselectedRating());

    this.ratingSelected.emit(this.Sm.getselectedRating());
   }

  @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
    // Only toggle showList if we're not clicking inside the modal box
    const target = event.target as HTMLElement;
    if (!target.closest('.modal-box')) {
      this.showList = !this.showList;
    }
    event.stopPropagation(); // Prevent document click from immediately closing it
  }

  @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent browser context menu
    if (this.Sm.getselectedItem() && this.Sm.getselectedItem()?.name) {
      this.showContextMenu = true;
    }
  }
  // Single document click handler for both list and context menu
  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
    this.showList = false;
  
    // Only close the context menu if the click is outside the modal box
    const target = event.target as HTMLElement;
    if (!target.closest('.modal-box') && !target.closest('.equipment-box')) {
      this.showContextMenu = false;
    }
  }
 
  onChangeEnchantment_TypeUncommon(event: string){
   
    this.Sm.setEnchantment('Uncommon',event, 0);
    //this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")}
    this.enchantmentSelected_TypeUncommon.emit(this.Sm.getEnchantment('Uncommon').type);
  }

  onChangeEnchantment_ValueUncommon(event: number){

    // Update the uncommon value
    this.Sm.setEnchantment('Uncommon', this.Sm.getEnchantment('Uncommon').type, event);
    // Re-fetch enchantment values with all current enchantment types
   console.log(this.Sm.getEnchantment('Uncommon').value)
    // Emit the event
    this.enchantmentSelected_ValueUncommon.emit(this.Sm.getEnchantment('Uncommon').value);
  }

   onChangeEnchantment_TypeRare(event: string){

    this.Sm.setEnchantment('Rare',event, 0);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")
    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")}
    this.enchantmentSelected_TypeRare.emit(this.Sm.getEnchantment('Rare').type);

  }
  
  onChangeEnchantment_ValueRare(event: number){

    this.Sm.setEnchantment('Rare', this.Sm.getEnchantment('Rare').type, event);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
    this.enchantmentSelected_ValueRare.emit(this.Sm.getEnchantment('Rare').value);
  }

  onChangeEnchantment_TypeEpic(event: string){

    this.Sm.setEnchantment('Epic',event, 0);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")
    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")}
    this.enchantmentSelected_TypeEpic.emit(this.Sm.getEnchantment('Epic').type);
  }
  
  onChangeEnchantment_ValueEpic(event: number){

    this.Sm.setEnchantment('Epic', this.Sm.getEnchantment('Epic').type, event);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
    this.enchantmentSelected_ValueEpic.emit(this.Sm.getEnchantment('Epic').value);
  }

  onChangeEnchantment_TypeLegendary(event: string){

    this.Sm.setEnchantment('Legendary',event, 0);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")};
    this.enchantmentSelected_TypeLegendary.emit(this.Sm.getEnchantment('Legendary').type);
  }
  
  onChangeEnchantment_ValueLegendary(event: number){

    this.Sm.setEnchantment('Legendary', this.Sm.getEnchantment('Legendary').type, event);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
    this.enchantmentSelected_ValueLegendary.emit(this.Sm.getEnchantment('Legendary').value);
  }

  onChangeEnchantment_TypeUnique(event: string){

    this.Sm.setEnchantment('Unique',event, 0);

    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")
    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/")}
    this.enchantmentSelected_TypeUnique.emit(this.Sm.getEnchantment('Unique').type);

  }
  
  onChangeEnchantment_ValueUnique(event: number){

    this.Sm.setEnchantment('Unique', this.Sm.getEnchantment('Unique').type, event);
    this.Fm.fetchEnchantment_Value("/enchantmentlistpwo/");
    this.enchantmentSelected_ValueUnique.emit(this.Sm.getEnchantment('Unique').value);

  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    
    // If value is an object, convert to string
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    // If value is a number, format with up to 2 decimal places
    if (typeof value === 'number') {
      let formattedValue = value.toFixed(2);
      // Remove trailing zeros after decimal point
      formattedValue = formattedValue.replace(/\.?0+$/, '');
      return formattedValue;
    }
    
    return String(value);
  }


  rarityBoxColor(): string {
    switch (this.Sm.getselectedRarity()) {
      case 1: return 'rarity-poor';
      case 2: return 'rarity-common';
      case 3: return 'rarity-uncommon';
      case 4: return 'rarity-rare';
      case 5: return 'rarity-epic';
      case 6: return 'rarity-legendary';
      case 7: return 'rarity-unique';
      default: return 'rarity-default';
    }
  }

  @Output() itemSelected = new EventEmitter<string>();
  @Output() raritySelected = new EventEmitter<number>();
  @Output() ratingSelected = new EventEmitter<number>();
  @Output() enchantmentSelected_TypeUncommon = new EventEmitter<string>();
  @Output() enchantmentSelected_ValueUncommon = new EventEmitter<number>();
  @Output() enchantmentSelected_TypeRare = new EventEmitter<string>();
  @Output() enchantmentSelected_ValueRare = new EventEmitter<number>();
  @Output() enchantmentSelected_TypeEpic = new EventEmitter<string>();
  @Output() enchantmentSelected_ValueEpic = new EventEmitter<number>();
  @Output() enchantmentSelected_TypeLegendary = new EventEmitter<string>();  
  @Output() enchantmentSelected_ValueLegendary = new EventEmitter<number>();
  @Output() enchantmentSelected_TypeUnique = new EventEmitter<string>();
  @Output() enchantmentSelected_ValueUnique = new EventEmitter<number>();
  //@Output() selectionpwo = new EventEmitter<any>();
}
    