import { ProductEvent } from 'src/app/models/enums/products/ProductsEvent';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interface/categories/response/GetCategoriesResponse';
import { CreateaProductResquest } from 'src/app/models/interface/products/request/CreateaProductResquest';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { EventAction } from 'src/app/models/interface/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interface/products/response/GetAllProductsResponse';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { EditProductRequest } from 'src/app/models/interface/products/request/EditProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destro$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectCategory: Array<{name: string; cpde: string}> = [];
  public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  }
  public productSelectedDatas?: GetAllProductsResponse;
  public producstDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private productDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ){}

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  })

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  })

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  public renderDropdown = false;

  ngOnInit(): void {
    this.productAction = this.ref.data;

    if(this.productAction?.event?.action === this.saleProductAction){
      this.getProductDatas();
    }

    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories() {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destro$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.categoriesDatas = response;
        }
        if(this.productAction?.event?.action === this.editProductAction && this.productAction.productDatas){
          this.getProductSelectdDadas(this.productAction?.event?.id as string)
        }

      }
    })
  }

  handleSubmitAddProduct(): void{
    if(this.addProductForm?.value && this.addProductForm?.valid){
      const requestCreateProduct: CreateaProductResquest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      }
      console.log(requestCreateProduct)
      this.productService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destro$))
      .subscribe({
        next: (response) => {
          if(response){
            this.messageService.add({
              severity: 'success',
              summary: 'Sucecsso',
              detail: 'Produto criado com sucesso!',
              life: 2500,
            })
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar Produto!',
            life: 2500,
          })
        }
      })
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void{
    if(this.editProductForm.value && this.editProductForm.valid && this.productAction.event.id){
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string,
      }
      this.productService.editProduct(requestEditProduct)
      .pipe(takeUntil(this.destro$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto editado com sucesso!',
            life: 2500,
          });
          this.editProductForm.reset();
        }, error: (err) => {
          console.log(err),
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar produto!',
            life: 2500,
          });
          this.editProductForm.reset();
        }
      })
    }
  }

  getProductSelectdDadas(productId: string){
    const allProducts = this.productAction?.productDatas;

    if(allProducts.length > 0){
      const productFiltered = allProducts.filter(
        (el) => el?.id === productId
      );

      if(productFiltered){
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
          category_id: this.productSelectedDatas?.category.id,
        });
      }
    }

  }

  getProductDatas(): void{
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destro$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.producstDatas = response;
          this.producstDatas &&
          this.productDtService.setProductsDatas(this.producstDatas)
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destro$.next();
    this.destro$.complete();
  }

}
