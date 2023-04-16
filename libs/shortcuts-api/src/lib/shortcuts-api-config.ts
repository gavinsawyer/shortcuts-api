/**
 * @property accessToken - Define this and retrieve the value from Secret Manager. It should match the value in your [Config shortcut](https://imgur.com/a/y3BTsQq).
 * @property environmentCollectionPath - Collection where public and private documents are stored.
 */
export interface ShortcutsApiConfig {
  accessToken: string,
  environmentCollectionPath: string,
}
