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

  // Class selection (properly encapsulated)
  getclassSelection(): string { return this._classSelection; }
  

  // ItemSelection state (read-only access to values)
  getselectedItemList(): ListItem[] | null { return this.state.selection.itemList; }
  getselectedItem():    ListItem | null {return this.state.selection.itemSel;}
  getselectedRarity(): number { return this.state.selection.rarity; }
  getselectedRating(): number { return this.state.selection.rating; }
  getselectedItemData(): ItemData | null { return this.state.selection.itemData; }
  getrarities(): Rarity[] | null {return this.rarities}
  getselectedItemDisplay(): any | null {return this.state.selection.itemDisplay}
  getselectedRatingList(): number[] | null{return this.state.selection.ratingList}

  // ===== CONTROLLED MUTATION METHODS =====
  setSelectedItem(items: ListItem | null): void {this.state.selection.itemSel = items;}
  setclassSelection(value: string) { this._classSelection = value; }
  setSelectedItemList(items: ListItem[] | null): void {this.state.selection.itemList = items}
  setSelectedRatingList(list: number[] | null): void{this.state.selection.ratingList = list}

  setSelectedRarity(rarity: number): void {
    if (this.isValidRarity(rarity)) {
      this.state.selection.rarity = rarity;
      //this.onSelectionChange();
    }
  }

  setSelectedRating(rating: number): void {
    if (rating >= 0) {
      this.state.selection.rating = rating;
      //this.onSelectionChange();
    }
  }

  setSelectedItemData(data: ItemData): void {
    this.state.selection.itemData = data;
  }

  setSelectedItemDisplay(item: any): void{
    this.state.selection.itemDisplay = item
  }

  // ===== PRIVATE METHODS FOR INTERNAL USE =====\
  
  private onSelectionChange(): void {
    // Handle ItemData side effects when selection changes
    console.log('ItemSelection updated:', this.state.selection);
  }

  private isValidRarity(rarity: number): boolean {
    return rarity >= 0 && rarity < this.rarities.length;
  }

  // ===== ENCHANTMENT METHODS (PROPERLY ENCAPSULATED) =====
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
    this.state.enchantments.lists[rarity] = { types: [...types], values: [...values] };
  }

  private isValidEnchantmentType(type: string): boolean {
    // Add your validation logic here
    return type.length > 0;
  }

  // ===== STATE MANAGEMENT =====
  resetSelection(): void {
    this.state.selection.itemList = null;
    //this.state.selection.itemSel = null; 
    this.state.selection.rarity = 0;
    this.state.selection.rating = 0;
    this.state.selection.itemData = null;
    this.state.selection.itemDisplay = null;
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
          class: this.Sm.getclassSelection(), // Now uses the passed instance
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
    next: (response) => {
        this.Sm.setSelectedRatingList = response.list;
        //console.log(this.listRating);
        
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
    showContextMenu = false

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
    //this.selectedRarity = 0;
    //this.listRating = [];
    //for (const rarity in this.selectedEnchantments) {
    //  this.selectedEnchantments[rarity] = { type: '', value: 0 };
    //}
    }

    selectItem(item: ListItem) {
    this.resetSelection();
    this.Sm.setSelectedItem(item);
    this.Fm.fetchItemData_Armor("/itemdisplay/");
    this.itemSelected.emit(item.name);
    this.showList = !this.showList;
  }

    onChangeRarity(event: number) { // Reset enchantment values and types // send quety to API // send event to parent // send event to css color box
    this.Sm.resetSelection()
    
    this.Sm.setSelectedRarity(+event)
    //console.log(this.selectedRarity);
    this.rarityBoxColor();

    //if (this.selectedItem && this.selectedItem.name) {
     // this.fetchList_Rating(this.selectedItem);
     // this.fetchEnchantment_List(this.selectedItem);
    //}
    this.raritySelected.emit(this.Sm.getselectedRarity());
    //console.log(this.selectedRarity);
  }

  onChangeRating(event: number) {
    const index = +event;
    this.Sm.setSelectedRating(this.Sm.getselectedRatingList()?.[index]?? 0)
    //console.log(this.selectedRating);

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
    
}
    