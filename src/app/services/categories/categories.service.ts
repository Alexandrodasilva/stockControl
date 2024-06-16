import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environmets/environments';
import { GetCategoriesResponse } from 'src/app/models/interface/categories/response/GetCategoriesResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    }),
  };
  constructor(private http: HttpClient, private cookie: CookieService) { }

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    );
  }
}
