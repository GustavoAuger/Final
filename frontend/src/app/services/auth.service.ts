import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'userName';

  login(userName: string): void {
    localStorage.setItem(this.USER_KEY, userName);
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getUserName();
  }

  getUserName(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }
}