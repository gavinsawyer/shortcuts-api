## ShortcutsAPI
A Firebase Function used to read and update Firestore from iOS and tvOS Automations.

When updating the Focus mode (`Do Not Disturb`/`Driving`/etc.) on any device, the iPhone triggers an Automation which calls the function with the `set focus` operation, for example. This allows the user's live Focus to appear in a website or app using Firestore.

Additional operations for location and time enable home automation. iOS and tvOS (running on Apple TV and HomePods) Automations set device and home conditions according to the user's state.

> An example automation I've implemented turns off the Sleep Focus and turns on my apartment lights and espresso machine if I am at home when my wake-up alarm is stopped.
