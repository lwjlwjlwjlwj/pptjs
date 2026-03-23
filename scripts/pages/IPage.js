export class IPage {
    constructor(slide, data = {}, options = {}) {
        this.slide = slide;
        this.data = data;
        this.options = options;
    }
    render() {
        throw new Error("Method not implemented.");
    }
}