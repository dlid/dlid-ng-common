import { Component } from '@angular/core';

import { NavItem } from './components/navigation/navigation.types';
import { contents } from './contents';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-common-demo';
  navigation!: NavItem[];

  constructor() {
    this.navigation = contents.pages;
  }
}
