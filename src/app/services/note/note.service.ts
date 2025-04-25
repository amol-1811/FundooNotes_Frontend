import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NoteService {

  constructor(private httpService: HttpService) {}

  createNote(payload: any): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi('/createnote', payload, headers);
  }

  getAllNotes(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/getnotes', headers);
  }

  updateNoteColor(data: {noteId: any, Color: string}): Observable<any> {
    const headers = this.httpService.getHeader();
    
    console.log('Update note color data:', data);

    const params = new HttpParams()
      .set('notesId', data.noteId.toString())
      .set('Color', data.Color);
      
    console.log('Sending parameters:', params.toString());
  
    return this.httpService.putApi('/addcolor', null, headers, params);
  }

  // updateNoteColor(data: {noteId: any, Color: string}): Observable<any> {
  //   const headers = this.httpService.getHeader();
    
  //   // Debug the data
  //   console.log('Update note color data:', data);
    
  //   // Check if noteId exists and is not undefined
  //   if (data.noteId === undefined) {
  //     console.error('Note ID is undefined!');
  //     // Return an error observable
  //     return new Observable(observer => {
  //       observer.error(new Error('Note ID is undefined'));
  //     });
  //   }
    
  //   // Make sure noteId is sent as a number
  //   const noteId = Number(data.noteId);
    
  //   // Use template literals to create params to ensure values are properly converted to strings
  //   const params = new HttpParams()
  //     .set('noteId', `${noteId}`)
  //     .set('Color', data.Color);
      
  //   console.log('Sending parameters:', params.toString());
  
  //   return this.httpService.putApi('/addcolor', null, headers, params);
  // }

  togglePin(noteId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.putApi(`/pinnotes${noteId}`, {}, headers);
  }
}
