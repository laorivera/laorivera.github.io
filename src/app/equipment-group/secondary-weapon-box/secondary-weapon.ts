
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEquipmentBox } from '../base-equipment-box';

@Component({
  selector: 'secondary-weapon-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secondary-weapon-box.component.html',
  styleUrl: './secondary-weapon-box.component.css'
})

export class SecondaryWeaponBoxObject extends BaseEquipmentBox {
  
  // Implement abstract methods - just provide the slot and endpoints
  protected getSlot(): string {
    return 'weaponTwo';
  }

  protected getItemListEndpoint(): string {
    return '/pwtlist/';
  }

  protected override getRatingListEndpoint(): string {
    return '/pwtratinglist/';
  }

  protected getEnchantmentListEndpoint(): string {
    return '/enchantmentlistpwt/';
  }
}

