import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { 
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  
 } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditComponent } from '../notes/edit/edit.component';
import { NoteService } from 'src/app/services/note/note.service';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  
  showModal: boolean = false;

  searchText: string = '';
  isRefreshing: boolean = false;
  isAccountMenuOpen: boolean = false;
  labels: any[] = [];
  //readonly dialog = inject(MatDialog);

  onSearchChange() {}
  clearSearch() {
    this.searchText = '';
  }
  isSidebarOpen = true;
  showTooltip: any;

  constructor(private router: Router, 
              private noteService: NoteService, 
              private labelService: LabelService, 
              private dialog: MatDialog) {}

  ngOnInit(): void {
    // document.addEventListener('click', this.handleClickOutside.bind(this));
    // this.checkScreenSize();
    // window.addEventListener('resize', this.checkScreenSize.bind(this));
    this.labelService.getAllLabels()
      .subscribe({
        next: (response) => {
          this.labels = response.data;
        },

        error: (err) => {
          console.log(err);
        }
      })

  } 

  ngOnDestroy(): void {
    // document.removeEventListener('click', this.handleClickOutside.bind(this));
    // window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize(): void {
    if (window.innerWidth <= 600) {
      this.isSidebarOpen = false;
    }
  }

  refreshNotes(): void {
    //this.isRefreshing = true;
    //this.refreshTriggered.emit();
    this.isRefreshing = true;
    this.noteService.getAllNotes()
    .subscribe({
      next: (val) => {
        this.isRefreshing = false;
      },

      error: (err) => {
        this.isRefreshing = false;
      }
    })
  }

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.right-section')) {
      this.isAccountMenuOpen = false;
    }
    if (window.innerWidth <= 600 && !target.closest('.sidenav') && !target.closest('button[matTooltip="Main Menu"]')) {
      this.isSidebarOpen = false;
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

  

  openDialog($event: Event): void {
    
    this.showModal = true;
  }
}
