import { Focus, Location, Time } from "../../types";


export interface User {
  "focus"?: Focus,
  "focusPrior"?: Focus,
  "location"?: Location,
  "publicFields"?: ("focus" | "location" | "time")[]
  "time"?: Time,
}
