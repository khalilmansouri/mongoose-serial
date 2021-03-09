import * as mongoose from "mongoose"
import { Schema } from "mongoose"

/**
 * 
 */
export enum InitCounter {
  YEARLY = "yearly",
  MONTHLY = "monthly",
  DAILY = "daily",
  HOURLY = "hourly"
}

/**
 * 
 */
export type Options = {
  field: string,
  prefix: string,
  format: string,
  separator: string,
  initCounter: "yearly" | "monthly" | "daily" | "hourly"
  digits: number
}

/**
 * 
 * @param counter 
 * @param size 
 */
export const addZeros = (counter: number, size: number) => {
  let counterString = counter.toString();
  while (counterString.length < size) counterString = "0" + counterString;
  return counterString;
}

/**
 * 
 * @param options 
 * @param serial 
 */
export const extractCounter = (options: Options, serial: string): string => {
  let { separator, initCounter, digits = 10 } = options
  let counter: string

  if (serial !== null) {
    counter = serial.split(separator).slice(-1).join(separator)
    let chunks = serial.split(separator)
    switch (initCounter) {
      case InitCounter.YEARLY:
        let currentYear = new Date().getFullYear().toString()
        let year = chunks[chunks.length - 2]
        if (currentYear !== year)
          return addZeros(1, digits)
        break
      case InitCounter.MONTHLY:
        let currentMonth = addZeros(new Date().getMonth() + 1, 2)
        let month = chunks[chunks.length - 2]
        if (currentMonth !== month)
          return addZeros(1, digits)
        break
      case InitCounter.DAILY:
        let currentDay = addZeros(new Date().getDate(), 2)
        let day = chunks[chunks.length - 2]
        if (currentDay !== day)
          return addZeros(1, digits)
        break
    }

    return addZeros(parseInt(counter) + 1, digits)
  } else
    return addZeros(1, digits)
}

/**
 * 
 * @param schema 
 * @param options 
 */
export const plugin = (schema: Schema, options: Options) => {
  let { field, prefix, separator, initCounter } = options
  let counter;
  schema.pre("save", async function (next) {
    let doc: any = this
    // feild must a string
    if (!(schema.path(field) instanceof mongoose.Schema.Types.String)) {
      next(Error("Field must be type of string"))
    }

    // get the last inserted document
    let lastDoc = await (<any>this).constructor.findOne({}).sort({ [`${field}`]: -1 })
    let serial = lastDoc ? lastDoc[field] : null

    counter = extractCounter(options, serial)

    // retrive the last count
    let dating;
    switch (initCounter) {
      case InitCounter.YEARLY:
        dating = new Date().getFullYear().toString()
        break
      case InitCounter.MONTHLY:
        dating = [new Date().getFullYear().toString(), addZeros(new Date().getMonth() + 1, 2)].join(separator)
        break
      case InitCounter.DAILY:
        dating = [new Date().getFullYear().toString(), addZeros(new Date
          ().getMonth() + 1, 2), addZeros(new Date().getDate(), 2)].join(separator)
        break
    }
    let t = []
    if (prefix) t.push(prefix)
    if (dating) t.push(dating)
    t.push(counter)
    doc[field] = t.join(separator)
    next()
  })
}

