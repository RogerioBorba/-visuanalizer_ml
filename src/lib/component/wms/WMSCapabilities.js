/*
WMS_Capabilities
    Service
        Name
        Title
        Abstract
        KeywordList
    Capability
*/
import {WMSLayer} from './WMSLayer'

export class WMSCapabilities {
    /**
     * @param {any} xmlObject
     */
    constructor(xmlObject) {
        this.xmlObject = xmlObject
    }
    
    /**
     * @param {{ [x: string]: any; }} node
     */
    nodeValue(node) {
        return node['#text'] || node['#cdata-section']
    }

    /**
     * @param {{ [x: string]: any; }} obj
     * @param {string | number} filterKey
     * @param {any} filterValue
     */
    filterObject (obj, filterKey, filterValue) { 
        return Object.keys(obj).reduce((acc, val) => 
                (obj[val][filterKey] !== filterValue ? acc : {...acc,[val]: obj[val]}                                        
        ), {})
    }
     
    /**
     * @param {string} xmlString
     */
    convertToXmlObject(xmlString) {
               
        if (!this.xmlObject['WMS_Capabilities']) {
            if (this.xmlObject['ServiceExceptionReport']){
                console.log(this.xmlObject['ServiceExceptionReport'])
                console.log('Url ou caminho: ', this.url)
                this.xmlObject = null
                throw Error("Houve uma exceção. O xml lido não tem o formato do WMS getCapabilities!")
            }
            throw Error("O xml lido não tem o formato do WMS getCapabilities!")
            return null
        }
        return this.xmlObject
    }
      
    /**
     * @param {string} anUrlOrFileNameWithPath
     */
    isURL(anUrlOrFileNameWithPath){
        const urlOrFileNameWithPath = anUrlOrFileNameWithPath.toLowerCase()
        return urlOrFileNameWithPath.search(/(http:|https:)/) > -1
    }
    
    getXmlObject() {
        return this.xmlObject
    }
    
    wmsCapabilities() {
        const xmlObj = this.getXmlObject()
        if(!xmlObj)
            return null
        return xmlObj['WMS_Capabilities']
    }
    
    version() {
        const wmsCapabilitiesObj = this.wmsCapabilities()
        if(!wmsCapabilitiesObj)
            return null
        let obj = wmsCapabilitiesObj['@attributes']
        return obj['version']
    }
    
    //Service is a element providing general metadata for the server as a whole.
    service() {
        const xmlObj = this.getXmlObject()
        if (!xmlObj)
            return null
        return xmlObj['WMS_Capabilities']['Service']
    }
    
    //The Name is a text string used for machine-to-machine communication 
    serviceName() {
        const serv = this.service()
        return this.nodeValue(serv['Name'])
    }
    
    //Tthe Title is for the benefit of humans communication 
    serviceTitle() {
        const serv = this.service()
        return this.nodeValue(serv['Title'])
    }
    
    //Optional service metadata
    serviceAbstract() {
        let serv = this.service()
        serv = serv['Abstract']
        if (!serv)
            return null
        return this.nodeValue(serv)
    }
    
    //Optional service metadata
    serviceKeywords() {
        const serv = this.service()
        const keyWords = serv['KeywordList']
        if (keyWords) {
           const keys = keyWords['Keyword']
           //return keys[0]['#text']
           return keys.map((element) => { return this.nodeValue(element)});
        }
        return null
    }
    
    serviceOnlineResource() {
        const serv = this.service()
        return serv['OnlineResource'][0]['$']
    }
    
    serviceMaxWidth() {
        const serv = this.service()
        if (!serv)
            return null
        const maxWidth = serv['MaxWidth']
        if (!maxWidth)
            return null
        return maxWidth[0]
    }
    
    serviceMaxHeight() {
        const serv = this.service()
        if (!serv)
            return null
        const maxHeight = serv['MaxHeight']
        if (!maxHeight)
            return null
        return maxHeight[0]
    }
    
    serviceContactInformation() {
        let serv = this.service()
        return serv['ContactInformation']    
    }
    
    serviceContactPersonPrimary() {
        let serv = this.serviceContactInformation()
        if (!serv)
            return null
        return serv['ContactPersonPrimary']
    }
    
    serviceContactInformationPerson() {
        let serv =  this.serviceContactPersonPrimary()
        if (!serv)
            return null
        return serv['ContactPerson']
    }
     
    serviceContactInformationOrganization() {
        let serv =  this.serviceContactPersonPrimary()
        if (!serv)
            return null
        return this.nodeValue(serv['ContactOrganization'])
    }
    
    serviceContactInformationPosition() {
        let serv =  this.serviceContactInformation()
        return serv['ContactPosition']
    }
    
    serviceContactInformationAdress() {
        let serv =  this.serviceContactInformation()
        return serv['ContactAddress']
    }
    
    serviceContactInformationTelefone() {
        let serv =  this.serviceContactInformation()
        return serv['ContactVoiceTelephone']
    }
    
    serviceContactInformationFax() {
        let serv =  this.serviceContactInformation()
        return serv['ContactFacsimileTelephone']
    } 
    
    serviceContactInformationeMail() {
        let serv =  this.serviceContactInformation()
        if (!serv)
            return null
        serv = serv['ContactElectronicMailAddress']
        if (!serv)
            return null    
        return this.nodeValue(serv)
    }
    
    serviceFees() {
        let serv =  this.service()
        return serv['Fees']
    }
    
    serviceAccessConstraints() {
        let serv =  this.service()
        return serv['AccessConstraints']
    }
    
    //names the actual operations that are supported by the server
    
    capability() {
        const cap = this.wmsCapabilities()
        if (!cap)
            return null    
        return cap['Capability']
    }

    capabilityException() {
        const capa = this.capability()
    
        if (!capa)
            return null
        return capa['Exception']
        //return keys.map((element) => { return element['#text']});
    }

    capabilityExceptionFormat() {
        let capa = this.capabilityException()
        if(!capa)
            return null
        capa = capa['Format']
        if (!capa)
            return null
        return capa.map((element) => { return this.nodeValue(element)});
    }

    capabilityRequest() {
        const request = this.capability()
        return request['Request']
    }
    
    capabilityRequestGetCapabilities() {
        const operations =  this.capabilityRequest()
        if (!operations)
            return null
        return operations['GetCapabilities']
    }

    capabilityRequestGetCapabilitiesDCPType() {
        const operations =  this.capabilityRequestGetCapabilities()
        if (!operations)
            return null
        return operations['DCPType']
    }

    capabilityRequestGetCapabilitiesDCPTypeHTTP() {
        const operations =  this.capabilityRequestGetCapabilitiesDCPType()
        if (!operations)
            return null
        return operations['HTTP']
    }

    capabilityRequestGetCapabilitiesDCPTypeHTTPGet() {
        const operations =  this.capabilityRequestGetCapabilitiesDCPTypeHTTP()
        if (!operations)
            return null
        return operations['Get']
    }

    capabilityRequestGetCapabilitiesDCPTypeHTTPPost() {
        const operations =  this.capabilityRequestGetCapabilitiesDCPTypeHTTP()
        if (!operations)
            return null
        return operations['Post']
    }

    capabilityRequestGetFeatureInfo() {
        const operations =   this.capabilityRequest()
        if (!operations)
            return null
        return  operations['GetFeatureInfo']
    }

    capabilityRequestGetFeatureInfoDCPType() {
        const operations =  this.capabilityRequestGetFeatureInfo()
        if (!operations)
            return null
        return operations['DCPType']
    }

    capabilityRequestGetFeatureInfoDCPTypeHTTP() {
        const operations =  this.capabilityRequestGetFeatureInfoDCPType()
        if (!operations)
            return null
        return operations['HTTP']
    }

    capabilityRequestGetFeatureInfoDCPTypeHTTPGet() {
        const operations =  this.capabilityRequestGetFeatureInfoDCPTypeHTTP()
        if (!operations)
            return null
        return operations['Get']
    }

    capabilityRequestGetFeatureInfoFormat() {
        const operations =  this.capabilityRequestGetFeatureInfo()
        if (!operations)
            return null

        const capa = operations['Format']
        if (!capa)
            return null
        return capa.map((element) => { return this.nodeValue(element)});
    }

    capabilityRequestGetMap() {
        const operations =   this.capabilityRequest()
        if (!operations)
            return null
        return  operations['GetMap']
    }

    capabilityRequestGetMapDCPType() {
        const operations =  this.capabilityRequestGetMap()
        if (!operations)
            return null
        return operations['DCPType']
    }

    capabilityRequestGetMapDCPTypeHTTP() {
        const operations =  this.capabilityRequestGetMapDCPType()
        if (!operations)
            return null
        return operations['HTTP']
    }

    capabilityRequestGetMapDCPTypeHTTPGet() {
        const operations =  this.capabilityRequestGetMapDCPTypeHTTP()
        if (!operations)
            return null
        return operations['Get']
    }

    capabilityRequestGetMapDCPTypeHTTPPost() {
        const operations =  this.capabilityRequestGetMapDCPTypeHTTP()
        if (!operations)
            return null
        return operations['Post']
    }

    capabilityRequestGetMapFormat() {
        const operations =   this.capabilityRequestGetMap()
        if (!operations)
            return null
        const capa = operations['Format']
        if (!capa)
            return null
        return capa.map((element) => { return element['#text']});
    }
     
    capabilityRequestParentLayer() {
        const operations =  this.capability()
        
        if (!operations)
            return null
        return operations['Layer']
        
    }
     
    parentLayerName() {
        const cl =   this.capabilityRequestParentLayer()
        if (!cl)
            return null
        const ly =  cl['Name']
        if (!ly)
            return null
        return this.nodeValue(ly)    
    }

    parentLayerTitle() {
        const cl =   this.capabilityRequestParentLayer()
        if (!cl)
            return null
        const ly =  cl['Title']
        if (!ly)
            return null
        return this.nodeValue(ly)   
    }
     
    parentLayerAbstract() {
        const cl =   this.capabilityRequestParentLayer()
        if(!cl)
            return null
        const ly = cl['Abstract']
        if (!ly)    
            return null
        return  this.nodeValue(ly)
    }
    
    //Limited list of EPSG projections
    parentLayerCRSs() {
        const cl =   this.capabilityRequestParentLayer()
        const crss =  cl['CRS']
        if(!crss)
            return null
        return crss.map((element) => { return this.nodeValue(element)});
    }
    
    /* EX_GeographicBoundingBox is to facilitate geographic searches without requiring coordinate
    transformations by the search engine */
     parentLayerEXGeographicBoundingBox() {
        const cl =   this.capabilityRequestParentLayer()
        if (!cl)
            return null
        const crss =  cl['EX_GeographicBoundingBox']
        return  crss
    }

    parentLayerEXGeographicBoundingBoxWestBoundLongitude() {
        let ly = this.parentLayerEXGeographicBoundingBox()
        if (!ly)
            return null
        ly = ly['westBoundLongitude']
        if (!ly)
            return null
        return this.nodeValue(ly)
    }

    parentLayerEXGeographicBoundingBoxEastBoundLongitude() {
        let ly = this.parentLayerEXGeographicBoundingBox()
        if (!ly)
            return null
        ly = ly['eastBoundLongitude']
        if (!ly)
            return null
        return this.nodeValue(ly)
    }

    parentLayerEXGeographicBoundingBoxSouthBoundLatitude() {
        let ly = this.parentLayerEXGeographicBoundingBox()
        if (!ly)
            return null
        ly = ly['southBoundLatitude']
        if (!ly)
            return null
        return this.nodeValue(ly)    
    }
    
    parentLayerEXGeographicBoundingBoxNorthBoundLatitude() {
        let ly = this.parentLayerEXGeographicBoundingBox()
        if (!ly)
            return null
        ly = ly['northBoundLatitude']
        if (!ly)
            return null
        return this.nodeValue(ly)
    }
    
    parentLayerBoundingBox() {
        const cl =   this.capabilityRequestParentLayer()
        return  cl['BoundingBox']
        
    }
    

    layerHasChildren(layer) {
        if(!layer)
            return false
        let children = layer['Layer'];
        
        if(Array.isArray(children))
            return true;
        if (children)
            return true;
        return  false;

    }

    children(layer) {
        let array_child = layer['Layer'];
        if(!array_child)
            return [];
        if(this.layerHasChildren(layer)) {
            array_child = layer['Layer'];
            if(Array.isArray(array_child))
                return array_child;
            else
                return [array_child];
        }
            
    }

    layerTreeObjects(layer) {
     /*
     + layer 
        + layer
        + layer
            + layer
                + layer
                + layer
            + layer
        + layer
     */
        let layersFromTree = [];
        //Layer sem nome é apenas um elemento organizador, uma categoria e não um layer 
        if (layer['Name']) 
            layersFromTree.push(layer);
        
        if (this.layerHasChildren(layer)) {
            
            let children = this.children(layer) ;
            children.forEach(child => { layersFromTree = layersFromTree.concat(this.layerTreeObjects(child))});
        }
        return layersFromTree;

    }
    layersFromTree() {
        if (!this.capabilityRequestParentLayer())
            return null
        return this.layerTreeObjects(this.capabilityRequestParentLayer());
    }
    lenLayersFromTree() {
        const ls =  this.layersFromTree()
        if (!ls)
            return 0
        return  Object.keys(ls).length
    }

    layerObjects() {
        const cl =   this.capabilityRequestParentLayer()
        if (!cl)
            return null
        let lays =  cl['Layer']
        if (!lays)
            return []
        if (!Array.isArray(lays))
            return [lays]        
        return lays
        
    }

    lenLayerObjects() {
        
        const ls =  this.layerObjects()
        if (!ls)
            return 0
        return  Object.keys(ls).length
    }
     
     
    //A server should use one or more <MetadataURL>
     metadataURLObjects() {
        const layers =  this.layerObjects()
        const metadataObjects =  layers.map((layerObj) => {
           return layerObj['MetadataURL']
        })
        return metadataObjects
    }
    
    layerObjectsWithoutMetadata() {
        const layers =  this.layerObjects()
        if (!layers)
            return null
        
        const layerObjects =  layers.filter((layerObj) => {
           return !layerObj['MetadataURL']
        })
        return layerObjects
    }

    layerTreeWithoutMetadata() {
        const layers =  this.layersFromTree();
        if (!layers)
            return null
        
        const layerObjects =  layers.filter((layerObj) => {
           return !layerObj['MetadataURL']
        })
        return layerObjects

    }
    
    allKeywords() {
        const layers =  this.layersFromTree()
        let arr = []
        if (!layers)
            return []
        const layerObjects =  layers.filter((layerObj) => {
           return layerObj && layerObj['KeywordList'] && layerObj['KeywordList']['Keyword'] 
        })
        
        for(let i =0; i < layerObjects.length; i++) {
            let innerArr = layerObjects[i]['KeywordList']['Keyword']
            innerArr = Array.isArray(innerArr)?innerArr: [innerArr]
            innerArr.forEach(element => {
                arr.push(this.nodeValue(element))
            });
        }
        return arr
    }

    layerObjectsWithoutKeyword() {
        const layers =  this.layersFromTree()
        if (!layers)
            return []
        
        const layerObjects =  layers.filter((layerObj) => {
           return !layerObj['KeywordList']
        })
        return layerObjects
    }

    layerTreeWithoutKeyword() {
        const layers =  this.layersFromTree()
        
        if (!layers)
            return []
        
        const layerObjects =  layers.filter((layerObj) => {
           return layerObj.KeywordList == undefined ||
                  layerObj.KeywordList == null ||
                  layerObj.KeywordList.Keyword == undefined

           

        })
        return layerObjects
    }

    layerNamesWithoutMetadata() {
        const layerObjects =  this.layerObjectsWithoutMetadata()
        const arr_metadados =  layerObjects.map((layerObj) => { return layerObj['Name']})
        return arr_metadados.join(',')
    }
     
    layerTitlesWithoutMetadata() {
        const layerObjects =  this.layerObjectsWithoutMetadata()
        const arr_metadados =  layerObjects.map((layerObj) => { return layerObj['Title']})
        return arr_metadados.join(',')
    }
    

     lenLayerObjectsWithoutMetadata() {
        const layerObjects =  this.layerObjectsWithoutMetadata()
        if (!layerObjects)
            return null
        return  layerObjects.length
    }
    
    lenTreeLayerObjectsWithoutMetadata() {
        const layerObjects =  this.layerTreeWithoutMetadata()
        if (!layerObjects)
            return null
        return  layerObjects.length
    }

     lenMetadataURL() {
        const metadados =  this.metadataURLObjects()
        if (!metadados)
            return null
        //const arr =  metadados.filter(metadata => {return metadata} )
        return metadados.length
    }

    lenLayerObjectsWithoutKeyword() {
        const layerObjs = this.layerObjectsWithoutKeyword()
        if (!layerObjs)
            return 0
        return layerObjs.length
    }

    lenTreeLayerWithoutKeyword() {
        const layerObjs = this.layerTreeWithoutKeyword()
        if (!layerObjs)
            return 0
        return layerObjs.length
    }

    layerCRSObjects() {
        const layers =  this.layerObjects()
        const crsObjects =  layers.map((layerObj) => {
           return layerObj['CRS']
        })
        return crsObjects
    }
    
    layerKeywordsObjects() {
        const layers =  this.layerObjects()
        let i = 1
        const wmsLayers =  layers.map(layerObj => new WMSLayer(layerObj, i++, null))
        let wmsLayersFiltered = wmsLayers.filter(wmsLayer => wmsLayer.keywords() != null && wmsLayer.keywords() != undefined )
        let allKeywords = []
        return allKeywords
    }

    wmsLayersFilteredBygeographicBoundingBox(boundingBox, sourceLayer = null) {
        let i = 1;
        let layers = this.layerObjects();
        if (!layers) return [];
    
        const wmsLayers = layers.map(layerObj => new WMSLayer(layerObj, i++, sourceLayer));
        wmsLayers.forEach(wms => console.log("referencia geográfica", JSON.stringify(wms.exGeographicBoundingBox())));
    
        const boundingBoxWest = parseFloat(boundingBox[0].westBoundLongitude);
        const boundingBoxEast = parseFloat(boundingBox[0].eastBoundLongitude);
        const boundingBoxSouth = parseFloat(boundingBox[0].southBoundLatitude);
        const boundingBoxNorth = parseFloat(boundingBox[0].northBoundLatitude);
    
        return wmsLayers.filter(wmsLayer => {
            const wmsBoundingBox = wmsLayer.exGeographicBoundingBox();
            const wmsWest = wmsBoundingBox.westBoundLongitude();
            const wmsEast = wmsBoundingBox.eastBoundLongitude();
            const wmsSouth = wmsBoundingBox.southBoundLatitude();
            const wmsNorth = wmsBoundingBox.northBoundLatitude();
    
            console.log(`Checando WMS Layer: West ${wmsWest}, East ${wmsEast}, South ${wmsSouth}, North ${wmsNorth}`);
            console.log(`Checando BOUNDING BOX Layer: West ${boundingBoxWest}, East ${boundingBoxEast}, South ${boundingBoxSouth}, North ${boundingBoxNorth}`);
    
            return (
                wmsWest >= boundingBoxWest &&
                wmsEast <= boundingBoxEast &&
                wmsSouth >= boundingBoxSouth &&
                wmsNorth <= boundingBoxNorth);
        });
    }
   

    wmsLayersFilteredByNameOrTitle(nameOrTitle, sourceLayer=null) {
        let i = 1
        let layers = this.layerObjects()
        if (!layers)
            return []
        const wmsLayers =  layers.map(layerObj => new WMSLayer(layerObj, i++, sourceLayer))
        return wmsLayers.filter(wmsLayer => 
            (wmsLayer.title() && wmsLayer.title().toLowerCase().includes(nameOrTitle.toLowerCase())) ||
            (wmsLayer.name() && wmsLayer.name().toLowerCase().includes(nameOrTitle.toLowerCase()))
        )
    }

    wmsLayersFilteredByNameOrTitleOrKeyword(nameOrTitleOrKeyword, sourceLayer=null) {
        let i = 1
        let layers = this.layerObjects()
        if (!layers)
            return []
        const wmsLayers =  layers.map(layerObj => new WMSLayer(layerObj, i++, sourceLayer))
        return wmsLayers.filter(wmsLayer => 
            (wmsLayer.title() && wmsLayer.title().toLowerCase().includes(nameOrTitleOrKeyword.toLowerCase())) ||
            (wmsLayer.name() && wmsLayer.name().toLowerCase().includes(nameOrTitleOrKeyword.toLowerCase())) ||
            (wmsLayer.keywords() &&
              wmsLayer.keywords().toString().toLowerCase().includes(nameOrTitleOrKeyword.toLowerCase())))
    }
   
    hasWMSLayerWithKeywords(keywordsObj) {
        let ands = [];
        let ors = [];
        Object.entries(keywordsObj).forEach(([key, value]) => { key == 'and'? ands.push(value): ors.push(value)});

    }
    includesAll(array1, array2) {
        if (array2.length == 0)
            return true
        
        let keywordListString = array1.toString().toLowerCase();
        for (let i = 0; i < array2.length; i++) {
            if (!keywordListString.includes(array2[i].toLowerCase()))
                return false;
        }
        return true;
    }
    includesAny(array1, array2) {
        if (array2.length == 0)
            return true
        let keywordListString = array1.toString().toLowerCase()  ;
        
        for (let i = 0; i < array2.length; i++) {
            if (keywordListString.includes(array2[i].toLowerCase())) 
                return true;
        }
        return false;
    }

    wmsLayersFilteredByKeywords(keywordsArray, sourceLayer=nully) {
        let i = 1
        let ors = keywordsArray.filter((ikl) => ikl.logicalOperator == 'or').map((ikl) => { return ikl.keyword})
        let ands = keywordsArray.filter((ikl) => ikl.logicalOperator == 'and').map((ikl) => { return ikl.keyword})
        let layers = this.layerObjects()
        if (!layers)
            return []
        const wmsLayers =  layers.map(layerObj => new WMSLayer(layerObj, i++, sourceLayer))
        
        let wmsLayersFiltered = wmsLayers.filter(wmsLayer =>   
            (wmsLayer.keywords() &&
              this.includesAny(wmsLayer.keywords(), ors) &&
              this.includesAll(wmsLayer.keywords(), ands)
              ));
              
        return wmsLayersFiltered
        
    }
}
//module.exports=WMSCapabilities
