import {
  HttpClient,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService as HttpCarCategoryService } from 'src/app/catalogs/car-category/http.service';
import { environment } from 'src/environments/environment';
import { Request, LastRequest } from '@models/Request';
import { Status } from '@models/Status';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private httpCarCategorySrv: HttpCarCategoryService
  ) {}

  private baseUrl = environment.baseUrl;

  add(r: Request): Observable<Request> {
    const url = this.baseUrl + '/request';
    if (r.product) {
      r.productId = r.product.id;
    }
    if (r.car) {
      r.carId = r.car.id;
    }
    if (r.client) {
      r.clientId = r.client.id;
    }
    if (r.supplier) {
      r.supplierId = r.supplier.id;
    }
    if (r.deliveryAddress) {
      r.deliveryAddressId = r.deliveryAddress.id;
    }
    if (r.carCategory) {
      r.carCategoryId = r.carCategory.id;
    }
    return this.http.post<any>(url, r);
  }

  addChildReq(request: Request, parentId: number): Observable<Request> {
    const url = this.baseUrl + `/request/${parentId}`;
    return this.http.post<any>(url, request);
  }

  edit(r: Request): Observable<Request> {
    const url = this.baseUrl + '/request';
    if (r.product) {
      r.productId = r.product.id;
    }
    if (r.car) {
      r.carId = r.car.id;
    }
    if (r.client) {
      r.clientId = r.client.id;
    }
    if (r.supplier) {
      r.supplierId = r.supplier.id;
    }
    if (r.deliveryAddress) {
      r.deliveryAddressId = r.deliveryAddress.id;
    }
    if (r.carCategory) {
      r.carCategoryId = r.carCategory.id;
    }
    return this.http.put<any>(url, r);
  }

  editProduct(request: Request): Observable<Request> {
    const url = this.baseUrl;

    return this.http.put<Request>(url, request);
  }

  del(req: Request): Observable<any> {
    const url = this.baseUrl + `/request/${req.id}`;
    return this.http.delete<any>(url);
  }

  finishRequest(requestId: number): Observable<any> {
    const url = this.baseUrl + `/request/complete/${requestId}`;
    return this.http.post<any>(url, requestId);
  }

  getActualRequests(limit: number, offset: number): Observable<Request[]> {
    const url =
      this.baseUrl + `/Request/not_completed?limit=${limit}&offset=${offset}`;
    return this.http.get<Request[]>(url);
  }

  getCompletedRequests(limit: number, offset: number): Observable<Request[]> {
    const url =
      this.baseUrl + `/Request/completed?limit=${limit}&offset=${offset}`;
    return this.http.get<Request[]>(url);
  }

  setStatus(id: number, statusId: number): Observable<Status[]> {
    const url = this.baseUrl + `/Request/set_status/${id}?statusId=${statusId}`;
    return this.http.post<any>(url, id);
  }

  getStatuses(): Observable<Status[]> {
    const url = this.baseUrl + '/RequestStatus';
    return this.http.get<Status[]>(url);
  }

  getRequestsByDate(dt: Date): Observable<Request[]> {
    const url = this.baseUrl + `/request/${dt.toISOString()}`;
    return this.http.get<Request[]>(url);
  }

  getLastRequest(reqParams: LastRequest): Observable<Request> {
    const url = this.baseUrl + `/request/last`;

    let params = new HttpParams();
    for (let key in reqParams) {
      params = params.append(key, reqParams[key]);
    }

    return this.http.get<Request>(url, { params });
  }

  getFile(dt: Date): Observable<HttpResponse<Blob>> {
    const path = this.baseUrl + `/request/excel/${dt.toISOString()}`;
    return this.http.get(path, { observe: 'response', responseType: 'blob' });
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
