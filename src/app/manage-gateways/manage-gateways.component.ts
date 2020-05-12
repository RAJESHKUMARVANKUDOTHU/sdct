import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { AddFindComponent } from '../add-find/add-find.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { EditDeviceComponent } from '../edit-device/edit-device.component';
import { GeneralMaterialsService } from '../general-materials.service';


@Component({
  selector: 'app-manage-gateways',
  templateUrl: './manage-gateways.component.html',
  styleUrls: ['./manage-gateways.component.css']
})
export class ManageGatewaysComponent implements OnInit {

  loginData:any
  gatewayData:any=[]
  constructor(private dialog:MatDialog,private api: ApiService,private login:LoginCheckService,private general:GeneralMaterialsService,) { }




  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '50vh';
    dialogConfig.width = '50vw';
    dialogConfig.data = {
      type:"gateways"
    }
    const dialogRef = this.dialog.open(AddFindComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.refreshGateway()
    });
  }


  ngOnInit() {
    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)
    this.refreshGateway()
  }



refreshGateway(){
  var data={
      userId:this.loginData.userId,
      tblName:'gatewayRegistration'
    }

  this.api.getData(data).then((res:any)=>{
    console.log("gateway data ======",res);
    if(res.status){
      this.gatewayData=res.success
    }
  })
}


edit(data){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.height = '50vh';
  dialogConfig.width = '50vw';
  dialogConfig.data = {
    type:"gateways",
    data:data
  }
  const dialogRef = this.dialog.open(EditDeviceComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    this.refreshGateway()
  });
}



delete(a){
  if(confirm('Are you sure you want to delete the gateway')){
    console.log("yes",a)
  }
  var data = {
    id:a.id,
    tblName:'gatewayRegistration'
  }
  this.api.deletedeviceandUser(data).then((res:any)=>{
    console.log("gateway data ======",res);
    if(res.status){
      this.refreshGateway()
      var msg = 'Gateway Deleted Successfully'
      this.general.openSnackBar(msg,'')
    }
  })
}


}