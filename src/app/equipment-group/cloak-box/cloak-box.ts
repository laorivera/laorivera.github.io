
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'cloak-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cloak-box.component.html',
  styleUrl: './cloak-box.component.css'
})

export class CloakBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'back';
  }

  protected getItemListEndpoint(): string {
    return '/cloaklist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/cloakratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistcloak/';
  }
}

