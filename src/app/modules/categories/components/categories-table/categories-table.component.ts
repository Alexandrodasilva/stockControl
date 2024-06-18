import { Component, Input } from '@angular/core';
import { GetCategoriesResponse } from 'src/app/models/interface/categories/response/GetCategoriesResponse';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: []
})
export class CategoriesTableComponent {
  @Input() public categories: Array<GetCategoriesResponse> = [];
  public categorySelected!: GetCategoriesResponse;
}
