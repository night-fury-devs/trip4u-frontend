/**
 * Author: Alexey Kleschikov
 * Date: 28 Jun 2016
 * Time: 21:56
 */

import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { environment } from "../../environment";
import { LoggedInUser } from "../../pages";
import { TokenResponse } from "./token-response.model";


@Injectable()
export class AuthenticationService {

  private loginUrl = environment.backend_host + 'auth/login';
  private registerUrl = environment.backend_host + 'auth/register';
  private confirmUrl = environment.backend_host + 'auth/confirm';

  constructor(
    private http: Http) {
  }

  login(user: LoggedInUser): Observable<any> {
    let params = new URLSearchParams();
    let headers = new Headers();

    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    params.append('username', user.userName);
    params.append('password', user.password);

    return this.http.post(this.loginUrl, params, headers)
        .map(AuthenticationService.extractData)
        .map(this.storeToken)
        .catch((err) => {
          console.error(err);
          return Observable.throw(err);
        })
  }

  confirm(id: string): Observable<boolean> {
    return this.http.post(this.confirmUrl, { id: id })
               .map(AuthenticationService.extractData)
  }

  private static extractData(response: Response) {
    let body = response.json();
    console.log(body);
    return body || {}
  }

  private storeToken(response: TokenResponse) {
    sessionStorage.setItem('token', response.token);
    return Observable.create(true)
  }
}