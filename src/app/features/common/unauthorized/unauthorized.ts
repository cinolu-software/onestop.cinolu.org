import { Component } from '@angular/core';
import { LucideAngularModule, ShieldAlert, House, LogIn } from 'lucide-angular';
import { environment } from '@environments/environment';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  imports: [LucideAngularModule, ButtonModule],
  templateUrl: './unauthorized.html'
})
export class UnauthorizedPage {
  icons = {
    shieldAlert: ShieldAlert,
    home: House,
    logIn: LogIn
  };

  redirectToHome(): void {
    window.location.href = environment.appUrl;
  }

  redirectToLogin(): void {
    window.location.href = `${environment.appUrl}sign-in`;
  }
}
