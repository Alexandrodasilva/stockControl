import { MessageService } from 'primeng/api';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interface/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  public productsList: Array<GetAllProductsResponse> = [];

  constructor(private productsService: ProductsService,
              private messageService: MessageService,
              private productsDtService: ProductsDataTransferService
              ){}

  ngOnInit(): void {
    this.getProductsDatas();
  }

  getProductsDatas(): void{
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: Response => {
        if(Response.length > 0) {
          this.productsList = Response;
          this.productsDtService.setProductsDatas(this.productsList);
        }
      },
      error: err => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500,
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
