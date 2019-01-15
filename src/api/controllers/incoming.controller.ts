import { Request, Response, NextFunction } from "express";
import { IInBound } from "api/interface/incoming.interface";
import * as Formidable from "formidable"
import { Readable } from "stream";

export async function incomingHandler(req : Request, res : Response, next : NextFunction){
    var stream = new Readable();
    let _body = req.body.toString()
    stream.push(_body, "utf-8");
    stream.push(null);
    stream['headers'] = req.headers;

    let chunks = [];
    stream.on("data", (_chunk) => {
        console.log(_chunk)
        chunks.push(_chunk)
    })

    stream.on("end", () => {
        let result = Buffer.concat(chunks).toString()
        res.json(JSON.stringify(result))
    })
    // let parsed = await parseData(stream);
    // console.log(parsed)
    // console.log(parsed)
    // res.json(parsed)
}

async function parseData(stream) {
    let promise : Promise<IInBound> =  new Promise((resolve, reject) => {
      // Instance
      let form = new Formidable.IncomingForm();
      // Initialize
    //   form.encoding = 'utf-8';
      form.keepExtensions = true;
      form.maxFieldsSize = 20 * 1024 * 1024;
      form.maxFileSize = 200 * 1024 * 1024;
  
  
      return form.parse(stream, (err, fields : any, files : any) => {
        // Work with your parsed form results here.
        if (err) {
          reject(err)
        } else {
          resolve({
            fields: fields,
            files: files
          });
        }
      });
    })
    return await promise;
  }