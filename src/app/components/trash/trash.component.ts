import { Component, OnInit, ViewChild } from '@angular/core';
import { NoteService } from 'src/app/services/note/note.service';
import { DisplayNoteComponent } from '../notes/display-note/display-note.component';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent {
  @ViewChild(DisplayNoteComponent) displayNoteComponent!: DisplayNoteComponent;
  refreshTrigger: number = 0;
  trashNoteList!: any[];
  isLoading: boolean = false;

  constructor(private noteService: NoteService) {
    this.getAllTrashNotes();
  }

  getAllTrashNotes() {
    console.log('Fetching trash notes...');
    this.isLoading = true;

    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response);
        

        if (Array.isArray(response)) {
          console.log('inside array');
          this.trashNoteList = response.filter((f) => f.isTrash === true);
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log('inside response data');
          this.trashNoteList = response.data.filter(
            (f: { isTrash: boolean }) => f.isTrash === true
          );
        } else if (response && typeof response === 'object') {
          console.log('inside response typeof');
          const possibleNotesArray = Object.values(response).find((val) =>
            Array.isArray(val)
          );
          if (possibleNotesArray && Array.isArray(possibleNotesArray)) {
            this.trashNoteList = possibleNotesArray;
          } else {
            // If nothing else worked, initialize as empty array
            console.warn('Could not find notes array in response', response);
            this.trashNoteList = [];
          }
        } else {
          console.warn('Unexpected response format:', response);
          this.trashNoteList = [];
        }
        if (this.trashNoteList.length === 0) {
          console.log('No notes found in the response.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching notes:', error);
      },

      complete: () => (this.isLoading = false),
    });
  }

  refreshNotes() {
    if (this.displayNoteComponent) {
      console.log('Refreshing notes via ViewChild...');
      this.getAllTrashNotes();
    } else {
      console.log(
        'DisplayNoteComponent not accessible via ViewChild, using refresh trigger...'
      );
      this.refreshTrigger++;
    }
  }
}
