import { IPage } from "./IPage.js";
import { COLORS } from "../config.js";

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
            fontSize: bestFontSize,
            bold: true,
            lineSpacing: bestFontSize * 1.5,
            fontFace: "微软雅黑",
        })
    }
}