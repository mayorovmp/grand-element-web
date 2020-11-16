import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService as HttpCarCategoryService } from 'src/app/catalogs/car-category/http.service';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Car } from 'src/app/models/Car';
import { CarCategory } from '../../models/CarCategory';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private httpCarCategorySrv: HttpCarCategoryService) { }

  private baseUrl = environment.baseUrl + '/car';

  getCars(): Observable<Car[]> {
    const url = this.baseUrl;
    return this.http.get<Car[]>(url);
  }

  getFavoriteCars(days: number, limit: number): Observable<Car[]> {
    const url = this.baseUrl + `/favorite?lastDays=${days}&limit=${limit}`;
    return this.http.get<Car[]>(url);
  }

  getCarCategories() {
    return this.httpCarCategorySrv.getCarCategories();
  }

  add(car: Car): Observable<Car> {
    const url = this.baseUrl;
    return this.http.post<any>(url, car);
  }

  edit(car: Car): Observable<Car> {
    const url = this.baseUrl;
    return this.http.put<any>(url, car);
  }

  delete(carId: number): Observable<any> {
    const url = this.baseUrl + `/${carId}`;
    return this.http.delete<any>(url);
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
