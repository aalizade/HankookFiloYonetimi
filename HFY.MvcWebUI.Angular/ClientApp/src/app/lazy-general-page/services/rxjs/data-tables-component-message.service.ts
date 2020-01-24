import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTablesComponentMessageService {

  constructor() { }

  private subject = new Subject<any>();

  // dataTablesSetData // örneğin componentRequest == Ebat ise Ebat tanımlı data array'i tetiklenecektir.
  dataTablesSetData(componentRequest: string,data:any[]) {
    this.subject.next({ componentRequest: componentRequest,data:data });
  }

  // General
  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
