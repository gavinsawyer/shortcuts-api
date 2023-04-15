## ShortcutsAPI
A Firebase Function used to read and update Firestore from iOS and tvOS Automations.

[![GitHub workflow status](https://img.shields.io/github/actions/workflow/status/gavinsawyer/shortcuts-api/ci.yml)](https://github.com/gavinsawyer/shortcuts-api/actions/workflows/ci.yml)
[![ShortcutsAPI version](https://img.shields.io/npm/v/@gavinsawyer/shortcuts-api?logo=npm)](https://www.npmjs.com/package/@gavinsawyer/shortcuts-api)
[![Firebase-Functions version](https://img.shields.io/npm/dependency-version/@gavinsawyer/shortcuts-api/firebase-functions?logo=firebase)](https://www.npmjs.com/package/firebase-functions)
### Deployment
From your Firebase Functions package root, run:

`% npm install @gavinsawyer/shortcuts-api --save`

Export the function by calling `getShortcutsApi` with a config object. Config object values must match values in your [Config shortcut](https://imgur.com/a/aM3oiQS).
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
  accessToken: string,
  homeName: string,
} // Define these and retrieve the values from Secret Manager.
```
Deploy your Firebase Functions:

`% firebase deploy --only functions`

### Usage
When updating the Focus mode (`Do Not Disturb`/`Driving`/etc.) on any device, the iPhone triggers an Automation which calls the function with the `set focus` operation, for example. This allows the user's live Focus to appear in a website or app using Firestore.

Additional operations for location and time enable more detailed home automation. iOS and tvOS (running on Apple TV and HomePods) Automations set device and home conditions according to the user's state.

> An example automation I've implemented turns off the Sleep Focus and turns on my apartment lights and espresso machine if I am at home when my wake-up alarm is stopped.
>
> [See this part of my Shortcuts setup](https://imgur.com/a/LE1fxqm)
