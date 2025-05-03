import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  searchText: string = '';
  isAccountMenuOpen: boolean = false;
  //isSidebarOpen = true;
  showTooltip: any;
  isRefreshing: boolean = false;

  @Output() refreshTriggered = new EventEmitter<void>();

  constructor(private router: Router) {}

  onSearchChange() {}

  clearSearch() {
    this.searchText = '';
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  logout(event: MouseEvent): void {
    event.stopPropagation();
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  refreshNotes(): void {
    this.isRefreshing =  true;
    this.refreshTriggered.emit();

    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }

  // toggleSidebar(): void {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }
}
