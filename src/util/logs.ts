export enum LogLevel {
  LOW = 'low',
  MID = 'mid',
  HIGH = 'high',
  WARNING = 'warning',
}

class LogManifest {
  maxLogs = 7;
  entries: [LogLevel, string][] = [];
  lastEntry: string = '';
  lastEntryCount: number = 1;

  addEntryLow(txt: string) {
    this.addEntry(LogLevel.LOW, txt);
  }

  addEntryMid(txt: string) {
    this.addEntry(LogLevel.MID, txt);
  }

  addEntryHigh(txt: string) {
    this.addEntry(LogLevel.HIGH, txt);
  }

  addEntryWarning(txt: string) {
    this.addEntry(LogLevel.WARNING, txt);
  }

  addEntry(logLevel: LogLevel, txt: string) {
    if (txt === this.lastEntry) {
      this.lastEntryCount++;
      this.entries.pop();
      this.entries.push([logLevel, `${txt} (x${this.lastEntryCount})`]);
    } else {
      this.entries.push([logLevel, txt]);
      this.lastEntryCount = 1;
    }

    this.lastEntry = txt;
    // Ensure we never go above max
    while (this.entries.length > this.maxLogs) this.entries.shift();
  }

  length() {
    return this.entries.length;
  }
}

export const Log = new LogManifest();
