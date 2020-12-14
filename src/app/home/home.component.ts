import { Component, OnInit,ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import {Router} from '@angular/router'
import { GeneralMaterialsService } from '../general-materials.service';
import * as CanvasJS from '../../assets/canvasjs-2.3.2/canvasjs.min';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { HomeCountViewComponent } from '../home-count-view/home-count-view.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

findData:any=[]
loginData:any
findLen:any
checkUrl:any
setting:any
contactTimeMax:any=[]
contactDeviceMax:any
countPerday:any
totalEmp = 0;
infectedEmp = 0;
normalEmp = 0;
activeEmp = 0;
dates:any=[]
month:any=[]
day:any=[]
totmin:any
timeout:any
pageIndex:any
pageSize:any
offlineCount:any
onlineCount:any
dataPoints:any=[]
branch:boolean
branch1:boolean

option=[
  { baseDevice: 120,
    baseName: "User 120",
    contactDevice: 305,
    contactName: "User 305",
    id: 1504927,
    totTime: "07:40:41",
    updatedOn: "2020-12-01T05:19:19.000Z",
    userId: 35},
    { baseDevice: 306,
      baseName: "User 306",
      contactDevice: 307,
      contactName: "User 307",
      id: 1504927,
      totTime: "07:40:41",
      updatedOn: "2020-12-01T05:19:19.000Z",
      userId: 35},
      { baseDevice: 306,
        baseName: "User 306",
        contactDevice: 308,
        contactName: "User 308",
        id: 1504927,
        totTime: "07:40:41",
        updatedOn: "2020-12-01T05:19:19.000Z",
        userId: 35}
  ]

  option1=[
    { baseDevice: 305,
      baseName: "User 305",
      contactDevice: 309,
      contactName: "User 309",
      id: 1504927,
      totTime: "07:40:41",
      updatedOn: "2020-12-01T05:19:19.000Z",
      userId: 35},
      { baseDevice: 305,
        baseName: "User 305",
        contactDevice: 310,
        contactName: "User 310",
        id: 1504927,
        totTime: "07:40:41",
        updatedOn: "2020-12-01T05:19:19.000Z",
        userId: 35}
    ]
  constructor(private api: ApiService,
  private login:LoginCheckService,
  private router:Router,
  public dialog: MatDialog,
  private general:GeneralMaterialsService
) { }

  ngOnInit(): void {
    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)
    console.log("this.loginData===",this.loginData)
    // this.checkUrl = this.router.url

    this.refreshFinds()
    this.refreshCount()
    this.refreshSetting()
    this.maximumContactTime()
    this.repeatedContacts()
    this.numOfcontactPerDay()

    this.timeout=setInterval(()=>{this.refresh()},60*1000)

}
ngOnDestroy() {
  clearInterval(this.timeout)
}

sendWarning(id,value){
  // console.log("value==",id,value)
  var data={
    userId:this.loginData.userId,
    id:id,
    totalCount:value,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
  }

  this.api.showWarning(data).then((res:any)=>{
    // console.log("warning ======",res);
    if(res.status){
      var msg = 'Warning sent Successfully'
      this.general.openSnackBar(msg,'')
    }
    else{
      var msg = 'EmailId or Mobile number is not registered'
      this.general.openSnackBar(msg,'')
    }
  })

}





refreshFinds(){
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
  }

  this.api.getAssignedDevices(data).then((res:any)=>{
    // console.log("find data ======",res);
    if(res.status){
      this.findData=res.success
        this.findLen=this.findData.length
    }
  })
}




refreshOnlineDevice(){
  console.log("total empp==",this.totalEmp)
  var date=new Date()
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
    zone:this.general.getZone(date),
    type:'onlineUserData'
  }

  this.api.getOnlineCount(data).then((res:any)=>{
    console.log("online data ======",res);

    if(res.status ){

      this.onlineCount=res.success.length
      this.offlineCount=this.totalEmp - res.success.length
      console.log("online offline count===",this.totalEmp ,this.onlineCount,this.offlineCount)
     }else {
      this.offlineCount=this.totalEmp-0
    }
  })
}

activeUser(){
  // console.log("Active users===",this.activeEmp)
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.height = '90vh';
  dialogConfig.width = '75vw';
  dialogConfig.data = {
    type:"activeUserData"
  }
  const dialogRef = this.dialog.open(HomeCountViewComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    this.refreshFinds()
  });


}

offlineUser(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.height = '90vh';
  dialogConfig.width = '75vw';
  dialogConfig.data = {
    type:"offlineUserData",

  }
  const dialogRef = this.dialog.open(HomeCountViewComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    this.refreshFinds()
    this.refreshOnlineDevice()

  });

}
onlineUser(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.height = '90vh';
  dialogConfig.width = '75vw';
  dialogConfig.data = {
    type:"onlineUserData",

  }
  const dialogRef = this.dialog.open(HomeCountViewComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    this.refreshFinds()
    this.refreshOnlineDevice()

  });

}


infectedUser(){


      // console.log("Infected users===",this.infectedEmp)
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = true;
       dialogConfig.height = '90vh';
       dialogConfig.width = '75vw';
       dialogConfig.data = {
         type:"infectedUserData",

       }
       const dialogRef = this.dialog.open(HomeCountViewComponent, dialogConfig);

       dialogRef.afterClosed().subscribe(result => {
         this.refreshFinds()
       });

}


normalUser(){
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
    type:'normal'
  }
  this.api.getHomeCountData(data).then((res:any)=>{
    // console.log("count data ======",res);
    if(res.status){
      //  console.log("Normal users===",this.normalEmp)
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = true;
       dialogConfig.height = '90vh';
       dialogConfig.width = '75vw';
       dialogConfig.data = {
         type:"normalUserData",
         data:res.success
       }
       const dialogRef = this.dialog.open(HomeCountViewComponent, dialogConfig);

       dialogRef.afterClosed().subscribe(result => {
         this.refreshFinds()
       });

    }
  })

}


refresh(){
  this.refreshCount()
  this.refreshSetting()
  this.maximumContactTime()
  this.repeatedContacts()
  this.refreshOnlineDevice()
  this.numOfcontactPerDay()
  this.refreshFinds()

}


refreshCount(){
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
  }
  this.api.getCountData(data).then((res:any)=>{
    console.log("count data ======",res);
    if(res.status){
      this.totalEmp = res.success[0].totalEmp
      this.infectedEmp = res.success[1].inectedEmp
      this.normalEmp = res.success[2].normalEmp
      this.activeEmp = res.success[3].activeEmp
     this.refreshOnlineDevice()
    }
  })

}





refreshSetting(){
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
    tblName:'deviceSetting'
  }
  this.api.getData(data).then((res:any)=>{
    // console.log("setting data ======",res);
    if(res.status){
      this.setting = res.success[0]
    }
  })
}



maximumContactTime(){
  var date=new Date()
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
    zone:this.general.getZone(date)
  }
  this.api.getMaxTimeContact(data).then((res:any)=>{
    console.log("max contact time ======",res);
    if(res.status){
      this.contactTimeMax = []
      for(var i=0;i<res.success.length;i++){
        var hms = res.success[i].totTime
        var a = hms.split(':')
         this.totmin = Math.round((+a[0]*60) + (+a[1] ) + ((+a[2])/60) )

        this.contactTimeMax.push(
          {
            baseName:res.success[i].baseName,
            totmin:this.totmin,
            totTime:res.success[i].totTime
          }
      )

      }
    }
  })

}





repeatedContacts(){
  var date=new Date()
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
    zone:this.general.getZone(date)
  }
  this.api.getMaxContactDevice(data).then((res:any)=>{
    // console.log("max contact devices data ======",res);
    if(res.status){
      this.contactDeviceMax = res.success

    }
  })

}




numOfcontactPerDay(){
  var date=new Date()
  var data={
    userId:this.loginData.userId,
    subUserId: (this.loginData.hasOwnProperty('id') && this.loginData.type==4 && this.loginData.id!=0) ? this.loginData.id : 0,
    zone:this.general.getZone(date)
  }
  this.api.getPerDayCount(data).then((res:any)=>{
    // console.log("repeated contacts data ======",res);
    if(res.status){
      this.dataPoints=[]
      this.countPerday = res.success.reverse()

      for (let i = 0; i < this.countPerday.length; i++) {
        var months=['Jan','Feb', 'Mar','Apr','May','Jun','Jul','Aug','sep','Oct','Nov','Dec']
          var dateObj=this.countPerday[i].updatedOn.split('T')
          var date=new Date(dateObj[0])
          this.month[i]=months[date.getMonth()]
          this.day[i]=date.getDate()
          this.dates[i]=this.month[i] + " " + this.day[i]
          this.dataPoints.push(
             {
              y:this.countPerday[i].dailyCount,
              label:this.dates[i]
             }
           )
      }

      var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    exportEnabled: true,
                    title: {
                      text: "No. of contacts",
                      fontColor: "#ef6c00",
                    },
                    axisY:{
                      gridThickness: 0
                    },
                    dataPointWidth: 30,
                    data: [{
                      type: "column",
                      dataPoints:this.dataPoints
                    }]
                  });

      chart.render();
      chart.destroy()
      chart=null;
      chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "No. of contacts",
          fontColor: "#ef6c00",
        },
        axisY:{
          gridThickness: 0
        },
        dataPointWidth: 30,
        data: [{
          type: "column",
          dataPoints:this.dataPoints
        }]
      });
      chart.render();
    }

  })
 }


 showNext(data,count){
   console.log("data===",data)
   this.branch=(count==1 || count== 2) && data.baseName== this.option[0].baseName?true:false
   this.branch1=count==2 && data.baseName== this.option1[0].baseName ?true:false

 }
}
