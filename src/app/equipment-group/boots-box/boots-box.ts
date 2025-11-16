
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'boots-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boots-box.component.html',
  styleUrl: './boots-box.component.css'
})

export class BootsBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'foot';
  }

  protected getItemListEndpoint(): string {
    return '/bootslist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/bootsratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistboots/';
  }
}

