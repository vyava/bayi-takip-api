export function removeSpacesFromString(text : string){
    return text.replace(/[\r\n\t ]/g, '');
}