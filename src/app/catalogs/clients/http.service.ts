import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Client } from '../../models/Client';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl;

  getClients(): Observable<Client[]> {
    const url = this.baseUrl + '/client';
    return this.http.get<Client[]>(url);
  }

  deleteClient(categoryId: number): Observable<any> {
    const url = this.baseUrl + `/client/${categoryId}`;
    return this.http.delete<Client>(url);
  }

  add(item: Client): Observable<Client> {
    const url = this.baseUrl + `/client`;
    return this.http.post<Client>(url, item);
  }

  edit(item: Client): Observable<any> {
    const url = this.baseUrl + `/client`;
    return this.http.put<Client>(url, item);
  }
}
