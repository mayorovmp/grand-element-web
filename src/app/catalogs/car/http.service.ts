import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Envelope } from 'src/app/Envelope';
import { Car } from 'src/app/catalogs/models/Car';
import { CarCategory } from '../models/CarCategory';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl;
  private navUrl = this.baseUrl + '/View';

  test(): Observable<Envelope<Car[]>> {
    const url = encodeURI(`${this.baseUrl}/user`);

    return this.http.get<Envelope<Car[]>>(url)
      .pipe(
        // tap(_ => this.ngxLoader.stop()),
        tap()
        // catchError(this.handleError<Plot[]>('getPlot', []))
      );
  }


  getCars(): Observable<Envelope<Car[]>> {
    const url = encodeURI(`${this.navUrl}/`);

    const data = {};

    const env = new Envelope<Car[]>();
    env.result = [
      new Car('Петров Иван', 'а531тн174', 'тел: 89049743099', 'Иногда не берет телефон', new CarCategory(1, '5т')),
      new Car('Иванов Петр', 'y321тн174', 'telegram: 8904971233', '', new CarCategory(1, '15т')),
      new Car('Антонов Иван', 'а431тн174', 'тел: 89049743099', 'Иногда не берет телефон', new CarCategory(1, '5т')),
      new Car('Сидорович Петр', 'о444тн174', 'telegram: 8904971233', '', new CarCategory(1, '15т'))];
    return of(env);
  }

  addCarCategory(category: string): Observable<Envelope<Car[]>> {
    const url = encodeURI(`${this.navUrl}/`);

    const data = {};
    const env = new Envelope<Car[]>();
    env.success = true;
    env.result = [];
    return of(env);
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
