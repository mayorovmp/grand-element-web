import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/models/Product';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl + '/product';

  getProducts(): Observable<Product[]> {
    const url = encodeURI(`${this.baseUrl}/`);

    return this.http.get<Product[]>(url);
  }

  addProduct(product: Product): Observable<Product> {
    const url = encodeURI(`${this.baseUrl}/`);

    return this.http.post<Product>(url, product);
  }

  editProduct(product: Product): Observable<Product> {
    const url = this.baseUrl;

    return this.http.put<Product>(url, product);
  }

  deleteProduct(productId: number) {
    const url = this.baseUrl + `/${productId}`;

    return this.http.delete<any>(url);
  }
}
