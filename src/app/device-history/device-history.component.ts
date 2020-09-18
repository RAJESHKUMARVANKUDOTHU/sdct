import { Component, OnInit, ViewChild} from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Timestamp } from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
@Component({
  selector: 'app-device-history',
  templateUrl: './device-history.component.html',
  styleUrls: ['./device-history.component.css']
})
export class DeviceHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  index:any
  deviceData:any=[]
  finds:any=[]
  findData:any=[]
  loginData:any
  dataSource:any
  currentPageLength:any=10
  currentPageSize:any=10
  displayedColumns: string[] = ['i','deviceName', 'contactDeviceName', 'updatedOn'];

  constructor(private api: ApiService,private login:LoginCheckService,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)


    this.route.queryParams.subscribe(params => {
        this.deviceData = JSON.parse(params.record) ;
         console.log("records=",this.deviceData )
        this.getTotalCount()
        this.refreshFinds()
    })
    //setInterval(()=>{this.refreshFinds()},60*1000)
  }


  refreshFinds(limit=10,offset=0){

   var data={
    userId:this.loginData.userId,
     deviceName:this.deviceData.deviceName,
      limit:limit,
      offset:offset
   }
    this.api.getDeviceData(data).then((res:any)=>{
       console.log("find data ======",res);
      if(res.status){
        this.finds=res.success
        this.findData=[]
        for(let i=0;i<res.success.length;i++){
          this.findData.push({
            i:i+1,
            deviceName:this.deviceData.deviceName,
            contactDeviceName:res.success[i].contactDeviceName,
            updatedOn:res.success[i].updatedOn
           })

        }

        this.dataSource = new MatTableDataSource(this.findData);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          // this.dataSource.paginator = this.paginator;

        });
      }

    })
  }

getTotalCount(){
  // console.log("device name==",this.deviceData.deviceName)
  var data={
    userId:this.loginData.userId,
    deviceName:this.deviceData.deviceName


  }

  this.api.getDeviceDataCount(data).then((res:any)=>{
    // console.log("device history data ======",res);
    if(res.status){
      // console.log('\nTotal response: ',res.success[0].count);
      this.currentPageLength = parseInt(res.success[0].count);

    }
  })
}
getUpdate(event) {
  // console.log("paginator event",event);
  // console.log("paginator event length", this.currentPageLength);
  var limit = event.pageSize
  var offset = event.pageIndex*event.pageSize
  // console.log("limit==",limit,"offset==",offset)
  this.refreshFinds(limit,offset)
}

}
