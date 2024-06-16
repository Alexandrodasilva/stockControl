import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductsEvent';
import { DeleteProductAction } from 'src/app/models/interface/products/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interface/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interface/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent  = new EventEmitter<DeleteProductAction>();

  public productSelcected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void{
    if(action && action !== ''){
      const ProductEventData = id && id !== '' ? {action, id} : { action };
      this.productEvent.emit(ProductEventData);
    }
  }

 handleDeleteProduct(product_id: string, productName: string): void{
  if(product_id !== '' && productName !== ''){
    this.deleteProductEvent.emit({
      product_id, productName
    });
  }
 }

}
