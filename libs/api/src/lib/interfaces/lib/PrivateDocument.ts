import { User } from "./User";


export interface PrivateDocument {
  "users": {
    [key: string]: User;
  },
}
