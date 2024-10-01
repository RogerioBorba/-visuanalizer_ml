export function nodeValue(node) {
    if (!node)
        return null
    return node['#text'] || node['#cdata-section']
}

/**
 * @param {string} xmlString
 */
export function xmlDocument(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return xmlDoc

  }