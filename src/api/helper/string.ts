import * as _ from "lodash"

export function removeSpacesFromString(text : string){
    // return text.replace(/(\r\n\t|\n|\r\t)/g, ' ');
    return _.trim(text);
}