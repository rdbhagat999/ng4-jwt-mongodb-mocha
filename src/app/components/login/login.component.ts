import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: User;
  constructor( public fb: FormBuilder, public authS: AuthService, public router: Router ) { }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['test@email.com', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')
      ] ],
      password: ['123456', [
        Validators.required,
        Validators.minLength(6)
      ] ]
    });
  }

  login( data ) {

    this.user = data.value;
    // console.log( this.user );
    this.authS.loginUser( this.user )
    .subscribe( (data) => {
      if( !data || data.authToken === '' ) {
        return false;
      }
      //console.log(data);

      this.authS.storeUserInfo( data );
      this.loginForm.reset();
      this.router.navigate(['dashboard']);
    },
    (err) => {
      console.log('errrrrrrrr');
      console.error(err);
    });
  }

}
