export class MetadataURL {
    // metadataObject is json object from WxS capabilities['MetadataURL']
    constructor(metadataObject) {
        this.metadataObject = metadataObject
    }
    
    type() {
        return this.metadataObject['@attributes']?.['type']
    }

    contentType() {
        return nodeValue(this.metadataObject['Format'])
    }

    link() {
        
        return this.metadataObject['OnlineResource']['@attributes']['xlink:href']
    }

    linkType() {
        return this.metadataObject['OnlineResource']['@attributes']['xlink:type']
    }

}