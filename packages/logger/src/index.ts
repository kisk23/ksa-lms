type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private context?: string;
  private minLevel: LogLevel;

  constructor(context?: string, minLevel: LogLevel = 'debug') {
    this.context = context;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      context: this.context,
      timestamp: new Date().toISOString(),
      data,
    };

    const color = {
      debug: '\x1b[36m',
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    }[level];

    const reset = '\x1b[0m';
    const prefix = this.context ? `[${this.context}]` : '';

    if (process.env.NODE_ENV === 'production') {
      // Structured JSON in production
      console.log(JSON.stringify(entry));
    } else {
      // Pretty print in development
      console.log(
        `${color}${level.toUpperCase().padEnd(5)}${reset} ${prefix} ${message}`,
        data ? data : '',
      );
    }
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>) {
    this.log('error', message, data);
  }

  child(context: string): Logger {
    return new Logger(`${this.context ? this.context + ':' : ''}${context}`, this.minLevel);
  }
}

export function createLogger(context?: string): Logger {
  const minLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug';
  return new Logger(context, minLevel);
}

export { Logger };
export type { LogLevel, LogEntry };
