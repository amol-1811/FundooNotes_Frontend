import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelService } from 'src/app/services/label/label.service';
import { NoteService } from 'src/app/services/note/note.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-label-notes',
  templateUrl: './label-notes.component.html',
  styleUrls: ['./label-notes.component.scss']
})
export class LabelNotesComponent implements OnInit {
  labelId: number = 0;
  labelName: string = '';
  isLoading: boolean = false;
  filteredNotes: any[] = [];
  searchText: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private labelService: LabelService,
    private noteService: NoteService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // Get label ID from route parameters
    this.route.params.subscribe(params => {
      this.labelId = params['labelId'];
      if (this.labelId) {
        this.getLabelDetails();
        this.loadLabelNotes(this.labelId); // Pass labelId to method
      }
    });

    // Subscribe to search input
    this.searchService.searchTextObservable.subscribe((searchText: string) => {
      this.searchText = searchText;
      this.loadLabelNotes(this.labelId); // Reload notes with current filter
    });
  }

  getLabelDetails(): void {
    this.labelService.getAllLabels().subscribe({
      next: (response) => {
        const label = response.data.find((l: any) => l.id === this.labelId || l.labelId === this.labelId);
        if (label) {
          this.labelName = label.labelName;
        }
      },
      error: (err) => {
        console.error('Error fetching label details:', err);
      }
    });
  }

  loadLabelNotes(labelId: number): void {
    this.isLoading = true;
    this.labelService.getNotesByLabel(labelId).subscribe({
      next: (response) => {
        const notes = response.data || response;
        this.filteredNotes = this.applySearchFilter(notes, this.searchText);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading label notes:', error);
        this.filteredNotes = [];
        this.isLoading = false;
      }
    });
  }

  private applySearchFilter(notes: any[], searchText: string): any[] {
    if (!searchText.trim()) return notes;

    const term = searchText.toLowerCase();
    return notes.filter(note =>
      note.title?.toLowerCase().includes(term) ||
      note.description?.toLowerCase().includes(term)
    );
  }

  onNoteColorChanged(updatedNote: any): void {
    const index = this.filteredNotes.findIndex(note => note.notesId === updatedNote.notesId);
    if (index !== -1) {
      this.filteredNotes[index] = updatedNote;
    }
  }

  refreshNotes(): void {
    this.loadLabelNotes(this.labelId);
  }
}
