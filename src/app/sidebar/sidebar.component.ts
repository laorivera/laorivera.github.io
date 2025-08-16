import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed = signal(false);
  collapsedWidth = '64px';
  expandedWidth = '200px';

  navItems = [
    { icon: 'assets/calculator.svg', label: 'Dashboard', route: 'calculator' },
    { icon: 'assets/changelog.png', label: 'Change Log', route: 'about'},
    { icon: 'assets/info.svg', label: 'Info', route: 'info' },
     
  ];

  toggleSidebar() {
    this.isCollapsed.update(current => !current);
  }

  navigateTo(route: string) {
    console.log('Navigating to:', route);
    // Add your navigation logic here
  }

  openSupport() {
    window.open('https://support.example.com', '_blank');
  }

}