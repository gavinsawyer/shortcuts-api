import { User } from "./User";


export interface PublicDocument {
  "users": {
    [key: string]: Partial<User>;
  },
}
