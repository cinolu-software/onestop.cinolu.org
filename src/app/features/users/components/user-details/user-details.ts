import { Component, input } from '@angular/core';
import { IUser } from '@shared/models';
import { Calendar, Mail, MapPin, Phone, User, LucideAngularModule, Shield, Briefcase, FileText } from 'lucide-angular';
import { UiAccordion, UiAccordionPanel, UiAccordionHeader, UiAccordionContent } from '@shared/ui';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.html',
  imports: [
    DatePipe,
    UiAccordion,
    UiAccordionPanel,
    UiAccordionHeader,
    UiAccordionContent,
    LucideAngularModule,
    ApiImgPipe,
    NgOptimizedImage
  ]
})
export class UserDetails {
  user = input.required<IUser>();
  icons = { User, Mail, Phone, Calendar, MapPin, Shield, Briefcase, FileText };
}
