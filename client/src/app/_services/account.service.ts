import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  // | means its an union type. Which means it can be one or more types. It fixes the null value problem
  private currentUserSource = new BehaviorSubject<User | null>(null);
  //$ means its an observable
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any)
  {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((respone: User) => {
        const user = respone;
        if(user) {
         this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe (
      map(user => {
        if(user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
