import { IPage } from "./IPage.js";
import { COLORS, LAYOUT_WIDTH, LAYOUT_HEIGHT } from "../config.js";

export class SellPointPage extends IPage {
    constructor(slide, data = {}, options = {}) {
        super(slide, data, options);
        this.textArr = []; // 文本数组
    }

    // push 文本
    pushText(text, color = COLORS.BLACK) {
        const item = {
            text: text,
            options: {
                color: color,
            }
        }
        this.textArr.push(item);
    }

    render() {
        // 循环读取data，添加到textArr中
        for (let key in this.data) {
            this.pushText(this.data[key]);
        }

        // 渲染文本
        this.slide.addText(this.textArr, {
            x: 0,
            y: 0,
            w: LAYOUT_WIDTH,
            h: LAYOUT_HEIGHT,
            align: "left",
            valign: "middle",
            fontSize: 24,
            bold: true,
            fontFace: "微软雅黑",
        })
    }
}