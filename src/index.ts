import * as mongoose from "mongoose"
import { Schema } from "mongoose"

enum InitCounter {
  YEALY = "yearly",
  MONTHLY = "monthly",
  DAILY = "daily"
}

export type Options = {
  field: string,
  prefix: string,
  format: string,
  separator: string,
  initCounter: "yearly" | "monthly" | "hourly"
  digits: number
}


export const addZeros = (counter: number, size: number) => {
  let counterString = counter.toString();
  while (counterString.length < size) counterString = "0" + counterString;
  return counterString;
}

export const extractCounter = (options: Options, serial: string): string => {
  let { prefix, format, separator, initCounter, digits } = options
  let counter: string

  if (serial !== null) {
    counter = serial.split(separator).slice(-1).join(separator)
    return addZeros(parseInt(counter) + 1, digits)
    // switch (initCounter) {
    //   case InitCounter.YEALY:
    //     counter = AddZeros()
    // }
  } else
    return addZeros(1, digits)
}

export const plugin = (schema: Schema, options: Options) => {
  let { field, prefix, format, separator } = options
  // let separator = "-"
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
    // extractCounter(options, serial)

    counter = extractCounter(options, serial)

    // retrive the last count
    doc[field] = ''.concat(prefix.toUpperCase(), separator, counter)
    next()
  })
}

