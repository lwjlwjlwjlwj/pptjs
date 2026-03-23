import { LAYOUT_WIDTH, LAYOUT_HEIGHT, COLORS } from "../config.js";
import { addSafeImage } from "../utils/imageUtils.js";
import { calculateTextLayoutHeight } from "../utils/textUtils.js";

export class TopTextBottomImagePage {
  /**
   * @param {Object} slide - PptxGenJS 的 slide 对象
   * @param {Object} data - 内容数据
   * @param {Object} options - 样式配置（可选）
   */
  constructor(slide, data = {}, options = {}) {
    this.slide = slide;
    this.data = {
      text: data.text || "",
      imagePath: data.imagePath || ""
    };
    this.options = {
      fontSize: 40,
      bold: true,
      color: COLORS.RED,
      highlight: COLORS.YELLOW,
      valign: "top",
      rotate: 0,
      align: "center",
      textY: 0,
      ...options
    };
  }

  render() {
    const { text, imagePath } = this.data;
    const { fontSize, bold, color, highlight, valign, rotate, align, textY, ...restOptions } = this.options;

    const textW = LAYOUT_WIDTH - 1;

    // 动态计算文本高度
    const textH = calculateTextLayoutHeight(text, fontSize, textW);

    this.slide.addText(text, {
      x: 0,
      y: textY,
      w: textW,
      h: textH,
      fontSize,
      bold,
      color,
      highlight,
      valign,
      rotate,
      align,
      ...restOptions
    });

    const imageY = textY + textH;
    const imageH = LAYOUT_HEIGHT - imageY;
    addSafeImage(this.slide, imagePath, 0, imageY, LAYOUT_WIDTH, imageH);
  }
}