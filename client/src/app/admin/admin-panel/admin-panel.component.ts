import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  tab1!: boolean;
  tab2!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  showTab(tab: string) {
    switch (tab) {
      case 'tab1':
        this.tab1 = true;
        this.tab2 = false;
        break;
      case 'tab2':
        this.tab2 = true;
        this.tab1 = false;
        break;
      default:
        break;
    }
  }

}
