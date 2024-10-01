import { BaseLayer } from "$lib/component/base/BaseLayer"
import {MetadataURL} from '$lib/component/ogc_commom/metadataURL.js';

function nodeValue(node) {
    return node['#text'] || node['#cdata-section']
}

class EXGeographicBoundingBox{
    constructor(exGeographicBoundingBoxObject) {
        this.exGeographicBoundingBoxObject = exGeographicBoundingBoxObject
    }

    westBoundLongitude() {
        return parseFloat(nodeValue(this.exGeographicBoundingBoxObject['westBoundLongitude']))
    }

    eastBoundLongitude() {
        return parseFloat(nodeValue(this.exGeographicBoundingBoxObject['eastBoundLongitude']))
    }
    
    southBoundLatitude() {
        return parseFloat(nodeValue(this.exGeographicBoundingBoxObject['southBoundLatitude']))
    }

    northBoundLatitude() {
        return parseFloat(nodeValue(this.exGeographicBoundingBoxObject['northBoundLatitude']))
    }
}
class Style {
    constructor(styleObject) {
        this.styleObject = styleObject
        this.name = this._name()
        this.title = this._title()
        this.abstract = this._abstract()
        this.legendGraphicURL = null
        this.legendGraphicFormat = null
        if (this.legendGraphic()) {
            this.legendGraphicURL = this.legendGraphic().link()
            this.legendGraphicFormat = this.legendGraphic().contentType()
        }
            
        
    }
    
    objCapability(propertyName) {
        
        let obj = this.styleObject[propertyName]
        if (!obj)
            return null
        const isEmpty = Object.keys(obj).length === 0;
        if (isEmpty)
            return null
        return obj['#text']
    }

    _name() {
        return this.objCapability('Name')
    }

    _title() {
        return this.objCapability('Title')
    }

    _abstract() {
        return this.objCapability('Abstract')
    }

    legendGraphic() {
        let lGraphic = new LegendGraphic(this.styleObject['LegendURL'])
        return lGraphic
    }
}


class LegendGraphic {
    constructor(legendGraphicObject) {
        this.legendGraphicObject = legendGraphicObject
    }

    width() {
        return parseInt(this.legendGraphicObject['@attributes']['width'])
    }

    height() {
        return parseInt(this.legendGraphicObject['@attributes']['height'])
    }

    contentType() {
        return nodeValue(this.legendGraphicObject['Format'])
    }

    link() {
        return this.legendGraphicObject['OnlineResource']['@attributes']['xlink:href']
    }

    linkType() {
        return this.legendGraphicObject['OnlineResource']['@attributes']['xlink:type']
    }

    linkNamespace() {
        return this.legendGraphicObject['OnlineResource']['@attributes']['xmlns:xlink']
    }

}

export class WMSLayer extends BaseLayer {
    
    /**
     * @param {any} wmsLayerCapability
     * @param {any} sourceLayer
     */
    constructor(wmsLayerCapability, oid = null, sourceLayer = null, layer=null) {
        super(layer);
        this.wmsLayerCapability = wmsLayerCapability
        this.sourceLayer = sourceLayer
        this.oid = oid?oid:WMSLayer.inc;
        this.styles_ = null;   
    }
    
    remove() {
        if (this.sourceLayer)
            this.sourceLayer.remove()
    }
    /**
     * @param {string} propertyName
     */
    objCapability(propertyName) {
        let obj = this.wmsLayerCapability[propertyName]
        if (obj)
            return nodeValue(obj)
        return null    
    }
    
    name(){
        return this.objCapability('Name')   
    }
    
    title(){
        return this.objCapability('Title')
    }

    description() {
        return this.title() || this.name() || 'sem título e nome'
    }
    abstractLayer(){
        return this.objCapability('Abstract')
    }
    
    keywords(){
        let keywordList = this.wmsLayerCapability['KeywordList']
        if (!keywordList)
            return null
        let keywords = keywordList['Keyword']
        if (keywords)
            if (Array.isArray(keywords))
                return keywords.map(keyword => keyword['#text'] || keyword['cdata-section'] )
            else
                return keywords['#text'] || keywords['cdata-section']
        return null
    }
    
    crss() {
        let crsObj = this.wmsLayerCapability['CRS']
        if (Array.isArray(crsObj))
            return crsObj.map(cObj => nodeValue(cObj))
        return [nodeValue(crsObj)]
    }
    
    exGeographicBoundingBox(){
        return new EXGeographicBoundingBox(this.wmsLayerCapability['EX_GeographicBoundingBox'])
    }
    
    boundingBoxes(){
        let bboxes = this.wmsLayerCapability['BoundingBox']
        if (bboxes)
            return bboxes.map(bbox => bbox['@attributes'])
        return []
    }
    extent() {
        let bbox = this.boundingBoxes()[0]
        return [bbox.minx, bbox.miny, bbox.maxx, bbox.maxy]
    }
    styles(){
        if (!this.styles_) {
            let sty_arr = this.wmsLayerCapability['Style']
            if (Array.isArray(sty_arr))
                this.styles_ = sty_arr.map( st => new Style(st))
            else {
                let st = this.wmsLayerCapability['Style']
                if (st)
                    this.styles_ = [new Style(st)]
            }
                
        }
            
        return this.styles_
    }
    styleTitle() {
        if (this.style() && this.style().title())
            return this.style().title()
        return ''
    }

    metadataURLs() {
        let metadataObjs = this.wmsLayerCapability['MetadataURL']
        if (metadataObjs) {
            if (Array.isArray(metadataObjs))
                return metadataObjs.map( metadataObj => new MetadataURL(metadataObj))
            
            return [new MetadataURL(metadataObjs)]
        }
            
        return null
    }
    layers() {
        let wmsLayers = this.wmsLayerCapability['Layer'];
        //console.log("this.wmsLayerCapability---> ", this.wmsLayerCapability);
        //console.log("wmsLayers---> ", wmsLayers);
        if (!wmsLayers)
            return [];
        if (Array.isArray(wmsLayers))
            return wmsLayers.map(layer => new WMSLayer(layer, null, null)); 
        return [wmsLayers]
    }
}