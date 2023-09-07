import { App }                                                          from "firebase-admin/lib/app";
import { DocumentReference, DocumentSnapshot, Firestore, getFirestore } from "firebase-admin/lib/firestore";
import { CallableRequest, HttpsFunction, onCall }                       from "firebase-functions/lib/v2/providers/https";
import { PrivateEnvironmentDocument, PublicEnvironmentDocument }        from "./interfaces";
import { Focus, Location, Time }                                        from "./types";


type FunctionOperation = "get private environment document" | "revert focus" | "sync focus" | "sync location" | "sync time";

interface UnknownFunctionRequest {
  "accessToken"?: string,
  "operation": FunctionOperation,
}

interface GetPrivateEnvironmentDocumentFunctionRequest extends UnknownFunctionRequest {
  "operation": "get private environment document",
}

interface RevertFocusFunctionRequest extends UnknownFunctionRequest {
  "operation": "revert focus",
}

interface SyncFocusFunctionRequest extends UnknownFunctionRequest {
  "focus": Focus,
  "operation": "sync focus",
}

interface SyncLocationFunctionRequest extends UnknownFunctionRequest {
  "location": Location,
  "operation": "sync location",
}

interface SyncTimeFunctionRequest extends UnknownFunctionRequest {
  "time": Time,
  "operation": "sync time",
}

type FunctionRequest = GetPrivateEnvironmentDocumentFunctionRequest | RevertFocusFunctionRequest | SyncFocusFunctionRequest | SyncLocationFunctionRequest | SyncTimeFunctionRequest;

interface UnknownFunctionResponse {
  "success": boolean,
}

interface UnknownFunctionResponseSuccessful extends UnknownFunctionResponse {
  "privateEnvironmentDocument": PrivateEnvironmentDocument,
  "operation": FunctionOperation,
  "success": true,
}

interface FunctionResponseUnsuccessful extends UnknownFunctionResponse {
  "code": "incorrect access token" | "insecure request" | "invalid operation" | "missing access token" | "missing operation" | "missing private environment document",
  "message": "The access token provided was incorrect." | "The request was insecure." | "The operation provided was invalid." | "The access token is missing." | "The operation is missing." | "The private environment document is missing.",
  "success": false,
}

interface GetPrivateEnvironmentDocumentFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "operation": "get private environment document",
}

interface RevertFocusFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "operation": "revert focus",
}

interface SyncFocusFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "operation": "sync focus",
}

interface SyncLocationFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "operation": "sync location",
}

interface SyncTimeFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "operation": "sync time",
}

type FunctionResponse = GetPrivateEnvironmentDocumentFunctionResponseSuccessful | RevertFocusFunctionResponseSuccessful | SyncFocusFunctionResponseSuccessful | SyncLocationFunctionResponseSuccessful | SyncTimeFunctionResponseSuccessful | FunctionResponseUnsuccessful;

// noinspection JSUnusedGlobalSymbols
/**
 * @param app - An optional {@link App} to use with Firestore.
 * @returns An {@link HttpsFunction} which will need to be exported from your Firebase Functions package index.
 */
export const getShortcutsApi: (app?: App) => HttpsFunction = (app?: App): HttpsFunction => onCall(
  {
    enforceAppCheck: false,
    ingressSettings: "ALLOW_ALL",
  },
  async (callableRequest: CallableRequest<FunctionRequest>): Promise<FunctionResponse> => callableRequest.rawRequest.protocol === "https" ? callableRequest.data.accessToken ? callableRequest.data.accessToken === process.env["SHORTCUTS_API_ACCESS_TOKEN"] ? callableRequest.data.operation ? ((firestore: Firestore): Promise<FunctionResponse> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).get().then<FunctionResponse>(
    (privateEnvironmentDocumentSnapshot: DocumentSnapshot<PrivateEnvironmentDocument>): Promise<FunctionResponse> => (async (privateEnvironmentDocument: PrivateEnvironmentDocument | null): Promise<FunctionResponse> => privateEnvironmentDocument ? callableRequest.data.operation === "get private environment document" ? {
      operation:                  callableRequest.data.operation,
      privateEnvironmentDocument: privateEnvironmentDocument,
      success:                    true,
    } : callableRequest.data.operation === "revert focus" ? ((functionRequest): Promise<FunctionResponse> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateEnvironmentDocument>).set(
      {
        focus:      privateEnvironmentDocument.focusPrior,
        focusPrior: privateEnvironmentDocument.focus,
      },
      {
        merge: true,
      },
    ).then<FunctionResponse>(
      (): Promise<FunctionResponse> => (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).set(
        {
          focus: privateEnvironmentDocument.focusPrior,
        },
        {
          merge: true,
        },
      ).then<FunctionResponse>(
        (): FunctionResponse => ({
          operation:                  functionRequest.operation,
          privateEnvironmentDocument: {
            ...privateEnvironmentDocument,
            focus:      privateEnvironmentDocument.focusPrior,
            focusPrior: privateEnvironmentDocument.focus,
          },
          success:                    true,
        }),
      ),
    ))(callableRequest.data) : callableRequest.data.operation === "sync focus" ? (async (functionRequest): Promise<FunctionResponse> => functionRequest.focus === privateEnvironmentDocument.focus ? {
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
    ).then<FunctionResponse>(
      (): Promise<FunctionResponse> => (firestore.collection("environment").doc("public") as DocumentReference<PublicEnvironmentDocument>).set(
        {
          "focus": functionRequest.focus,
        },
        {
          merge: true,
        },
      ).then<FunctionResponse>(
        (): FunctionResponse => ({
          operation:                  functionRequest.operation,
          privateEnvironmentDocument: {
            ...privateEnvironmentDocument,
            focus:      functionRequest.focus,
            focusPrior: privateEnvironmentDocument.focus,
          },
          success:                    true,
        }),
      ),
    ))(callableRequest.data) : callableRequest.data.operation === "sync location" ? (async (functionRequest): Promise<FunctionResponse> => functionRequest.location === privateEnvironmentDocument.location ? {
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
    ).then<FunctionResponse>(
      (): FunctionResponse => ({
        operation:                  functionRequest.operation,
        privateEnvironmentDocument: {
          ...privateEnvironmentDocument,
          location: functionRequest.location,
        },
        success:                    true,
      }),
    ))(callableRequest.data) : callableRequest.data.operation === "sync time" ? (async (functionRequest): Promise<FunctionResponse> => functionRequest.time === privateEnvironmentDocument.time ? {
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
    ).then<FunctionResponse>(
      (): FunctionResponse => ({
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
