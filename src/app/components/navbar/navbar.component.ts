import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as swal from 'sweetalert';

import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( private authS: AuthService, private router: Router ) { 
  }

  ngOnInit() { }

  logout() {
    this.authS.logOut();
    swal('logout successfull');
    this.router.navigate(['']);
  }

}
