import { Component, OnInit } from '@angular/core';
import { PartyManagementService } from '../services/party-management.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

declare var bootstrap: any;
@Component({
  selector: 'app-party-management',
  templateUrl: './party-management.component.html',
  styleUrls: ['./party-management.component.scss']
})
export class PartyManagementComponent implements OnInit {

  partyListData: any = [];
  isEditModalShown = false;
  editPartyDetails!: any;
  apiEndPoint = environment.apiEndPoint;
  constructor(private _partyManagementService: PartyManagementService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this._partyManagementService.getPartyManagementList().subscribe({
      next: (res) => {
        this.partyListData = res;
      },
      error: (error) => {
        console.error('API call failed, error:', error);
        this.toastr.error(error?.error?.msg);
      }
    })
  }

  openModal(partyData?: any) {
    if (partyData) {
      this.editPartyDetails = partyData;
      this.isEditModalShown = true;
    } else {
      this.isEditModalShown = false;
    }
  }

  openDeleteParty(partyId: number) {
    this._partyManagementService.deletePartyDetails(partyId).subscribe({
      next: (res) => {
        this.loadProducts();
        this.toastr.success('Party Details Deleted Sucessfully!');
      },
      error: (error) => {
        console.error('API call failed, error:', error);
        this.toastr.error(error?.error?.msg);
      }
    }
    )
  }

  onModalClose(event: any) {
    if (event) {
      const modalElement = document.getElementById('staticBackdrop');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      this.loadProducts();
    }
  }
}
