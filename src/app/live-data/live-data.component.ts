import { Component, OnInit,ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GeneralMaterialsService } from '../general-materials.service';
import { Timestamp } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import * as moment from 'moment'

@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.component.html',
  styleUrls: ['./live-data.component.css']
})

export class LiveDataComponent implements OnInit {
@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
timeout:any
liveData:any=[]
dataSource:any
loginData:any
currentLength:any
count= 0
currentPageLength:number = 10;
currentPageSize:number = 10;

displayedColumns: string[] = ['i','baseName','contactName','location','startTime', 'updatedOn','totalTime'];


  constructor(
    private api: ApiService,
    private login:LoginCheckService,
    private general:GeneralMaterialsService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)
    this.count=0
    this.refresh()
    // console.log("count",this.count)
    this.timeout=setInterval(()=>{this.refresh()},30*1000)
  }
  ngOnDestroy() {
    clearInterval(this.timeout)
  }
  refresh(){
    // this.getTotalCount(0)
    this.refreshData(this.count)
  }
  prevDayData(){
    // var limit=this.paginator.pageSize
    // var offset=this.paginator.pageIndex*this.paginator.pageSize
    this.liveData=[]
    this.count = this.count + 1;
    // console.log("count==",this.count);

    this.getTotalCount(this.count)
    this.refreshData(this.count)
  }

  nextDayData(){
    this.liveData=[]
    // var limit=this.paginator.pageSize
    // var offset=this.paginator.pageIndex*this.paginator.pageSize
    this.count = this.count - 1;
    // console.log("count==",this.count);

    this.getTotalCount(this.count)
    this.refreshData(this.count)
  }

getTotalCount(val){
  var date=new Date()
  var data={
    userId:this.loginData.userId,
    tblName:'deviceData',
    count:val,
    zone:this.general.getZone(date)
  }
 
  this.api.getLiveDataTotalCount(data).then((res:any)=>{
    // console.log("live data ======",res);
    if(res.status){
      console.log('\nTotal response: ',res.success[0].count);
      this.currentPageSize= parseInt(res.success[0].count);
     

    }
  })
}


  refreshData(value,limit=10,offset=0){
    this.liveData=[]
    var date=new Date()
    var data={
      userId:this.loginData.userId,
      tblName:'deviceData',
      count:value,
      zone:this.general.getZone(date),
      offset:offset,
      limit:limit
    }
   

    this.api.getLiveData(data).then((res:any)=>{
    
      console.log("live data ======",res);
      if(res.status){
        this.liveData=[]
        for(var i=0;i<res.success.length;i++){
          this.liveData.push({
            i:i+1,
            baseName:res.success[i].baseName,
            contactName:res.success[i].contactName,
            location:res.success[i].location,
            updatedOn:res.success[i].updatedOn,
            totalTime:res.success[i].totalTime,
            startTime:this.startTime(res.success[i].totalTime,res.success[i].updatedOn)
          })
        }
        // this.currentPageLength = res.success.length;
        this.dataSource = new MatTableDataSource(this.liveData);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          //this.dataSource.paginator = this.paginator;
          this.paginator.length = this.currentPageSize
        })
      }
      else if(res.success==false){
        this.liveData=[]
        this.dataSource = new MatTableDataSource(this.liveData);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          //this.dataSource.paginator = this.paginator;
          this.paginator.length = this.currentPageSize
        })
      }
    })

 }


 convertDate(a){
  // console.log("a===",a)
  var timeArr = a.split(':')
  var date = ''
  if(timeArr[0]!='00'){
    date += timeArr[0] + ' hour '
  }
  if(timeArr[1]!='00'){
    date += timeArr[1] + ' minute '
  }
  if(timeArr[2]!='00'){
    date += timeArr[2] + ' second '
  }
  if(date==''){
    date = '05 second'
  }
  return date
}
startTime(data1,data2){
  console.log(data1,data2)
  var date=new Date(data2)
  if(data1!="00:00:00" || data1!='-'){
    var a=data1.split(':')
    date.setHours(date.getHours() -a[0]);
    date.setMinutes(date.getMinutes() - a[1]); 
    date.setSeconds(date.getSeconds() - a[2]); 
    console.log("new date==",date)
  }
  if(data1=="00:00:00" || data1=='-'){
    date.setSeconds(date.getSeconds() - 5); 
  }

  return date
}

     getUpdate(event) {
      // console.log("paginator event",event);
      // console.log("paginator event length", this.currentPageLength);
      var limit = event.pageSize
      var offset = event.pageIndex*event.pageSize
      this.refreshData(this.count,limit,offset)
    }


}
