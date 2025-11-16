
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'ring-box-two',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ring-box.component-two.html',
  styleUrl: './ring-box.component-two.css'
})

export class RingTwoBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'ringTwo';
  }

  protected getItemListEndpoint(): string {
    return '/ringlist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistring/';
  }
}
