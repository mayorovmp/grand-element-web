import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService as HttpCarCategoryService } from 'src/app/catalogs/car-category/http.service';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Request } from '../models/Request';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private httpCarCategorySrv: HttpCarCategoryService) { }

  private baseUrl = environment.baseUrl;

  add(request: Request): Observable<Request> {
    const url = this.baseUrl + '/request';
    return this.http.post<any>(url, request);
  }

  edit(request: Request): Observable<Request> {
    const url = this.baseUrl + '/request';
    return this.http.put<any>(url, request);
  }

  editProduct(request: Request): Observable<Request> {
    const url = this.baseUrl;

    return this.http.put<Request>(url, request);
  }


  del(req: Request): Observable<any> {
    const url = this.baseUrl + `/request/${req.id}`;
    return this.http.delete<any>(url);
  }

  finishRequest(requestId: number): Observable<any> {
    const url = this.baseUrl + `/request/complete/${requestId}`;
    return this.http.post<any>(url, requestId);
  }

  getRequests(): Observable<Request[]> {
    const url = this.baseUrl + '/request';
    return this.http.get<Request[]>(url);
  }
  getRequestsByDate(dt: Date): Observable<Request[]> {
    const url = this.baseUrl + `/request/${dt.toISOString()}`;
    return this.http.get<Request[]>(url);
  }

  getLastRequest(): Observable<Request> {
    const url = this.baseUrl + `/request/last`;
    return this.http.get<Request>(url);
  }

  getFile(dt: Date): Observable<HttpResponse<Blob>> {
    const path = this.baseUrl + `/request/excel/${dt.toISOString()}`;
    return this.http.get(path, { observe: 'response', responseType: 'blob' });
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
