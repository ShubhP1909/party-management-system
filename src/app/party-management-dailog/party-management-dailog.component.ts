import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartyManagementService } from '../services/party-management.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-party-management-dailog',
  templateUrl: './party-management-dailog.component.html',
  styleUrls: ['./party-management-dailog.component.scss']
})
export class PartyManagementDailogComponent implements OnInit, OnChanges {

  @Input() partyDetailsData: any;
  @Input() isEditModalOpen!: boolean;
  @Output() onModalClose = new EventEmitter();
  partyDetailsForm!: FormGroup;
  fileToUpload!: File;
  imageUrl!: string | null;
  constructor(private fb: FormBuilder, private partyManagementService: PartyManagementService, private toastr: ToastrService) { }

  get addressArray(): any {
    return this.partyDetailsForm.get(
      'address'
    ) as FormArray;
  }

  get bankDetailsArray(): any {
    return this.partyDetailsForm.get(
      'bank'
    ) as FormArray;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.partyDetailsData) {
      this.partyDetailsForm.patchValue({
        name: this.partyDetailsData.name,
        company_name: this.partyDetailsData.company_name,
        mobile_no: this.partyDetailsData.mobile_no,
        telephone_no: this.partyDetailsData.telephone_no,
        whatsapp_no: this.partyDetailsData.whatsapp_no,
        email: this.partyDetailsData.email,
        remark: this.partyDetailsData.remark,
        login_access: this.partyDetailsData.login_access,
        date_of_birth: this.partyDetailsData.date_of_birth,
        anniversary_date: this.partyDetailsData.anniversary_date,
        gstin: this.partyDetailsData.gstin,
        pan_no: this.partyDetailsData.pan_no,
        apply_tds: this.partyDetailsData.apply_tds,
        credit_limit: this.partyDetailsData.credit_limit
      });

      this.bankDetailsArray.clear();

      if (this.partyDetailsData?.bank_id && this.partyDetailsData?.bank_id?.length > 0) {
        this.partyDetailsData?.bank_id.forEach((bank: any) => {
          this.bankDetailsArray.push(this.addBankItems(bank));
        });
      }

      if (this.partyDetailsData?.address && this.partyDetailsData.address?.length > 0) {
        this.partyDetailsData.address.forEach((address: any) => {
          this.addressArray.push(this.addAddressItems(address));
        });
      }

      if (this.partyDetailsData?.image) {
        this.imageUrl = environment.apiEndPoint + this.partyDetailsData?.image;
      }
    }

  }

  handleFileInput(event: any) {
    const file = event.target.files?.item(0);
    if (file) {
      const validTypes = ['image/png', 'image/jpg', 'images/PNG', 'images/JPG'];
      if (!validTypes.includes(file.type)) {
        alert('Only PNG and JPG files are allowed.');
        return;
      }
      this.fileToUpload = file;
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    }
  }

  initForm() {
    this.partyDetailsForm = this.fb.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      telephone_no: [''],
      whatsapp_no: [''],
      email: [''],
      remark: [''],
      login_access: [false, Validators.required],
      date_of_birth: [''],
      anniversary_date: [''],
      gstin: [''],
      pan_no: [''],
      apply_tds: [''],
      credit_limit: ['', [Validators.required]],
      image: [''],
      address: this.fb.array([]),
      bank: this.fb.array([])
    });
  }

  addBankItems(bankData: any = {}): FormGroup {
    return this.fb.group({
      bank_ifsc_code: [bankData.bank_ifsc_code || ''],
      bank_name: [bankData.bank_name || ''],
      branch_name: [bankData.branch_name || ''],
      account_no: [bankData.account_no || ''],
      account_holder_name: [bankData.account_holder_name || '']
    });
  }

  addAddressItems(addressData: any = {}): FormGroup {
    return this.fb.group({
      address_line_1: [addressData.address_line_1 || ''],
      address_line_2: [addressData.address_line_2 || ''],
      city: [addressData.city || ''],
      country: [addressData.country || ''],
      pincode: [addressData.pincode || ''],
      state: [addressData.state || '']
    });
  }

  onAddAddress() {
    this.addressArray.push(this.addAddressItems());
  }

  onAddBankDetails() {
    this.bankDetailsArray.push(this.addBankItems());
  }

  removeAddress(i: number) {
    this.addressArray.removeAt(i);
  }

  removeBankDetails(i: number) {
    this.bankDetailsArray.removeAt(i);
  }

  saveProduct() {
    if (this.partyDetailsForm.valid) {
      const productData = this.partyDetailsForm.getRawValue();
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('company_name', productData.company_name);
      formData.append('mobile_no', productData.mobile_no);
      formData.append('telephone_no', productData.telephone_no);
      formData.append('whatsapp_no', productData.whatsapp_no);
      formData.append('email', productData.email);
      formData.append('remark', productData.remark);
      formData.append('login_access', productData.login_access);
      formData.append('date_of_birth', productData.date_of_birth);
      formData.append('anniversary_date', productData.anniversary_date);
      formData.append('gstin', productData.gstin);
      formData.append('pan_no', productData.pan_no);
      formData.append('apply_tds', productData.apply_tds);
      formData.append('credit_limit', productData.credit_limit);
      formData.append('address', JSON.stringify(productData.address));
      formData.append('bank', JSON.stringify(productData.bank));

      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
      }

      if (!this.partyDetailsData) {
        this.partyManagementService.addPartyDetails(formData).subscribe({
          next: (res) => {
            this.onModalClose.next(this.partyDetailsData?.id);
            this.toastr.success('Add New Party Details Sucessfully!');
          },
          error: (error) => {
            console.error('API call failed, error:', error);
            this.toastr.error(error?.error?.msg);
          }
        }
        );
      }
      else {
        this.partyManagementService.updatePartyDataById(this.partyDetailsData?.id, formData).subscribe({
          next: (res) => {
            this.onModalClose.next(this.partyDetailsData?.id);
            this.toastr.success('Update Party Details Sucessfully!');
          },
          error: (error) => {
            console.error('API call failed, error:', error);
            this.toastr.error(error?.error?.msg);
          }
        }
        )
      }
    }
  }
}
