import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { User } from '../user';

@Injectable()
export class AuthService {

  baseUrl = 'http://localhost:4200';

  constructor( public _http: Http ) { }

  isAuthenticated() {
    return tokenNotExpired('id_token');
  }

  registerUser( userObject: User ): Observable<User> {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this._http.post( this.baseUrl + '/users', userObject, options )
          .map((res: Response) => {
              return res.json();
            }, (error: any) => {
              console.log('registerUser service error');
              return Observable.throw(error.json().error || 'Server error');
            });
  }

  loginUser( userObject: Object ) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    //console.log( userObject );

    return this._http.post( this.baseUrl + '/users/login', userObject )
            .map((res) => {
              //console.log('loginUser service');
              return res.json();
            }, (error: any) => {
              console.log('loginUser service error');
              return Observable.throw(error.json().error || 'Server error');
            });
  }

  logOut() {
    this.deleteUserInfo();
  }

  storeUserInfo( userData ): void {
    //localStorage.setItem('token', userData.authToken );
    localStorage.setItem('id_token', userData.authToken );
    localStorage.setItem('user', JSON.stringify( userData.user ) );
  }

  deleteUserInfo() {
    //localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }

}
