import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Simple navigation handler
  navigateTo(destination: string) {
    console.log(`Navigating to ${destination}`);
    // Add your navigation logic here
    // window.location.href = `/${destination}`;
    // or use a service to handle navigation
  }

  // Support button handler
  openSupport() {
    window.open('https://support.yoursite.com', '_blank');
  }
}