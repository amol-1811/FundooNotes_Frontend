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
import { NoteService } from 'src/app/services/note/note.service';

@Component({
  selector: 'app-display-note',
  templateUrl: './display-note.component.html',
  styleUrls: ['./display-note.component.scss'],
})
export class DisplayNoteComponent implements OnInit, OnChanges {
  @Output() noteColorChanged = new EventEmitter<any>();
  @Input() refreshTrigger: number = 0; // Trigger to refresh notes

  notes: any[] = [];
  activeColorPalette: number | null = null;
  selectedNote: any = null;
  selectedNotes: Set<number> = new Set();
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
  
  ngOnInit() {
    this.getallNotes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.getallNotes();
    }
  }

  getallNotes() {
    console.log('Fetching all notes...');
    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response);

        if (Array.isArray(response)) {
          this.notes = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.notes = response.data;
        } else if (response && typeof response === 'object') {
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
        console.error('Error fetching notes:', error);
      },
    });
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
    event.stopPropagation();
    this.activeColorPalette = this.activeColorPalette === noteId ? null : noteId;
  }

  changeNoteColor(note: any, color: string, event: Event) {
    event.stopPropagation();
    
    // Get the note ID from the note object
    const noteId = note.id;
    
    console.log('Changing color for note with ID:', noteId);
    
    const payload = {
      noteId: noteId,  // This will be sent as "notesId" in the service
      Color: color,
    };
    
    this.noteService.updateNoteColor(payload).subscribe({
      next: (response) => {
        console.log('Note color updated successfully:', response);
        // Update the note color in the local array
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
    
    const noteToUpdate = this.notes.find(n => n.id === noteId || n.noteId === noteId);
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