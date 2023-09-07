import { App }                                                          from "firebase-admin/lib/app";
import { DocumentReference, DocumentSnapshot, Firestore, getFirestore } from "firebase-admin/lib/firestore";
import { CallableFunction, CallableRequest, onCall }                    from "firebase-functions/lib/v2/providers/https";
import { PrivateEnvironmentDocument, PublicEnvironmentDocument }        from "./interfaces";
import { CallableRequestData, CallableResponseData }                    from "./types";


// noinspection JSUnusedGlobalSymbols
/**
 * @param app - An optional {@link App} to use with Firestore.
 * @returns An {@link HttpsFunction} which will need to be exported from your Firebase Functions package index.
 */
export const getShortcutsApi: (app?: App) => CallableFunction<CallableRequestData, Promise<CallableResponseData>> = (app?: App): CallableFunction<CallableRequestData, Promise<CallableResponseData>> => onCall(
  {
    enforceAppCheck: false,
    ingressSettings: "ALLOW_ALL",
  },
  async (callableRequest: CallableRequest<CallableRequestData>): Promise<CallableResponseData> => callableRequest.rawRequest.protocol === "https" ? callableRequest.data.accessToken ? callableRequest.data.accessToken === process.env["SHORTCUTS_API_ACCESS_TOKEN"] ? callableRequest.data.operation ? ((firestore: Firestore): Promise<CallableResponseData> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<CallableResponseData>(
    (privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<CallableResponseData> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | null): Promise<CallableResponseData> => privateEnvironmentDocument ? callableRequest.data.operation === "get private environment document" ? {
      operation:                  callableRequest.data.operation,
      privateEnvironmentDocument: privateEnvironmentDocument,
      success:                    true,
    } : callableRequest.data.operation === "revert focus" ? ((functionRequest): Promise<CallableResponseData> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
      {
        focus:      privateEnvironmentDocument.focusPrior,
        focusPrior: privateEnvironmentDocument.focus,
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      (): Promise<CallableResponseData> => (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).set(
        {
          focus: privateEnvironmentDocument.focusPrior,
        },
        {
          merge: true,
        },
      ).then<CallableResponseData>(
        (): CallableResponseData => ({
          operation:                  functionRequest.operation,
          privateEnvironmentDocument: {
            ...privateEnvironmentDocument,
            focus:      privateEnvironmentDocument.focusPrior,
            focusPrior: privateEnvironmentDocument.focus,
          },
          success:                    true,
        }),
      ),
    ))(callableRequest.data) : callableRequest.data.operation === "sync focus" ? (async (functionRequest): Promise<CallableResponseData> => functionRequest.focus === privateEnvironmentDocument.focus ? {
      operation:                  functionRequest.operation,
      privateEnvironmentDocument: privateEnvironmentDocument,
      success:                    true,
    } : (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
      {
        focus:      functionRequest.focus,
        focusPrior: privateEnvironmentDocument.focus,
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      (): Promise<CallableResponseData> => (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).set(
        {
          "focus": functionRequest.focus,
        },
        {
          merge: true,
        },
      ).then<CallableResponseData>(
        (): CallableResponseData => ({
          operation:                  functionRequest.operation,
          privateEnvironmentDocument: {
            ...privateEnvironmentDocument,
            focus:      functionRequest.focus,
            focusPrior: privateEnvironmentDocument.focus,
          },
          success:                    true,
        }),
      ),
    ))(callableRequest.data) : callableRequest.data.operation === "sync location" ? (async (functionRequest): Promise<CallableResponseData> => functionRequest.location === privateEnvironmentDocument.location ? {
      operation:                  functionRequest.operation,
      privateEnvironmentDocument: privateEnvironmentDocument,
      success:                    true,
    } : (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
      {
        location: functionRequest.location,
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      (): CallableResponseData => ({
        operation:                  functionRequest.operation,
        privateEnvironmentDocument: {
          ...privateEnvironmentDocument,
          location: functionRequest.location,
        },
        success:                    true,
      }),
    ))(callableRequest.data) : callableRequest.data.operation === "sync time" ? (async (functionRequest): Promise<CallableResponseData> => functionRequest.time === privateEnvironmentDocument.time ? {
      operation:                  functionRequest.operation,
      privateEnvironmentDocument: privateEnvironmentDocument,
      success:                    true,
    } : (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
      {
        time: functionRequest.time,
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      (): CallableResponseData => ({
        operation:                  functionRequest.operation,
        privateEnvironmentDocument: {
          ...privateEnvironmentDocument,
          time: functionRequest.time,
        },
        success:                    true,
      }),
    ))(callableRequest.data) : {
      code:    "invalid operation",
      message: "The operation provided was invalid.",
      success: false,
    } : {
      code:    "missing private environment document",
      message: "The private environment document is missing.",
      success: false,
    })(privateEnvironmentDocumentSnapshot.data() || null),
  ))(
    app ? getFirestore(
      app,
      "shortcuts-api",
    ) : getFirestore("shortcuts-api"),
  ) : {
    code:    "missing operation",
    message: "The operation is missing.",
    success: false,
  } : {
    code:    "incorrect access token",
    message: "The access token provided was incorrect.",
    success: false,
  } : {
    code:    "missing access token",
    message: "The access token is missing.",
    success: false,
  } : {
    code:    "insecure request",
    message: "The request was insecure.",
    success: false,
  },
);
