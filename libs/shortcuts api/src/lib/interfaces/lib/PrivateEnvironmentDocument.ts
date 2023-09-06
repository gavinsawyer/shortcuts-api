import { Focus } from "../../types";


export interface PrivateEnvironmentDocument {
  "focus"?: Focus,
  "focusPrior"?: Focus,
  "location"?: "At Home" | "Away",
  "time"?: "Day" | "Night",
}
