import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from '../../services/api-config.service';
import { BoxesGroupComponent } from "../equipment-group.component";
import { inject } from '@angular/core';

interface ListItem {
  name: string;
  image: string;
}

@Component({
  selector: 'head-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-box.component.html',
  styleUrl: './head-box.component.css'
})
export class HeadBoxComponent {
  //store values
  private _classSelection: string = ""; //inizializado a 0 (no selection)
  showList = false;

  selectedItem: ListItem | null = null;
  selectedRarity: number = 0;
  selectedRating: number = 0;
  selectedItemData: any = null;
  listItems: ListItem[] = [];
  listRating: number[] = [];
  outputItemData: any = null;
  showContextMenu = false;
  selectedRatingIndex: number = 0;

  selectedEnchantments: { [rarity: string]: { type: string, value: number } } = {
      uncommon: { type: '', value: 0 },
      rare: { type: '', value: 0 },
      epic: { type: '', value: 0 },
      legendary: { type: '', value: 0 },
      unique: { type: '', value: 0 }
  };

  enchantmentLists: { [rarity: string]: { types: string[], values: number[] } } = {
    uncommon: { types: [], values: [] },
    rare: { types: [], values: [] },
    epic: { types: [], values: [] },
    legendary: { types: [], values: [] },
    unique: { types: [], values: [] }
  };
    //array rarity 
  rarityHead: string[] = ["No selection", "Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Unique"];

  buttonsBox: string[] = [ "I", "II", "III", "IV", "V", "VI", "VII" ];

  allclass: string[]= ["", "Fighter", "Barbarian", "Rogue", "Wizard", "Cleric", "Warlock", "Bard", "Ranger", "Soccerer"]
  

  // send data to parents
  @Output() itemSelected = new EventEmitter<string>();
  @Output() ratingSelected = new EventEmitter<number>();
  @Output() raritySelected = new EventEmitter<number>();
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
  

  // HTTP METHOD 
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  private parent = inject(BoxesGroupComponent, { host: true });
 
  // toma characters
  @Input()
  set classSelection(value: string) {
    this._classSelection = value;
    // Reset all selections when class changes
    this.resetSelection();
    this.fetchList_Items(this._classSelection);
  }
  get classSelection(): string {
    return this._classSelection;
  }

  //
  fetchList_Items(selclass: string) {

    const payload = {
    class: selclass, // Get class from parent
    };

  this.apiConfig.postData('/helmetlist/', payload).subscribe({
    next: (response) => {
      this.listItems = response.list;
      this.listItems.unshift({ image: 'assets/placeholderx.png', name: '' }); // Add "No selection" option at the beginning for reset
      },
    error: (err) => {
        console.error('Error fetching head list:', err);
      },

    });
  }
  // reset selecciones
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
    this.fetchItemData_Armor(this.selectedItem);
    console.log(item.name)
    this.itemSelected.emit(item.name);
    this.showList = !this.showList;
  }

  fetchList_Rating(item: ListItem) {

  const playload = {
    class: this._classSelection,
      itemSlot: {
        head: {
          name: item.name,
          rarity: this.selectedRarity.toString()
        }
    }
  };
  this.apiConfig.postData('/helmetratinglist/', playload).subscribe({
    next: (response) => {
        this.listRating = response.list;
        console.log(this.listRating);
        
        // If there's only one rating option, automatically select it
        if (this.listRating.length >= 1) {
          this.selectedRating = this.listRating[0];
          this.ratingSelected.emit(this.selectedRating);
        }
      },
    error: (err) => {
        console.error('Error fetching head list:', err);
      },
  });
}


fetchItemData_Armor(item: ListItem) {

  const payload = {
    class: this._classSelection,
    itemSlot: {
      head: { 
        name: item.name
      }
    }
  };

  console.log('Fetching rating with payload:', payload);
  // 2. Use POST with the complete JSON structure
  this.apiConfig.postData('/itemdisplay/', payload).subscribe({
    next: (response: any) => {
      console.log(response)
      this.selectedItemData = response
      //his.outputItemData = response.itemdata
    },
    error: (err) => {
      console.error('Error fetching rating list:', err);
    },
  });
  }

fetchEnchantment_List(item: ListItem ) {
  const payload = {
    class: this._classSelection,
      itemSlot: {
        head: {
          name: item.name,
          rarity: this.selectedRarity.toString()
        }
      }
    }
    //console.log(this._classSelection)
    //console.log(item.name)
    //console.log(this.selectedRarity.toString())
    console.log(payload)
    this.apiConfig.postData('/enchantmentlisthelmet/', payload).subscribe({
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
    if (this.selectedItem && this.selectedItem.name) {
      this.showContextMenu = true;
      this.parent.closeAllDropdownsExcept(this)
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

  onChangeRarity(event: number) { // Reset enchantment values and types // send quety to API // send event to parent // send event to css color box
    this.selectedEnchantments['uncommon'].value = 0
    this.selectedEnchantments['rare'].value = 0;
    this.selectedEnchantments['epic'].value = 0;
    this.selectedEnchantments['legendary'].value = 0;
    this.selectedEnchantments['unique'].value = 0;
    this.selectedEnchantments['uncommon'].type = '';
    this.selectedEnchantments['rare'].type = '';
    this.selectedEnchantments['epic'].type = '';
    this.selectedEnchantments['legendary'].type = '';
    this.selectedEnchantments['unique'].type = '';
    
    this.selectedRarity = +event;
    //console.log(this.selectedRarity);

    this.rarityBoxColor();

    if (this.selectedItem && this.selectedItem.name) {
      this.fetchList_Rating(this.selectedItem);
      this.fetchEnchantment_List(this.selectedItem);
    }
    this.raritySelected.emit(this.selectedRarity);
    //console.log(this.selectedRarity);
  }

  onChangeRating(event: number) {
    const index = +event;
    this.selectedRating = this.listRating[index];
    //console.log(this.selectedRating);
    this.ratingSelected.emit(this.selectedRating);
  }

  fetchEnchantment_Value(item: ListItem){
  const payload = {
    class: this._classSelection,
    race: "",
    itemSlot: {
      head: {
        id: "",
        name: item.name,
        rarity: this.selectedRarity.toString(),
        rating: "",
          enchant: {
            typeu: "",
            valueu: this.selectedEnchantments['uncommon'].value,
            typer: "",
            valuer: this.selectedEnchantments['rare'].value,
            typee: "",
            valuee: this.selectedEnchantments['epic'].value,
            typel: "",
            valuel: this.selectedEnchantments['legendary'].value,
            typeq: "",
            valueq: this.selectedEnchantments['unique'].value
          }
      }
    }
    };
    // Store current values before fetching
    const currentUncommonValue = this.selectedEnchantments['uncommon'].value;
    const currentRareValue = this.selectedEnchantments['rare'].value;
    const currentEpicValue = this.selectedEnchantments['epic'].value;
    const currentLegendaryValue = this.selectedEnchantments['legendary'].value;
    const currentUniqueValue = this.selectedEnchantments['unique'].value;
    
    this.apiConfig.postData('/enchantmentlisthelmet/', payload).subscribe({
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

  onChangeEnchantment_TypeUncommon(event: string){
    const currentEnchantmentUncommon = this.selectedEnchantments['uncommon'].type;
    const currentEnchantmentRare = this.selectedEnchantments['rare'].type;
    const currentEnchantmentEpic = this.selectedEnchantments['epic'].type;
    const currentEnchantmentLegendary = this.selectedEnchantments['legendary'].type;
    const currentEnchantmentUnique = this.selectedEnchantments['unique'].type;

    this.selectedEnchantments['uncommon'].value = 0;
    this.selectedEnchantments['uncommon'].type = event;
  
    this.fetchEnchantment_List(this.selectedItemData)
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    this.enchantmentSelected_TypeUncommon.emit(this.selectedEnchantments['uncommon'].type);
  }

  onChangeEnchantment_ValueUncommon(event: number){
    // Store current types of higher rarity enchantments
    const currentRareType = this.selectedEnchantments['rare'].type;
    const currentEpicType = this.selectedEnchantments['epic'].type;
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;
    
    // Update the uncommon value
    this.selectedEnchantments['uncommon'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    this.selectedItem
    //this.fetchEnchantment_Value(this.apiConfig.getApiUrl(`/enchantmentlisthelmet/?enchantment_helmettype=${this.selectedEnchantments['uncommon'].type}&enchantment_helmettype2=${currentRareType}&enchantment_helmettype3=${currentEpicType}&enchantment_helmettype4=${currentLegendaryType}&enchantment_helmettype5=${currentUniqueType}`));
    
    // Emit the event
    this.enchantmentSelected_ValueUncommon.emit(this.selectedEnchantments['uncommon'].value);
  }

  onChangeEnchantment_TypeRare(event: string){
    const currentUncommonType = this.selectedEnchantments['uncommon'].type;
    const currentRareType = this.selectedEnchantments['rare'].type;
    const currentEpicType = this.selectedEnchantments['epic'].type;
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;


    this.selectedEnchantments['rare'].value = 0;
    this.selectedEnchantments['rare'].type = event;

   // this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlisthelmet/?itemhelmet=${this.selectedItem?.name}&enchantment_helmettype=${currentUncommonType}&enchantment_helmettype2=${currentRareType}&enchantment_helmettype3=${currentEpicType}&enchantment_helmettype4=${currentLegendaryType}&enchantment_helmettype5=${currentUniqueType}`));
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}

    this.enchantmentSelected_TypeRare.emit(this.selectedEnchantments['rare'].type);
   
  }
  
  onChangeEnchantment_ValueRare(event: number){
    // Store current types of higher rarity enchantments
    const currentEpicType = this.selectedEnchantments['epic'].type;
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;
    
    // Update the rare value
    this.selectedEnchantments['rare'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    
    // Emit the event
    this.enchantmentSelected_ValueRare.emit(this.selectedEnchantments['rare'].value);
  }

  onChangeEnchantment_TypeEpic(event: string){
    const currentUncommonType = this.selectedEnchantments['uncommon'].type;
    const currentRareType = this.selectedEnchantments['rare'].type;
    const currentEpicType = this.selectedEnchantments['epic'].type;
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;

    this.selectedEnchantments['epic'].value = 0;
    this.selectedEnchantments['epic'].type = event;

   // this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlisthelmet/?itemhelmet=${this.selectedItem?.name}&enchantment_helmettype=${currentUncommonType}&enchantment_helmettype2=${currentRareType}&enchantment_helmettype3=${currentEpicType}&enchantment_helmettype4=${currentLegendaryType}&enchantment_helmettype5=${currentUniqueType}`));
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    this.enchantmentSelected_TypeEpic.emit(this.selectedEnchantments['epic'].type);
  }
  
  onChangeEnchantment_ValueEpic(event: number){
    // Store current types of higher rarity enchantments
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;
    
    // Update the epic value
    this.selectedEnchantments['epic'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
  
    // Emit the event
    this.enchantmentSelected_ValueEpic.emit(this.selectedEnchantments['epic'].value);
  }

  onChangeEnchantment_TypeLegendary(event: string){
    const currentUncommonType = this.selectedEnchantments['uncommon'].type;
    const currentRareType = this.selectedEnchantments['rare'].type;
    const currentEpicType = this.selectedEnchantments['epic'].type;
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;

    this.selectedEnchantments['legendary'].value = 0;
    this.selectedEnchantments['legendary'].type = event;
    
   // this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlisthelmet/?itemhelmet=${this.selectedItem?.name}&enchantment_helmettype=${currentUncommonType}&enchantment_helmettype2=${currentRareType}&enchantment_helmettype3=${currentEpicType}&enchantment_helmettype4=${currentLegendaryType}&enchantment_helmettype5=${currentUniqueType}`));
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    this.enchantmentSelected_TypeLegendary.emit(this.selectedEnchantments['legendary'].type);
  }
  
  onChangeEnchantment_ValueLegendary(event: number){
    // Store current types of higher rarity enchantments
    const currentUniqueType = this.selectedEnchantments['unique'].type;
    
    // Update the legendary value
    this.selectedEnchantments['legendary'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    // Emit the event
    this.enchantmentSelected_ValueLegendary.emit(this.selectedEnchantments['legendary'].value);
  }

  onChangeEnchantment_TypeUnique(event: string){
    const currentUncommonType = this.selectedEnchantments['uncommon'].type;
    const currentRareType = this.selectedEnchantments['rare'].type;
    const currentEpicType = this.selectedEnchantments['epic'].type;
    const currentLegendaryType = this.selectedEnchantments['legendary'].type;
    const currentUniqueType = this.selectedEnchantments['unique'].type;

    this.selectedEnchantments['unique'].value = 0;
    this.selectedEnchantments['unique'].type = event;

   // this.fetchEnchantment_List(this.apiConfig.getApiUrl(`/enchantmentlisthelmet/?itemhelmet=${this.selectedItem?.name}&enchantment_helmettype=${currentUncommonType}&enchantment_helmettype2=${currentRareType}&enchantment_helmettype3=${currentEpicType}&enchantment_helmettype4=${currentLegendaryType}&enchantment_helmettype5=${currentUniqueType}`));
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    this.enchantmentSelected_TypeUnique.emit(this.selectedEnchantments['unique'].type);
  }
  
  onChangeEnchantment_ValueUnique(event: number){
    // Update the unique value
    this.selectedEnchantments['unique'].value = event;
    
    // Re-fetch enchantment values with all current enchantment types
    if(this.selectedItem){this.fetchEnchantment_Value(this.selectedItem)}
    
    // Emit the event
    this.enchantmentSelected_ValueUnique.emit(this.selectedEnchantments['unique'].value);
  }


  // Format values for display
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
    switch (this.selectedRarity) {
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
}