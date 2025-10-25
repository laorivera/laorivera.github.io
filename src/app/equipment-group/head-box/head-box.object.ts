import { Component, EventEmitter, Input, Output, HostListener, inject } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { ApiConfigService } from '../../services/api-config.service';
//import { BoxesGroupComponent } from "../equipment-group.component";
import { Smanager,FetchManager, } from '../boxes-object';
import { StateSelection  } from './state-box.component';
import { ListItem } from '../state-object'; 

@Component({
  selector: 'head-boxy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-box.component.html',
  styleUrl: './head-box.component.css'
})

export class HeadBoxObject {
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
    Fm = new FetchManager(this.Sm);

    @Input()
    set classSelection(value: string) {
      // Reset all selections when class changes
        this.Sm.resetSelection();
        this.Sm.setclassSelection(value);
        console.log(this.Sm.getclassSelection())
        this.Fm.fetchList_Items('/helmetlist/');
        
     }
    get classSelection(): string {
         return this.Sm.getclassSelection();
    }
   
    resetSelection() {
    //this.selectedItem = null;
    //this.selectedItemData = null;
    this.showList = false;
    //this.showContextMenu = false;
    console.log(this.rating, '-->',this.state.uncommont)
    /*this.state = {
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
     }*/
    // this.Sm.setSelectedRarity(0);
    //this.listRating = [];
    //for (const rarity in this.selectedEnchantments) {
    //  this.selectedEnchantments[rarity] = { type: '', value: 0 };
    //}
    }

    selectItem(item: ListItem) {
    this.Sm.resetSelection();
    this.Sm.setSelectedItem(item);
    console.log(this.Sm.getselectedItem()?.name)
    this.Fm.fetchItemData_Armor("/itemdisplay/");
    this.itemSelected.emit(item.name);
    //this.showList = this.showList;
  }

  async onChangeRarity(event: number) { // Reset enchantment values and types // send quety to API // send event to parent // send event to css color box
    try {
    this.Sm.resetEnchant();
    this.Sm.setSelectedRarity(+event);
    
    console.log(this.Sm.getselectedRarity());
    this.rarityBoxColor();
    
    if (this.Sm.getselectedItem() && this.Sm.getselectedItem()?.name) {
     await this.Fm.fetchList_Rating("/helmetratinglist/");
     await this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/");
    }
   this.ratingSelected.emit(this.Sm.getselectedRating());
    console.log(this.Sm.getselectedRating())
    //this.ratingSelected.emit(this.Sm.getselectedRating());
    this.raritySelected.emit(this.Sm.getselectedRarity());
    this.resetSelection()
    //this.resetSelection();
    //console.log(this.selectedRarity);
  }catch(error){console.error('error');}}

 onChangeRating(event: number) {
    const index = +event;
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
 
  async onChangeEnchantment_TypeUncommon(event: string){
    //const currentEnchantmentUncommon = this.Sm.getEnchantment('Uncommon').type
    // const currentEnchantmentRare = this.Sm.getEnchantment('Rare').type;
    //const currentEnchantmentEpic = this.selectedEnchantments['epic'].type;
    //const currentEnchantmentLegendary = this.selectedEnchantments['legendary'].type;
    //const currentEnchantmentUnique = this.selectedEnchantments['unique'].type;
    try {
    this.Sm.setEnchantment('Uncommon',event, 0);
    //this.selectedEnchantments['uncommon'].type = ;
  
    await this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/");

    if(this.Sm.getselectedItem()){await this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/")}

    console.log(this.rating, '-->',this.state.uncommont)
    console.log(this.rating, '-->',this.state.uncommonv)
    console.log(this.rating, '-->',this.state.raret)
    console.log(this.rating, '-->',this.state.rarev)
    this.enchantmentSelected_TypeUncommon.emit(this.Sm.getEnchantment('Uncommon').type);

    }catch(error){console.log()}

  }

  onChangeEnchantment_ValueUncommon(event: number){
    // Store current types of higher rarity enchantments
    //const currentRareType = this.Sm.getEnchantment('Rare').type;
    //const currentEpicType = this.selectedEnchantments['epic'].type;
    //const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    //const currentUniqueType = this.selectedEnchantments['unique'].type;
    
    // Update the uncommon value
    this.Sm.setEnchantment('Uncommon', this.Sm.getEnchantment('Uncommon').type, event);
    
    // Re-fetch enchantment values with all current enchantment types
   
    this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/");
    
    // Emit the event
    this.enchantmentSelected_ValueUncommon.emit(this.Sm.getEnchantment('Uncommon').value);
  }

   onChangeEnchantment_TypeRare(event: string){

      this.Sm.setEnchantment('Rare',event, 0);
    //this.selectedEnchantments['uncommon'].type = ;
  
    this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/")

    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/")}

    this.enchantmentSelected_TypeRare.emit(this.Sm.getEnchantment('Rare').type);

    //this.selectedEnchantments['rare'].value = 0;
    //this.selectedEnchantments['rare'].type = event;

    //this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?itemgloves=${this.selectedItem?.name}&enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${currentUniqueType}`));
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype2=${this.selectedEnchantments['rare'].type}`));

   // this.enchantmentSelected_TypeRare.emit(this.selectedEnchantments['rare'].type);
   
  }
  
  onChangeEnchantment_ValueRare(event: number){

    
    this.Sm.setEnchantment('Rare', this.Sm.getEnchantment('Rare').type, event);
    
    // Re-fetch enchantment values with all current enchantment types
   
    this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/");
    
    // Emit the event
    this.enchantmentSelected_ValueRare.emit(this.Sm.getEnchantment('Rare').value);

    // Update the rare value
    //this.selectedEnchantments['rare'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
   // this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${this.selectedEnchantments['uncommon'].type}&enchantment_glovestype2=${this.selectedEnchantments['rare'].type}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${currentUniqueType}`));
    
    // Emit the event
   // this.enchantmentSelected_ValueRare.emit(this.selectedEnchantments['rare'].value);
  }

  onChangeEnchantment_TypeEpic(event: string){
  

    this.Sm.setEnchantment('Epic',event, 0);
    //this.selectedEnchantments['uncommon'].type = ;
  
    this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/")

    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/")}

    this.enchantmentSelected_TypeRare.emit(this.Sm.getEnchantment('Epic').type);


    //this.selectedEnchantments['epic'].value = 0;
    //this.selectedEnchantments['epic'].type = event;

    //this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?itemgloves=${this.selectedItem?.name}&enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${currentUniqueType}`));
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}`));
    //this.enchantmentSelected_TypeEpic.emit(this.selectedEnchantments['epic'].type);
  }
  
  onChangeEnchantment_ValueEpic(event: number){

     // Update the uncommon value
    this.Sm.setEnchantment('Epic', this.Sm.getEnchantment('Epic').type, event);
    
    // Re-fetch enchantment values with all current enchantment types
   
    this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/");
    
    // Emit the event
    this.enchantmentSelected_ValueUncommon.emit(this.Sm.getEnchantment('Epic').value);
    // Store current types of higher rarity enchantments
    //const currentLegendaryType = this.selectedEnchantments['legendary'].type;
   // const currentUniqueType = this.selectedEnchantments['unique'].type;
    
    // Update the epic value
    //this.selectedEnchantments['epic'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${this.selectedEnchantments['uncommon'].type}&enchantment_glovestype2=${this.selectedEnchantments['rare'].type}&enchantment_glovestype3=${this.selectedEnchantments['epic'].type}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${currentUniqueType}`));
    
    // Emit the event
    //this.enchantmentSelected_ValueEpic.emit(this.selectedEnchantments['epic'].value);
  }

  onChangeEnchantment_TypeLegendary(event: string){

    this.Sm.setEnchantment('Legendary',event, 0);
    //this.selectedEnchantments['uncommon'].type = ;
  
    this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/")

    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/")}

    this.enchantmentSelected_TypeRare.emit(this.Sm.getEnchantment('Legendary').type);

 
    ///this.selectedEnchantments['legendary'].value = 0;
    //this.selectedEnchantments['legendary'].type = event;
    
    //this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?itemgloves=${this.selectedItem?.name}&enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${currentUniqueType}`));
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${this.selectedEnchantments['legendary'].type}`));
    //this.enchantmentSelected_TypeLegendary.emit(this.selectedEnchantments['legendary'].type);
  }
  
  onChangeEnchantment_ValueLegendary(event: number){

     // Update the uncommon value
    this.Sm.setEnchantment('Legendary', this.Sm.getEnchantment('Legendary').type, event);
    
    // Re-fetch enchantment values with all current enchantment types
   
    this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/");
    
    // Emit the event
    this.enchantmentSelected_ValueUncommon.emit(this.Sm.getEnchantment('Legendary').value);

    // Update the legendary value
    //this.selectedEnchantments['legendary'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${this.selectedEnchantments['uncommon'].type}&enchantment_glovestype2=${this.selectedEnchantments['rare'].type}&enchantment_glovestype3=${this.selectedEnchantments['epic'].type}&enchantment_glovestype4=${this.selectedEnchantments['legendary'].type}&enchantment_glovestype5=${currentUniqueType}`));
    
    // Emit the event
    //this.enchantmentSelected_ValueLegendary.emit(this.selectedEnchantments['legendary'].value);
  }

  onChangeEnchantment_TypeUnique(event: string){

    this.Sm.setEnchantment('Unique',event, 0);
    //this.selectedEnchantments['uncommon'].type = ;
  
    this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/")

    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/")}

    this.enchantmentSelected_TypeRare.emit(this.Sm.getEnchantment('Unique').type);


   // this.selectedEnchantments['unique'].value = 0;
   // this.selectedEnchantments['unique'].type = event;

    //this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?itemgloves=${this.selectedItem?.name}&enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${currentUniqueType}`));
   // this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${currentUncommonType}&enchantment_glovestype2=${currentRareType}&enchantment_glovestype3=${currentEpicType}&enchantment_glovestype4=${currentLegendaryType}&enchantment_glovestype5=${this.selectedEnchantments['unique'].type}`));
    //this.enchantmentSelected_TypeUnique.emit(this.selectedEnchantments['unique'].type);
  }
  
  onChangeEnchantment_ValueUnique(event: number){

     // Update the uncommon value
    this.Sm.setEnchantment('Unique', this.Sm.getEnchantment('Unique').type, event);
    
    // Re-fetch enchantment values with all current enchantment types
   
    this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/");
    
    // Emit the event
    this.enchantmentSelected_ValueUncommon.emit(this.Sm.getEnchantment('Unique').value);
    // Update the unique value
   // this.selectedEnchantments['unique'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlistgloves/?enchantment_glovestype=${this.selectedEnchantments['uncommon'].type}&enchantment_glovestype2=${this.selectedEnchantments['rare'].type}&enchantment_glovestype3=${this.selectedEnchantments['epic'].type}&enchantment_glovestype4=${this.selectedEnchantments['legendary'].type}&enchantment_glovestype5=${this.selectedEnchantments['unique'].type}`));
    
    // Emit the event
   // this.enchantmentSelected_ValueUnique.emit(this.selectedEnchantments['unique'].value);
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
  @Output() selectionHelmet = new EventEmitter<any>();
}
    