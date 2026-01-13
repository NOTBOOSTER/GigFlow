import { ENV } from "./envLoader.js";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

const canLog = {
  debug: {
    debug: true,
    info: true,
    warn: true,
    success: true,
    error: true,
  },
  development: {
    debug: false,
    info: true,
    warn: true,
    success: true,
    error: true,
  },
  production: {
    debug: false,
    info: false,
    warn: false,
    success: true,
    error: true,
  },
};

class Logger {
  constructor(context = "App") {
    this.context = context;
  }

  debug(msg, ...args) {
    if (canLog[ENV].debug) this.print("DEBUG", msg, ...args);
  }

  info(msg, ...args) {
    if (canLog[ENV].info) this.print("INFO", msg, ...args);
  }

  success(msg, ...args) {
    if (canLog[ENV].success) this.print("SUCCESS", msg, ...args);
  }

  warn(msg, ...args) {
    if (canLog[ENV].warn) this.print("WARN", msg, ...args);
  }

  error(msg, ...args) {
    if (canLog[ENV].error) this.print("ERROR", msg, ...args);
  }

  print(level, message, ...args) {
    const time = new Date().toLocaleTimeString();
    const tag = `[${level}]`.padEnd(9);
    const ctx = `[${this.context}]`;

    let color = colors.reset;
    if (level === "ERROR") color = colors.red;
    if (level === "WARN") color = colors.yellow;
    if (level === "SUCCESS") color = colors.green;
    if (level === "DEBUG") color = colors.magenta;

    console.log(
      `${color}${tag}${colors.reset}`,
      `${colors.dim}${time}${colors.reset}`,
      `${colors.cyan}${ctx}${colors.reset}`,
      message,
      ...args
    );
  }
}

export default Logger;
