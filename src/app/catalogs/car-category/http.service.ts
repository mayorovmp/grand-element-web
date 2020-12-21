import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CarCategory } from '@models/CarCategory';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;
  private categoryUrl = this.baseUrl + '/CarCategory';

  test(): Observable<CarCategory[]> {
    const url = encodeURI(`${this.baseUrl}/user`);

    return this.http.get<CarCategory[]>(url).pipe(
      // tap(_ => this.ngxLoader.stop()),
      tap()
      // catchError(this.handleError<Plot[]>('getPlot', []))
    );
  }

  getCarCategories(): Observable<CarCategory[]> {
    const url = this.categoryUrl;
    return this.http.get<CarCategory[]>(url);
  }

  editCarCategory(carCategory: CarCategory): Observable<CarCategory> {
    const url = this.categoryUrl;

    return this.http.put<CarCategory>(url, carCategory);
  }

  addCarCategory(carCategory: CarCategory): Observable<CarCategory> {
    const url = this.categoryUrl;

    return this.http.post<CarCategory>(url, carCategory);
  }

  deleteCarCategory(categoryId: number): Observable<any> {
    const url = this.categoryUrl + `/${categoryId}`;
    return this.http.delete<CarCategory>(url);
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
