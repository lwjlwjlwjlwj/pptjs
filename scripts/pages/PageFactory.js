import { LeftTextRightImagePage } from "./LeftTextRightImagePage.js";
import { TopTextBottomImagePage } from "./TopTextBottomImagePage.js";
import { HomeImagePage } from "./HomeImagePage.js";
import { FinalDescPage } from "./FinalDescPage.js";

const PAGE_TYPES = {
  HOME_IMAGE: HomeImagePage,
  LEFT_TEXT_RIGHT_IMAGE: LeftTextRightImagePage,
  TOP_TEXT_BOTTOM_IMAGE: TopTextBottomImagePage,
  FINAL_DESC: FinalDescPage
};

export function registerPageType(type, PageClass) {
  PAGE_TYPES[type] = PageClass;
}

/**
 * 创建页面实例
 * @param {Object} slide - PptxGenJS 的 slide 对象
 * @param {string} type - 页面类型
 * @param {Object} data - 内容数据
 * @param {Object} options - 样式配置（可选）
 */
export function createPage(slide, type, data, options = {}) {
  const PageClass = PAGE_TYPES[type];
  if (!PageClass) {
    throw new Error(`Unknown page type: ${type}`);
  }
  const page = new PageClass(slide, data, options);
  page.render();
  return page;
}

export { LeftTextRightImagePage };
export { TopTextBottomImagePage };
export { HomeImagePage };
export { PAGE_TYPES };