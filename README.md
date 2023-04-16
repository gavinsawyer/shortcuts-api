## ShortcutsAPI
A Firebase Function used to read and update Firestore from iOS and tvOS Automations.

[![GitHub workflow status](https://img.shields.io/github/actions/workflow/status/gavinsawyer/shortcuts-api/ci.yml)](https://github.com/gavinsawyer/shortcuts-api/actions/workflows/ci.yml)
[![ShortcutsAPI version](https://img.shields.io/npm/v/@gavinsawyer/shortcuts-api?logo=npm)](https://www.npmjs.com/package/@gavinsawyer/shortcuts-api)
[![Firebase-Functions version](https://img.shields.io/npm/dependency-version/@gavinsawyer/shortcuts-api/firebase-functions?logo=firebase)](https://www.npmjs.com/package/firebase-functions)
### Deployment
From your Firebase Functions package root, run:

`% npm install @gavinsawyer/shortcuts-api --save`

Export the function by calling `getShortcutsApi` with a config object.
```ts
import { getApps, initializeApp } from "firebase-admin/app";
import { HttpsFunction }          from "firebase-functions";
import { getShortcutsApi }        from "@gavinsawyer/shortcuts-api";


getApps().length === 0 && initializeApp();

export const shortcutsApi: HttpsFunction = getShortcutsApi({...});

// Other functions...
```
```ts
export interface ShortcutsApiConfig {
  accessToken: string,               // Define this and retrieve the value from Secret Manager. It should match the value in your Config shortcut.
  environmentCollectionPath: string, // Collection where public and private documents are stored.
}
```
Deploy your Firebase Functions:

`% firebase deploy --only functions`

### Usage
Download and import the [shortcuts](shortcuts). `Config` requires setup including giving shortcuts your access token and Cloud Function URL and reviewing what data you want shortcuts to store and use. [Automation shortcuts](shortcuts/automation) are left empty to be customized. `Turn On At Home Settings` is not triggered if you are in Sleep Focus unless `Use Focus` is disabled in `Config`.

For a complete implementation, in the Automation section of Shortcuts on iOS, create Personal Automations pointing to the [automation trigger](shortcuts/automation-triggers) shortcuts for each of the following:
- Time of Day: Sunrise -> `On Sunrise`
- Time of Day: Sunset -> `On Sunset`
- Alarm Is Stopped: Wake-Up -> `On Stop Wake-Up Alarm`
- CarPlay: Connects/Disconnects -> `On Connect or Disconnect CarPlay`
- Apple Watch Workout: Starts/Ends -> `On Start or End Fitness Activity`
- Charger: Connects/Disconnects -> `On Connect or Disconnect Charger`
- %{FOCUS}: Turned on/off -> `On Change Focus` with input: "${FOCUS}" (To update Firestore when your devices' Focus mode changes.)
- Anything -> `On Start or End %{FOCUS} Activity` (To set your device's Focus mode programmatically.)

When updating the Focus mode (`Do Not Disturb`/`Driving`/etc.) on any device, the iPhone triggers an Automation which calls the function with the `set focus` operation. This allows the user's live Focus to appear in a website or app using Firestore. Only the live Focus is stored in a document intended to be public, while prior focus, location, and time are stored in a separate document used internally:
```ts
export interface PublicEnvironmentDocument {
  "focus"?: Focus,
}
```
```ts
export interface PrivateEnvironmentDocument {
  "focus"?: Focus,
  "focusPrior"?: Focus,
  "location"?: "At Home" | "Away",
  "time"?: "Day" | "Night",
}
```
Currently supported Focus modes:
```ts
export type Focus = "Developing" | "Do Not Disturb" | "Driving" | "Fitness" | "Personal" | "Sleep" | "Studying" | "Work";
```
Operations for focus, location, and time combined enable highly detailed home automation. The initial problem this aimed to solve was disabling motion-activated lights while in Sleep focus, not at a hard-coded time of day. However, it's capable of doing much more.
> An example automation using the `Turn On Sleep Settings` shortcut reminds me to connect my phone to the charger before going to sleep by only turning off my bedroom lights when the charger is connected.
>
> [See this part of my Shortcuts setup](https://imgur.com/a/mIncLX1)

> A more complex example using the `On Stop Wake-Up Alarm` shortcut turns off my Sleep Focus and turns on my apartment lights and espresso machine if I am at home when my wake-up alarm is stopped.
> 
> [See this part of my Shortcuts setup and how each shortcut works](https://imgur.com/a/LE1fxqm)
