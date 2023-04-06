import { Focus } from "./focus";

export interface PrivateEnvironmentDocument {
  "focus": Focus,
  "focusPrior": Focus,
  "location": string,
  "time": "Day" | "Night",
}
