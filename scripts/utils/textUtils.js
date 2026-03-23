import {
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_SPACING,
  PTS_PER_INCH
} from "../config.js";

/**
 * 计算文本布局高度（适用于水平文本）
 * @param {string} text - 文本内容
 * @param {number} fontSize - 字号
 * @param {number} w - 宽度
 * @returns {number} 计算后的高度
 */
export function calculateTextLayoutHeight(text, fontSize, w) {
  const maxCharsPerLine = Math.floor((w * PTS_PER_INCH) / fontSize);
  const paragraphs = text.split('\n');
  let totalLines = 0;
  paragraphs.forEach(p => {
    totalLines += Math.max(1, Math.ceil(p.length / maxCharsPerLine));
  });
  const h = (totalLines * fontSize * DEFAULT_LINE_SPACING) / PTS_PER_INCH;
  return h;
}

/**
 * 计算垂直文本布局高度（已废弃，保留向后兼容）
 * @deprecated 请使用 calculateTextLayoutHeight
 */
export function calculateVerticalTextLayout(text, fontSize, w) {
  return calculateTextLayoutHeight(text, fontSize, w);
}

export function calculateRotationCompensation(w, h) {
  return (w - h) / 2;
}

export function addRotatedText(slide, text, opts) {
  const fontSize = opts.fontSize || DEFAULT_FONT_SIZE;
  const w = opts.w || 5;
  const xTarget = opts.x || 0;
  const yTarget = opts.y || 0;
  const h = calculateVerticalTextLayout(text, fontSize, w);
  const compensation = calculateRotationCompensation(w, h);

  slide.addText(text, {
    ...opts,
    x: xTarget - compensation,
    y: yTarget + compensation,
    w: w,
    h: h,
    rotate: -90,
    align: opts.align || "center",
    valign: opts.valign || "middle"
  });

  return { calculatedW: w, calculatedH: h };
}