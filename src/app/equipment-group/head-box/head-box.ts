
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'head-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-box.component.html',
  styleUrl: './head-box.component.css'
})

export class HeadBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'head';
  }

  protected getItemListEndpoint(): string {
    return '/helmetlist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/helmetratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlisthelmet/';
  }
}

