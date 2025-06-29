import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  estaLogueado: boolean = false;

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    this.estaLogueado = !!token;
  }

  cerrarSesion() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
