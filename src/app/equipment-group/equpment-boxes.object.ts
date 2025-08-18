
import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from './../services/api-config.service';
import { BoxesGroupComponent } from "./equipment-group.component";
import { inject } from '@angular/core';

interface ListItem {
  name: string;
  image: string;
}

export abstract class EquipmentBehaivor {
    selectedItem: ListItem | null = null;
    selectedItemData: any = null;
    showList = false;
    showContextMenu = false;
    selectedRating: number = 0;
    selectedRarity: number = 0;
    listRating: number[] = [];
    listItems: ListItem[] = [];

    enchantmentLists: { [rarity: string]: { types: string[], values: number[] } } = {
    uncommon: { types: [], values: [] },
    rare: { types: [], values: [] },
    epic: { types: [], values: [] },
    legendary: { types: [], values: [] },
    unique: { types: [], values: [] }
  };

    selectedEnchantments: { [rarity: string]: { type: string, value: number } } = {
      uncommon: { type: '', value: 0 },
      rare: { type: '', value: 0 },
      epic: { type: '', value: 0 },
      legendary: { type: '', value: 0 },
      unique: { type: '', value: 0 }
  };

  

    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService
    ) {}

    fetchList_Items(url: string) {
        this.http.get<{ list: ListItem[] }>(url).subscribe({
            next: (response) => {
                this.listItems = response.list;
                this.listItems.unshift({ image: 'assets/placeholderx.png', name: '' }); // Add "No selection" option at the beginning for reset
            },
        error: (err) => {
        console.error('Error fetching head list:', err);
      },
     });
     }

    resetSelection() {
    this.selectedItem = null;
    this.selectedItemData = null;
    this.showList = false;
    this.showContextMenu = false;
    this.selectedRarity = 0;
    this.listRating = [];
    for (const rarity in this.selectedEnchantments) {
      this.selectedEnchantments[rarity] = { type: '', value: 0 };
    }
 
  }

    selectItem(item: ListItem) {
    this.resetSelection();
    this.selectedItem = item;
    this.fetchItemData_Armor(this.apiConfig.getApiUrl(`/itemdisplay/${item.name}`));
    //this.itemSelected.emit(item.name);
    this.showList = !this.showList;
  }

  fetchList_Rating(url: string) {
    this.http.get<{ list: number[] }>(url).subscribe({
      next: (response) => {
        this.listRating = response.list;
        console.log(this.listRating);
        
        // If there's only one rating option, automatically select it
        if (this.listRating.length >= 1) {
          this.selectedRating = this.listRating[0];
          //this.ratingSelected.emit(this.selectedRating);
        }
      },
      error: (err) => {
        console.error('Error fetching head list:', err);
      },
    });
  }

    fetchEnchantment_List(url: string) {
    this.http.get<{ [key: string]: string[] }>(url).subscribe({  // Remove `list` from type
      next: (response) => { 
        
        // Add "No selection" option at the beginning of each list
        this.enchantmentLists['uncommon'].types = ['No selection', ...response['listname_uncommon']];
        this.enchantmentLists['rare'].types = ['No selection', ...response['listname_rare']];
        this.enchantmentLists['epic'].types = ['No selection', ...response['listname_epic']];
        this.enchantmentLists['legendary'].types = ['No selection', ...response['listname_legend']];
        this.enchantmentLists['unique'].types = ['No selection', ...response['listname_unique']];
        
        
      },
      error: (err) => {
        console.error('Error fetching enchantment list:', err);
      },
    });
  }

  fetchEnchantment_Value(url: string){
    // Store current values before fetching
    const currentUncommonValue = this.selectedEnchantments['uncommon'].value;
    const currentRareValue = this.selectedEnchantments['rare'].value;
    const currentEpicValue = this.selectedEnchantments['epic'].value;
    const currentLegendaryValue = this.selectedEnchantments['legendary'].value;
    const currentUniqueValue = this.selectedEnchantments['unique'].value;
    
    this.http.get<{[key: string]: number[]}>(url).subscribe({
      next: (response) => {
        // Update uncommon values
        if (response['listvalue_uncommon']) {
          this.enchantmentLists['uncommon'].values = response['listvalue_uncommon'];
        }
        
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
      },
      error: (err) => {
        console.error('Error fetching enchantment list:', err);
      },
    });
  }

   fetchItemData_Armor(url: string) {
    console.log('Fetching item data from URL:', url);
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('Item data response:', response);
        // Check if the response has the expected structure
        if (response && response.itemdata) {
          this.selectedItemData = response;
          //console.log('Selected item data:', this.selectedItemData);
        } else {
          console.error('Unexpected response structure:', response);
          this.selectedItemData = null;
        }
      },
      error: (err) => {
        console.error('Error fetching item display:', err);
        this.selectedItemData = null;
      },
    });
  }


}
  