import sizeOf from "image-size";
import { LAYOUT_HEIGHT, PTS_PER_INCH } from "../config.js";

/**
 * 添加自适应图片（保持比例，防止拉伸）
 * @param {Object} slide - PptxGenJS 的 slide 对象
 * @param {string} imagePath - 图片路径
 * @param {number} xStart - 起始 x 坐标
 * @param {number} yStart - 起始 y 坐标
 * @param {number} maxW - 最大宽度
 * @param {number} maxH - 最大高度
 */
export function addSafeImage(slide, imagePath, xStart, yStart, maxW, maxH) {
  const dimensions = sizeOf(imagePath);
  const imgRatio = dimensions.width / dimensions.height;

  let fitH_Width = maxH * imgRatio;
  let fitW_Height = maxW / imgRatio;

  let finalW, finalH;

  if (fitH_Width <= maxW) {
    finalH = maxH;
    finalW = fitH_Width;
  } else {
    finalW = maxW;
    finalH = fitW_Height;
  }

  const nativeW = dimensions.width / PTS_PER_INCH;
  const nativeH = dimensions.height / PTS_PER_INCH;

  if (finalW > nativeW || finalH > nativeH) {
    finalW = nativeW;
    finalH = nativeH;
  }

  slide.addImage({
    path: imagePath,
    x: xStart + (maxW - finalW) / 2,
    y: yStart + (maxH - finalH) / 2,
    w: finalW,
    h: finalH
  });
}

/**
 * 添加顺时针旋转 90 度的图片
 * @param {Object} slide - PptxGenJS 的 slide 对象
 * @param {string} imagePath - 图片路径
 * @param {number} x - 目标 X 位置
 * @param {number} y - 目标 Y 位置
 * @param {number} w - 容器宽度
 * @param {number} h - 容器高度
 */
export function addRotatedImage(slide, imagePath, x, y, w, h) {
  const dimensions = sizeOf(imagePath);
  const imgRatio = dimensions.width / dimensions.height;

  // 旋转 90 度后，容器的宽高交换使用
  const containerW = h;  // 旋转后，原高度变为可用宽度
  const containerH = w;  // 旋转后，原宽度变为可用高度

  // 计算图片在旋转容器中的最佳尺寸
  let fitH_Width = containerH * imgRatio;
  let fitW_Height = containerW / imgRatio;

  let finalW, finalH;

  if (fitH_Width <= containerW) {
    finalH = containerH;
    finalW = fitH_Width;
  } else {
    finalW = containerW;
    finalH = fitW_Height;
  }

  // 防止拉伸
  const nativeW = dimensions.width / PTS_PER_INCH;
  const nativeH = dimensions.height / PTS_PER_INCH;

  if (finalW > nativeW || finalH > nativeH) {
    finalW = nativeW;
    finalH = nativeH;
  }

  // 计算旋转补偿值（绕中心旋转）
  const compensation = (finalW - finalH) / 2;

  // 添加旋转图片
  slide.addImage({
    path: imagePath,
    x: x - compensation,  // 注意：旋转后宽高交换
    y: y + (LAYOUT_HEIGHT - finalH) / 2,
    w: finalW,
    h: finalH,
    rotate: -90
  });
}