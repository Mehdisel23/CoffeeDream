import {Coffee} from './coffee';

export interface User {
  id?:number;
  full_name: string;
  email : string;
  role ? : string;
  password? : string;

  phone_number? : string;
  address? : string;
  description? : string;

}

export interface SellerProfile extends User {
  phone_number: string;
  address: string;
  description: string;
  image ?: string ;
  coffee ? : Coffee;
  user? : User ;
}

