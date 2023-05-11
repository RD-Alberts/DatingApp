import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() modalFor: any;
  @Input() user!: any;
  @Input() title!: string;
  roles!: any[];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.roles = this.getRoles(this.user.roles);
  }

  updateRoles(){
    this.roles = this.roles.filter(el => el.checked === true).map(el => el.name);
    this.adminService.updateUserRoles(this.user.username, this.roles).subscribe({
      next: roles => {
        this.user.roles = roles;
        this.roles = this.getRoles(this.user.roles);
      }, error: error => {
        console.log(error);
      }
    });
  }

  getRoles(selectedRoles:any){
    const roles:any = [];
    const userRoles = selectedRoles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'},
    ]

    availableRoles.forEach(role => {
      let isMatch = false;
      for(const userRole of userRoles){
        if(role.name === userRole){
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if(!isMatch){
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }

}