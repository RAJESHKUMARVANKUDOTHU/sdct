import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators ,FormArray} from '@angular/forms';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { GeneralMaterialsService } from '../general-materials.service';


@Component({
  selector: 'app-edit-setting-shift',
  templateUrl: './edit-setting-shift.component.html',
  styleUrls: ['./edit-setting-shift.component.css']
})
export class EditSettingShiftComponent implements OnInit {

	shiftForm:FormGroup
	overCrowdForm:FormGroup
	type:any
	shifts:any
	coinData:any
	loginData:any
	gateway:any



    constructor(
	    private fb: FormBuilder,
	    public dialogRef: MatDialogRef<EditSettingShiftComponent>,
	    @Inject(MAT_DIALOG_DATA)  data,
	    private api: ApiService,
	    private login:LoginCheckService,
	    private general:GeneralMaterialsService
  	){
		this.type=data.type
		console.log("type==",this.type)
		this.shiftForm = this.fb.group({
		  items:this.fb.array([])
		});

		this.overCrowdForm = this.fb.group({
			data:this.fb.array([])
		  });
  	}

	ngOnInit(): void {
	  this.loginData = this.login.Getlogin()
	  this.loginData = JSON.parse(this.loginData)
	  this.refreshShift()
	  this.refreshCoins()
	//   this.refreshGateway()
	}

	refreshShift(){
	  var data={
	    userId:this.loginData.userId,
	    tblName:'deviceShift'
	  }

	  this.api.getData(data).then((res:any)=>{
	    console.log("shift  data ======",res);
	    if(res.status){
		  this.shifts=res.success
		  
	  	for(let i=0;i<res.success.length;i++){
			var dateobj=new Date()
			var year = dateobj.getFullYear();
			var month = dateobj.getMonth() + 1
			var day = dateobj.getDate()
			var date = month + '/' + day + '/'  + year
		  
			var time1=date+" "+this.shifts[i].fromTime+':00 UTC'
			var time2=date+" "+this.shifts[i].toTime+':00 UTC'
			time1=new Date(time1).toString()
			time2=new Date(time2).toString()
			
		
			var h=new Date(time1).getHours()
			var m=new Date(time1).getMinutes()
			var h1=new Date(time2).getHours()
			var m1=new Date(time2).getMinutes()
			var hh = h <= 9 && h >= 0 ? "0"+h : h;
			var mm = m <= 9 && m >= 0 ? "0"+m : m;
			var hh1 = h1 <= 9 && h1 >= 0 ? "0"+h1 : h1;
			var mm1 = m1 <= 9 && m1 >= 0 ? "0"+m1 : m1;
			
	  
		  this.shifts[i].fromTime=(hh+':'+mm)
		  this.shifts[i].toTime=(hh1+':'+mm1)
	  }
		

  		    const control = <FormArray>this.shiftForm.controls.items;
			control.controls = [];
			for(var i=0;i<this.shifts.length;i++){
				control.push(this.fb.group(
				  {
				    id:[this.shifts[i].id],
				    userId:[this.shifts[i].userId],
				    shiftName:[this.shifts[i].shiftName],
				    fromTime:[this.shifts[i].fromTime],
				    toTime:[this.shifts[i].toTime],
				  }
				))
			}
  		//   console.log("controls=",control)
	    }
	  })
	}

	refreshGateway(){
		var data={
			userId:this.loginData.userId,
			tblName:'gatewayRegistration'
		  }
	  
		this.api.getData(data).then((res:any)=>{
		//   console.log("gateway data ======",res);
		  if(res.status){
			this.gateway=res.success
	  
		  }
	  
		})
	  }

	refreshCoins(){
		var data={
		  userId:this.loginData.userId,
		  tblName:'coinRegistration'
		}
	  
		this.api.getData(data).then((res:any)=>{
		//   console.log("coin data ======",res);
		  if(res.status){
			this.coinData=res.success
			const control = <FormArray>this.overCrowdForm.controls.data;
			control.controls = [];
			
		  for (let i = 0; i <this.coinData.length; i++) {
			control.push(this.fb.group(
				{
					id:[this.coinData[i].id],
					coinId:[this.coinData[i].coinId],
					coinName: [this.coinData[i].coinName],
					// gatewayId:[this.coinData[i].gatewayId],
					maxLimit:[this.coinData[i].maxLimit]
					
				}
			));	
		  }	
		//   console.log("control==",control)
		}
	})
 }


	submit(a){
		var dateobj=new Date()
		var year = dateobj.getFullYear();
		var month = dateobj.getMonth() + 1
		var day = dateobj.getDate()
		var date = month + '/' + day + '/'  + year
	
		var time1=date+" "+a.fromTime
		var time2=date+" "+a.toTime
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
   
		a.fromTime = hh + ':' + mm
		a.toTime = hh1 + ':' + mm1  
		console.log("a===",a)

	
		this.api.editSettingShift(a).then((res:any)=>{
        // console.log("shift edit==",res)
        if(res.status){
          var msg = 'Shift updated Successfully'
          this.general.openSnackBar(msg,'')
        }
        this.refreshShift()
      })
	}


  delete(a){
    // console.log("delete===",a);
    if(confirm("Are you sure you want to delete the shift")){
      this.api.deleteShift(a).then((res:any)=>{
        // console.log("shift delete==",res)
        if(res.status){
          var msg = 'Shift deleted Successfully'
          this.general.openSnackBar(msg,'')
        }
        this.refreshShift()
      })
    }
  }

  submitOvercrowd(data){
	
	data.coinId=[data.coinId]
	data.userId=this.loginData.userId
	//  console.log("data==",data)
	  this.api.maxLimit(data).then((res:any)=>{
		// console.log("limit response===",res)
		if(res.status){
		  var msg='Max limit updated Successfully'
		  this.general.openSnackBar(msg,'')
		  this.refreshCoins()
		}
	  })

  }

  deleteOvercrowd(value){
	
	  var data = {
		id:value.id,
		tblName:'coinRegistration'
	  }
	  this.api.deletedeviceandUser(data).then((res:any)=>{
		// console.log("coin data ======",res);
		if(res.status){
		  this.refreshCoins()
		  var msg = 'Coin Deleted Successfully'
		  this.general.openSnackBar(msg,'')
		}
	  })
  
  }

}
