import { DocumentReference, DocumentSnapshot, Firestore, getFirestore } from "firebase-admin/firestore";
import { HttpsFunction, Request, Response, runWith }                    from "firebase-functions";
import { PrivateEnvironmentDocument }                                   from "./private-environment-document";
import { PublicEnvironmentDocument }                                    from "./public-environment-document";
import { ShortcutsApiConfig }                                           from "./shortcuts-api-config";


/**
 * @returns An {@link HttpsFunction} which will need to be exported from your Firebase Functions package index.
 */
export const getShortcutsApi: (shortcutsApiConfig: ShortcutsApiConfig) => HttpsFunction = (shortcutsApiConfig: ShortcutsApiConfig): HttpsFunction => runWith({
  enforceAppCheck: false,
})
  .https
  .onRequest(async (request: Request, response: Response<PrivateEnvironmentDocument>): Promise<void> => request.secure && request.body["accessToken"] === process.env["SHORTCUTS_API_ACCESS_TOKEN"] ? request.body["operation"] ? ((firestore: Firestore): Promise<void> => (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>((privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<void> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? request.body["operation"] === "get private environment" ? response.json(privateEnvironmentDocumentSnapshot.data()).end() && void(0) : request.body["operation"] === "revert focus" ? (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("private") as DocumentReference<PrivateEnvironmentDocument>).set({
    "focus": privateEnvironmentDocument.focusPrior,
    "focusPrior": privateEnvironmentDocument.focus,
  }, {
    merge: true,
  }).then<void>((): Promise<void> => response.json({
    ...privateEnvironmentDocument,
    "focus": privateEnvironmentDocument.focusPrior,
    "focusPrior": privateEnvironmentDocument.focus,
  }).end() && (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("public") as DocumentReference<PublicEnvironmentDocument>).set({
    "focus": privateEnvironmentDocument.focusPrior,
  }, {
    merge: true,
  }).then<void>((): void => void(0))) : request.body["operation"] === "sync focus" ? privateEnvironmentDocument["focus"] === request.body["focus"] ? response.json(privateEnvironmentDocument).end() && void(0) : response.json({
    "focus": request.body["focus"],
    "focusPrior": privateEnvironmentDocument.focus,
  }).end() && (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("private") as DocumentReference<PrivateEnvironmentDocument>).set({
    "focus": request.body["focus"],
    "focusPrior": privateEnvironmentDocument.focus,
  }, {
    merge: true,
  }).then<void>((): Promise<void> => (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("public") as DocumentReference<PublicEnvironmentDocument>).set({
    "focus": request.body["focus"],
  }, {
    merge: true,
  }).then<void>((): void => void(0))) : request.body["operation"] === "sync location" ? privateEnvironmentDocument.location === request.body["location"] ? response.json(privateEnvironmentDocument).end() && void(0) : response.json({
    ...privateEnvironmentDocument,
    "location": request.body["location"],
  }).end() && (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("private") as DocumentReference<PrivateEnvironmentDocument>).set({
    "location": request.body["location"],
  }, {
    merge: true,
  }).then<void>((): void => void(0)) : request.body["operation"] === "sync time" ? privateEnvironmentDocument.time === request.body["time"] ? response.json(privateEnvironmentDocument).end() && void(0) : response.json({
    ...privateEnvironmentDocument,
    "time": request.body["time"],
  }).end() && (firestore.collection(shortcutsApiConfig.environmentCollectionPath).doc("private") as DocumentReference<PrivateEnvironmentDocument>).set({
    "time": request.body["time"],
  }, {
    merge: true,
  }).then<void>((): void => void(0)) : response.status(400).end() && void(0) : response.status(404).end() && void(0))(privateEnvironmentDocumentSnapshot.data())))(getFirestore()) : response.status(400).end() && void(0) : response.status(401).end() && void(0));
