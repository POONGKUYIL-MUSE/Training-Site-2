import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http'
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
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  selectedList: any[] = []
  displayedColumns: string[]= ['addcart', 'id', 'name', 'amount', 'description', 'added_by']
  dataSource = new MatTableDataSource<ProductElement>(PROD_DATA)
  selection = new SelectionModel<ProductElement>(true, [])

  constructor(private auth: AuthService,
    private router: Router) {
    this.getAllProducts() 
  }

  onAddCart(row) {
    console.log(row)
    let cuser = localStorage.getItem('currentUser')
    this.auth.addCart(row, cuser).subscribe(
      res => {
        console.log(res)
      }, 
      err => {
        console.log(err)
      }
    )
  }

  getAllProducts() {
    this.auth.getAllProducts().subscribe(
      res => {
        this.dataSource = res
      },
      err => {
        if(err instanceof HttpErrorResponse) {
          if(err.status === 401) {
            this.router.navigate(['/login'])
          }
        }
      }
    )
  }

  ngOnInit(): void {
  }

}
