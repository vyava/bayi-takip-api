const mstime = require('mstime');
import { NextFunction, Request, Response, Router } from 'express';
import { ITEMS_PER_PAGE } from './Const';

// Helper functions for Utils.uuid()
const lut = Array(256)
  .fill('')
  .map((_, i) => (i < 16 ? '0' : '') + i.toString(16));
const formatUuid = ({ d0, d1, d2, d3 }: { d0: number; d1: number; d2: number; d3: number }) =>
  lut[d0 & 0xff] +
  lut[(d0 >> 8) & 0xff] +
  lut[(d0 >> 16) & 0xff] +
  lut[(d0 >> 24) & 0xff] +
  '-' +
  lut[d1 & 0xff] +
  lut[(d1 >> 8) & 0xff] +
  '-' +
  lut[((d1 >> 16) & 0x0f) | 0x40] +
  lut[(d1 >> 24) & 0xff] +
  '-' +
  lut[(d2 & 0x3f) | 0x80] +
  lut[(d2 >> 8) & 0xff] +
  '-' +
  lut[(d2 >> 16) & 0xff] +
  lut[(d2 >> 24) & 0xff] +
  lut[d3 & 0xff] +
  lut[(d3 >> 8) & 0xff] +
  lut[(d3 >> 16) & 0xff] +
  lut[(d3 >> 24) & 0xff];

const getRandomValuesFunc =
  typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues
    ? () => {
        const dvals = new Uint32Array(4);
        window.crypto.getRandomValues(dvals);
        return {
          d0: dvals[0],
          d1: dvals[1],
          d2: dvals[2],
          d3: dvals[3]
        };
      }
    : () => ({
        d0: (Math.random() * 0x100000000) >>> 0,
        d1: (Math.random() * 0x100000000) >>> 0,
        d2: (Math.random() * 0x100000000) >>> 0,
        d3: (Math.random() * 0x100000000) >>> 0
      });

/* -------------------------------------------------------------------------------- */

export function uuid() {
  return formatUuid(getRandomValuesFunc());
}

export function startTimer(req: any) {
  mstime.start(req.originalUrl, { uuid: uuid() });
}

export function endTimer(req: any) {
  const end = mstime.end(req.originalUrl);
  if (end) {
    console.log(`avg time - ${end.avg} (ms)`);
    return end;
  }
  return null;
}

// from "sort" string (URL param) => build sort object (mongoose), e.g. "sort=name:desc,age"
export function getSortQuery(sortStr: string, defaultKey = 'createdAt') {
  let arr = [sortStr || defaultKey];
  if (sortStr && sortStr.indexOf(',')) {
    arr = sortStr.split(',');
  }
  let ret = {};
  for (let i = 0; i < arr.length; i += 1) {
    let order = 1; // default: ascending (a-z)
    let keyName = arr[i].trim();
    if (keyName.indexOf(':') >= 0) {
      const [keyStr, orderStr] = keyName.split(':'); // e.g. "name:desc"
      keyName = keyStr.trim();
      order = orderStr.trim() === 'desc' || orderStr.trim() === '-1' ? -1 : 1;
    }
    ret = { ...ret, [keyName]: order };
  }
  return ret;
}

// from "req" (req.query) => transform to: query object, e.g. { limit: 5, sort: { name: 1 } }
export function getPageQuery(reqQuery: any) {
  const output: any = {};
  if (reqQuery.page) {
    output.perPage = reqQuery.perPage || ITEMS_PER_PAGE; // if page is set => take (or set default) perPage
  }

  const numParams = ['page', 'perPage', 'limit', 'offset'];
  numParams.forEach(field => {
    if (reqQuery[field]) {
      output[field] = parseInt(reqQuery[field], 10);
    }
  });
  output.sort = getSortQuery(reqQuery.sort, 'createdAt');
  return output;
}

// function to decorate a promise with useful helpers like: .transform(), etc.
// @example: return queryPromise( this.find({}) )
export function queryPromise(mongoosePromise: any) {
  return new Promise(async resolve => {
    const items = await mongoosePromise;

    // decorate => transform() on the result
    items.transform = () => items.map((item: any) => (item.transform ? item.transform() : item));
    resolve(items);
  });
}

type apiJsonTypes = {
  req: Request;
  res: Response;
  data: any | any[]; // data can be object or array
  model?: any; // e.g. "listModal: User" to get meta.totalCount (User.countDocuments())
  meta?: any;
  json?: boolean; // retrieve JSON only (won't use res.json(...))
};
/**
 * prepare a standard API Response, e.g. { meta: {...}, data: [...], errors: [...] }
 * @param param0
 */
export async function apiJson({ req, res, data, model, meta = {}, json = false }: apiJsonTypes) {
  const queryObj = getPageQuery(req.query);
  const metaData = { ...queryObj, ...meta };

  if (model) {
    // if pass in "model" => query for totalCount & put in "meta"
    const isPagination = req.query.limit || req.query.page;
    if (isPagination && model.countDocuments) {
      const totalCount = await model.countDocuments();
      metaData.totalCount = totalCount;
      if (queryObj.perPage) {
        metaData.pageCount = Math.ceil(totalCount / queryObj.perPage);
      }
    }
  }
  // add Timer data
  const timer = endTimer(req);
  if (timer) {
    metaData.timer = timer.last;
    metaData.timerAvg = timer.avg;
  }

  const output = { data, meta: metaData };
  if (json) {
    return output;
  }
  return res.json(output);
}
