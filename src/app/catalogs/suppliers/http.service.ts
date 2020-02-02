import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService as HttpCarCategoryService } from 'src/app/catalogs/car-category/http.service';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Envelope } from 'src/app/Envelope';
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

  getSuppliers(): Observable<Envelope<Supplier[]>> {
    const url = this.baseUrl;
    return this.http.get<Envelope<Supplier[]>>(url);
  }

  deleteSupplier(id: number) {
    const url = this.baseUrl + `/${id}`;

    return this.http.delete<Envelope<any>>(url);
  }
  add(item: Supplier) {
    const url = this.baseUrl;

    return this.http.post<Envelope<any>>(url, item);
  }

  edit(item: Supplier) {
    const url = this.baseUrl;

    return this.http.put<Envelope<any>>(url, item);
  }
}