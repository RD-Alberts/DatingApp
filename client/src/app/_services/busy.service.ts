import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRquestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy() {
    this.busyRquestCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-spin',
      bdColor: 'rgba(0,0,0,0.8)',
      size: 'medium',
      color: '#ef436e',
      fullScreen: true
    });
  }

  idle() {
    this.busyRquestCount--;
    if(this.busyRquestCount <= 0) {
      this.busyRquestCount = 0;
      this.spinnerService.hide();
    }
  }
}
