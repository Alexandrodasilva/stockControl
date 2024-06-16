import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateaProductResquest } from 'src/app/models/interface/products/request/CreateaProductResquest';
import { EditProductRequest } from 'src/app/models/interface/products/request/EditProductRequest';
import { CreateaProductResponse } from 'src/app/models/interface/products/response/CreateaProductResponse';
import { DeleteProductResponse } from 'src/app/models/interface/products/response/DeleteProductResponse';
import { GetAllProductsResponse } from 'src/app/models/interface/products/response/GetAllProductsResponse';
import { environment } from 'src/environmets/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.API_URL
  private JWT_TOKEN = this.cookie.get('USER_INFO')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    })
  }
  constructor(private http: HttpClient, private cookie: CookieService) { }

  getAllProducts(): Observable<Array<GetAllProductsResponse>>{
    return this.http
      .get<Array<GetAllProductsResponse>>(`${this.API_URL}/products`,
    this.httpOptions
    )
    .pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }
  deleteProduct(product_id: string): Observable<DeleteProductResponse>{
    return this.http.delete<DeleteProductResponse>(`${this.API_URL}/product/delete`,{
        ...this.httpOptions,
        params: {
          product_id: product_id
        },
      }
    )
  }

  createProduct(requestDatas: CreateaProductResquest): Observable<CreateaProductResponse>{
    return this.http.post<CreateaProductResponse>(
      `${this.API_URL}/product`,
      requestDatas,
      this.httpOptions
    )
  }

  editProduct(requestDatas: EditProductRequest): Observable<void>{
    return this.http.put<void>(
      `${this.API_URL}/product/edit`,
      requestDatas, this.httpOptions
    );
  }
}
