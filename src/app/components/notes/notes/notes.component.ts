import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayNoteComponent } from '../display-note/display-note.component';
import { NoteService } from 'src/app/services/note/note.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  @ViewChild(DisplayNoteComponent) displayNoteComponent!: DisplayNoteComponent;
  refreshTrigger: number = 0;
  isLoading: boolean = false;
  notes: any[] = [];
  filteredNotes: any[] = [];
  constructor(private noteService: NoteService, private searchService: SearchService) {
  }

  refreshNotes() {
    if (this.displayNoteComponent) {
      console.log('Refreshing notes via ViewChild...');
      this.getallNotes();
    } else {
      console.log(
        'DisplayNoteComponent not accessible via ViewChild, using refresh trigger...'
      );
      this.refreshTrigger++;
    }
  }

  ngOnInit() {
    this.getallNotes();
    this.searchService.searchText$.subscribe(searchText => {
      this.filterNotes(searchText);
    });
  }

  filterNotes(searchText: string): void {
    if (!searchText) {
      this.filteredNotes = [...this.notes];
      return;
    }

    this.filteredNotes = this.notes.filter(note =>
      note.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  }


  allNotes: any[] = [];
  addNote(note: any) {
    console.log('Note added:', note);
    this.refreshNotes();
  }
  
  archiveNoteList: any[] = [];

  getallNotes() {
    console.log('Fetching all notes...');
    this.isLoading = true;

    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response);
        this.isLoading = false;

        if (Array.isArray(response)) {
          console.log('inside array');
          this.notes = response.filter((f) => f.isArchive === false);
          this.filteredNotes = [...this.notes]; 
          this.archiveNoteList = response.filter((f) => f.isArchive === true);
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log('inside response data');
          this.notes = response.data.filter(
            (f: { isArchive: boolean }) => f.isArchive === false
          );
          this.archiveNoteList = response.data.filter(
            (f: { isArchive: boolean }) => f.isArchive === true
          );
          this.filteredNotes = [...this.notes]; 
        } else if (response && typeof response === 'object') {
          console.log('inside response typeof');
          const possibleNotesArray = Object.values(response).find((val) =>
            Array.isArray(val)
          );
          if (possibleNotesArray && Array.isArray(possibleNotesArray)) {
            this.notes = possibleNotesArray;
          } else {
            // If nothing else worked, initialize as empty array
            console.warn('Could not find notes array in response', response);
            this.notes = [];
          }
        } else {
          console.warn('Unexpected response format:', response);
          this.notes = [];
        }
        console.log('Processed notes:', this.notes);
        if (this.notes.length === 0) {
          console.log('No notes found in the response.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching notes:', error);
      },

      complete: () => this.isLoading = false
    });
  }
}
