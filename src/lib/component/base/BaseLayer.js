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

    name() {
        throw new Error("The method 'name' must be implemented in subclasses.");
    }
    
    toString() {
        return this.name();  // Chama o método nome() para exibir o nome
      }

}