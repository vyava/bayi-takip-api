import * as _ from "lodash"

export function removeSpacesFromString(text : string){
    return text.replace(/(\r\n\t?|\n|\r\n)/g, ' ');
    // return text.replace(/[\r\n\t]+|[\r\n\t\t]+|[\r\n]?/g, '');
    // return _.trim(text);
}