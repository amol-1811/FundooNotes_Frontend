import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent {

  @Output() noteAction = new EventEmitter<string>();

  action(type: string) {
    this.noteAction.emit(type);
  }
}
