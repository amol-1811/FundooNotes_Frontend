import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  isListView: boolean = false;
  isGridView: boolean = true;

  constructor() { }

  getGridView(): Observable<boolean> {
    return of(this.isGridView);
  }

  toggleView(): Observable<boolean> {
    this.isGridView = !this.isGridView;
    this.isListView = !this.isListView;
    return of(this.isGridView);
  }
}
