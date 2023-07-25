
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Storage {
  static set (key: string, value: string): void {
    window.localStorage.setItem(key, value)
  }

  static get (key: string): string | null {
    return window.localStorage.getItem(key)
  }

  static remove (key: string): void {
    window.localStorage.removeItem(key)
  }
}
