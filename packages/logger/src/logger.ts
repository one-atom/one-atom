export namespace Logger {
  const DETAILS = 'numeric';
  const LOCALE = 'en';

  export enum Level {
    ERROR = 1,
    WARN = 2,
    INFO = 4,
    DEBUG = 8,
    VERBOSE = 16,
    NONE = 0,
  }

  type MessageFn = (...args: string[]) => void;

  interface MessageFns {
    warn: MessageFn;
    error: MessageFn;
    info: MessageFn;
    verbose: MessageFn;
  }

  // Bit value, 0 = none
  let flag = Level.NONE;
  let printFns: MessageFns;

  setPrintFn({
    warn: console.warn,
    error: console.error,
    info: console.info,
    verbose: console.log,
  });

  export function assert(level: Level, message: string): void {
    const timestamp = new Date();

    const hour = new Intl.DateTimeFormat(LOCALE, { hour: DETAILS }).format(timestamp);
    const minute = new Intl.DateTimeFormat(LOCALE, { minute: DETAILS }).format(timestamp);
    const second = new Intl.DateTimeFormat(LOCALE, { second: DETAILS }).format(timestamp);

    const str = `[${levelEnumToString(level)} - ${hour}:${minute}:${second}] ${message}`;

    if ((level & flag) === level) {
      printMessage(str, level);
    }
  }

  export function setLevel(level: Level): void {
    const newFlag = getBitFlag(level);

    flag = newFlag;
  }

  export function setPrintFn(fns: MessageFns): void {
    printFns = fns;
  }

  function printMessage(str: string, level?: Level) {
    if (level === Level.ERROR) {
      printFns.error(str);

      return;
    }

    if (level === Level.WARN) {
      printFns.warn(str);

      return;
    }

    if (level === Level.INFO) {
      printFns.info(str);

      return;
    }

    printFns.verbose(str);
  }

  function levelEnumToString(level: Level): string {
    if ((level & Level.ERROR) === Level.ERROR) return 'error';
    if ((level & Level.WARN) === Level.WARN) return 'warn';
    if ((level & Level.INFO) === Level.INFO) return 'info';
    if ((level & Level.DEBUG) === Level.DEBUG) return 'debug';
    if ((level & Level.VERBOSE) === Level.VERBOSE) return 'verbose';

    throw new Error('Can not assert with level "none"');
  }

  function getBitFlag(level: Level): number {
    let bitWise;

    switch (level) {
      case Level.ERROR:
        bitWise = Level.ERROR;
        break;
      case Level.WARN:
        bitWise = Level.WARN | Level.ERROR;
        break;
      case Level.INFO:
        bitWise = Level.INFO | Level.WARN | Level.ERROR;
        break;
      case Level.DEBUG:
        bitWise = Level.DEBUG | Level.INFO | Level.WARN | Level.ERROR;
        break;
      case Level.VERBOSE:
        bitWise = Level.VERBOSE | Level.DEBUG | Level.INFO | Level.WARN | Level.ERROR;
        break;
      default:
        bitWise = 0;
    }

    return bitWise;
  }
}
