import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getMemebers() {
    return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions())
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    //if you are not logged in you wont get users
    if(!userString) return;

    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }
  }
}
