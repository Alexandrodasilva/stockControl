import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interface/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

  public productsDataEmitter$ =
    new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);

  public productDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(products: Array<GetAllProductsResponse>): void{
    if(products){
      this.productsDataEmitter$.next(products);
      this.getProductsDatas();
    }
  }
  getProductsDatas() {
    this.productsDataEmitter$
    .pipe(
      take(1),
      map(data => data?.filter(product => product.amount > 0))
    )
    .subscribe({
      next: response => {
        if(response){
          this.productDatas = response;
        }
      }
    });
    return this.productDatas;
  }
}
