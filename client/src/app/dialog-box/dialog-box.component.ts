import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})

export class DialogBoxComponent implements OnInit {

  action: string
  local_data: any
  editUserData: FormGroup
  addUserData: FormGroup
  addProductData: FormGroup
  editProductData: FormGroup
  displayedColumns: string[] = []
  dataSource = []
  billamount: number
  order_details: any = {}

  order_product_name = ''
  order_product_quantity = ''
  order_product_amount = ''
  order_totalamount = 0

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
    ) { 
      this.local_data = {...data}
      this.action = this.local_data.action
      this.setForm()
  }

  setForm() {
    if(this.action == "Update" || this.action == "Delete"){
      this.editUserData = this.fb.group({
        id: this.local_data.id,
        ename: this.local_data.name,
        eemail: this.local_data.email,
        emobile: this.local_data.mobile,
        euser_role: this.local_data.user_role
      })
    }
    if(this.action == "Add"){
      this.addUserData = this.fb.group({
        name: [''],
        email: [''],
        mobile: [''],
        password: [''],
        cfpassword: [''],
        user_role: [this.data.addrole],
        added_by: [localStorage.getItem('role')]
      })
    }
    if(this.action == "AddProduct"){
      this.addProductData = this.fb.group({
        product_name: [''],
        product_amount: [''],
        product_description: [''],
        added_by: [localStorage.getItem('username')]
      })
    }
    if(this.action == "UpdateProduct" || this.action == "DeleteProduct"){
      this.editProductData = this.fb.group({
        id: this.local_data.id,
        ename: this.local_data.product_name,
        eamount: this.local_data.product_amount,
        edescription: this.local_data.product_description,
      })
    }

    if(this.action == 'PlaceOrder') {
      this.displayedColumns= ['id', 'name', 'amount', 'quantity', 'total_cost']
      for (var o in this.local_data) {
        if(this.local_data.hasOwnProperty(o)){
          if(this.local_data[o] != 'PlaceOrder') {
            var val = this.local_data[o]
            this.dataSource.push(val)
          }
        }
      }
      this.generateBillAmount()
    }
  }

  doAction(){
    if(this.action == 'Add'){
      this.dialogRef.close({event:this.action, data: this.addUserData})
    }
    if(this.action == 'Update') {
      this.dialogRef.close({event:this.action, data: this.editUserData})
    }
    if(this.action == 'Delete') {
      this.dialogRef.close({event: this.action, data: this.editUserData})
    }
    if(this.action == 'AddProduct') {
      this.dialogRef.close({event: this.action, data: this.addProductData})
    }
    if(this.action == 'UpdateProduct') {
      this.dialogRef.close({event: this.action, data: this.editProductData})
    }
    if(this.action == 'DeleteProduct') {
      this.dialogRef.close({event: this.action, data: this.editProductData})
    }
    if(this.action == 'PlaceOrder') {
      if(this.dataSource.length == 0) {
        alert("Select One/More product to place your order")
      }
      else {
        this.generateBillAmount()
        this.generateBill()
        this.order_details = {
          added_by: localStorage.getItem('currentUser'),
          product_names: this.order_product_name,
          product_quantity: this.order_product_quantity,
          product_amount: this.order_product_amount,
          order_totalamount: this.order_totalamount
        }
        this.dialogRef.close({event: this.action, data: this.order_details})
      }
    }
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'})
  }

  addTotal(event: any, i: number) {
    var quans = event.target.value;
    this.dataSource[i].product_quantity = quans
    this.dataSource[i].product_totalamount = quans*this.dataSource[i].product_amount
    this.generateBillAmount()
  }

  generateBillAmount() {
    var i = 0
    this.billamount = 0
    for (let i=0; i<this.dataSource.length; i++){
      this.billamount += this.dataSource[i].product_totalamount
    }
  }

  generateBill() {
    for(let i=0; i<this.dataSource.length; i++){
      this.order_product_name +=  this.dataSource[i].product_name + ","
      this.order_product_quantity += this.dataSource[i].product_quantity + ","
      this.order_product_amount += this.dataSource[i].product_amount + ","
      this.order_totalamount += this.dataSource[i].product_totalamount

    }
  }

  ngOnInit(): void {}
}
