import { App }                                                          from "firebase-admin/app";
import { DocumentReference, DocumentSnapshot, Firestore, getFirestore } from "firebase-admin/firestore";
import { HttpsFunction, Request, Response, runWith }                    from "firebase-functions";
import { PrivateEnvironmentDocument, PublicEnvironmentDocument }        from "./interfaces";


// noinspection JSUnusedGlobalSymbols
/**
 * @param app - An optional {@link App} to use with Firestore.
 * @returns An {@link HttpsFunction} which will need to be exported from your Firebase Functions package index.
 */
export const getShortcutsApi: (app?: App) => HttpsFunction = (app?: App): HttpsFunction => runWith(
  {
    enforceAppCheck: false,
    ingressSettings: "ALLOW_ALL",
  },
)
  .https
  .onRequest(
    async (request: Request, response: Response<PrivateEnvironmentDocument>): Promise<void> => request.secure && request.body["accessToken"] === process.env["SHORTCUTS_API_ACCESS_TOKEN"] ? request.body["operation"] ? ((firestore: Firestore): Promise<void> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<void>(
      (privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<void> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | undefined): Promise<void> => privateEnvironmentDocument ? request.body["operation"] === "get private environment" ? response.json(privateEnvironmentDocumentSnapshot.data()).end() && void (0) : request.body["operation"] === "revert focus" ? (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
        {
          "focus":      privateEnvironmentDocument.focusPrior,
          "focusPrior": privateEnvironmentDocument.focus,
        },
        {
          merge: true,
        },
      ).then<void>(
        (): Promise<void> => response.json(
          {
            ...privateEnvironmentDocument,
            "focus":      privateEnvironmentDocument.focusPrior,
            "focusPrior": privateEnvironmentDocument.focus,
          },
        ).end() && (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).set(
          {
            "focus": privateEnvironmentDocument.focusPrior,
          },
          {
            merge: true,
          },
        ).then<void>(
          (): void => void (0),
        ),
      ) : request.body["operation"] === "sync focus" ? privateEnvironmentDocument["focus"] === request.body["focus"] ? response.json(privateEnvironmentDocument).end() && void (0) : response.json(
        {
          ...privateEnvironmentDocument,
          "focus":      request.body["focus"],
          "focusPrior": privateEnvironmentDocument.focus,
        },
      ).end() && (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
        {
          "focus":      request.body["focus"],
          "focusPrior": privateEnvironmentDocument.focus,
        },
        {
          merge: true,
        },
      ).then<void>(
        (): Promise<void> => (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).set(
          {
            "focus": request.body["focus"],
          },
          {
            merge: true,
          },
        ).then<void>(
          (): void => void (0),
        ),
      ) : request.body["operation"] === "sync location" ? privateEnvironmentDocument.location === request.body["location"] ? response.json(privateEnvironmentDocument).end() && void (0) : response.json(
        {
          ...privateEnvironmentDocument,
          "location": request.body["location"],
        },
      ).end() && (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
        {
          "location": request.body["location"],
        },
        {
          merge: true,
        },
      ).then<void>(
        (): void => void (0),
      ) : request.body["operation"] === "sync time" ? privateEnvironmentDocument.time === request.body["time"] ? response.json(privateEnvironmentDocument).end() && void (0) : response.json(
        {
          ...privateEnvironmentDocument,
          "time": request.body["time"],
        },
      ).end() && (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
        {
          "time": request.body["time"],
        },
        {
          merge: true,
        },
      ).then<void>(
        (): void => void (0),
      ) : response.status(400).end() && void (0) : response.status(404).end() && void (0))(privateEnvironmentDocumentSnapshot.data()),
    ))(app ? getFirestore(
      app,
      "shortcuts-api",
    ) : getFirestore("shortcuts-api")) : response.status(400).end() && void (0) : response.status(401).end() && void (0),
  );
