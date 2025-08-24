export interface Auth {

}
export interface LoginData{
  email : string;
  password : string
}
export interface RegisterData{
  full_name: string;
  email : string;
  role : string;
  password : string;
  confirm_password : string ;

  phone_number?: number;
  address?: string;
  description?: string;
}
