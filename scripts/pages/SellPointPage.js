import { IPage } from "./IPage.js";

export class SellPointPage extends IPage {
    constructor(slide, data = {}, options = {}) {
        super(slide, data, options);
    }

    render() {
        console.log("test");
    }
}