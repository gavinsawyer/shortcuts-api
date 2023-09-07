import { Focus, CallableOperation, Location, Time } from "../../types";


interface UnknownCallableRequestData {
  "accessToken"?: string,
  "operation": CallableOperation,
}

interface GetPrivateEnvironmentDocumentCallableRequestData extends UnknownCallableRequestData {
  "operation": "get private environment document",
}

interface RevertFocusCallableRequestData extends UnknownCallableRequestData {
  "operation": "revert focus",
}

interface SyncFocusCallableRequestData extends UnknownCallableRequestData {
  "focus": Focus,
  "operation": "sync focus",
}

interface SyncLocationCallableRequestData extends UnknownCallableRequestData {
  "location": Location,
  "operation": "sync location",
}

interface SyncTimeCallableRequestData extends UnknownCallableRequestData {
  "time": Time,
  "operation": "sync time",
}

export type CallableRequestData = GetPrivateEnvironmentDocumentCallableRequestData | RevertFocusCallableRequestData | SyncFocusCallableRequestData | SyncLocationCallableRequestData | SyncTimeCallableRequestData;
