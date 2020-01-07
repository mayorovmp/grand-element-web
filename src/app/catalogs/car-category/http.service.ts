import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Envelope } from 'src/app/Envelope';
import { CarCategory } from '../../models/CarCategory';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl;
  private categoryUrl = this.baseUrl + '/CarCategory';

  test(): Observable<Envelope<CarCategory[]>> {
    const url = encodeURI(`${this.baseUrl}/user`);

    return this.http.get<Envelope<CarCategory[]>>(url)
      .pipe(
        // tap(_ => this.ngxLoader.stop()),
        tap()
        // catchError(this.handleError<Plot[]>('getPlot', []))
      );
  }

  getCarCategories(): Observable<Envelope<CarCategory[]>> {
    const url = this.categoryUrl;
    return this.http.get<Envelope<CarCategory[]>>(url);
  }

  addCarCategory(category: string): Observable<Envelope<CarCategory>> {
    const url = this.categoryUrl;

    const data = { name: category };

    return this.http.post<Envelope<CarCategory>>(url, data);
  }

  deleteCarCategory(categoryId: number): Observable<Envelope<any>> {
    const url = this.categoryUrl + `/delete/${categoryId}`;

    const data = { name: categoryId };

    return this.http.post<Envelope<CarCategory>>(url, data);
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
