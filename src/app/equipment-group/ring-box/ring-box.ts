
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'ring-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ring-box.component.html',
  styleUrl: './ring-box.component.css'
})

export class RingBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'ringOne';
  }

  protected getItemListEndpoint(): string {
    return '/ringlist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistring/';
  }
}
