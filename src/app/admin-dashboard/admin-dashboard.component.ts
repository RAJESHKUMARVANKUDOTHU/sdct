import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCheckService } from '../login-check.service';
import { ApiService } from '../api.service';
import { GeneralMaterialsService } from '../general-materials.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { AdminAddBleIdComponent } from '../admin-add-ble-id/admin-add-ble-id.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

   adminAddUserform: FormGroup;
   public loginInvalid: boolean;
   passwordType: string = 'password';
   passwordIcon: string = 'visibility_off';
   adminData:any=[]
   constructor(
   		public dialog: MatDialog,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private login: LoginCheckService,
      private api: ApiService,
      private general: GeneralMaterialsService
    ) {
    }

    // Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/) 	letter,digit,special character

  ngOnInit(): void {
    this.adminAddUserform = this.fb.group({
      userName: ['', Validators.email],
      portalPassword: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\W_]+$/) 	
      ]],
      mobilePassword: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\W_]+$/) 	
      ]],
      userPassword: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\W_]+$/) 	
      ]]
    });
    this.refreshAdminData()
  }

 onSubmit(data) {
    if (this.adminAddUserform.valid) {
      try {
        this.api.createUser(data).then((res:any)=>{
        	// console.log("created==",res)
			if(res.status){
				var msg = "User Created successfully"
				this.general.openSnackBar(msg,'')
				this.adminAddUserform.reset()
				this.refreshAdminData()
			}
        })      	
      } catch (err) {
      }
    }
  }


refreshAdminData(){
    this.api.getAdminData().then((res:any)=>{
    	// console.log("data===",res)
		if(res.status){
			this.adminData=res.success
		}
    })
}


  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }


  openDialog(data): void {
	  const dialogConfig = new MatDialogConfig();
	  dialogConfig.disableClose = true;
	  dialogConfig.autoFocus = true;
	  dialogConfig.height = '70vh';
	  dialogConfig.width = '70vw';
	  dialogConfig.data = {
	    type:"addBle",
	    data:data
	  }
	  const dialogRef = this.dialog.open(AdminAddBleIdComponent, dialogConfig);

	  dialogRef.afterClosed().subscribe(result => {
	  });
 }

 openSetting(data){
  this.router.navigate(['/admin-settings'], { queryParams: { record: JSON.stringify(data) } });
 }


 delete(a){
 	// console.log("delete==",a)
 	var data={
 		userId : a.userId,
 		isDeleted : a.isDeleted == 'Y' ? 'N' : 'Y'
 	}

 	this.api.deleteAdminUser(data).then((res:any)=>{
    	// console.log("data===",res)
		if(res.status){
			var msg = "User updated successfully"
			this.general.openSnackBar(msg,'')
			this.refreshAdminData()
		}
    })
 }



}
