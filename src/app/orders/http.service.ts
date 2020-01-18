import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService as HttpCarCategoryService } from 'src/app/catalogs/car-category/http.service';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Envelope } from 'src/app/Envelope';
import { Request } from '../models/Request';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private httpCarCategorySrv: HttpCarCategoryService) { }

  private baseUrl = environment.baseUrl;

  getRequests(): Observable<Envelope<Request[]>> {
    const url = this.baseUrl + '/request';
    return this.http.get<Envelope<Request[]>>(url);
  }
  getRequestsByDate(dt: Date): Observable<Envelope<Request[]>> {
    const url = this.baseUrl + `/request/${dt.toISOString()}`;
    return this.http.get<Envelope<Request[]>>(url);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
