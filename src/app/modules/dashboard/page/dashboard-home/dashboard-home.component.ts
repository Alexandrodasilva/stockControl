import { MessageService } from 'primeng/api';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interface/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  public productsList: Array<GetAllProductsResponse> = [];
  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;
  text: string = '';
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
          this.setProdutsChartConfig();
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

  setProdutsChartConfig(): void{
    if(this.productsList.length > 0){
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secundary');
      const surfacceBorder = documentStyle.getPropertyValue('--surface-border');

      this.productsChartDatas = {
        labels: this.productsList.map((element) => element?.name),
        datasets: [
          {
            label: 'quantidade',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
            data: this.productsList.map((element) => element?.amount),
          }
        ]
      };
      this.productsChartOptions ={
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              // font: {
              //   weight: '500',
              // },
            },
            grid: {
              color: surfacceBorder,
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfacceBorder,
            }
          }
        }
      }
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
