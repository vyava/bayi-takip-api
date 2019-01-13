import * as express from "express"
import * as validate from "express-validation";
import { IInBound } from "api/interface/incoming.interface";
import * as Formidable from "formidable"
const Stream = require('stream').Readable;
const router = express.Router();

router
    .route("/")
    .post(async (req, res, next) => {
        var stream = new Stream();
        let _body = req.body.toString()
        stream.push(_body);
        stream.push(null);
        stream.headers = req.headers;
        
        let parsed = await parseData(stream);
        console.log(parsed)
        res.status(200)
    });

async function parseData(stream) {
  let promise : Promise<IInBound> =  new Promise((resolve, reject) => {
    // Instance
    let form = new Formidable.IncomingForm();
    // Initialize
    form.encoding = 'utf-8';
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

module.exports = router;