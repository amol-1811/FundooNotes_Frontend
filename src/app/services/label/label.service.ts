import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor(private httpService: HttpService) { }

  getAllLabels(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/getalllabels', headers);
  }

  getNotesByLabel(labelId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi(`/getnotesbylabel?labelId=${labelId}`, headers);
  }

  addLabel(name: string): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi(`/addlabel?name=${name}`, null, headers);
  }

  assignLabel(noteId: number, labelId:number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.putApi(`/assignlabeltonote?noteId=${noteId}&labelId=${labelId}`, null, headers);
  }

  removeLabel(noteId: number, labelId:number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.deleteApi(`/deletelabel?noteId=${noteId}&labelId=${labelId}`, headers);
  }

}
