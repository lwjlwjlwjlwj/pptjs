import PptxGenJS from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";
import { LAYOUT_16x10, COLORS } from "./config.js";
import { createPage, PAGE_TYPES } from "./pages/PageFactory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export async function generatePPT(slides = []) {
  const pptx = new PptxGenJS();

  pptx.defineLayout({
    name: 'CUSTOM_LAYOUT',
    width: LAYOUT_16x10.width,
    height: LAYOUT_16x10.height
  });
  pptx.layout = 'CUSTOM_LAYOUT';

  for (const slideData of slides) {
    const slide = pptx.addSlide();
    await createPage(slide, slideData.type, slideData.data, slideData.options);
  }

  return pptx;
}

export async function savePPT(pptx, outputPath) {
  await pptx.writeFile({ fileName: outputPath });
}

export { PAGE_TYPES };

export async function main() {
  const slides = [
    {
      type: "TOP_TEXT_BOTTOM_IMAGE",
      data: {
        text: "柳丝木",
        imagePath: path.join(projectRoot, "image.png"),
      }
    },
    {
      type: "LEFT_TEXT_RIGHT_IMAGE",
      data: {
        text: "柳丝木 活力御光美白防晒乳\n祛斑美白、防晒、修护、保湿、舒缓功效宣称",
        imagePath: path.join(projectRoot, "image.png"),
      }
    },
    {
      type: "HOME_IMAGE",
      data: {
        sideTitle: "侧标题",
        brand: "品牌名",
        name: "产品名",
        mainSpecDesc: "主品规格描述",
        giftSpecDesc: "赠品规格描述",
        summaryDesc: "总结描述",
        finalDesc: "最终描述",
        officialPriceInfo: "官方价信息",
        livePriceInfo: "直播价信息",
        stockInfo: "库存信息",
        footerInfo: "底部信息"
      }
    }
  ];

  const pptx = await generatePPT(slides);
  await savePPT(pptx, path.join(projectRoot, "output.pptx"));
  console.log("PPT 生成成功: output.pptx");
}

if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  main().catch(console.error);
}