import {
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_SPACING,
  PTS_PER_INCH,
  LAYOUT_WIDTH,
  LAYOUT_HEIGHT,
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

/**
 * 计算水平文本的最佳字号
 * @param {Array|string} input - 文本数组 [{text:''}] 或直接传入字符串
 * @param {number} maxWidth - 允许占据的最大宽度 (inches)
 * @param {number} maxHeight - 可选：允许占据的最大高度 (inches)，防止字号过大顶破天花板
 */
export function calculateBestFontSize(input, maxWidth = LAYOUT_WIDTH, maxHeight = LAYOUT_HEIGHT) {
    // 1. 统一处理输入：如果是字符串，转为单元素数组；如果是数组，提取 text 属性
    const lines = Array.isArray(input) 
        ? input.map(item => typeof item === 'object' ? item.text : item)
        : [input];

    // 2. 视觉长度计算函数 (针对中英文混排优化)
    const getVisualLength = (str) => {
        if (!str) return 0;
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            // 中文字符及全角标点算 1，英文字符/数字/半角标点算 0.6
            len += str.charCodeAt(i) > 255 ? 1 : 0.6;
        }
        return len;
    };

    // 3. 找到最长的一行
    const maxVisualLen = lines.reduce((max, curr) => {
        const currentLen = getVisualLength(curr);
        return currentLen > max ? currentLen : max;
    }, 0);

    if (maxVisualLen === 0) return 24; // 兜底字号

    // 4. 计算基于宽度的理想字号
    const safePaddingW = 0.85; // 宽度留白 15%
    let bestSize = (maxWidth * safePaddingW * PTS_PER_INCH) / maxVisualLen;

    // 5. 如果提供了高度限制，进行二次校验
    if (maxHeight) {
        const lineSpacing = 1.2; // 默认行高倍数
        const totalLines = lines.length;
        const safePaddingH = 0.9; // 高度留白 10%
        
        // 计算公式：maxHeight * padding = (fontSize / 72) * lineSpacing * lines
        const sizeLimitByHeight = (maxHeight * safePaddingH * PTS_PER_INCH) / (totalLines * lineSpacing);
        
        // 取宽、高中较小的一个，确保都不溢出
        bestSize = Math.min(bestSize, sizeLimitByHeight);
    }

    // 6. 阈值保护
    const MAX_LIMIT = 120;
    const MIN_LIMIT = 12;
    bestSize = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, bestSize));

    return Math.floor(bestSize);
}