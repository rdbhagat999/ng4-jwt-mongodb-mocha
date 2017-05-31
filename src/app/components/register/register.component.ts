import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: User;
  constructor( public fb: FormBuilder, public authS: AuthService, public router: Router ) { }

  ngOnInit() {
    this.buildRegisterForm();
  }

  buildRegisterForm(): void {
    this.registerForm = this.fb.group({
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

  register( data ) {
    this.user = data.value;
    // console.log( this.user );
    this.authS.registerUser( this.user )
    .subscribe( (user) => {
      console.log('response');
      if( !user ) {
        return false;
      }
      console.log(user.email);
      this.registerForm.reset();
      this.router.navigate(['login']);
    },
    (err) => {
      console.log('errrrrrrrr');
      console.error(err);
    });
  }

}
