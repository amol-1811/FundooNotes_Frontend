import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  private searchTextSubject = new Subject<string>();
  searchText$ = this.searchTextSubject.asObservable();
  searchTextObservable = this.searchTextSubject.asObservable();

  emitSearchText(text: string) {
    this.searchTextSubject.next(text);
  }
}
