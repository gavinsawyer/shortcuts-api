import { PrivateEnvironmentDocument } from "../../interfaces";
import { CallableOperation }          from "../../types";


interface UnknownCallableResponseData {
  "success": boolean,
}

interface UnknownCallableResponseDataSuccessful extends UnknownCallableResponseData {
  "privateEnvironmentDocument": PrivateEnvironmentDocument,
  "operation": CallableOperation,
  "success": true,
}

interface CallableResponseDataUnsuccessful extends UnknownCallableResponseData {
  "code": "incorrect access token" | "insecure request" | "invalid operation" | "missing access token" | "missing operation" | "missing private environment document",
  "message": "The access token provided was incorrect." | "The request was insecure." | "The operation provided was invalid." | "The access token is missing." | "The operation is missing." | "The private environment document is missing.",
  "success": false,
}

interface GetPrivateEnvironmentDocumentCallableResponseDataSuccessful extends UnknownCallableResponseDataSuccessful {
  "operation": "get private environment document",
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

export type CallableResponseData = GetPrivateEnvironmentDocumentCallableResponseDataSuccessful | RevertFocusCallableResponseDataSuccessful | SyncFocusCallableResponseDataSuccessful | SyncLocationCallableResponseDataSuccessful | SyncTimeCallableResponseDataSuccessful | CallableResponseDataUnsuccessful;
