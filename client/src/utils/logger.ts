type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MODE = import.meta.env.VITE_APP_MODE || import.meta.env.MODE || 'development';

const shouldLog = (level: LogLevel): boolean => {
  if (MODE === 'development') {
    return LEVELS[level] >= LEVELS.info;
  }
  if (MODE === 'production') {
    return LEVELS[level] >= LEVELS.error;
  }
  return true;
};

const COLORS = {
  debug: 'gray',
  info: '#3b82f6',
  warn: '#eab308',
  error: '#ef4444',
  success: '#22c55e',
};

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.debug(`%c[DEBUG] ${message}`, `color: ${COLORS.debug}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info') || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.info(`%c[INFO] ${message}`, `color: ${COLORS.info}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn') || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.warn(`%c[WARN] ${message}`, `color: ${COLORS.warn}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (shouldLog('error') || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error(`%c[ERROR] ${message}`, `color: ${COLORS.error}`, ...args);
    }
  },
  success: (message: string, ...args: any[]) => {
    if (shouldLog('info') || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`%c[SUCCESS] ${message}`, `color: ${COLORS.success}`, ...args);
    }
  }
};
