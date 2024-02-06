import { PrivateDocument }   from "../../interfaces";
import { CallableOperation } from "../../types";


interface UnknownCallableResponseData {
  "success": boolean,
}

interface UnknownCallableResponseDataSuccessful extends UnknownCallableResponseData {
  "privateDocument": PrivateDocument,
  "operation": CallableOperation,
  "states": {
    "somebodyAtHome": boolean,
    "everybodyAtHomeAsleep": boolean,
  },
  "success": true,
}

interface CallableResponseDataUnsuccessful extends UnknownCallableResponseData {
  "code": "incorrect access token" | "insecure request" | "invalid operation" | "invalid username" | "missing access token" | "missing operation" | "missing private document" | "missing username",
  "message": "The access token provided is incorrect." | "The request is insecure." | "The operation provided is invalid." | "The username provided is invalid." | "The access token is missing." | "The operation is missing." | "The private document is missing." | "The username is missing.",
  "success": false,
}

interface GetPrivateDocumentCallableResponseDataSuccessful extends UnknownCallableResponseDataSuccessful {
  "operation": "get private document",
}

interface RevertFocusCallableResponseDataSuccessful extends UnknownCallableResponseDataSuccessful {
  "operation": "revert focus",
}

interface SyncFocusCallableResponseDataSuccessful extends UnknownCallableResponseDataSuccessful {
  "operation": "sync focus",
}

interface SyncLocationCallableResponseDataSuccessful extends UnknownCallableResponseDataSuccessful {
  "operation": "sync location",
}

interface SyncTimeCallableResponseDataSuccessful extends UnknownCallableResponseDataSuccessful {
  "operation": "sync time",
}

export type CallableResponseData = GetPrivateDocumentCallableResponseDataSuccessful | RevertFocusCallableResponseDataSuccessful | SyncFocusCallableResponseDataSuccessful | SyncLocationCallableResponseDataSuccessful | SyncTimeCallableResponseDataSuccessful | CallableResponseDataUnsuccessful;
