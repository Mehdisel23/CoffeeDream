import {User} from './user';

export interface Coffee {
  id? : number;
  name : string;
  type : string;
  description : string;
  price : number;
  added_by : User;
  image ? : string;
}
