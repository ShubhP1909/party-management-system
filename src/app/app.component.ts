import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'party-management-system';
  isUserLoggedIn: boolean = false;

  constructor(private _localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.isUserLoggedIn = this._localStorageService.isUserLoggedIn();
  }

}
