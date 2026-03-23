import { LAYOUT_WIDTH, LAYOUT_HEIGHT, COLORS } from "../config.js";
import { IPage } from "./IPage.js";
import { calculateBestFontSize } from "../utils/textUtils.js";


export class FinalDescPage extends IPage {
    constructor(slide, data = {}, options = {}) {
        super(slide, data, options);
    }

    render() {
        const textArr = [
            "到手：", "商品名+规格数量", "总计最小规格数量"
        ];

        const bestFontSize = calculateBestFontSize(textArr);

        let arr = [
            {
                text: textArr[0] + "\n",
                options: {
                    color: COLORS.BLACK,
                }
            },
            {
                text: textArr[1] + "\n",
                options: {
                    color: COLORS.BLACK,
                }
            },
            {
                text: textArr[2],
                options: {
                    color: COLORS.RED,
                }
            }
        ];

        this.slide.addText(arr, {
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