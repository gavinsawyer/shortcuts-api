import { DocumentReference, DocumentSnapshot, Firestore, getFirestore } from "firebase-admin/firestore";
import { HttpsFunction, Request, Response, runWith }                    from "firebase-functions";
import { PrivateEnvironmentDocument }                                   from "./private-environment-document";
import { PublicEnvironmentDocument }                                    from "./public-environment-document";


/**
 * @returns An {@link HttpsFunction} which will need to be exported from your Firebase Functions package index.
 */
export const getShortcutsApi: () => HttpsFunction = (): HttpsFunction => runWith({
  enforceAppCheck: false,
})
  .https
  .onRequest(async (request: Request, response: Response): Promise<void> => request.body["ShortcutsAPIKey"] === process.env["SHORTCUTS_API_KEY"] && request.secure ? (async (firestore: Firestore): Promise<void> => request.body["operation"] === "get all" ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): void => response.json(privateEnvironmentDocumentSnapshot.data()).end() && void(0)) : request.body["operation"] === "reset focus" ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<void> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).update({
    "focus": privateEnvironmentDocument.focusPrior,
    "focusPrior": privateEnvironmentDocument.focus,
  }).then<void>((): Promise<void> => response.json({
    ...privateEnvironmentDocument,
    "focus": privateEnvironmentDocument.focusPrior,
    "focusPrior": privateEnvironmentDocument.focus,
  }).end() && (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).update({
    "focus": privateEnvironmentDocument.focusPrior,
  }).then<void>((): void => void(0))) : response.status(404).end() && void(0))(privateEnvironmentDocumentSnapshot.data())) : request.body["operation"] === "set focus" ? request.body["focus"] ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<void> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? privateEnvironmentDocument["focus"] === request.body["focus"] ? response.json(privateEnvironmentDocument).end() && void(0) : (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).update({
    "focus": request.body["focus"],
    "focusPrior": privateEnvironmentDocument.focus,
  }).then<void>((): Promise<void> => response.json({
    ...privateEnvironmentDocument,
    "focus": request.body["focus"],
    "focusPrior": privateEnvironmentDocument.focus,
  }).end() && (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).update({
    "focus": request.body["focus"],
  }).then<void>((): void => void(0))) : response.status(404).end() && void(0))(privateEnvironmentDocumentSnapshot.data())) : response.status(400).end() && void(0) : request.body["operation"] === "set location" ? request.body["location"] ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<void> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? privateEnvironmentDocument.location === request.body["location"] ? response.json(privateEnvironmentDocument).end() && void(0) : (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).update({
    "location": request.body["location"],
  }).then<void>((): void => response.json({
    ...privateEnvironmentDocument,
    "location": request.body["location"],
  }).end() && void(0)) : response.status(404).end() && void(0))(privateEnvironmentDocumentSnapshot.data())) : response.status(400).end() && void(0) : request.body["operation"] === "set time" ? request.body["time"] ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<void> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? privateEnvironmentDocument.time === request.body["time"] ? response.json(privateEnvironmentDocument).end() && void(0) : (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).update({
    "time": request.body["time"],
  }).then<void>((): void => response.json({
    ...privateEnvironmentDocument,
    "time": request.body["time"],
  }).end() && void(0)) : response.status(404).end() && void(0))(privateEnvironmentDocumentSnapshot.data())) : response.status(400).end() && void(0) : request.body["operation"] === "toggle location" ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>) => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).update({
    "location": privateEnvironmentDocument.location === "away" ? process.env["SHORTCUTS_API_HOME_NAME"] : "away",
  }).then<void>((): void => response.json({
    ...privateEnvironmentDocumentSnapshot.data(),
    "location": privateEnvironmentDocument.location === "away" ? process.env["SHORTCUTS_API_HOME_NAME"] : "away",
  }).end() && void(0)) : response.status(404).end() && void(0))(privateEnvironmentDocumentSnapshot.data())) : response.status(400).end() && void(0))(getFirestore()) : response.status(401).end() && void(0));
