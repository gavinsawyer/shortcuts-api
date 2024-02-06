import { CallableOperation, Focus, Location, Time } from "../../types";


interface UnknownCallableRequestData {
  "accessToken"?: string,
  "operation": CallableOperation,
}

interface GetPrivateDocumentCallableRequestData extends UnknownCallableRequestData {
  "operation": "get private document",
}

interface UserSpecificCallableRequestData extends UnknownCallableRequestData {
  "username": string,
}

interface RevertFocusCallableRequestData extends UserSpecificCallableRequestData {
  "operation": "revert focus",
}

interface SyncFocusCallableRequestData extends UserSpecificCallableRequestData {
  "focus": Focus,
  "operation": "sync focus",
}

interface SyncLocationCallableRequestData extends UserSpecificCallableRequestData {
  "location": Location,
  "operation": "sync location",
}

interface SyncTimeCallableRequestData extends UserSpecificCallableRequestData {
  "time": Time,
  "operation": "sync time",
}

export type CallableRequestData = GetPrivateDocumentCallableRequestData | RevertFocusCallableRequestData | SyncFocusCallableRequestData | SyncLocationCallableRequestData | SyncTimeCallableRequestData;
