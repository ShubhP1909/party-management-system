import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyManagementComponent } from './party-management.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { PartyManagementDailogComponent } from '../party-management-dailog/party-management-dailog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PartyManagementComponent,
    data: {
      title: 'party-management',
    },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    PartyManagementComponent,
    PartyManagementDailogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PartyManagementModule { }
