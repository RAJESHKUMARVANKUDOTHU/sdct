import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { GeneralMaterialsService } from '../general-materials.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { EditSettingShiftComponent } from '../edit-setting-shift/edit-setting-shift.component';

import {  saveAs  }from 'file-saver'




// import * as moment from 'moment';
// import { time } from 'console';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  workingForm:FormGroup
  distanceForm:FormGroup
  maxContactForm:FormGroup
  txPowerForm:FormGroup
  inactivityForm:FormGroup
  bufferForm:FormGroup
  overCrowedForm:FormGroup
  wearableForm:FormGroup
  timeForm:FormGroup
  scanningForm:FormGroup
  buzzerTimeForm:FormGroup
  buzzerConfigForm:FormGroup
  maxDistanceForm:FormGroup
  loginData:any
  setting:any
  duration:any
  wearableType:any
  statusCustomise:boolean=false
  minStatus:boolean=false
  secStatus:boolean=false
  requiredStatus1:boolean=false
  requiredStatus2:boolean=false
  timeFormStatus:boolean=true
  buzzerFormStatus:boolean=false
  selectedValue:boolean=false
  buzzerConfigStatus:boolean=false
  bufferValue:boolean=false
  measureStatus:boolean=false
  multipleshift:boolean=false
  inactivityStatusValue:any=[]
  coinData:any=[]
  coin:any=[]
  min:any=[]
  sec:any=[]
  loading:boolean=false
  tempImagePath:any
  uploadForm: FormGroup;
    @ViewChild('fileInput') fileInput : ElementRef;

  constructor(public dialog: MatDialog,private fb:FormBuilder,private api:ApiService,private login:LoginCheckService,private general:GeneralMaterialsService) { }

  ngOnInit(): void {
    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)
    this.refreshCoins()
    this.refreshSetting()
    // this.minThresholdMinsec()

    this.workingForm = this.fb.group({
      shift: ['', Validators.required],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required]
    });


    this.distanceForm = this.fb.group({
      distance: ['', Validators.required],
      rssi: [{value:'',disabled: true}, Validators.required],
      wearable:['',Validators.required]
    });


    this.maxContactForm = this.fb.group({
      threshold: ['', [Validators.required, Validators.min(0)]],
    });


    this.txPowerForm = this.fb.group({
      txPower: [{value:'',disabled: true}, Validators.required],
    });

    this.inactivityForm = this.fb.group({
      inactivity: ['',[Validators.required,Validators.max(120), Validators.min(0)]]
    });

    this.bufferForm = this.fb.group({
      buffer: ['',[Validators.required, Validators.min(0)]]
    })

    this.overCrowedForm=this.fb.group({
      coinSelect:['',Validators.required],
      maxLimit:['',Validators.required]

    })

    // this.timeForm=this.fb.group({
    //   minutes:[{value:'',disabled: false},Validators.required],
    //   seconds:[{value:'',disabled: false},Validators.required]
    // })

    // this.wearableForm=this.fb.group({
    //   wearable:['',Validators.required]
    // })

    this.buzzerTimeForm=this.fb.group({
      buzzerTime:['',[Validators.required,Validators.max(255), Validators.min(1)]]
    })

    this.buzzerConfigForm=this.fb.group({
      buzzerConfig:[''],
      durationSec:['',[Validators.max(255), Validators.min(10),Validators.pattern(/^\d*[05]$/)]]
    })
    this.scanningForm=this.fb.group({
      seconds:['',[Validators.required,Validators.max(60), Validators.min(1)]],

    })

    this.uploadForm = this.fb.group({
      fileData:null,
      type:'logo',
    });
    this.maxDistanceForm = this.fb.group({
      maxDistance:['',Validators.required]
    });
    

  }


  refreshCoins(){
    var data={
      userId:this.loginData.userId,
      tblName:'coinRegistration'
    }

    this.api.getData(data).then((res:any)=>{
      // console.log("coin data ======",res);
      if(res.status){
        this.coinData=res.success

      }
    })
  }

  refreshSetting(){
    var data={
      userId:this.loginData.userId,
      tblName:'deviceSetting'
    }
    this.api.getData(data).then((res:any)=>{
      // console.log("setting data page ======",res);
      if(res.status){
        this.setting = res.success[0]

        this.duration=res.success[0].durationThreshold

        this.distanceForm.patchValue({
          distance: res.success[0].distance.toString(),
          rssi: res.success[0].rssi,
          wearable:res.success[0].type.toString()
        })
        this.maxContactForm.patchValue({
          threshold: res.success[0].threshold,
        })
        this.txPowerForm.patchValue({
          txPower: res.success[0].txPower,
        })
        this.inactivityForm.patchValue({
          inactivity: res.success[0].inactivity,
        })
        this.bufferForm.patchValue({
          buffer: res.success[0].buffer,
        })
        // if(res.success[0].durationThreshold<=55){
        //   this.minStatus=true
        //   this.timeFormStatus=false
        //   this.timeForm.patchValue({
        //     minutes:'none',
        //     seconds:(res.success[0].durationThreshold).toString()
        //   })
        // }else if(res.success[0].durationThreshold>55){
        //   this.secStatus=true
        //   this.timeFormStatus=false
        //   this.timeForm.patchValue({
        //     seconds:'none',
        //     minutes:res.success[0].durationThreshold/60,
        //   })
        // }

        this.buzzerTimeForm.patchValue({
          buzzerTime:res.success[0].buzzerTime
        })
        // this.wearableForm.patchValue({
        //   wearable:res.success[0].type.toString()
        // })


        this.scanningForm.patchValue({
          seconds:res.success[0].scanningInterval.toString()
        })
        this.maxDistanceForm.patchValue({
          maxDistance:res.success[0].maxDistance.toString()
        })

        if(res.success[0].buzzerConfig==5){
          this.buzzerConfigStatus=true

          this.buzzerConfigForm.patchValue({
            buzzerConfig:res.success[0].buzzerConfig.toString(),
            durationSec:res.success[0].buzzerTime
          })
        }
        else{
          this.buzzerConfigStatus=false
          this.buzzerConfigForm.patchValue({
            buzzerConfig:res.success[0].buzzerConfig.toString(),

          })
        }

        if( res.success[0].inactivityStatus == 1){
          this.inactivityStatusValue = {
            value:true,
            status:'Disable'
          }
        }
        else{
          this.inactivityStatusValue = {
            value:false,
            status:'Enable'
          }
        }
      }
    })
  }

  // minThresholdMinsec(){
  //   var seconds=''
  //   for(let i =0;i<=5;i++){
  //     var minutes=i==0?'none':i
  //     this.min.push(minutes)
  //    }
  //   for(let i =-1;i<=11;i++){
  //     if(i==1|| i==2 || i==3){
  //     }
  //     else{
  //       if(i==-1){
  //         seconds='none'
  //       }
  //       else{
  //        seconds=(i*5).toString()
  //       }
  //       this.sec.push(seconds)
  //     }
  //   }
  // }


  onSubmitWorkForm(data) {
    // console.log("time==",data)
    var dateobj=new Date()
    var year = dateobj.getFullYear();
    var month = dateobj.getMonth() + 1
    var day = dateobj.getDate()
    var date = month + '/' + day + '/'  + year

    var time1=date+" "+data.fromTime
    var time2=date+" "+data.toTime
    time1=new Date(time1).toUTCString()
    time2=new Date(time2).toUTCString()
    var h=new Date(time1).getUTCHours()
    var m=new Date(time1).getUTCMinutes()
    var h1=new Date(time2).getUTCHours()
    var m1=new Date(time2).getUTCMinutes()
     var hh = h <= 9 && h >= 0 ? "0"+h : h;
     var mm = m <= 9 && m >= 0 ? "0"+m : m;
     var hh1 = h1 <= 9 && h1 >= 0 ? "0"+h1 : h1;
     var mm1 = m1 <= 9 && m1 >= 0 ? "0"+m1 : m1;

    data.fromTime = hh + ':' + mm
    data.toTime = hh1 + ':' + mm1
    // console.log("data====",data)


     if (this.workingForm.valid) {
       try {
        //  console.log("time data===",data)
         data.userId = this.loginData.userId
         this.api.setTime(data).then((res:any)=>{
          //  console.log("time insrted or updated",res)
          if(res.status){
            this.multipleshift=false
            var msg = 'Shift time update Successfully'
            this.general.openSnackBar(msg,'')
           
           }else{
            this.multipleshift=true
           }
         })
       } catch (err) {
       }
     }
   }



  onSubmitDistanceForm(data) {
    // console.log("data=",data)

     if (this.distanceForm.valid) {
       try {
        if(data.wearable=="0"){
          if(data.distance == "1" ){
            data.rssi='BE'
          }
          else if(data.distance  == "2" ){
           data.rssi='BC'

          }
          else if(data.distance  == "3"){
            data.rssi='B6'
          }
        }
        if(data.wearable=="1"){
          if(data.distance  == "1" ){
            data.rssi='AC'
          }
          else if(data.distance  == "2"){
            data.rssi='A9'
          }
          else if(data.distance  == "3"){
            data.rssi='A5'
          }
        }
         data.userId = this.loginData.userId
         console.log("distance ===",data)
         this.api.addDistance(data).then((res:any)=>{
           console.log("distance insrted or updated",res)
           if(res.status){
             this.refreshSetting()
             this.api.updateWearableType(data).then((res:any)=>{
             var msg = 'Minimum distance and wearable type updated Successfully'
             this.general.openSnackBar(msg,'')
         })
        }
        })
       } catch (err) {
       }
     }
   }


  onSubmitmaxContactForm(data) {
     if (this.maxContactForm.valid) {
       try {
        //  console.log("threshold ===",data)
         data.userId = this.loginData.userId
         this.api.addMaxContactThreshold(data).then((res:any)=>{
          //  console.log("contact threshold insrted or updated",res)
           if(res.status){
             this.refreshSetting()
             var msg = 'Max contact threshold updated Successfully'
             this.general.openSnackBar(msg,'')
           }
         })
       } catch (err) {
       }
     }
   }



  onSubmittxPowerForm(data) {
     if (this.txPowerForm.valid) {
       try {
        //  console.log("threshold ===",data)
         data.userId = this.loginData.userId
         this.api.addTxPower(data).then((res:any)=>{
           console.log("tx power updated",res)
           if(res.status){
             this.refreshSetting()
             var msg = 'Transmission power updated Successfully'
             this.general.openSnackBar(msg,'')
           }
         })
       } catch (err) {
       }
     }
   }


   onSubmitInactivityForm(value){

    if (this.inactivityForm.valid) {
      try {
        // console.log("inactivity data==",value)
        var data={
        userId : this.loginData.userId,
        inactivity : value.inactivity

        }

        this.api.getInactivityDeviceSetting(data).then((res:any)=>{
          // console.log("Inactivity response===",res)
          if(res.status){
            this.refreshSetting()
            var msg = 'Inactivity updated Successfully'
            this.general.openSnackBar(msg,'')
          }
        })
      } catch (err) {
      }
    }


   }

 
   onSubmitBufferForm(value){

    if (this.bufferForm.valid) {
      try {
        // console.log("buffer data==",value)
        var data={
        userId : this.loginData.userId,
        buffer : value.buffer

        }

     
        this.api.getBufferDeviceSetting(data).then((res:any)=>{
          // console.log("Buffer response===",res)
          if(res.status){
            this.refreshSetting()
            var msg = 'Buffer updated Successfully'
            this.general.openSnackBar(msg,'')
          }
        }).catch(err=>{
          // console.log("err===",err);
        })
    
      } catch (err) {
      }
    }
   }
   bufferval(event){
     console.log(event.target.value)
    
      this.bufferValue=event.target.value>5?true:false
    
   }

   onSubmitoverCrowedForm(value){
      console.log("value==",value)
    if (this.overCrowedForm.valid) {
      try {

        var data={
          userId:this.loginData.userId,
          coinId:value.coinSelect,
          maxLimit:value.maxLimit
        }

        this.api.maxLimit(data).then((res:any)=>{
          // console.log("limit response===",res)
          if(res.status){
            this.refreshSetting()
            var msg='Max limit updated Successfully'
            this.general.openSnackBar(msg,'')
          }
        }).catch(err=>{
          console.log("err===",err);
        })
      } catch (err) {
      }
    }

   }


  //  onSubmitTimeForm(data){
  //   //  console.log(" time data===",data);

  //      data.seconds=data.minutes!=="none"?data.minutes*60:data.seconds



  //    var second=data.seconds <=9 && data.seconds >= 0 ?"0"+data.seconds:data.seconds
  //    var data1={
  //      userId:this.loginData.userId,
  //      seconds:second
  //    }
  //    console.log("data1==",data1)

  //    this.api.getDurationThreshold(data1).then((res:any)=>{
  //      console.log("duration==",res)
  //     if(res.status){

  //       this.refreshSetting()
  //       var msg = 'Minimum duration threshold updated Successfully'
  //       this.general.openSnackBar(msg,'')
  //     }
  //   })

  //  }


  //  onSubmitwearableForm(data){

  //    this.wearableType=data.wearable
  //   //  console.log("data===",data.wearable)
  //    if (this.wearableForm.valid) {
  //     try {
  //       if(this.wearableType==0){
  //         if(this.setting.distance == 1){
  //           data.rssi='B9'
  //         }
  //         else if(this.setting.distance  == 2){
  //          data.rssi='B5'

  //         }
  //         else if(this.setting.distance  ==3){
  //           data.rssi='AE'
  //         }
  //       }
  //       if(this.wearableType==1){
  //         if(this.setting.distance  == 1){
  //           data.rssi='AC'
  //         }
  //         else if(this.setting.distance  == 2){
  //           data.rssi='A9'
  //         }
  //         else if(this.setting.distance  == 3){
  //           data.rssi='A5'
  //         }
  //       }


  //         data.userId=this.loginData.userId,

  //       // console.log("data=====",data)
  //       this.api.updateWearableType(data).then((res:any)=>{
  //         // console.log("wearable type===",res)
  //         if(res.status){
  //           this.refreshSetting()
  //           var msg='Wearable type updated Successfully'
  //           this.general.openSnackBar(msg,'')
  //           this.refreshSetting()
  //         }
  //       }).catch(err=>{
  //         console.log("err===",err);
  //       })
  //     } catch (err) {
  //     }
  //   }

  //  }

  onSubmitbuzzerConfigForm(data){
    // console.log("data==",data)
    data.durationSec=data.buzzerConfig>0 && data.buzzerConfig<=4?0:data.durationSec
    // console.log("data==",data)

    if (this.buzzerConfigForm.valid) {
      try {
        data.userId=this.loginData.userId
        this.api.updateBuzzerConfig(data).then((res:any)=>{
          // console.log("buzzer congig===",res)
          if(res.status){
            this.refreshSetting()
            var msg='Buzzer configured Successfully'
            this.general.openSnackBar(msg,'')
          }

        }).catch(err=>{
          console.log("err===",err);
        })
      } catch (err) {
      }
    }
  }

  onSubmitScanningForm(data){
    // console.log("data==",data)
    if (this.scanningForm.valid) {
      try {
        data.userId=this.loginData.userId
        this.api.updateScanningInterval(data).then((res:any)=>{
          // console.log("Scanning Interval===",res)
          if(res.status){
            this.refreshSetting()
            var msg='Interval second Successfully'
            this.general.openSnackBar(msg,'')
          }
        }).catch(err=>{
          console.log("err===",err);
        })
      } catch (err) {
      }
    }

  }
  onSubmitmaxDistanceForm(data){
      console.log("data==",data)
      if (this.maxDistanceForm.valid) {
        try {
          data.userId=this.loginData.userId
          this.api.getMaxDistance(data).then((res:any)=>{
            // console.log("Scanning Interval===",res)
            if(res.status){
              this.refreshSetting()
              var msg='Maximum distance updated Successfully'
              this.general.openSnackBar(msg,'')
            }
          }).catch(err=>{
            console.log("err===",err);
          })
        } catch (err) {
        }
      }

  }

  getBuzzerValue(event){
    // console.log("event==",event)
   if(event.value == 5){
     this.buzzerConfigStatus=true
     this.buzzerConfigForm.patchValue({
      durationSec:10
    })

   }else if(event.value !== 5){
    this.buzzerConfigStatus=false
   }


  }

     customise(){
     this.statusCustomise = this.statusCustomise == true ? false : true
   }

  // getMin(event){
  //   // console.log("event==",event)
  //   if(event.value=="none"){
  //     this.minStatus=true
  //     this.secStatus=false
  //     this.requiredStatus1=false
  //     this.requiredStatus2=true
  //     this.timeFormStatus=true


  //   }
  //   else{
  //     this.minStatus=false
  //     this.secStatus=true
  //     this.requiredStatus1=true
  //     this.requiredStatus2=false
  //     this.timeFormStatus=false


  //   }

  // }

  // getSec(event){
  //   if(event.value=="none"){
  //     this.minStatus=false
  //     this.secStatus=true
  //     this.requiredStatus1=true
  //     this.requiredStatus2=false
  //     this.timeFormStatus=true

  //   }
  //   else{
  //     this.minStatus=true
  //     this.secStatus=false
  //     this.requiredStatus1=false
  //     this.requiredStatus2=true
  //     this.timeFormStatus=false


  //   }

  // }


  measurement(event){
    console.log("event==",event)
    this.measureStatus=event.value=='meter'?false:true
    
  }




   // changeDistance(event){
   //  //  console.log("event===",event.value)
   //    this.refreshSetting()
   //    console.log("hii")
   //    if(this.setting.type==0){
   //      if(event.value == 1){
   //        this.distanceForm.patchValue({
   //          rssi:'B9'
   //        })
   //      }
   //      else if(event.value == 2){
   //        this.distanceForm.patchValue({
   //          rssi:'B5'
   //        })
   //      }
   //      else if(event.value == 3){
   //        this.distanceForm.patchValue({
   //          rssi:'AE'
   //        })
   //      }
   //    }
   //    if(this.setting.type==1){
   //      if(event.value == 1){
   //        this.distanceForm.patchValue({
   //          rssi:'A1'
   //        })
   //      }
   //      else if(event.value == 2){
   //        this.distanceForm.patchValue({
   //          rssi:'A2'
   //        })
   //      }
   //      else if(event.value == 3){
   //        this.distanceForm.patchValue({
   //          rssi:'A3'
   //        })
   //      }
   //    }
   //
   //
   // }

   inactivityChange(event){
     var checked = event.checked == true ? 1 : 2

     var data={
       userId : this.loginData.userId,
       status : checked
     }
    //  console.log("data====",data)
     this.api.updateInactivityStatus(data).then((res:any)=>{
       if(res.status){
         this.refreshSetting()
         var msg = 'Inactivity updated Successfully'
         this.general.openSnackBar(msg,'')
       }
     }).catch(err=>{
      //  console.log("err===",err);
     })
   }

  openDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '60vh';
    dialogConfig.width = '70vw';
    dialogConfig.data = {
      type:"shifts"
    }
    const dialogRef = this.dialog.open(EditSettingShiftComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openOvercrowdDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '60vh';
    dialogConfig.width = '70vw';
    dialogConfig.data = {
      type:"overcrowd"
    }
    const dialogRef = this.dialog.open(EditSettingShiftComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  fileChange(files){

     // console.log("File Change event",files);
    let reader = new FileReader();
    if(files && files.length>0){

      let file = files[0];
      reader.readAsDataURL(file);
      console.log("file===",file)
      reader.onload = ()=>{
        this.tempImagePath = reader.result;
        console.log("\nReader result",reader.result);

        this.uploadForm.get('fileData').setValue({
          filename: file.name ,
          filetype: file.type,
          value: this.tempImagePath.split(',')[1],
        });


      }
    }

  }

  clearFile(){
   this.uploadForm.get('fileData').setValue(null);
    this.tempImagePath = '';
    this.fileInput.nativeElement.value = '';

  }


  randomNumber(min=1, max=20) {
      return Math.random() * (max - min) + min;
  }

  formSubmit(data){
    data.userId =  this.loginData.userId
    data.fileData.filename = this.loginData.userId.toString() + parseInt(this.randomNumber().toString()) + data.fileData.filename 
    console.log("file===",data)
   if(data.fileData.filetype=='image/jpg'||data.fileData.filetype=='image/jpeg'||data.fileData.filetype=='image/png'){
    this.api.uploadLogo(data).then((res:any)=>{
      console.log("res img===",res)
      this.general.updateItem('sensegizlogin','logo',data.fileData.filename)
      this.clearFile()
      setTimeout(()=>{
        window.location.reload()
      },1000)
    })
   }else{
     this.loading=true

   }

  }
}
