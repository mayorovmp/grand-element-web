import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Envelope } from 'src/app/Envelope';
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

  getProducts(): Observable<Envelope<Product[]>> {
    const url = encodeURI(`${this.baseUrl}/`);

    return this.http.get<Envelope<Product[]>>(url);
  }

  addProduct(name: string): Observable<Envelope<Product>> {
    const url = encodeURI(`${this.baseUrl}/`);

    return this.http.post<Envelope<Product>>(url, { name });
  }

  editProduct(product: Product): Observable<Envelope<Product>> {
    const url = this.baseUrl;

    return this.http.put<Envelope<Product>>(url, product);
  }

  deleteProduct(productId: number) {
    const url = this.baseUrl + `/${productId}`;

    return this.http.delete<Envelope<any>>(url);
  }
}
