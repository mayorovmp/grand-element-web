import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService as HttpCarCategoryService } from 'src/app/catalogs/car-category/http.service';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Car } from 'src/app/models/Car';
import { Supplier } from '../../models/Supplier';
import { Product } from 'src/app/models/Product';
import { HttpService as ProductHttpService } from 'src/app/catalogs/product/http.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private httpCarCategorySrv: HttpCarCategoryService) { }

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
