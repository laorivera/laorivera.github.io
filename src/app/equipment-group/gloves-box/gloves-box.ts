import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'gloves-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gloves-box.component.html',
  styleUrl: './gloves-box.component.css'
})

export class GlovesBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'hands';
  }

  protected getItemListEndpoint(): string {
    return '/gloveslist/';
  }

   protected override getRatingListEndpoint(): string {
    return '/glovesratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistgloves/';
  }
}
