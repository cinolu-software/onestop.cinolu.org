export interface SignUpDto {
  email: string;
  address: string;
  phone_number: string;
  referral_code?: string;
  birth_date: Date;
  country: string;
  gender: string;
  password: string;
  password_confirm: string;
  name: string;
}
