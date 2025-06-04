import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { NoteService } from 'src/app/services/note/note.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss'],
})
export class ReminderComponent {
  @Output() noteColorChanged = new EventEmitter<any>();
  reminderNotes: any[] = [];
  activeColorPalette: number | null = null;
  selectedNote: any = null;
  selectedNotes: Set<number> = new Set();
  isLoading: boolean;

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
    this.isLoading = false;
  }

  markAsDone(note: any, event: Event) {
    this.reminderNotes = this.reminderNotes.filter(n => n.notesId !== note.notesId);
  }

  selectNote(noteId: any, event: Event) {
    // Handle note selection (checkbox)
    event.stopPropagation();

    if (this.selectedNotes.has(noteId)) {
      this.selectedNotes.delete(noteId);
    } else {
      this.selectedNotes.add(noteId);
    }
  }

  removeReminder(note: any, event: Event) {
    this.markAsDone(note, event);
  }

  ngOnInit(): void {
    this.noteService.getAllNotes().subscribe({
      next: (val) => {
        console.log(val);
        this.reminderNotes = val.data.filter(
          (n: { reminder: null | undefined }) =>
            n?.reminder !== null && n?.reminder !== undefined
        );
        console.log(this.reminderNotes);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  switchLoadingState() {
    this.isLoading = !this.isLoading;
  }

  openNoteDetail(note: any) {
    console.log('Opening note detail:', note);
    this.selectedNote = { ...note };
  }

  togglePin(note: any, event: Event): void {
    event.stopPropagation();
    const noteId = note.id || note.noteId;

    const noteToUpdate = this.reminderNotes.find(
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

  archiveNote(note: any, event: Event): void {
    console.log('Archiving note:', note);
    event.stopPropagation();
    const noteId = note.notesId || note.noteId;

    this.noteService.ArchiveNote(noteId).subscribe({
      next: (response) => {
        console.log('Note archived successfully:', response);
        this.reminderNotes = this.reminderNotes.filter(
          (n) => n.notesId !== noteId
        );
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
        this.reminderNotes = this.reminderNotes.filter(
          (n) => n.notesId !== noteId
        );
        //this.getallNotes();
      },
      error: (error) => {
        console.error('Error trashing note:', error);
      },
    });
  }

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
