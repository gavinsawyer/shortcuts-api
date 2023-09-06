## ShortcutsAPI
An API and library of iOS shortcuts used to create highly detailed home automations based on the user's Focus mode, location, and time of day. The Focus mode can also be displayed on a personal website in real-time.

[![GitHub workflow status](https://img.shields.io/github/actions/workflow/status/gavinsawyer/shortcuts-api/ci.yml)](https://github.com/gavinsawyer/shortcuts-api/actions/workflows/ci.yml)
[![ShortcutsAPI version](https://img.shields.io/npm/v/@gavinsawyer/shortcuts-api?logo=npm)](https://www.npmjs.com/package/@gavinsawyer/shortcuts-api)
[![Firebase-Functions version](https://img.shields.io/npm/dependency-version/@gavinsawyer/shortcuts-api/firebase-functions?logo=firebase)](https://www.npmjs.com/package/firebase-functions)
### Thesis
Having somewhere to store and retrieve Focus mode, location, and time of day enables highly detailed home automations in HomeKit and the native iOS app Shortcuts. The initial problem this aimed to solve was [disabling motion-activated lights while in Sleep Focus](./examples/Occupancy%20Detected%20Example.md) rather than at a hard-coded time. This was impossible as Home Automations run on tvOS devices which don't currently have access to the user's Focus mode. The final product is capable of doing much more, though:
> An example of home automation using the `On Stop Wake-Up Alarm` shortcut turns off my Sleep Focus, turns on my apartment lights and espresso machine, and prompts Siri to tell me the weather and my first calendar events over intercom if I am at home when my wake-up alarm is stopped:
>
> ![On Stop Wake-Up Alarm Example](./examples/On%20Stop%20Wake-Up%20Alarm%20Example.png)

> An example of home state management using the `Asleep and At Home` shortcut reminds me to charge my iPhone before going to sleep by only turning off my bedroom lights when the charger is connected:
>
> ![Asleep and At Home Example](./examples/Asleep%20and%20At%20Home%20Example.png)
### Deployment
1. From your Firebase Functions package root, run:

`% npm install @gavinsawyer/shortcuts-api --save`

2. Export the function by calling `getShortcutsApi` with a config object.
```ts
import { getApps, initializeApp } from "firebase-admin/app";
import { HttpsFunction }          from "firebase-functions";
import { getShortcutsApi }        from "@gavinsawyer/shortcuts-api";


getApps()
  .length === 0 && initializeApp();

export const ShortcutsApi: HttpsFunction = getShortcutsApi();

// Other functions...
```
3. Deploy your Firebase Functions:

    ```
    % firebase deploy --only functions
    ```

4. Create a Firestore Database to store public key credentials with the ID `shortcuts-api` and location matching the function deployment. It is recommended to choose either `nam5` in North America or `eur3` in Europe:

    ```
    % firebase firestore:databases:create shortcuts-api --location ${MULTI_REGION_NAME}
    ```
### Usage
Download and import all items in within the [shortcuts](shortcuts) directory to your Mac or iOS device. You may organize them into folders once imported, but it's not necessary. `Config` requires setup including:
- Providing your home Wi-Fi network's name and the Cloud Function's URL.
- Creating an `Access Token`

[Automation State shortcuts](shortcuts/automation-state) are left empty for you to customize. These are used to express state rather than to respond to events and must be able to be triggered repeatedly without side effects. Whether you are home is determined by your iPhone's Wi-Fi connection.
- `Awake and At Home Anytime`: Partial state of your home when awake at any time (preferred temp, etc.). Only triggered when you are awake. This is always preceded by either:
  - `Awake and At Home Before Sunset`: Partial state of your home when awake during daytime (brighter lighting, etc.).
  - `Awake and At Home Before Sunrise`: Partial state of your home when awake during nighttime (dimmer lighting, etc.).
- `Away`: Complete state of your home when you are away.
- `Asleep and At Home`: Complete state of your home when you are asleep

In the Automation section of Shortcuts on iOS, create Personal Automations pointing to the [Automation Trigger shortcuts](shortcuts/automation-triggers) for each of the following events. These shortcuts can all be customized with additional actions based on focus, location, and time of day by accessing the `Private Environment` Dictionary.
- iPhone joins or leaves home Wi-Fi network -> `On Arrive or Depart` (Updates Firestore with your location)
- You Choose -> `On Start or End Focus Activity` with the focus as text input. (To set your device's Focus mode programmatically–[example](./examples/On%20Start%20or%20End%20Focus%20Activity%20Example.md))
- Time of Day: Sunrise/Sunset -> `On Sunrise`/`On Sunset` (Updates Firestore with the time)
- CarPlay: Connects/Disconnects -> `On Connect or Disconnect CarPlay`
- Charger: Connects/Disconnects -> `On Connect or Disconnect Charger`
- Alarm Goes Off: Any -> `Get Utility Alarm`, `Delete Utility Alarm`, `Handle Utility Alarm` ([example](./examples/Any%20Alarm%20Goes%20Off%20Example.md))
- Alarm Is Stopped: Wake-Up -> `On Stop Wake-Up Alarm`
- ${FOCUS}: Turned on/off -> `On Change Focus` with the current focus as text input. (Updates Firestore with your device's Focus mode–[example](./examples/On%20Change%20Focus%20Example.md))


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
