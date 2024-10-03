import { fetchData } from "$lib/request/requestData";

/**
 * Classe que representa um tipo complexo.
 *
 * @class
 * @classdesc Esta classe descreve um tipo complexo com várias informações.
 * @param {string} name - O nome do tipo complexo.
 * @param {string|null} baseConcept - O tipo complexo de base (pode ser nulo se não houver base).
 * @param {ElementProperty[]} elementProperties - Um array de propriedades de elemento.
 */
export class ComplexType {
    /**
     * @param {string} name - O nome do conceito.
     * @param {string|null} baseConcept - O conceito de base (pode ser nulo se não houver base).
     * @param {ElementProperty[]} elementProperties - Um array de propriedades de elemento.
    */
    constructor(name, baseConcept, elementProperties = []) {
        this.name = this.removerTipoDaString(name)
        this.baseConcept = baseConcept
        this.elementProperties = elementProperties
    }

    
   /**
     * Remove a palavra "Type" do final de uma string.
     * @param {string} str - A string da qual a palavra "Type" deve ser removida.
     * @returns {string} A string resultante após a remoção.
     */
   removerTipoDaString(str) {
        // Verifica se a string termina com a palavra "Type"
        if (str && str.endsWith("Type")) {
        // Remove "Type" do final da string
            return str.slice(0, -4);
        }
        // Se a string não terminar com "Type", retorna a string original
        return str;
    }

    /**
     * Set properties
     * @param {ElementProperty[]} elementProperties
     */
    setElementProperties(elementProperties) {
        this.elementProperties = elementProperties
    }
}


/**
 * Classe que representa uma propriedade de elemento.
 *
 * @class
 * @classdesc Esta classe descreve uma propriedade de elemento com várias informações.
 * @param {number} maxOccurs - O número máximo de ocorrências desta propriedade.
 * @param {number} minOccurs - O número mínimo de ocorrências desta propriedade.
 * @param {string} name - O nome da propriedade.
 * @param {boolean} nillable - Indica se a propriedade pode ser nula.
 * @param {string} typeVar - O tipo da propriedade.
 */
export class ElementProperty {
    /**
    * @param {number} maxOccurs - O número máximo de ocorrências desta propriedade.
    * @param {number} minOccurs - O número mínimo de ocorrências desta propriedade.
    * @param {string} name - O nome da propriedade.
    * @param {boolean} nillable - Indica se a propriedade pode ser nula.
    * @param {string} typeVar - O tipo da propriedade.
     */
    constructor(maxOccurs, minOccurs, name, nillable, typeVar) {
        this.maxOccurs = maxOccurs
        this.minOccurs = minOccurs
        this.name = name
        this.nillable = nillable
        this.typeVar = this.removerPrefixo(typeVar)
    }

    /**
     * @param {string} str
     */
    removerPrefixo(str) {
        // Use uma expressão regular para encontrar o prefixo de 3 letras seguido por dois pontos
        const regex = /^[a-zA-Z]{3}:/;
      
        // Use o método replace() para remover o prefixo
        return str.replace(regex, "");
      }
}

/**
 * Converte uma string XML em um objeto Document usando DOMParser.
 *
 * @param {string} xmlString - A string contendo um documento XML.
 * @returns {Document} - Um objeto Document representando o documento XML analisado.
 * @throws {DOMException} - Lança uma exceção se ocorrer um erro durante a análise XML.
 */
function xmlDocument(xmlString) {
    /**
     * @type {DOMParser}
     */
    const parser = new DOMParser();

    /**
     * @type {Document}
     */
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return xmlDoc;
}

  
  /**
 * @param {NodeList} nodeList
 */
  export function nodeListAsComplexTypeArray(nodeList) {
    let complexTypeArray = []
    for (const node of nodeList) {
        if (!node.attributes[0]?.nodeValue)
            continue
        const name = node.attributes[0]?.nodeValue
        const baseConcept = node.querySelector("complexContent")?.querySelector("extension")?.attributes[0]?.nodeValue
        let complexType = new ComplexType(name, baseConcept)
        const nodeSequence = node.querySelector("complexContent")?.querySelector("extension")?.querySelector("sequence")
        if (!nodeSequence)
            continue
        /**
         * @type {ElementProperty[]}
         */
        let elementPropertyArray = []
        for (const no of nodeSequence?.children) {
            const attributes = no.attributes
            if (!attributes)
                continue
            const maxOccurs = parseInt(attributes[0]?.nodeValue || "0")
            const minOccurs = parseInt(attributes[1]?.nodeValue || "0")
            const name = attributes[2]?.nodeValue
            const nillable = Boolean(attributes[3]?.nodeValue)
            const typeVar = attributes[4]?.nodeValue
            const property = new ElementProperty(maxOccurs, minOccurs, name, nillable, typeVar)
            elementPropertyArray.push(property)
        }
        complexType.setElementProperties(elementPropertyArray)
        complexTypeArray.push(complexType)
    }
    return complexTypeArray
  }

  /**
   * Returns the schema from describeFetureType.
   * url must address operation describeFetureType from WFS service
   * @returns {Promise<string>}
   * @param {String} url
 
 */
  async function describeFeatureTypeSchema(url) {
    let res = await fetchData(url)
    return await res.text()
  }

  /**
 * @param {string} xmlString
 */
  export async function complexTypeList(xmlString) {
    const xmlDoc = xmlDocument(xmlString)
    /**
       * @type {ComplexType[]}
       */
    let complexTypeArray = []
    let nodeList = xmlDoc.querySelectorAll("complexType")
    if (nodeList.length == 0) {
        nodeList = xmlDoc.querySelectorAll("import")
        for (const node of nodeList) {
            const url = node.attributes[1]?.nodeValue
            const a_xmlString = await describeFeatureTypeSchema(url)
            const a_xmlDoc = xmlDocument(a_xmlString)
            let nodeList = a_xmlDoc.querySelectorAll("complexType")
            complexTypeArray = complexTypeArray.concat(nodeListAsComplexTypeArray(nodeList))
        }
         
    } else {
        complexTypeArray = nodeListAsComplexTypeArray(nodeList)
    }
    return complexTypeArray
  }