import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from '../../services/api-config.service';
import { BoxesGroupComponent } from "../equipment-group.component";
import { inject } from '@angular/core';



interface ItemData {
  // Lists of enchantment types by rarity
  listname_uncommon: string[];
  listname_rare: string[];
  listname_epic: string[];
  listname_legend: string[]; 
  listname_unique: string[];
  
  // Lists of enchantment values by rarity (can be numbers or null)
  listvalue_uncommon: number[] | null;
  listvalue_rare: number[] | null;
  listvalue_epic: number[] | null;
  listvalue_legend: number[] | null; 
  listvalue_unique: number[] | null;
}

// Define comprehensive interfaces
interface ListItem {
  name: string;
  image: string;
}

interface Enchantment {
  type: string;
  value: number;
}

interface EnchantmentList {
  types: string[];
  values: number[];
}

interface ItemSelection {
  itemList: ListItem[] | null;
  itemSel: ListItem | null;
  rarity: number;
  rating: number;
  ratingList: number[] | null;
  itemData: ItemData | null;
  itemDisplay: any | null;
}

interface EnchantmentState {
  selected: { [rarity: string]: Enchantment };
  lists: { [rarity: string]: EnchantmentList };
}

interface AppState {
  selection: ItemSelection;
  enchantments: EnchantmentState;
}

// Rarity type for type safety
type Rarity = 'No Selection' | 'Poor'| 'Common'| 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Unique';

class Smanager {
  private _classSelection: string = "";
  private selectedRatingIndex = 0

  private state: AppState = {
    selection: {
      itemList: null,
      itemSel: null,
      rarity: 0,
      rating: 0,
      ratingList: null,
      itemData: null,
      itemDisplay:  null,
    },
    
    enchantments: {
      selected: {
        uncommon: { type: '', value: 0 },
        rare: { type: '', value: 0 },
        epic: { type: '', value: 0 },
        legendary: { type: '', value: 0 },
        unique: { type: '', value: 0 }
      },
      
      lists: {
        uncommon: { types: [], values: [] },
        rare: { types: [], values: [] },
        epic: { types: [], values: [] },
        legendary: { types: [], values: [] },
        unique: { types: [], values: [] }
      }
    }
  };

  private rarities: Rarity[] = ['No Selection', "Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Unique"];

  // ===== ENCAPSULATION =====

  // (read-only)
  // Class selection 
  getclassSelection(): string { return this._classSelection; }
  getselectedItemList(): ListItem[] | null { return this.state.selection.itemList; }
  getselectedItem(): ListItem | null {return this.state.selection.itemSel;}
  getselectedRarity(): number { return this.state.selection.rarity; }
  getselectedRating(): number { return this.state.selection.rating; }
  getselectedItemData(): ItemData | null { return this.state.selection.itemData; }
  getrarities(): Rarity[] | null {return this.rarities}
  getselectedItemDisplay(): any | null {return this.state.selection.itemDisplay}
  getselectedRatingList(): number[] | null{return this.state.selection.ratingList}

  // ===== MUTATION =====
  setSelectedItem(items: ListItem | null): void {this.state.selection.itemSel = items;}
  setclassSelection(value: string) { this._classSelection = value; }
  setSelectedItemList(items: ListItem[] | null): void {this.state.selection.itemList = items}
  setSelectedRatingList(list: number[] | null): void{this.state.selection.ratingList = list}
  setSelectedRarity(rarity: number): void {if (this.isValidRarity(rarity)) {this.state.selection.rarity = rarity;}}
  setSelectedRating(rating: number): void {if (rating >= 0) {this.state.selection.rating = rating}}
  setSelectedItemData(data: ItemData): void {this.state.selection.itemData = data;}
  setSelectedItemDisplay(item: any): void {this.state.selection.itemDisplay = item}

  // ===== PRIVATE =====\
  
  private onSelectionChange(): void {
    // Handle ItemData side effects when selection changes
    console.log('ItemSelection updated:', this.state.selection);
  }

  private isValidRarity(rarity: number): boolean {
    return rarity >= 0 && rarity < this.rarities.length;
  }

  // ===== ENCHANTMENT =====
  getEnchantment(rarity: Rarity): Readonly<Enchantment> {
    return { ...this.state.enchantments.selected[rarity] }; // Return copy to prevent mutation
  }

  setEnchantment(rarity: Rarity, type: string, value: number): void {
    if (this.isValidEnchantmentType(type) && value >= 0) {
      this.state.enchantments.selected[rarity] = { type, value };
    }
  }

  getEnchantmentList(rarity: Rarity): Readonly<EnchantmentList> {
    return { 
      types: [...this.state.enchantments.lists[rarity].types],
      values: [...this.state.enchantments.lists[rarity].values]
    };
  }

  setEnchantmentList(rarity: Rarity, types: string[], values: number[]): void {
    this.state.enchantments.lists[rarity] = { types: [...(types || [])], values: [...(values || [])]  };
  }

  private isValidEnchantmentType(type: string): boolean {
    // Add your validation logic here
    return type.length > 0;
  }

  // ===== STATE =====
  resetSelection(): void {
   // this.state.selection.itemList = null;
    this.state.selection.itemSel = null; 
    this.state.selection.rarity = 0;
    this.state.selection.rating = 0;
    this.state.selection.itemData = null;
    this.state.selection.itemDisplay = null;
  }

  resetEnchant(): void{
    this.state.enchantments.selected = {};
  }

  // Get readonly state snapshot for debugging/display
  getStateSnapshot(): Readonly<AppState> {
    return JSON.parse(JSON.stringify(this.state)); // Deep copy for safety
  }
}

class FetchManager {
    // Accept Smanager instance through constructor
    constructor(private Sm: Smanager) {}
    
    private apiConfig = inject(ApiConfigService);
   
    fetchList_Items(url: string): void {
      const payload = {
          class: this.Sm.getclassSelection(), 
        };
        
        this.apiConfig.postData(url, payload).subscribe({
          next: (response) => {
              this.Sm.setSelectedItemList(response.list); 
              console.log(this.Sm.getselectedItemList())
          },
          error: (err) => {
              console.error('Error fetching head list:', err);
          },
    });
    }

 fetchItemData_Armor(url: string) {

  const payload = {
    class: this.Sm.getclassSelection(),
    itemSlot: {
      head: { 
        name: this.Sm.getselectedItem()?.name,
      }
    }
  };
  //console.log('Fetching rating with payload:', payload);
  // 2. Use POST with the complete JSON structure
  this.apiConfig.postData(url, payload).subscribe({
    next: (response: any) => {
      console.log(response);
      this.Sm.setSelectedItemDisplay(response);
      //his.outputItemData = response.itemdata
    },
    error: (err) => {
      console.error('Error fetching rating list:', err);
    },
    });
  }

  fetchList_Rating(url: string) {

  const playload = {
    class: this.Sm.getclassSelection(),
      itemSlot: {
        head: {
          name: this.Sm.getselectedItem()?.name,
          rarity: this.Sm.getselectedRarity().toString()
        }
    }
    };
    this.apiConfig.postData(url, playload).subscribe({
    next: (response) => {;
        this.Sm.setSelectedRatingList(response.list);
        console.log(this.Sm.getselectedRatingList());
        
        // If there's only one rating option, automatically select it
        //if (this.Sm.getselectedRatingList()?.length >= 1) {
         // this.Sm.setSelectedRating = this.Sm.getselectedRatingList()?[0]
          //this.ratingSelected.emit(this.selectedRating);
        //}
      },
    error: (err) => {
        console.error('Error fetching head list:', err);
      },
    });
  }
  fetchEnchantment_List(url: string) {
  const payload = {
    class: this.Sm.getclassSelection(),
      itemSlot: {
        head: {
          name: this.Sm.getselectedItem()?.name,
          rarity: this.Sm.getselectedRarity().toString()
        }
      }
    }
    //console.log(this._classSelection)
    //console.log(item.name)
    //console.log(this.selectedRarity.toString())
    console.log(payload)
    this.apiConfig.postData(url, payload).subscribe({
      next: (response) => { 
        
        // Add "No selection" option at the beginning of each list
        this.Sm.setEnchantmentList('Uncommon', ['No selection', ...response['listname_uncommon']], response['listvalue_uncommon'] ? [0, ...response['listvalue_uncommon']] : [0]);
        //this.enchantmentLists['rare'].types = ['No selection', ...response['listname_rare']];
        //this.enchantmentLists['epic'].types = ['No selection', ...response['listname_epic']];
       // this.enchantmentLists['legendary'].types = ['No selection', ...response['listname_legend']];
        //this.enchantmentLists['unique'].types = ['No selection', ...response['listname_unique']];
        
      },
      error: (err) => {
        console.error('Error fetching enchantment list:', err);
      },
    });
  }

  fetchEnchantment_Value(url: string){
  const payload = {
    class: this.Sm.getclassSelection(),
    race: "",
    itemSlot: {
      head: {
        id: "",
        name: this.Sm.getselectedItem()?.name,
        rarity: this.Sm.getselectedRarity().toString(),
        rating: "",
          enchant: {
            typeu:  this.Sm.getEnchantment('Uncommon').type,
            valueu: this.Sm.getEnchantment('Uncommon').value.toString(),
            //typer: this.Sm.getEnchantment('Rare').type,
            //valuer: this.Sm.getEnchantment('Rare').value.toString(),
            //typee: this.Sm.getEnchantment('Epic').type,
            //valuee: this.Sm.getEnchantment('Epic').value.toString(),
            //typel: this.Sm.getEnchantment('Legendary').type,
            //valuel: this.Sm.getEnchantment('Legendary').value.toString(),
            //typeq: this.Sm.getEnchantment('Unique').type,
            //valueq: this.Sm.getEnchantment('Unique').value.toString(),
          }
      }
    }
    };

    //console.log(payload)

    // Store current values before fetching
    const currentUncommonValue = this.Sm.getEnchantment('Uncommon').value;
    const currentRareValue = this.Sm.getEnchantment('Rare').value;
    const currentEpicValue = this.Sm.getEnchantment('Epic').value;
    const currentLegendaryValue = this.Sm.getEnchantment('Legendary').value;
    const currentUniqueValue = this.Sm.getEnchantment('Unique').value;
    
    this.apiConfig.postData(url, payload).subscribe({
      next: (response) => {

        console.log(response['listvalue_uncommon'])
        // Update uncommon values
        if (response) {
          this.Sm.setEnchantmentList('Uncommon', response['listname_uncommon'] || [], response['listvalue_uncommon']);
        }
       /*
        // Update rare values
        if (response['listvalue_rare']) {
          this.enchantmentLists['rare'].values = response['listvalue_rare'];
        }
        
        // Update epic values
        if (response['listvalue_epic']) {
          this.enchantmentLists['epic'].values = response['listvalue_epic'];
        }
        
        // Update legendary values
        if (response['listvalue_legend']) {
          this.enchantmentLists['legendary'].values = response['listvalue_legend'];
        }
        
        // Update unique values
        if (response['listvalue_unique']) {
          this.enchantmentLists['unique'].values = response['listvalue_unique'];
        }
        
        // Restore selected values if they exist in the new lists
        if (currentUncommonValue && this.enchantmentLists['uncommon'].values.includes(currentUncommonValue)) {
          this.selectedEnchantments['uncommon'].value = currentUncommonValue;
        }
        
        if (currentRareValue && this.enchantmentLists['rare'].values.includes(currentRareValue)) {
          this.selectedEnchantments['rare'].value = currentRareValue;
        }
        
        if (currentEpicValue && this.enchantmentLists['epic'].values.includes(currentEpicValue)) {
          this.selectedEnchantments['epic'].value = currentEpicValue;
        }
        
        if (currentLegendaryValue && this.enchantmentLists['legendary'].values.includes(currentLegendaryValue)) {
          this.selectedEnchantments['legendary'].value = currentLegendaryValue;
        }
        
        if (currentUniqueValue && this.enchantmentLists['unique'].values.includes(currentUniqueValue)) {
          this.selectedEnchantments['unique'].value = currentUniqueValue;
        }
          */
      },
      error: (err) => {
        console.error('Error fetching enchantment list:', err);
      },
    });
  }

}



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

    holder: any;
    holder2: any;
    holder3: any

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
    this.showContextMenu = false;
    this.Sm.setSelectedRarity(0);
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
    this.showList = this.showList;
  }

   onChangeRarity(event: number) { // Reset enchantment values and types // send quety to API // send event to parent // send event to css color box
    this.Sm.resetEnchant();
    this.Sm.setSelectedRarity(+event);
    
    console.log(this.Sm.getselectedRarity());
    this.rarityBoxColor();

    if (this.Sm.getselectedItem() && this.Sm.getselectedItem()?.name) {
     this.Fm.fetchList_Rating("/helmetratinglist/");
     this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/");
    }
    this.raritySelected.emit(this.Sm.getselectedRarity());
    //console.log(this.selectedRarity);
  }

  onChangeRating(event: number) {
    const index = +event;
    this.Sm.setSelectedRating(this.Sm.getselectedRatingList()?.[index]?? 0)
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
    const currentEnchantmentUncommon = this.Sm.getEnchantment('Uncommon').type
    //const currentEnchantmentRare = this.selectedEnchantments['rare'].type;
    //const currentEnchantmentEpic = this.selectedEnchantments['epic'].type;
    //const currentEnchantmentLegendary = this.selectedEnchantments['legendary'].type;
    //const currentEnchantmentUnique = this.selectedEnchantments['unique'].type;

    this.Sm.setEnchantment('Uncommon',event, 0);
    //this.selectedEnchantments['uncommon'].type = ;
  
    this.Fm.fetchEnchantment_List("/enchantmentlisthelmet/")
    if(this.Sm.getselectedItem()){this.Fm.fetchEnchantment_Value("/enchantmentlisthelmet/")}
    this.enchantmentSelected_TypeUncommon.emit(this.Sm.getEnchantment('Uncommon').type);
  }

  onChangeEnchantment_ValueUncommon(event: number){
    // Store current types of higher rarity enchantments
    const currentRareType = this.Sm.getEnchantment('Rare').type;
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
    
}
    