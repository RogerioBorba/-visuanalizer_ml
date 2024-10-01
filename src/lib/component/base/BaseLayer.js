export class BaseLayer {
    static inc = 0;
    /**
     * @param {any} aLayer
     */
    constructor(aLayer) {
        this.layer = aLayer;
        this.className = this.constructor.name;
        BaseLayer.inc++;
    }


}