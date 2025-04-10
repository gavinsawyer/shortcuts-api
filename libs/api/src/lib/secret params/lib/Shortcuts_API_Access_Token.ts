import { type SecretParam } from "firebase-functions/lib/params/types";
import { defineSecret }     from "firebase-functions/params";


export const Shortcuts_API_Access_Token: SecretParam = defineSecret("Shortcuts_API_Access_Token");
