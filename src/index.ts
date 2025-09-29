import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

/**
 * Counter initialization options
 */
export enum InitCounter {
  YEARLY = "yearly",
  MONTHLY = "monthly",
  DAILY = "daily",
  HOURLY = "hourly",
  NEVER = "never"
}

/**
 * Plugin options interface
 */
export interface SerialOptions {
  /** The field name to be set as serial number (must be type string in mongoose schema) */
  field: string;
  /** String prefix for the serial number */
  prefix?: string;
  /** Custom format string (e.g., "YYYY-MM-DD") */
  format?: string;
  /** Separator to separate different parts of the serial number */
  separator?: string;
  /** When to reset the counter */
  initCounter?: InitCounter;
  /** Number of digits the counter should have */
  digits?: number;
  /** Whether to ignore increment on edit operations */
  ignoreIncrementOnEdit?: boolean;
  /** Custom date function (useful for testing) */
  getCurrentDate?: () => Date;
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: Required<SerialOptions> = {
  field: "serialNumber",
  prefix: "",
  format: "",
  separator: "-",
  initCounter: InitCounter.NEVER,
  digits: 10,
  ignoreIncrementOnEdit: true,
  getCurrentDate: () => new Date()
};

/**
 * Adds leading zeros to a number
 * @param counter - The number to pad
 * @param size - The target length
 * @returns Padded string
 */
export const addZeros = (counter: number, size: number): string => {
  if (size <= 0) return counter.toString();
  return counter.toString().padStart(size, "0");
};

/**
 * Extracts and increments counter from existing serial number
 * @param options - Plugin options
 * @param serial - Existing serial number
 * @returns Next counter value
 */
export const extractCounter = (options: Required<SerialOptions>, serial: string | null): string => {
  const { separator, initCounter, digits } = options;
  
  if (!serial) {
    return addZeros(1, digits);
  }

  const chunks = serial.split(separator);
  const counter = chunks[chunks.length - 1];
  
  // Check if we need to reset counter based on time period
  if (initCounter !== InitCounter.NEVER) {
    const currentDate = options.getCurrentDate();
    const shouldReset = checkCounterReset(chunks, initCounter, currentDate);
    if (shouldReset) {
      return addZeros(1, digits);
    }
  }

  const currentCounter = parseInt(counter, 10);
  if (isNaN(currentCounter)) {
    return addZeros(1, digits);
  }

  return addZeros(currentCounter + 1, digits);
};

/**
 * Checks if counter should be reset based on time period
 */
const checkCounterReset = (
  chunks: string[],
  initCounter: InitCounter,
  currentDate: Date
): boolean => {
  switch (initCounter) {
    case InitCounter.YEARLY: {
      const currentYear = currentDate.getFullYear().toString();
      const year = chunks[chunks.length - 2];
      return currentYear !== year;
    }
      
    case InitCounter.MONTHLY: {
      const currentMonth = addZeros(currentDate.getMonth() + 1, 2);
      const month = chunks[chunks.length - 2];
      return currentMonth !== month;
    }
      
    case InitCounter.DAILY: {
      const currentDay = addZeros(currentDate.getDate(), 2);
      const day = chunks[chunks.length - 2];
      return currentDay !== day;
    }
      
    case InitCounter.HOURLY: {
      const currentHour = addZeros(currentDate.getHours(), 2);
      const hour = chunks[chunks.length - 2];
      return currentHour !== hour;
    }
      
    default:
      return false;
  }
};

/**
 * Generates date string based on initCounter
 */
const generateDateString = (
  initCounter: InitCounter,
  currentDate: Date,
  separator: string
): string => {
  const year = currentDate.getFullYear().toString();
  const month = addZeros(currentDate.getMonth() + 1, 2);
  const day = addZeros(currentDate.getDate(), 2);
  const hour = addZeros(currentDate.getHours(), 2);

  switch (initCounter) {
    case InitCounter.YEARLY:
      return year;
    case InitCounter.MONTHLY:
      return [year, month].join(separator);
    case InitCounter.DAILY:
      return [year, month, day].join(separator);
    case InitCounter.HOURLY:
      return [year, month, day, hour].join(separator);
    default:
      return "";
  }
};

/**
 * Validates plugin options
 */
const validateOptions = (options: SerialOptions): void => {
  if (!options.field) {
    throw new Error("Field name is required");
  }
  
  if (options.digits !== undefined && (options.digits < 1 || options.digits > 20)) {
    throw new Error("Digits must be between 1 and 20");
  }
  
  if (options.separator && options.separator.length > 1) {
    throw new Error("Separator must be a single character");
  }
};

/**
 * Mongoose plugin for auto-incrementing serial numbers
 * @param schema - Mongoose schema
 * @param options - Plugin options
 */
export const plugin = (schema: Schema, options: SerialOptions): void => {
  // Merge with defaults
  const opts: Required<SerialOptions> = { ...DEFAULT_OPTIONS, ...options };
  
  // Validate options
  validateOptions(opts);
  
  // Check if field exists and is string type
  if (!schema.path(opts.field)) {
    throw new Error(`Field '${opts.field}' does not exist in schema`);
  }
  
  if (!(schema.path(opts.field) instanceof mongoose.Schema.Types.String)) {
    throw new Error(`Field '${opts.field}' must be of type String`);
  }

  schema.pre("save", async function (next) {
    try {
      const doc = this as Document;
      
      // Skip if field already has a value and we're ignoring increments on edit
      if (opts.ignoreIncrementOnEdit && doc.get(opts.field)) {
        return next();
      }

      // Get the last document with the highest serial number
      const lastDoc = await (doc.constructor as mongoose.Model<Document>).findOne({})
        .sort({ [opts.field]: -1 })
        .lean();

      const lastSerial = lastDoc ? (lastDoc as any)[opts.field] : null;
      const counter = extractCounter(opts, lastSerial);
      
      // Generate date string if needed
      const dateString = opts.initCounter !== InitCounter.NEVER 
        ? generateDateString(opts.initCounter, opts.getCurrentDate(), opts.separator)
        : "";

      // Build serial number parts
      const parts: string[] = [];
      if (opts.prefix) parts.push(opts.prefix);
      if (dateString) parts.push(dateString);
      parts.push(counter);

      // Set the serial number
      doc.set(opts.field, parts.join(opts.separator));
      
      next();
    } catch (error) {
      next(error as Error);
    }
  });
};

// Export default plugin
export default plugin;

