import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NoteService } from 'src/app/services/note/note.service';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss'],
})
export class CollaboratorComponent implements OnChanges {
  @Input() noteId: any;
  @Output() closeModal = new EventEmitter<void>();

  Email: string = '';
  collaborators: any[] = [];

  constructor(private noteService: NoteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['noteId'] &&
      changes['noteId'].currentValue !== undefined &&
      changes['noteId'].currentValue !== null
    ) {
      this.noteService.GetAllCollaborator(this.noteId).subscribe({
        next: (resp) => {
          console.log(resp);
          this.collaborators = resp?.fullData;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  ngOnInit() {}

  addCollaborator(noteId: any) {
    this.collaborators.push({email: this.Email});
    this.noteService.AddCollaborator(noteId, this.Email).subscribe({
      next: (val) => {
        console.log(val);
      },

      error: (err) => {
        console.log(err);
      },
    });
    this.Email = '';
  }

  removeCollaborator(noteId: any, email: string) {
    this.collaborators = this.collaborators.filter((e) => e !== email);
    this.noteService.RemoveCollaborator(noteId, email).subscribe({
      next: (val) => {
        console.log(val);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  close() {
    this.closeModal.emit();
  }
}
