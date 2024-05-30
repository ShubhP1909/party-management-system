import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errMsg!: string;
  isFromExtension: boolean = false;
  loginFormLoading: boolean = false;
  token: any;

  constructor(
    private fb: FormBuilder,
    public _localStorageService: LocalStorageService,
    private _router: Router,
    private _authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    if (this._localStorageService.isUserLoggedIn()) {
      this.checkUserLoggedIn();
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  checkUserLoggedIn() {
    if (this._localStorageService.isUserLoggedIn()) {
      this._router.navigate(['/party-management']);
    }
  }

  submitForm(event: any) {
    if (!this.loginForm.valid) {
      return;
    }
    this.loginFormLoading = true;
    this.loginForm.disable();

    const payload = {
      username: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    }

    this._authService.oAuthToken(payload).subscribe({
      next: (res) => {
        this.toastr.success('Login Sucessful!');
        this._localStorageService.setAccessToken(res.token);
        this._localStorageService.setUserLoggedIn(true);
        this._router.navigate(['/party-management']);
      },
      error: (error) => {
        console.error('API call failed, error:', error);
        this.toastr.error(error?.error?.msg);
        this.loginForm.enable();
        this._localStorageService.setUserLoggedIn(false);
        this.loginFormLoading = false;
      }
    })
  }
}
