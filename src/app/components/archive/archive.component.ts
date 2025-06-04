import { Component, OnInit, ViewChild } from '@angular/core';
import { NoteService } from 'src/app/services/note/note.service';
import { DisplayNoteComponent } from '../notes/display-note/display-note.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  @ViewChild(DisplayNoteComponent) displayNoteComponent!: DisplayNoteComponent;
  refreshTrigger: number = 0;
  archiveNoteList: any[] = [];

  isLoading: boolean;

  constructor(private noteService: NoteService) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.getAllArchivedNotes();
  }

  switchLoadingState() {
    this.isLoading = !this.isLoading;
  }

  getAllArchivedNotes() {
    this.switchLoadingState();

    console.log('Fetching archieve notes...');
    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response);
        

        if (Array.isArray(response)) {
          console.log('inside array');
          this.archiveNoteList = response.filter(
            (f) => f.isArchive === true && f.isTrash === false
          );
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log('inside response data');
          this.archiveNoteList = response.data.filter(
            (f: { isTrash: boolean; isArchive: boolean }) =>
              f.isArchive === true && f.isTrash === false
          );
        } else if (response && typeof response === 'object') {
          console.log('inside response typeof');
          const possibleNotesArray = Object.values(response).find((val) =>
            Array.isArray(val)
          );
          if (possibleNotesArray && Array.isArray(possibleNotesArray)) {
            this.archiveNoteList = possibleNotesArray;
          } else {
            // If nothing else worked, initialize as empty array
            console.warn('Could not find notes array in response', response);
            this.archiveNoteList = [];
          }
        } else {
          console.warn('Unexpected response format:', response);
          this.archiveNoteList = [];
        }
        if (this.archiveNoteList.length === 0) {
          console.log('No notes found in the response.');
        }
        this.switchLoadingState()
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
        this.switchLoadingState();
      },
    });
  }

  refreshNotes() {
    if (this.displayNoteComponent) {
      console.log('Refreshing notes via ViewChild...');
      this.getAllArchivedNotes();
    } else {
      console.log(
        'DisplayNoteComponent not accessible via ViewChild, using refresh trigger...'
      );
      this.refreshTrigger++;
    }
  }
}
