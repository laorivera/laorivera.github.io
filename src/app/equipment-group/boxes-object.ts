import { ApiConfigService } from '../services/api-config.service';
import {  inject } from '@angular/core';

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
export interface ListItem {
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

  
  // (read-only)
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

  //  state snapshot
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
              const itemlist = [{ image: "assets/placeholderx.png", name: "No selection" }, ...response.list ];
              this.Sm.setSelectedItemList(itemlist); 
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
  //
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
    console.log(payload)
    this.apiConfig.postData(url, payload).subscribe({
      next: (response) => { 
        
        // Add "No selection" option at the beginning of each list
        this.Sm.setEnchantmentList('Uncommon', ['No selection', ...response['listname_uncommon']], response['listvalue_uncommon'] ? [0, ...response['listvalue_uncommon']] : [0]);
        this.Sm.setEnchantmentList('Rare', ['No selection', ...response['listname_rare']], response['listvalue_rare'] ? [0, ...response['listvalue_rare']] : [0]);
        this.Sm.setEnchantmentList('Epic', ['No selection', ...response['listname_epic']], response['listvalue_epic'] ? [0, ...response['listvalue_epic']] : [0]);
        this.Sm.setEnchantmentList('Legendary', ['No selection', ...response['listname_legend']], response['listvalue_legend'] ? [0, ...response['listvalue_legend']] : [0]);
        this.Sm.setEnchantmentList('Unique', ['No selection', ...response['listname_unique']], response['listvalue_unique'] ? [0, ...response['listvalue_unique']] : [0]);
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
            typer: this.Sm.getEnchantment('Rare').type,
            valuer: this.Sm.getEnchantment('Rare').value.toString(),
            typee: this.Sm.getEnchantment('Epic').type,
            valuee: this.Sm.getEnchantment('Epic').value.toString(),
            typel: this.Sm.getEnchantment('Legendary').type,
            valuel: this.Sm.getEnchantment('Legendary').value.toString(),
            typeq: this.Sm.getEnchantment('Unique').type,
            valueq: this.Sm.getEnchantment('Unique').value.toString(),
          }
      }
    }
    };

    //console.log(payload)

    // Store current values before fetching
   // const currentUncommonValue = this.Sm.getEnchantment('Uncommon').value;
   // const currentRareValue = this.Sm.getEnchantment('Rare').value;
   // const currentEpicValue = this.Sm.getEnchantment('Epic').value;
   // const currentLegendaryValue = this.Sm.getEnchantment('Legendary').value;
   // const currentUniqueValue = this.Sm.getEnchantment('Unique').value;
    
    this.apiConfig.postData(url, payload).subscribe({
      next: (response) => {

        console.log(response['listvalue_uncommon'])
        // Update uncommon values
        if (response.listvalue_uncommon) {
          this.Sm.setEnchantmentList('Uncommon', response['listname_uncommon'] || [], response['listvalue_uncommon']);
        }
      
        // Update rare values
        if (response.listvalue_rare) {
          this.Sm.setEnchantmentList('Rare', response['listname_rare'] || [], response['listvalue_rare']);
        }
         
        // Update epic values
        if (response.listvalue_epic) {
          this.Sm.setEnchantmentList('Epic', response['listname_epic'] || [], response['listvalue_epic']);
        }
        
        // Update legendary values
        if (response.listvalue_legend) {
          this.Sm.setEnchantmentList('Legendary', response['listname_legend'] || [], response['listvalue_legend']);
        }
        
        // Update unique values
        if (response.listvalue_unique) {
         this.Sm.setEnchantmentList('Unique', response['listname_unique '] || [], response['listvalue_unique']);
        }
        /*
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




export { Smanager, FetchManager }