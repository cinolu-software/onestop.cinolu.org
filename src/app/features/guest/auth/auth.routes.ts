import { Routes } from '@angular/router';
import { unauthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: 'sign-in',
    title: 'Sign In',
    canActivate: [unauthGuard],
    loadComponent: () => import('./pages/sign-in/sign-in').then((c) => c.SignIn),
  },
  {
    path: 'sign-up',
    title: 'Sign Up',
    loadComponent: () => import('./pages/sign-up/sign-up').then((c) => c.SignUp),
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password',
    loadComponent: () => import('./pages/forgot-password/forgot-password').then((c) => c.ForgotPassword),
  },
  {
    path: 'reset-password',
    title: 'Reset Password',
    loadComponent: () => import('./pages/reset-password/reset-password').then((c) => c.ResetPassword),
  },
];
