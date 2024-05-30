import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService: AuthService, private _router: Router,
    private _localStorageService: LocalStorageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this._authService.logout().subscribe({
      next: (res) => {
        this.toastr.success('Logout Sucessfully!')
        this._router.navigate(['/login']);
        this._localStorageService.setUserLoggedIn(false);
        this._localStorageService.removeItem('token');
      },
      error: (error) => {
        console.error('API call failed, error:', error);
        this.toastr.error(error?.error?.msg);
      }
    })
  }
}
