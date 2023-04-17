## ShortcutsAPI
A Firebase Function and library of iOS shortcuts used to create highly detailed home automations based on the user's Focus mode, location, and the time of day. The Focus mode can also be displayed on a personal website in real-time.

[![GitHub workflow status](https://img.shields.io/github/actions/workflow/status/gavinsawyer/shortcuts-api/ci.yml)](https://github.com/gavinsawyer/shortcuts-api/actions/workflows/ci.yml)
[![ShortcutsAPI version](https://img.shields.io/npm/v/@gavinsawyer/shortcuts-api?logo=npm)](https://www.npmjs.com/package/@gavinsawyer/shortcuts-api)
[![Firebase-Functions version](https://img.shields.io/npm/dependency-version/@gavinsawyer/shortcuts-api/firebase-functions?logo=firebase)](https://www.npmjs.com/package/firebase-functions)
### Thesis
API operations for storing focus, location, and time combined enable highly detailed Home Automations. The initial problem this aimed to solve was [disabling motion-activated lights while in Sleep Focus](https://imgur.com/a/BVXWg3b), not at a hard-coded time of day. This was impossible as Home Automations run on tvOS devices which don't currently have access to the user's Focus mode. The final product is capable of doing much more, though:
> An example automation using the `Turn On Sleep Settings` shortcut reminds me to charge my iPhone before going to sleep by only turning off my bedroom lights when the charger is connected.
>
> [See this part of my Shortcuts setup](https://imgur.com/a/Brv2zBs)

> A more complex example using the `On Stop Wake-Up Alarm` shortcut turns off my Sleep Focus and turns on my apartment lights and espresso machine if I am at home when my wake-up alarm is stopped.
>
> [See this part of my Shortcuts setup](https://imgur.com/a/Wenixz1)
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
Download and import the [shortcuts](shortcuts). `Config` requires setup including:
- Providing your access token and Cloud Function URL
- Reviewing what data you want to store and use
  - With `Use Focus` turned on, disable automatic Focus modes (including schedules, Car Bluetooth/CarPlay, etc.) in Settings and use shortcuts instead. 
  - With `Use Time` turned on, disable the Automatic Appearance setting in Display & Brightness.

[Automation shortcuts](shortcuts/automation) are left empty to be customized:
- `Turn On At Home Settings`: Thermostat and other settings which don't change at sunrise/sunset. Only triggered when you are awake unless `Use Focus` is disabled in `Config`. This is always preceded by either:
  - `Turn On Daytime Settings`: Lighting or other settings which do change at sunrise/sunset.
  - `Turn On Nighttime Settings`: Lighting or other settings which do change at sunrise/sunset. Never triggered if `Use Time` is disabled in `Config`.
- `Turn On Away Settings`: All settings for your home when you are away. Never triggered if `Use Location` is disabled in `Config`.
- `Turn On Sleep Settings`: All settings for your home when you are asleep. Never triggered if `Use Focus` is disabled in `Config`.

In the Automation section of Shortcuts on iOS, create Personal Automations pointing to the [Automation Trigger shortcuts](shortcuts/automation-triggers) for each of the following events:
- You Choose -> `On Arrive or Depart`
  - Example: NFC Tag Detected -> `On Arrive or Depart` (Tape a [£2 walnut NFC card](https://nfctagify.com/product/nfc-walnut-business-card-ntag213/) to the wall beside a lightswitch, tap your iPhone on your way in and out.)
  - Unfortunately location-based automations cannot be triggered without user permission each time except on tvOS, and Home Automations cannot run shortcuts.
- ${FOCUS}: Turned on/off -> `On Change Focus` with input: "${FOCUS}" (To update Firestore when your device's Focus mode changes.)
- CarPlay: Connects/Disconnects -> `On Connect or Disconnect CarPlay`
- Charger: Connects/Disconnects -> `On Connect or Disconnect Charger`
- You Choose -> `On Start or End ${FOCUS} Activity` (To set your device's Focus mode programmatically.)
  - Example: Apple Watch Workout: Any Workout Except Walking Starts/Ends -> `On Start or End Fitness Activity`
- Alarm Is Stopped: Wake-Up -> `On Stop Wake-Up Alarm`
- Time of Day: Sunrise -> `On Sunrise`
- Time of Day: Sunset -> `On Sunset`

The API stores data in two documents so that the Focus mode can be displayed on a personal website in real-time. The document intended to be made public only has `focus`, while a separate document used internally also has `focusPrior`, `location`, and `time`:
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
