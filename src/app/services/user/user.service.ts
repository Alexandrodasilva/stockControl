import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interface/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interface/auth/AuthResponse';
import { signupUserReq } from 'src/app/models/interface/user/SignupUserReq';
import { signupUserResp } from 'src/app/models/interface/user/SignupUserResp';
import { environment } from 'src/environmets/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  signupUser(requestDatas: signupUserReq): Observable<signupUserResp>{
    return this.http.post<signupUserResp>(`${this.API_URL}/user`, requestDatas);
  }

  authUser(requestDatas: AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }
}
