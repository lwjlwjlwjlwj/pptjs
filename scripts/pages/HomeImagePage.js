import { LAYOUT_WIDTH, LAYOUT_HEIGHT, COLORS } from "../config.js";
import { IPage } from "./IPage.js";

export class HomeImagePage extends IPage {
    /**
     * @param {Object} slide - PptxGenJS 的 slide 对象
     * @param {Object} data - LLM 生成的结构化数据
     */
    constructor(slide, data = {}, options = {}) {
        super(slide, data, options);
        // 简化后的数据模型
        this.data = {
            sideTitle: data.sideTitle || "", // 第一列文本
            productHeader: {
                brand: data.brand || "",
                name: data.name || ""
            },
            specs: {
                main: data.mainSpecDesc || "", // 主品规格及价值描述
                gift: data.giftSpecDesc || "", // 赠品规格及价值描述
                summary: data.summaryDesc || "", // 共计...平均...
                final: data.finalDesc || ""     // 到手...折合...
            },
            pricing: {
                official: data.officialPriceInfo || "", // 官方价 + 快递信息
                live: data.livePriceInfo || ""          // 直播价 + 优惠方式
            },
            stock: data.stockInfo || "",               // 库存相关整行文字
            footer: data.footerInfo || ""               // 生产日期、保质期、售后
        };
    }

    render() {
        const d = this.data;

        let rows = [
            // 第一行：深度定制的混合样式行
            [
                {
                    text: d.sideTitle,
                    options: { rowspan: 4, color: COLORS.BLACK, bold: true, fontSize: 24, valign: "middle", align: "center", fontFace: "微软雅黑" }
                },
                {
                    text: [
                        { text: "产品名称：", options: { color: COLORS.BLACK, bold: true, fontSize: 24 } },
                        { text: d.productHeader.brand, options: { color: COLORS.RED, bold: true, fontSize: 24 } },
                        { text: " " + d.productHeader.name + "\n\n", options: { color: COLORS.BLACK, bold: true, fontSize: 24 } },

                        { text: "主品规格：" + d.specs.main + "\n\n", options: { color: COLORS.BLACK, bold: true, fontSize: 22 } },
                        
                        // --- 动态处理赠品行 ---
                        ...(d.specs.gift ? [{
                            text: "赠品规格：" + d.specs.gift + "\n\n",
                            options: { color: COLORS.BLACK, bold: true, fontSize: 22 }
                        }] : []),
                        
                        { text: d.specs.summary + "\n\n", options: { color: COLORS.RED, fill: COLORS.YELLOW, bold: true, fontSize: 24 } },
                        { text: d.specs.final, options: { color: COLORS.RED, bold: true, fontSize: 24 } }
                    ],
                    options: { colspan: 2, valign: "middle", align: "left", fontFace: "微软雅黑" }
                }
            ],
            // 第二行：价格与渠道
            [
                {
                    text: d.pricing.official,
                    options: { color: COLORS.NAVY_BLUE, bold: true, fontSize: 22, valign: "middle", align: "left", fontFace: "微软雅黑" }
                },
                {
                    text: d.pricing.live,
                    options: { color: COLORS.RED, bold: true, fontSize: 22, valign: "middle", align: "left", fontFace: "微软雅黑" }
                }
            ],
            // 第三行：库存状态
            [
                {
                    text: d.stock,
                    options: { colspan: 2, color: COLORS.BLACK, bold: true, fontSize: 22, valign: "middle", align: "left", fontFace: "微软雅黑", fill: COLORS.GREEN }
                }
            ],
            // 第四行：售后保障
            [
                {
                    text: d.footer,
                    options: { colspan: 2, color: COLORS.BLACK, bold: true, fontSize: 20, valign: "middle", align: "left", fontFace: "微软雅黑" }
                }
            ]
        ];

        this.slide.addTable(rows, {
            x: 0, y: 0, w: LAYOUT_WIDTH,
            colW: [2.133, 5.6, 5.6],
            rowH: [4.15, 1.6, 0.7, 1.05],
            border: { pt: 1, color: "000000" }
        });
    }
}