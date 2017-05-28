import { Component, OnInit } from '@angular/core';
import * as swal from 'sweetalert';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isLoggedIn:Boolean = false;

  logout() {
  	swal('logout');
  	this.isLoggedIn = false;
  }

}
