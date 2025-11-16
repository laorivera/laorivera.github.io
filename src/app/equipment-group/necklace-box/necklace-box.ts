
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'necklace-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './necklace-box.component.html',
  styleUrl: './necklace-box.component.css'
})

export class NecklaceBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'necklace';
  }

  protected getItemListEndpoint(): string {
    return '/necklacelist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistnecklace/';
  }
}

