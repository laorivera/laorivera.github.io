
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'chest-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chest-box.component.html',
  styleUrl: './chest-box.component.css'
})

export class ChestBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'chest';
  }

  protected getItemListEndpoint(): string {
    return '/chestlist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/chestratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistchest/';
  }
}

