import * as mongoose from "mongoose"
import { Schema } from "mongoose"

export type Options = {
  field: string,
  prefix: string,
  format: string,
}

// const extractCounter = (options: Options, serial: string): string => {
//   // INVOICE-YYYY/DD/COUNTER
//   let { prefix, format } = options

//   return ''
// }

export const plugin = (schema: Schema, options: Options) => {
  let { field, prefix, format } = options
  let separator = "-"
  let counter;
  schema.pre("save", async function (next) {
    let doc: any = this
    // feild must a string
    if (!(schema.path(field) instanceof mongoose.Schema.Types.String)) {
      next(Error("Field must be type of string"))
    }

    // get the last inserted document
    let lastDoc = await (<any>this).constructor.findOne({}).sort(field)

    if (!lastDoc)
      counter = "0001"
    else
      counter = "0002"


    // retrive the last count
    doc[field] = ''.concat(prefix, separator, counter)
    next()
  })
}

