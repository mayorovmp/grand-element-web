import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Supplier } from '@models/Supplier';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl + '/supplier';

  getSuppliers(): Observable<Supplier[]> {
    const url = this.baseUrl;
    return this.http.get<Supplier[]>(url);
  }

  getSuppliersByProdId(productId: number): Observable<Supplier[]> {
    const url = this.baseUrl + `/${productId}`;
    return this.http.get<Supplier[]>(url);
  }

  deleteSupplier(id: number) {
    const url = this.baseUrl + `/${id}`;

    return this.http.delete<any>(url);
  }
  add(item: Supplier) {
    const url = this.baseUrl;

    return this.http.post<any>(url, item);
  }

  edit(item: Supplier) {
    const url = this.baseUrl;

    return this.http.put<any>(url, item);
  }
}
