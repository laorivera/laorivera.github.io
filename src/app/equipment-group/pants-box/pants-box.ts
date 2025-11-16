
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'pants-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pants-box.component.html',
  styleUrl: './pants-box.component.css'
})

export class PantsBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'pants';
  }

  protected getItemListEndpoint(): string {
    return '/pantslist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/pantsratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistpants/';
  }
}

