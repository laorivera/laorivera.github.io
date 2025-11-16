
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'primary-weapon-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './primary-weapon-box.component.html',
  styleUrl: './primary-weapon-box.component.css'
})

export class PrimaryWeaponBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'weaponOne';
  }

  protected getItemListEndpoint(): string {
    return '/pwolist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/pworatinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistpwo/';
  }
}

