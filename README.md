# PPTJS 项目规范文档

## 项目简介

PPTJS 是一个基于 PptxGenJS 的 PowerPoint 自动生成工具，支持多种页面布局模板和自定义样式配置。采用内容与样式分离的设计模式，提供灵活的页面生成能力。

## 画布规格

### 尺寸配置
- **画布真实尺寸**: 13.333 x 7.5 inches (16:10 比例)
- **坐标系原点**: 左上角 [-0.3, 0.3]
- **布局常量**: 
  - `LAYOUT_WIDTH = 13.333`
  - `LAYOUT_HEIGHT = 7.5`

## 颜色库

使用 `COLORS` 对象统一管理项目颜色：

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 黑色 (BLACK) | `000000` | 默认文本颜色 |
| 红色 (RED) | `FF0000` | 强调、警告、重点内容 |
| 蓝色 (BLUE) | `0088CC` | 主色调、链接、标题 |
| 黄色 (YELLOW) | `FFFF00` | 高亮、背景色 |
| 藏蓝色 (NAVY_BLUE) | `1E386B` | 次要信息、官方价格 |
| 绿色 (GREEN) | `75BD42` | 库存状态、成功标识 |

### 使用示例
```javascript
import { COLORS } from './config.js';

slide.addText('文本', {
  color: COLORS.RED,
  highlight: COLORS.YELLOW
});
```

## 核心工具函数

### 1. addSafeImage - 图片自适应函数
**功能**: 防止图片拉伸，保持原始比例，带溢出保护

**参数**:
- `slide`: PptxGenJS 的 slide 对象
- `imagePath`: 图片路径
- `xStart`: 起始 x 坐标
- `yStart`: 起始 y 坐标
- `maxW`: 最大宽度
- `maxH`: 最大高度

**特性**:
- 自动计算图片最佳尺寸
- 保持宽高比
- 防止小图片拉伸模糊
- 自动居中

### 2. addRotatedImage - 旋转图片函数
**功能**: 添加顺时针旋转 90 度的图片，带坐标校准

**参数**:
- `slide`: PptxGenJS 的 slide 对象
- `imagePath`: 图片路径
- `x`: 目标 X 位置
- `y`: 目标 Y 位置
- `w`: 容器宽度
- `h`: 容器高度

**特性**:
- 自动计算旋转补偿值
- 保持图片原始比例
- 防止拉伸模糊

### 3. calculateTextLayoutHeight - 文本高度计算函数
**功能**: 根据文本内容、字号和宽度动态计算所需高度

**参数**:
- `text`: 文本内容
- `fontSize`: 字号
- `w`: 宽度

**返回值**: `number` - 计算后的高度

### 4. addRotatedText - 垂直文本框函数
**功能**: 添加顺时针旋转 90 度的文本框，带坐标校准

**参数**:
- `slide`: PptxGenJS 的 slide 对象
- `text`: 文本内容
- `opts`: 配置项
  - `x`: 目标 X 位置 (默认 0)
  - `y`: 目标 Y 位置 (默认 0)
  - `w`: 宽度 (默认 5)
  - `fontSize`: 字号 (默认 18)
  - `bold`: 是否加粗
  - `color`: 文字颜色
  - `highlight`: 背景高亮色
  - `align`: 对齐方式
  - `valign`: 垂直对齐

**返回值**: `{ calculatedW, calculatedH }` - 计算后的实际尺寸

## 页面布局模板

### 设计模式：内容与样式分离

所有页面模板均采用统一的构造函数签名：

```javascript
constructor(slide, data = {}, options = {})
```

- **data**: 内容数据 - 包含文本、图片路径等实际内容
- **options**: 样式配置（可选）- 包含字体、颜色、对齐等样式设置

### 1. LeftTextRightImagePage - 左文右图布局

**特点**: 左侧垂直旋转文本，右侧自适应图片

**内容数据 (data)**:
```javascript
{
  text: "文本内容",
  imagePath: "图片路径"
}
```

**样式配置 (options)**:
```javascript
{
  fontSize: 40,        // 字号
  bold: true,          // 是否加粗
  color: COLORS.RED,   // 文字颜色
  highlight: COLORS.YELLOW  // 背景高亮
}
```

**使用示例**:
```javascript
{
  type: "LEFT_TEXT_RIGHT_IMAGE",
  data: {
    text: "柳丝木 活力御光美白防晒乳",
    imagePath: "./image.png"
  },
  options: {
    fontSize: 40,
    color: COLORS.RED
  }
}
```

### 2. TopTextBottomImagePage - 上文下图布局

**特点**: 顶部水平文本，底部自适应图片

**内容数据 (data)**:
```javascript
{
  text: "文本内容",
  imagePath: "图片路径"
}
```

**样式配置 (options)**:
```javascript
{
  fontSize: 40,        // 字号
  bold: true,          // 是否加粗
  color: COLORS.RED,   // 文字颜色
  highlight: COLORS.YELLOW,  // 背景高亮
  valign: "top",       // 垂直对齐
  rotate: 0,           // 旋转角度
  align: "center",     // 水平对齐
  textY: 0             // 起始 Y 坐标
}
```

**使用示例**:
```javascript
{
  type: "TOP_TEXT_BOTTOM_IMAGE",
  data: {
    text: "柳丝木 活力御光美白防晒乳",
    imagePath: "./image.png"
  },
  options: {
    fontSize: 40,
    color: COLORS.RED,
    align: "center"
  }
}
```

### 3. HomeImagePage - 首页表格布局

**特点**: 左侧标题列，右侧产品信息表格，支持多行多列混合布局

**内容数据 (data)**:
```javascript
{
  sideTitle: "侧边标题",
  productHeader: {
    brand: "品牌名",
    name: "产品名"
  },
  specs: {
    main: "主品规格及价值描述",
    gift: "赠品规格及价值描述",  // 可选
    summary: "共计...平均...",
    final: "到手...折合..."
  },
  pricing: {
    official: "官方价 + 快递信息",
    live: "直播价 + 优惠方式"
  },
  stock: "库存相关整行文字",
  footer: "生产日期、保质期、售后"
}
```

**样式配置**: 使用内置默认样式（基于 COLORS 常量）

**使用示例**:
```javascript
{
  type: "HOME_IMAGE",
  data: {
    sideTitle: "热销产品",
    brand: "柳丝木",
    name: "活力御光美白防晒乳",
    mainSpecDesc: "50ml*2 支",
    giftSpecDesc: "赠送旅行装 10ml",
    summaryDesc: "共计 2 支，平均每支 50 元",
    finalDesc: "到手价 100 元，折合每支 50 元",
    officialPriceInfo: "官方价 128 元，快递费 10 元",
    livePriceInfo: "直播价 100 元，包邮到家",
    stockInfo: "库存充足，现货速发",
    footerInfo: "生产日期：2024 年，保质期 3 年，售后无忧"
  }
}
```

## 项目结构

```
pptjs/
├── scripts/              # 核心脚本目录 (需上传)
│   ├── index.js         # 入口文件
│   ├── config.js        # 配置文件（布局、颜色、常量）
│   ├── pages/           # 页面模板
│   │   ├── PageFactory.js          # 页面工厂
│   │   ├── HomeImagePage.js        # 首页表格模板
│   │   ├── LeftTextRightImagePage.js  # 左文右图模板
│   │   └── TopTextBottomImagePage.js  # 上文下图模板
│   └── utils/           # 工具函数
│       ├── imageUtils.js  # 图片工具（addSafeImage, addRotatedImage）
│       └── textUtils.js   # 文本工具（calculateTextLayoutHeight, addRotatedText）
├── package.json         # 项目配置 (需上传)
├── package-lock.json    # 依赖锁定 (需上传)
├── .gitignore          # Git 忽略配置
├── config.js           # 根目录配置 (忽略，旧版)
├── generate-ppt.js     # 旧版脚本 (忽略)
└── image.png           # 图片资源 (忽略)
```

## 开发规范

### 1. 代码规范
- 使用 ES6 Module 语法
- 所有代码使用中文注释
- 遵循设计模式提升复用性
- 工具函数统一放在 utils 目录

### 2. 设计原则

#### 内容与样式分离
- **data**: 传递实际内容（文本、图片路径等）
- **options**: 传递样式配置（字体、颜色、对齐等）
- 默认样式在类内部定义，可通过 options 覆盖

#### 工厂模式
- 使用 `PageFactory` 统一管理页面类型
- 通过 `createPage()` 工厂方法创建页面实例
- 支持动态注册新的页面类型

### 3. 布局模板
项目支持多种页面布局：
- **左文右图布局** (LeftTextRightImagePage) - 适用于标题页、封面页
- **上文下图布局** (TopTextBottomImagePage) - 适用于内容页、展示页
- **首页表格布局** (HomeImagePage) - 适用于产品信息页、价格对比页

### 4. 单位换算
- 1 inch = 70 pts (PptxGenJS 标准)
- 图片 DPI 基准：72
- 默认行高倍数：1.2

## 第三方依赖说明

### PptxGenJS

本项目使用 **PptxGenJS** 作为核心 PowerPoint 生成库。

**开源信息**:
- **官方仓库**: https://github.com/gitbrent/PptxGenJS
- **开源协议**: MIT License
- **当前版本**: ^4.0.1
- **作者**: Brent Ely
- **版权**: Copyright © 2015-present Brent Ely

**主要特性**:
- 生成符合 Open Office XML (OOXML) 标准的 PowerPoint 文件
- 支持 Node.js、React、Angular、Vite、Electron 和浏览器环境
- 支持文本、表格、形状、图片、图表等多种幻灯片元素
- 支持自定义幻灯片母版、SVG、动画 GIF、YouTube 嵌入等
- 无运行时依赖，提供 CommonJS 和 ES Module 双构建

**MIT 协议说明**:
> MIT 许可证是一份简短、宽松的许可证，只要求保留版权和许可声明。根据 MIT 许可证，开发者可以免费使用、复制、修改、合并、出版、分发、再授权和/或销售软件的副本，前提是包含原始版权声明和许可声明。

**安装方式**:
```bash
npm install pptxgenjs
```

**官方文档**: https://gitbrent.github.io/PptxGenJS

**其他依赖**:
- **image-size**: 用于获取图片尺寸信息（MIT License）
- **jszip**: PptxGenJS 的内部依赖，用于生成 ZIP 格式的 OOXML 文件（MIT License）

## 常用命令

```bash
# 安装依赖
npm install

# 生成 PPT
npm run generate
```

## 注意事项

1. **图片处理**: 
   - 使用 `addSafeImage` 函数添加水平图片，避免拉伸
   - 使用 `addRotatedImage` 函数添加旋转图片，已处理坐标补偿

2. **文本处理**: 
   - 使用 `calculateTextLayoutHeight` 函数动态计算文本高度
   - 使用 `addRotatedText` 函数添加旋转文本，已处理坐标补偿

3. **颜色使用**: 优先使用 `COLORS` 常量，避免硬编码色值

4. **布局适配**: 所有元素位置计算基于 `LAYOUT_WIDTH` 和 `LAYOUT_HEIGHT`

5. **代码复用**: 工具函数统一放在 utils 目录，提升可维护性

6. **参数传递**: 
   - 内容数据通过 `data` 参数传递
   - 样式配置通过 `options` 参数传递（可选）
   - 未指定 options 时使用默认样式

## 版本历史

### v1.0.0
- 支持左文右图和上文下图两种布局模板
- 实现图片自适应和旋转功能
- 实现文本高度动态计算
- 集成 PptxGenJS v4.0.1

### v1.1.0
- 新增 HomeImagePage 首页表格布局模板
- 重构所有页面类，采用 data/options 分离模式
- 更新 PageFactory 工厂函数签名
- 完善颜色库，新增 BLACK、NAVY_BLUE、GREEN
- 更新项目文档
