import { Component, OnInit } from '@angular/core';

import { Category } from '../category';
import { CategoryService } from '../category.service';


import { HelperService } from "../helper.service";

@Component({
  selector: 'box-categories',
  templateUrl: './box-categories.component.html',
  styleUrls: ['./box-categories.component.scss']
})
export class BoxCategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    public helperService: HelperService,
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

}
