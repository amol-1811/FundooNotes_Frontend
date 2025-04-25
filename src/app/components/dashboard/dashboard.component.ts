import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayNoteComponent } from '../notes/display-note/display-note.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild(DisplayNoteComponent) displayNoteComponent!: DisplayNoteComponent;
  refreshTrigger: number = 0;
  searchText: string = '';
  isAccountMenuOpen: boolean = false;
  onSearchChange() {}
  clearSearch() {
    this.searchText = '';
  }
  isSidebarOpen = true;
  navItems = [
    { icon: 'lightbulb', label: 'Notes' },
    { icon: 'notifications', label: 'Reminders' },
    { icon: 'edit', label: 'Edit Labels' },
    { icon: 'archive', label: 'Archive' },
    { icon: 'delete', label: 'Bin' },
  ];
  showTooltip: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  } 

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.right-section')) {
      this.isAccountMenuOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  logout(event: MouseEvent): void {
    event.stopPropagation();
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  refreshNotes() {
    if (this.displayNoteComponent) {
      console.log('Refreshing notes via ViewChild...');
      this.displayNoteComponent.getallNotes();
    } else {
      console.log('DisplayNoteComponent not accessible via ViewChild, using refresh trigger...');
      this.refreshTrigger++;
    }
  }

  allNotes: any[] = [];
  addNote(note: any) {
    console.log('Note added:', note);
    this.refreshNotes();
  }
}
