// display-note.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NoteService } from 'src/app/services/note/note.service';

@Component({
  selector: 'app-display-note',
  templateUrl: './display-note.component.html',
  styleUrls: ['./display-note.component.scss'],
})
export class DisplayNoteComponent implements OnInit, OnChanges {
  @Output() noteColorChanged = new EventEmitter<any>();
  @Input() refreshTrigger: number = 0;
  @Input() notes: any[] = [];

  activeColorPalette: number | null = null;
  selectedNote: any = null;
  selectedNotes: Set<number> = new Set();
  dateObj: any = null;
  colorOptions: string[] = [
    '#ffffff', // white
    '#f28b82', // red
    '#fbbc04', // orange
    '#fff475', // yellow
    '#ccff90', // green
    '#a7ffeb', // teal
    '#cbf0f8', // blue
    '#d7aefb', // purple
    '#fdcfe8', // pink
    '#e6c9a8', // brown
    '#e8eaed', // gray
  ];

  constructor(private noteService: NoteService) {
    const date = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);

    this.dateObj = {
      date: date,
      today: date.getHours() + ':' + '00',
      tomorrowDate: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      tomorrow:
        new Date(date.getTime() + 27 * 60 * 60 * 1000).getHours() + ':' + '00',
      nextWeek: {
        date: new Date(
          date.getTime() + (7 - date.getDay() + 1) * 24 * 60 * 60 * 1000
        ),
        day: new Date(
          date.getTime() + (7 - date.getDay() + 1) * 24 * 60 * 60 * 1000
        )
          .toDateString()
          .split(' ')[0],
        time:
          new Date(
            date.getTime() + (7 - date.getDay() + 1) * 24 * 60 * 60 * 1000
          ).getHours() +
          ':' +
          '00',
      },
    };
  }

  dateChangeEvent(note: any, event: MatDatepickerInputEvent<Date>) {
    console.log(event.target?.value);
    this.changeReminder(note, event.target?.value, 'Future');
  }

  removeReminder(note: any) {
    this.changeReminder(note, null, 'Today');
  }

  changeReminder(note: any, date: any, when: string) {
    note.reminder = date;
    console.log('Updating the reminder for ', when, 'for date ', date);
    this.noteService.updateNote(note).subscribe({
      next: (val) => {
        console.log(val);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit() {
    //this.getallNotes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      //this.getallNotes();
    }
  }

  archiveNoteList: any[] = [];

  // getallNotes() {
  //   console.log('Fetching all notes...');
  //   this.noteService.getAllNotes().subscribe({
  //     next: (response: any) => {
  //       console.log('Raw API response:', response);

  //       if (Array.isArray(response)) {
  //         console.log("inside array");
  //         this.notes = response.filter(f=> f.isArchive === false);
  //         this.archiveNoteList = response.filter(f=> f.isArchive === true);
  //       } else if (response && response.data && Array.isArray(response.data)) {
  //         console.log("inside response data");
  //         this.notes = response.data.filter((f: { isArchive: boolean; })=> f.isArchive === false);
  //         this.archiveNoteList = response.data.filter((f: { isArchive: boolean; })=> f.isArchive === true);
  //       } else if (response && typeof response === 'object') {
  //         console.log("inside response typeof");
  //         const possibleNotesArray = Object.values(response).find((val) =>
  //           Array.isArray(val)
  //         );
  //         if (possibleNotesArray && Array.isArray(possibleNotesArray)) {
  //           this.notes = possibleNotesArray;
  //         } else {
  //           // If nothing else worked, initialize as empty array
  //           console.warn('Could not find notes array in response', response);
  //           this.notes = [];
  //         }
  //       } else {
  //         console.warn('Unexpected response format:', response);
  //         this.notes = [];
  //       }
  //       console.log('Processed notes:', this.notes);
  //       if (this.notes.length === 0) {
  //         console.log('No notes found in the response.');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching notes:', error);
  //     },
  //   });
  // }

  selectNote(noteId: any, event: Event) {
    // Handle note selection (checkbox)
    event.stopPropagation();

    if (this.selectedNotes.has(noteId)) {
      this.selectedNotes.delete(noteId);
    } else {
      this.selectedNotes.add(noteId);
    }
  }

  openNoteDetail(note: any) {
    // Close color palette if open when clicking on note
    if (this.activeColorPalette !== null) {
      this.activeColorPalette = null;
      return;
    }
    console.log('Opening note detail:', note);
    this.selectedNote = { ...note };
  }

  closeNoteDetail() {
    this.selectedNote = null;
    this.activeColorPalette = null;
  }

  toggleColorPalette(noteId: any, event: MouseEvent): void {
    console.log(noteId);
    event.stopPropagation();
    this.activeColorPalette =
      this.activeColorPalette === noteId ? null : noteId;

    //this.changeNoteColor(noteId, , event);
  }

  changeNoteColor(note: any, color: string, event: Event) {
    event.stopPropagation();

    const noteId = note.notesId;

    const payload = {
      noteId: noteId,
      Color: color,
    };

    this.noteService.updateNoteColor(payload).subscribe({
      next: (response) => {
        console.log('Note color updated successfully:', response);
        note.color = color;
        this.noteColorChanged.emit(note);
      },
      error: (error) => {
        console.error('Error updating note color:', error);
      },
    });

    this.activeColorPalette = null;
  }

  togglePin(note: any, event: Event): void {
    event.stopPropagation();
    const noteId = note.id || note.noteId;

    const noteToUpdate = this.notes.find(
      (n) => n.id === noteId || n.noteId === noteId
    );
    if (noteToUpdate) {
      noteToUpdate.isPinned = !noteToUpdate.isPinned;
    }

    this.noteService.togglePin(noteId).subscribe({
      next: (response) => {
        console.log('Note pin status updated:', response);
      },
      error: (error) => {
        console.error('Error toggling pin status:', error);
        if (noteToUpdate) {
          noteToUpdate.isPinned = !noteToUpdate.isPinned;
        }
      },
    });
  }

  archiveNote(note: any, event: Event): void {
    console.log('Archiving note:', note);
    event.stopPropagation();
    const noteId = note.notesId || note.noteId;

    this.noteService.ArchiveNote(noteId).subscribe({
      next: (response) => {
        console.log('Note archived successfully:', response);
        this.notes = this.notes.filter((n) => n.notesId !== noteId);
        //this.getallNotes();
      },
      error: (error) => {
        console.error('Error archiving note:', error);
      },
    });
  }

  trashNote(note: any, event: Event): void {
    console.log('Trashing note:', note);
    event.stopPropagation();
    const noteId = note.notesId || note.noteId;

    this.noteService.TrashNote(noteId).subscribe({
      next: (response) => {
        console.log('Note trashed successfully:', response);
        this.notes = this.notes.filter((n) => n.notesId !== noteId);
        //this.getallNotes();
      },
      error: (error) => {
        console.error('Error trashing note:', error);
      },
    });
  }

  addReminder(note: any, event: Event): void {
    event.stopPropagation();
    const noteId = note.notesId || note.noteId;

    this.noteService.AddReminder(noteId).subscribe({
      next: (response) => {
        this.notes = this.notes.filter((n) => n.notesId !== noteId);
      },
      error: (error) => {
        console.error('Error Reminder note:', error);
      },
    });
  }

  // Close color palette when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.color-palette') &&
      !target.closest('[matTooltip="Background options"]') &&
      !target.closest('.color-option')
    ) {
      this.activeColorPalette = null;
    }
  }
}
