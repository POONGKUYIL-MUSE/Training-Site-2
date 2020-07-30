import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../auth.service';

import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface ProductElement {
  product_name: string;
  id: number;
  product_amount: number;
  product_description: string;
  added_by: string;
}

const PROD_DATA: ProductElement[] =[]

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartsComponent implements OnInit {

  @ViewChild(MatTable, {static: true}) table: MatTable<any>

  selectedList: any[] = []
  displayedColumns: string[]= ['addcart', 'id', 'name', 'amount']
  dataSource = new MatTableDataSource<ProductElement>(PROD_DATA)
  selection = new SelectionModel<ProductElement>(true, [])

  constructor(private auth: AuthService,
    private router: Router,
    private dialog: MatDialog) {

      this.dataSource = new MatTableDataSource<ProductElement>(PROD_DATA)
      this.getCart() 
  }

  ngOnInit(): void {
  }

  getCart() {
    let cuser = localStorage.getItem('currentUser')
    this.auth.getCart(cuser).subscribe(
      res => {
        this.dataSource = res
      },
      err => {
        //console.log(err)
        if(err instanceof HttpErrorResponse) {
          if(err.status === 401) {
            this.router.navigate(['/login'])
          }
        }
      })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource['length']
    return numSelected === numRows
  }

  masterToggle() {
    console.log(this.dataSource)
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(
        row => {
          this.selection.select(row)
        }
      )
  }

  placeOrder(){
    this.selectedList.length = 0
    if(this.selection.selected.length > 0){
      this.selectedList.length = 0
      this.selection.selected.forEach(value => {
        this.selectedList.push(value)
      })
    }
    //console.log(this.selection.selected.length)
    //console.log(this.selection)
    console.log(this.selectedList)
    this.openDialog('PlaceOrder', this.selectedList)
  }

  openDialog(action, obj){
    obj.action = action
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '950px',
      data: obj
    })

    dialogRef.afterClosed().subscribe(result=>{
      if(result.event == 'PlaceOrder'){
        console.log("Order Placed : " + result)
        console.log(result.data)
        this.auth.addOrder(result.data).subscribe(
          res => console.log(res),
          err => console.log(err)
        )
      }
    })
  }

  checkboxLabel(row?: ProductElement): string {
    if(!row) {
      return `${this.isAllSelected()? 'select': 'deselect'} all`
    }
    return `${this.selection.isSelected(row)? 'deselect' : 'select'} row ${row.id + 1}`
  }


}
