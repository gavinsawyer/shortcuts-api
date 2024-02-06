import { App }                                                          from "firebase-admin/app";
import { DocumentReference, DocumentSnapshot, Firestore, getFirestore } from "firebase-admin/firestore";
import { CallableFunction, CallableRequest, onCall }                    from "firebase-functions/v2/https";
import { PrivateDocument, PublicDocument, User }                        from "./interfaces";
import { CallableRequestData, CallableResponseData }                    from "./types";


// noinspection JSUnusedGlobalSymbols
/**
 * @param app - An optional {@link App} to use with Firestore.
 * @returns - A {@link CallableFunction} which will need to be exported from your Firebase Functions package index.
 */
export const getShortcutsApi: (app?: App) => CallableFunction<CallableRequestData, Promise<CallableResponseData>> = (app?: App): CallableFunction<CallableRequestData, Promise<CallableResponseData>> => onCall(
  {
    enforceAppCheck: false,
    ingressSettings: "ALLOW_ALL",
  },
  async (callableRequest: CallableRequest<CallableRequestData>): Promise<CallableResponseData> => callableRequest.rawRequest.protocol === "https" ? callableRequest.data.accessToken ? callableRequest.data.accessToken === process.env["SHORTCUTS_API_ACCESS_TOKEN"] ? callableRequest.data.operation ? ((firestore: Firestore): Promise<CallableResponseData> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateDocument>).get().then<CallableResponseData>(
    (privateDocumentSnapshot: DocumentSnapshot<PrivateDocument>): Promise<CallableResponseData> => (async (privateDocument: PrivateDocument | null): Promise<CallableResponseData> => privateDocument ? callableRequest.data.operation === "get private document" ? {
      operation:       callableRequest.data.operation,
      privateDocument: privateDocument,
      states:          {
        somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
        everybodyAtHomeAsleep: Object.values<User>(privateDocument.users).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
      },
      success:         true,
    } : callableRequest.data.username ? privateDocument.users[callableRequest.data.username] ? callableRequest.data.operation === "revert focus" ? ((functionRequest): Promise<CallableResponseData> => (firestore.collection("environment").doc("private") as DocumentReference<PrivateDocument>).set(
      {
        users: {
          [functionRequest.username]: {
            focus:      privateDocument.users[functionRequest.username].focusPrior,
            focusPrior: privateDocument.users[functionRequest.username].focus,
          },
        },
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      async (): Promise<CallableResponseData> => privateDocument.users[functionRequest.username].publicFields?.includes("focus") ? (firestore.collection("environment").doc("public") as DocumentReference<PublicDocument>).set(
        {
          users: {
            [functionRequest.username]: {
              focus: privateDocument.users[functionRequest.username].focusPrior,
            },
          },
        },
        {
          merge: true,
        },
      ).then<CallableResponseData>(
        (): CallableResponseData => ({
          operation:       functionRequest.operation,
          privateDocument: {
            users: {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                focus:      privateDocument.users[functionRequest.username].focusPrior,
                focusPrior: privateDocument.users[functionRequest.username].focus,
              },
            },
          },
          states:          {
            somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
            everybodyAtHomeAsleep: Object.values<User>(
              {
                ...privateDocument.users,
                [functionRequest.username]: {
                  ...privateDocument.users[functionRequest.username],
                  focus: privateDocument.users[functionRequest.username].focusPrior,
                },
              },
            ).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
          },
          success:         true,
        }),
      ) : {
        operation:       functionRequest.operation,
        privateDocument: {
          users: {
            ...privateDocument.users,
            [functionRequest.username]: {
              ...privateDocument.users[functionRequest.username],
              focus:      privateDocument.users[functionRequest.username].focusPrior,
              focusPrior: privateDocument.users[functionRequest.username].focus,
            },
          },
        },
        states:          {
          somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
          everybodyAtHomeAsleep: Object.values<User>(
            {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                focus: privateDocument.users[functionRequest.username].focusPrior,
              },
            },
          ).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
        },
        success:         true,
      },
    ))(callableRequest.data) : callableRequest.data.operation === "sync focus" ? (async (functionRequest): Promise<CallableResponseData> => functionRequest.focus === privateDocument.users[functionRequest.username].focus ? {
      operation:       functionRequest.operation,
      privateDocument: privateDocument,
      states:          {
        somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
        everybodyAtHomeAsleep: Object.values<User>(privateDocument.users).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
      },
      success:         true,
    } : (firestore.collection("environment").doc("private") as DocumentReference<PrivateDocument>).set(
      {
        users: {
          [functionRequest.username]: {
            focus:      functionRequest.focus,
            focusPrior: privateDocument.users[functionRequest.username].focus,
          },
        },
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      async (): Promise<CallableResponseData> => privateDocument.users[functionRequest.username].publicFields?.includes("focus") ? (firestore.collection("environment").doc("public") as DocumentReference<PublicDocument>).set(
        {
          users: {
            [functionRequest.username]: {
              focus: functionRequest.focus,
            },
          },
        },
        {
          merge: true,
        },
      ).then<CallableResponseData>(
        (): CallableResponseData => ({
          operation:       functionRequest.operation,
          privateDocument: {
            users: {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                focus:      functionRequest.focus,
                focusPrior: privateDocument.users[functionRequest.username].focus,
              },
            },
          },
          states:          {
            somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
            everybodyAtHomeAsleep: Object.values<User>(
              {
                ...privateDocument.users,
                [functionRequest.username]: {
                  ...privateDocument.users[functionRequest.username],
                  focus: functionRequest.focus,
                },
              },
            ).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
          },
          success:         true,
        }),
      ) : {
        operation:       functionRequest.operation,
        privateDocument: {
          users: {
            ...privateDocument.users,
            [functionRequest.username]: {
              ...privateDocument.users[functionRequest.username],
              focus:      functionRequest.focus,
              focusPrior: privateDocument.users[functionRequest.username].focus,
            },
          },
        },
        states:          {
          somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
          everybodyAtHomeAsleep: Object.values<User>(
            {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                focus: functionRequest.focus,
              },
            },
          ).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
        },
        success:         true,
      },
    ))(callableRequest.data) : callableRequest.data.operation === "sync location" ? (async (functionRequest): Promise<CallableResponseData> => functionRequest.location === privateDocument.users[functionRequest.username].location ? {
      operation:       functionRequest.operation,
      privateDocument: privateDocument,
      states:          {
        somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
        everybodyAtHomeAsleep: Object.values<User>(privateDocument.users).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
      },
      success:         true,
    } : (firestore.collection("environment").doc("private") as DocumentReference<PrivateDocument>).set(
      {
        users: {
          [functionRequest.username]: {
            location: functionRequest.location,
          },
        },
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      async (): Promise<CallableResponseData> => privateDocument.users[functionRequest.username].publicFields?.includes("location") ? (firestore.collection("environment").doc("public") as DocumentReference<PublicDocument>).set(
        {
          users: {
            [functionRequest.username]: {
              location: functionRequest.location,
            },
          },
        },
        {
          merge: true,
        },
      ).then<CallableResponseData>(
        (): CallableResponseData => ({
          operation:       functionRequest.operation,
          privateDocument: {
            users: {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                location: functionRequest.location,
              },
            },
          },
          states:          {
            somebodyAtHome:        Object.values<User>(
              {
                ...privateDocument.users,
                [functionRequest.username]: {
                  ...privateDocument.users[functionRequest.username],
                  location: functionRequest.location,
                },
              },
            ).some((user: User): boolean => user.location === "At Home"),
            everybodyAtHomeAsleep: Object.values<User>(
              {
                ...privateDocument.users,
                [functionRequest.username]: {
                  ...privateDocument.users[functionRequest.username],
                  location: functionRequest.location,
                },
              },
            ).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
          },
          success:         true,
        }),
      ) : {
        operation:       functionRequest.operation,
        privateDocument: {
          users: {
            ...privateDocument.users,
            [functionRequest.username]: {
              ...privateDocument.users[functionRequest.username],
              location: functionRequest.location,
            },
          },
        },
        states:          {
          somebodyAtHome:        Object.values<User>(
            {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                location: functionRequest.location,
              },
            },
          ).some((user: User): boolean => user.location === "At Home"),
          everybodyAtHomeAsleep: Object.values<User>(
            {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                location: functionRequest.location,
              },
            },
          ).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
        },
        success:         true,
      },
    ))(callableRequest.data) : callableRequest.data.operation === "sync time" ? (async (functionRequest): Promise<CallableResponseData> => functionRequest.time === privateDocument.users[functionRequest.username].time ? {
      operation:       functionRequest.operation,
      privateDocument: privateDocument,
      states:          {
        somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
        everybodyAtHomeAsleep: Object.values<User>(privateDocument.users).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
      },
      success:         true,
    } : (firestore.collection("environment").doc("private") as DocumentReference<PrivateDocument>).set(
      {
        users: {
          [functionRequest.username]: {
            time: functionRequest.time,
          },
        },
      },
      {
        merge: true,
      },
    ).then<CallableResponseData>(
      async (): Promise<CallableResponseData> => privateDocument.users[functionRequest.username].publicFields?.includes("time") ? (firestore.collection("environment").doc("public") as DocumentReference<PublicDocument>).set(
        {
          users: {
            [functionRequest.username]: {
              time: functionRequest.time,
            },
          },
        },
        {
          merge: true,
        },
      ).then<CallableResponseData>(
        (): CallableResponseData => ({
          operation:       functionRequest.operation,
          privateDocument: {
            users: {
              ...privateDocument.users,
              [functionRequest.username]: {
                ...privateDocument.users[functionRequest.username],
                time: functionRequest.time,
              },
            },
          },
          states:          {
            somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
            everybodyAtHomeAsleep: Object.values<User>(privateDocument.users).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
          },
          success:         true,
        }),
      ) : {
        operation:       functionRequest.operation,
        privateDocument: {
          users: {
            ...privateDocument.users,
            [functionRequest.username]: {
              ...privateDocument.users[functionRequest.username],
              time: functionRequest.time,
            },
          },
        },
        states:          {
          somebodyAtHome:        Object.values<User>(privateDocument.users).some((user: User): boolean => user.location === "At Home"),
          everybodyAtHomeAsleep: Object.values<User>(privateDocument.users).filter<User>((user: User): user is User => user.location === "At Home").every<User>((user: User): user is User => user.focus === "Sleep"),
        },
        success:         true,
      },
    ))(callableRequest.data) : {
      code:    "invalid operation",
      message: "The operation provided is invalid.",
      success: false,
    } : {
      code:    "missing private document",
      message: "The private document is missing.",
      success: false,
    } : {
      code:    "missing username",
      message: "The username is missing.",
      success: false,
    } : {
      code:    "invalid username",
      message: "The username provided is invalid.",
      success: false,
    })(privateDocumentSnapshot.data() || null),
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
    message: "The access token provided is incorrect.",
    success: false,
  } : {
    code:    "missing access token",
    message: "The access token is missing.",
    success: false,
  } : {
    code:    "insecure request",
    message: "The request is insecure.",
    success: false,
  },
);
