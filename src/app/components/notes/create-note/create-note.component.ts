// create-note.component.ts
import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { NoteService } from 'src/app/services/note/note.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss'],
})
export class CreateNoteComponent {
  @Output() noteCreated = new EventEmitter();

  isExpanded = false;
  title = '';
  content = '';
  isPinned = false;
  showColorPalette = false;
  noteColor = '#ffffff';

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
  constructor(private noteService: NoteService) {}

  toggleExpand() {
    this.isExpanded = true;
  }

  closeNote() {
    if (this.title.trim() !== '' || this.content.trim() !== '') {
      this.createNote();
    }
    this.resetForm();
  }

  createNote() {
    const note = {
      id: Date.now(),
      title: this.title,
      content: this.content,
      isPinned: this.isPinned,
      color: this.noteColor,
      createdAt: new Date(),
    };
    this.noteService.createNote(note).subscribe({
      next: (response) => {
        console.log('Note created:', response);
        this.noteCreated.emit(note);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating note:', error);
      },
    });
  }

  resetForm() {
    this.isExpanded = false;
    this.title = '';
    this.content = '';
    this.isPinned = false;
    this.noteColor = '#ffffff';
    this.showColorPalette = false;
  }

  togglePin() {
    this.isPinned = !this.isPinned;
  }

  toggleColorPalette(event: Event) {
    event.stopPropagation();
    this.showColorPalette = !this.showColorPalette;
  }

  changeColor(color: string, event: Event) {
    event.stopPropagation();
    this.noteColor = color;
    this.showColorPalette = false;
  }

  // Close color palette when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.showColorPalette) {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.color-palette') &&
        !target.closest('[matTooltip="Background options"]')
      ) {
        this.showColorPalette = false;
      }
    }
  }
}
