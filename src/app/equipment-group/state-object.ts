
export interface ItemData {
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

export interface Enchantment {
  type: string;
  value: number;
}

export interface EnchantmentList {
  types: string[];
  values: number[];
}

export interface ItemSelection {
  itemList: ListItem[] | null;
  itemSel: ListItem | null;
  rarity: number;
  rating: number;
  ratingList: number[] | null;
  itemData: ItemData | null;
  itemDisplay: any | null;
}

export interface EnchantmentState {
  selected: { [rarity: string]: Enchantment };
  lists: { [rarity: string]: EnchantmentList };
}

export interface AppState {
  selection: ItemSelection;
  enchantments: EnchantmentState;
}


// Rarity type for type safety
export type Rarity = 'No Selection' | 'Poor'| 'Common'| 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Unique';
