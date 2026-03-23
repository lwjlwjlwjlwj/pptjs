import { LAYOUT_WIDTH, LAYOUT_HEIGHT, COLORS } from "../config.js";
import { addRotatedText } from "../utils/textUtils.js";
import { addRotatedImage } from "../utils/imageUtils.js";

export class LeftTextRightImagePage {
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
      ...options
    };
  }

  render() {
    const { text, imagePath } = this.data;
    const { fontSize, bold, color, highlight, ...restOptions } = this.options;

    // 添加旋转文本
    const textRect = addRotatedText(this.slide, text, {
      x: 0,
      y: 0,
      w: LAYOUT_HEIGHT,
      fontSize,
      bold,
      color,
      highlight,
      ...restOptions
    });

    // 计算图片区域（旋转后的图片需要交换宽高）
    const imgX = textRect.calculatedH;
    const imgW = LAYOUT_WIDTH - imgX;
    const imgH = LAYOUT_HEIGHT;

    // 添加旋转图片
    addRotatedImage(this.slide, imagePath, imgX, 0, imgW, imgH);
  }
}