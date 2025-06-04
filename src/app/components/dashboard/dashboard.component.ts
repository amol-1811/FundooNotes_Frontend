import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { EditComponent } from '../notes/edit/edit.component';
import { filter } from 'rxjs/operators';
import { NoteService } from 'src/app/services/note/note.service';
import { LabelService } from 'src/app/services/label/label.service';
import { ViewService } from 'src/app/services/view/view.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  @Output() viewChangeEvent = new EventEmitter<boolean>();

  showModal: boolean = false;

  searchText: string = '';
  isSearchActive: boolean = false;
  isRefreshing: boolean = false;
  isAccountMenuOpen: boolean = false;
  labels: any[] = [];
  headerTitle: string = 'Keep';
  isGridView: boolean;
  //readonly dialog = inject(MatDialog);

  onSearch() {
    this.searchService.emitSearchText(this.searchText);
  }

  isSidebarOpen = true;
  showTooltip: any;

  constructor(
    private router: Router,
    //changeDetectorRef: ChangeDetectorRef,
    private noteService: NoteService,
    private labelService: LabelService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialog: MatDialog,
    private viewService: ViewService,
    private searchService: SearchService
  ) {
    this.isGridView = this.viewService.isGridView;
  }

  ngOnInit(): void {
    // document.addEventListener('click', this.handleClickOutside.bind(this));
    // this.checkScreenSize();
    // window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event?.urlAfterRedirects;
        if (url?.includes('/dashboard/notes')) {
          this.headerTitle = 'Keep';
        } else if (url?.includes('/dashboard/archive')) {
          this.headerTitle = 'Archive';
        } else if (url?.includes('/dashboard/bin')) {
          this.headerTitle = 'Bin';
        } else if (url?.includes('/dashboard/reminder')) {
          this.headerTitle = 'Reminders';
        } else if (url?.includes('/dashboard/label/')) {
          const labelId = url.split('/dashboard/label/')[1];
          const label = this.labels.find(
            (l) => (l.id || l.labelId) === labelId
          );
          this.headerTitle = label ? label.labelName : 'Label';
        } else {
          this.headerTitle = 'Keep';
        }
      });

    this.labelService.getAllLabels().subscribe({
      next: (response) => {
        this.labels = response.data;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    // document.removeEventListener('click', this.handleClickOutside.bind(this));
    // window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  switchView() {
    this.viewService.toggleView()
    .subscribe({
      next: val => {
        console.log("Toggling Grid value ", val);
        this.isGridView = val;
        this.viewChangeEvent.emit(this.isGridView);
      },
      error: err => console.error(err)
    })
  }

  clearSearch() {
    this.searchText = '';
    this.searchService.emitSearchText('');
  }

  checkScreenSize(): void {
    if (window.innerWidth <= 600) {
      this.isSidebarOpen = false;
    }
  }

  onSearchFocus(): void {
    this.isSearchActive = true;
  }

  onSearchBlur() {
    this.isSearchActive = true;
  }

  refreshNotes(): void {
    //this.isRefreshing = true;
    //this.refreshTriggered.emit();
    this.isRefreshing = true;
    this.noteService.getAllNotes().subscribe({
      next: (val) => {
        this.isRefreshing = false;
      },

      error: (err) => {
        this.isRefreshing = false;
      },
    });
  }

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.right-section')) {
      this.isAccountMenuOpen = false;
    }
    if (
      window.innerWidth <= 600 &&
      !target.closest('.sidenav') &&
      !target.closest('button[matTooltip="Main Menu"]')
    ) {
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
