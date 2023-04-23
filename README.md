## ShortcutsAPI
An API and library of iOS shortcuts used to create highly detailed home automations based on the user's Focus mode, location, and time of day. The Focus mode can also be displayed on a personal website in real-time.

[![GitHub workflow status](https://img.shields.io/github/actions/workflow/status/gavinsawyer/shortcuts-api/ci.yml)](https://github.com/gavinsawyer/shortcuts-api/actions/workflows/ci.yml)
[![ShortcutsAPI version](https://img.shields.io/npm/v/@gavinsawyer/shortcuts-api?logo=npm)](https://www.npmjs.com/package/@gavinsawyer/shortcuts-api)
[![Firebase-Functions version](https://img.shields.io/npm/dependency-version/@gavinsawyer/shortcuts-api/firebase-functions?logo=firebase)](https://www.npmjs.com/package/firebase-functions)
### Thesis
Having somewhere to store and retrieve Focus mode, location, and time of day enables highly detailed home automations in HomeKit and the native iOS app Shortcuts. The initial problem this aimed to solve was [disabling motion-activated lights while in Sleep Focus](https://imgur.com/a/BVXWg3b) rather than at a hard-coded time. This was impossible as Home Automations run on tvOS devices which don't currently have access to the user's Focus mode. The final product is capable of doing much more, though:
> An example of home automation using the `On Stop Wake-Up Alarm` shortcut turns off my Sleep Focus and turns on my apartment lights and espresso machine if I am at home when my wake-up alarm is stopped.
>
> [See this part of my Shortcuts setup](https://imgur.com/a/Wenixz1)

> An example of home state management using the `Asleep and At Home` shortcut reminds me to charge my iPhone before going to sleep by only turning off my bedroom lights when the charger is connected.
>
> [See this part of my Shortcuts setup](https://imgur.com/a/eITKS09)
### Deployment
1. From your Firebase Functions package root, run:

`% npm install @gavinsawyer/shortcuts-api --save`

2. Export the function by calling `getShortcutsApi` with a config object.
```ts
import { getApps, initializeApp } from "firebase-admin/app";
import { HttpsFunction }          from "firebase-functions";
import { getShortcutsApi }        from "@gavinsawyer/shortcuts-api";


getApps().length === 0 && initializeApp();

export const shortcutsAPI: HttpsFunction = getShortcutsApi({...});

// Other functions...
```
```ts
export interface ShortcutsApiConfig {
  environmentCollectionPath: string, // Firestore collection where public and private documents are saved.
}
```
3. Deploy your Firebase Functions:

`% firebase deploy --only functions`
### Usage
Download and import the [shortcuts](shortcuts) to your Mac or iOS device. `Config` requires setup including:
- Creating an `Access Token`
- Providing the `Cloud Function URL`
- Reviewing what data you want to store and use:
  - With `Use Focus` turned on, disable automatic Focus modes (including schedules, Car Bluetooth/CarPlay, etc.) in Settings and use shortcuts instead. 
  - With `Use Location` turned on, disable any geolocation-based automations and use shortcuts instead.
  - With `Use Time` turned on, disable the Automatic Appearance setting in Display & Brightness.

[Automation State shortcuts](shortcuts/automation-state) are left empty for you to customize. These are used to express state rather than to respond to events and must be able to be triggered repeatedly without side effects.
- `Awake and At Home Anytime`: Partial state of your home when awake at any time (preferred temp, etc.). Only triggered when you are awake unless `Use Focus` is disabled in `Config`. This is always preceded by either:
  - `Awake and At Home Before Sunset`: Partial state of your home when awake during daytime (brighter lighting, etc.).
  - `Awake and At Home Before Sunrise`: Partial state of your home when awake during nighttime (dimmer lighting, etc.). Never triggered if `Use Time` is disabled in `Config`.
- `Away`: Complete state of your home when you are away. Never triggered if `Use Location` is disabled in `Config`.
- `Asleep and At Home`: Complete state of your home when you are asleep. Never triggered if `Use Focus` is disabled in `Config`.

In the Automation section of Shortcuts on iOS, create Personal Automations pointing to the [Automation Trigger shortcuts](shortcuts/automation-trigger) for each of the following events. These shortcuts can all be customized with additional actions based on focus, location, and time of day by accessing the `Private Environment` Dictionary. 
- You Choose -> `On Arrive or Depart`
  - Example: NFC Tag Detected -> `On Arrive or Depart` (Tape a [£2 walnut NFC card](https://nfctagify.com/product/nfc-walnut-business-card-ntag213/) to the wall beside a lightswitch, tap your iPhone on your way in and out.)
  - Unfortunately, Apple does not allow location-based automations to run without receiving permission each time.
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
### Google Cloud Setup
- Reference the access token you created in the `Config` shortcut as a secret by exposing the environment variable `SHORTCUTS_API_ACCESS_TOKEN` in [Cloud Functions](https://console.cloud.google.com/functions/list) under `shortcutsApi` > Edit > Security and Image Repo.
- Grant the `Cloud Functions Invoker` role to the `allUsers` principal in [Cloud Functions](https://console.cloud.google.com/functions/list) under `shortcutsApi` > Permissions.
- Grant the `Cloud Datastore User` role to the `App Engine default service account` principal in [Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) under `App Engine default service account` > Permissions.
