import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { GeneralMaterialsService } from '../general-materials.service';
@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  txPowerForm:FormGroup
  distanceForm:FormGroup
  setting:any=[]
  dataGet:any
  statusCustomise:boolean=false
  selectedValue:boolean=false
  selectStatus1:boolean=false
  selectStatus2:boolean=false
  constructor(private fb:FormBuilder,private api:ApiService,private login:LoginCheckService,private general:GeneralMaterialsService,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.txPowerForm = this.fb.group({
      txPower: ['', Validators.required],
    });
    this.distanceForm = this.fb.group({
      distance: ['', Validators.required],
      rssi: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      this.dataGet = JSON.parse(params.record) ;
      // console.log("data==",this.dataGet.userId)
  })
  this. refreshSetting()
  }

  refreshSetting(){
    var data={
      userId:this.dataGet.userId,
      tblName:'deviceSetting'
    }
    console.log("data get==",data)
    this.api.getData(data).then((res:any)=>{
      console.log("setting data page ======",res);
      if(res.status){
        this.setting = res.success[0]
        this.distanceForm.patchValue({
          distance: res.success[0].distance.toString(),
          rssi: res.success[0].rssi
        })
        if(this.setting.type==0){
          this.selectStatus1=true
         
        }
        else{
          this.selectStatus2=true
       
        }
       
        this.txPowerForm.patchValue({
          txPower: res.success[0].txPower,
        })
       
      }
    })
  }


  onSubmitDistanceForm(data) {
    if (this.distanceForm.valid) {
      try {
        // console.log("distance ===",data)
        data.userId = this.dataGet.userId
        this.api.addDistance(data).then((res:any)=>{
          console.log("distance inserted or updated",res)
          if(res.status){
            this.refreshSetting()
            var msg = 'Minimum distance updated Successfully'
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
        // console.log("threshold ===",data)
        data.userId = this.dataGet.userId
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


  customise(){
    this.statusCustomise = this.statusCustomise == true ? false : true
  }
  onclick(event){
    this.distanceForm.reset()
    this.selectedValue=event.value==1?false:true
    // if(event.value==1){

    // }
   
  
  }

  changeDistance(event){
    
    // if(this.setting.type==0){
      if(event.value == 1 ){
        this.distanceForm.patchValue({
          rssi:'B9'
        })
      }
      else if(event.value == 2){
        this.distanceForm.patchValue({
          rssi:'B5'
        })
      }
      else if(event.value == 3){
        this.distanceForm.patchValue({
          rssi:'AE'
        })
      }
    // }
    // else if(this.setting.type==1){
    //   if(event.value == 1 ){
    //     this.distanceForm.patchValue({
    //       rssi:'A1'
    //     })
    //   }
    //   else if(event.value == 2){
    //     this.distanceForm.patchValue({
    //       rssi:'A2'
    //     })
    //   }
    //   else if(event.value == 3){
    //     this.distanceForm.patchValue({
    //       rssi:'A3'
    //     })
    //   }
    // }
  }
}
