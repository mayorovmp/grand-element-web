import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerHttpService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;
  private navUrl = this.baseUrl;

  getListOfNames(): Observable<string[]> {
    const url = `${this.navUrl}/log`;
    return this.http.get<string[]>(url).pipe(
      // tap(_ => this.ngxLoader.stop()),
      tap()
      // catchError(this.handleError<Plot[]>('getPlot', []))
    );
  }

  getFile(name: string): Observable<any> {
    const url = `${this.navUrl}/${name}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      // tap(_ => this.ngxLoader.stop()),
      tap()
      // catchError(this.handleError<Plot[]>('getPlot', []))
    );
  }
}
