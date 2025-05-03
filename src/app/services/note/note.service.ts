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
    
    console.log('Update note color data:', data.Color);
    
    const payload = {
      noteId: data.noteId,
      Color: data.Color
    }
        
    return this.httpService.putApi('/addcolor', payload, headers);
  }

  updateNote(payload: any) {
    const headers = this.httpService.getHeader();
    
    console.log('Updating note:', payload);
        
    return this.httpService.putApi(`/updatenotes?notesId=${payload.notesId}`, payload, headers);
  }

  togglePin(noteId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.putApi(`/pinnotes${noteId}`, {}, headers);
  }

  ArchiveNote(noteId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.putApi(`/archivenote?noteId=${noteId}`, {}, headers);
  }
  
  TrashNote(noteId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.putApi(`/trashnotes?noteId=${noteId}`, {}, headers);
  }

  AddReminder(data: {noteId: number, Reminder: Date}): Observable<any> {
    const headers = this.httpService.getHeader();
    const payload = {
      noteId: data.noteId,
      Reminder: data.Reminder
    }
    return this.httpService.putApi('/addreminder', payload, headers)
  }
}
