import { ApiConfigService } from '../services/api-config.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ListItem, Rarity, ItemData, Enchantment, EnchantmentList , AppState  } from './state-object'; 


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
  getclassSelection(): string { return this._classSelection}
  getselectedItemList(): ListItem[] | null { return this.state.selection.itemList}
  getselectedItem(): ListItem | null {return this.state.selection.itemSel}
  getselectedRarity(): number { return this.state.selection.rarity; }
  getselectedRating(): number { return this.state.selection.rating; }
  getselectedItemData(): ItemData | null { return this.state.selection.itemData}
  getrarities(): Rarity[] | null {return this.rarities}
  getselectedItemDisplay(): any | null {return this.state.selection.itemDisplay}
  getselectedRatingList(): number[] | null{return this.state.selection.ratingList}

  // ===== MUTATION =====
  setSelectedItem(items: ListItem | null): void {this.state.selection.itemSel = items;}
  setclassSelection(value: string) { this._classSelection = value; }
  setSelectedItemList(items: ListItem[] | null): void {this.state.selection.itemList = items}
  setSelectedRatingList(list: number[] | null): void{this.state.selection.ratingList = list}
  setSelectedRarity(rarity: number): void {if (this.isValidRarity(rarity)) {this.state.selection.rarity = rarity}}
  setSelectedRating(rating: number): void {if (rating >= 0) {this.state.selection.rating = rating}}
  setSelectedItemData(data: ItemData): void {this.state.selection.itemData = data}
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
    this.state.enchantments.selected = {
      uncommon: {type: '', value: 0},
      rare: {type: '', value: 0}
    };
    this.state.enchantments.lists = {};
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

   private payload: {[key: string]: string};

    
    // Accept Smanager instance through constructor
    constructor(private Sm: Smanager, private slot: string){
     this.payload = {
      }
    }
    
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

  async fetchEnchantment_List(url: string) {
  const payload = {     
    class: this.Sm.getclassSelection(),
      itemSlot: {
        [this.slot]: {
          name: this.Sm.getselectedItem()?.name,
          rarity: this.Sm.getselectedRarity().toString()
        }
      }
    }
    console.log(payload)
   try {
    const response = await firstValueFrom(this.apiConfig.postData(url, payload))

    this.Sm.setEnchantmentList('Uncommon', 
      ['No selection', ...response['listname_uncommon']?.sort() || []], 
      response['listvalue_uncommon'] || []
    );
    
    this.Sm.setEnchantmentList('Rare', 
      ['No selection', ...response['listname_rare']?.sort() || []], 
      response['listvalue_rare'] ? [0, ...response['listvalue_rare']] : [0]
    );
    
    this.Sm.setEnchantmentList('Epic', 
      ['No selection', ...response['listname_epic']?.sort() || []], 
      response['listvalue_epic'] ? [0, ...response['listvalue_epic']] : [0]
    );
    
    this.Sm.setEnchantmentList('Legendary', 
      ['No selection', ...response['listname_legend']?.sort() || []], 
      response['listvalue_legend'] ? [0, ...response['listvalue_legend']] : [0]
    );
    
    this.Sm.setEnchantmentList('Unique', 
      ['No selection', ...response['listname_unique']?.sort() || []], 
      response['listvalue_unique'] ? [0, ...response['listvalue_unique']] : [0]
    );
    
    console.log(this.Sm.getEnchantmentList('Uncommon'))
  } catch(err) {
    console.error('Error fetching enchantment list:', err);
  }
};
  

 fetchItemData_Armor(url: string) {

  const payload = {
    class: this.Sm.getclassSelection(),
    itemSlot: {
      [this.slot]: { 
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

  async fetchList_Rating(url: string) {
    try {
     const payload = {
      class: this.Sm.getclassSelection(),
      itemSlot: {
        [this.slot]: {
          name: this.Sm.getselectedItem()?.name,
          rarity: this.Sm.getselectedRarity().toString()
        }
      }
    };
    console.log(this.Sm.getclassSelection())
    console.log(this.Sm.getselectedItem()?.name)
    console.log(payload);
    const response = await firstValueFrom (this.apiConfig.postData(url, payload));
    this.Sm.setSelectedRatingList(response.list);
    console.log(this.Sm.getselectedRatingList());
    const lenght = this.Sm.getselectedRatingList()?.length;
    console.log(lenght);
        // If there's only one rating option, automatically select it
    this.Sm.setSelectedRating(response.list[0])
    
        }catch(err){
          console.error('error')
        }
  }


async fetchEnchantment_Value(url: string){
  const payload = {
    class: this.Sm.getclassSelection(),
    race: "",
    itemSlot: {
      [this.slot]: {
        id: "",
        name: this.Sm.getselectedItem()?.name,
        rarity: this.Sm.getselectedRarity().toString(),
        rating: "",
          enchant: {
            typeu:  this.Sm.getEnchantment('Uncommon').type,
            valueu: this.Sm.getEnchantment('Uncommon').value?.toString(),
            typer: this.Sm.getEnchantment('Rare').type,
            valuer: this.Sm.getEnchantment('Rare').value?.toString(),
            typee: this.Sm.getEnchantment('Epic').type,
            valuee: this.Sm.getEnchantment('Epic').value?.toString(),
            typel: this.Sm.getEnchantment('Legendary').type,
            valuel: this.Sm.getEnchantment('Legendary').value?.toString(),
            typeq: this.Sm.getEnchantment('Unique').type,
            valueq: this.Sm.getEnchantment('Unique').value?.toString(),
          }
      }
    }
    };

    try {
      const response = await firstValueFrom(this.apiConfig.postData(url, payload));
        console.log(response['listvalue_uncommon']);
        
         this.Sm.setEnchantmentList('Uncommon', 
      ['No selection', ...response['listname_uncommon']?.sort() || []], 
      response['listvalue_uncommon'] || []
    );
    
    this.Sm.setEnchantmentList('Rare', 
      ['No selection', ...response['listname_rare']?.sort() || []], 
      response['listvalue_rare'] || []
    );
    
    this.Sm.setEnchantmentList('Epic', 
      ['No selection', ...response['listname_epic']?.sort() || []], 
      response['listvalue_epic'] || []
    );
    
    this.Sm.setEnchantmentList('Legendary', 
      ['No selection', ...response['listname_legend']?.sort() || []], 
      response['listvalue_legend'] || []
    );
    
    this.Sm.setEnchantmentList('Unique', 
      ['No selection', ...response['listname_unique']?.sort() || []], 
      response['listvalue_unique'] || []
    );
      }catch(error){
        console.error('Error fetching enchantment list:');
      }
    }
  }
  
export { Smanager, FetchManager }