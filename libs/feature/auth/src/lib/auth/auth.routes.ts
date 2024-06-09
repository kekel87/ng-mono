import { Routes } from '@angular/router';

import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { LoginComponent } from './components/login/login.component';
import { isNotAuthCanActivate } from './guards/auth.guard';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [isNotAuthCanActivate] },
  { path: 'access-denied', component: AccessDeniedComponent },
];
