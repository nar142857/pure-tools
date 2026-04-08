export interface ToolSeoData {
  slug: string;
  name: string;
  steps: { name: string; text: string }[];
  faq: { question: string; answer: string }[];
}

export const toolSeoMap: Record<string, ToolSeoData> = {
  "pdf-compress": {
    slug: "/pdf-compress",
    name: "PDF压缩",
    steps: [
      { name: "上传PDF文件", text: "拖拽或点击上传需要压缩的PDF文件。" },
      { name: "选择压缩级别", text: "选择轻度、标准或极限压缩级别。" },
      { name: "开始压缩", text: "点击开始压缩，文件将在浏览器本地处理。" },
      { name: "下载压缩文件", text: "压缩完成后预览效果并下载压缩后的PDF文件。" },
    ],
    faq: [
      { question: "PDF压缩后会损失质量吗？", answer: "轻度压缩几乎不影响质量，标准压缩在体积和质量间取得平衡，极限压缩会较大程度降低图片质量但文件体积最小。" },
      { question: "我的文件会上传到服务器吗？", answer: "不会。所有文件处理完全在您的浏览器本地完成，文件不会上传到任何服务器，保障您的隐私安全。" },
      { question: "支持多大的PDF文件？", answer: "没有固定的文件大小限制，处理能力取决于您设备的性能和内存。一般数十MB的文件均可正常处理。" },
      { question: "PDF压缩是免费的吗？", answer: "完全免费，无使用次数限制，无文件大小限制，无隐藏收费。" },
    ],
  },
  "image-compress": {
    slug: "/image-compress",
    name: "图片压缩",
    steps: [
      { name: "上传图片", text: "拖拽或点击上传JPG、PNG或WebP格式的图片，支持批量上传。" },
      { name: "设置压缩参数", text: "调节压缩质量（1-100）和最大尺寸。" },
      { name: "开始压缩", text: "点击开始压缩，所有图片在浏览器本地处理。" },
      { name: "下载压缩图片", text: "预览压缩效果，单独或批量下载压缩后的图片。" },
    ],
    faq: [
      { question: "支持哪些图片格式？", answer: "支持JPG/JPEG、PNG、WebP三种常见图片格式的压缩。" },
      { question: "可以批量压缩吗？", answer: "可以。支持同时上传多张图片并批量压缩处理。" },
      { question: "压缩后图片质量如何？", answer: "您可以根据需要自由调节压缩质量，从1（最低质量/最小体积）到100（最高质量/最大体积）。" },
    ],
  },
  "pdf-to-image": {
    slug: "/pdf-to-image",
    name: "PDF转图片",
    steps: [
      { name: "上传PDF文件", text: "拖拽或点击上传需要转换的PDF文件。" },
      { name: "选择输出格式和分辨率", text: "选择输出为PNG或JPG格式，设置缩放比例（1x-4x）。" },
      { name: "开始转换", text: "点击开始转换，PDF每页将转为独立的图片。" },
      { name: "下载图片", text: "逐页预览并下载转换后的图片。" },
    ],
    faq: [
      { question: "PDF转图片支持哪些输出格式？", answer: "支持PNG和JPG两种输出格式。PNG适合需要透明背景或高质量的场景，JPG适合文件体积较小的场景。" },
      { question: "可以自定义输出分辨率吗？", answer: "可以。支持1倍到4倍的缩放比例，倍数越高输出的图片分辨率越大。" },
      { question: "转换后的图片质量如何？", answer: "使用先进的PDF渲染引擎，输出高清图片，支持最高4倍缩放，确保细节清晰。" },
    ],
  },
  "image-to-pdf": {
    slug: "/image-to-pdf",
    name: "图片转PDF",
    steps: [
      { name: "上传图片", text: "拖拽或点击上传多张图片，支持JPG、PNG、WebP格式。" },
      { name: "设置页面参数", text: "选择纸张大小（A4/Letter）和页面方向（纵向/横向）。" },
      { name: "调整图片顺序", text: "拖拽调整图片在PDF中的排列顺序。" },
      { name: "生成PDF并下载", text: "点击生成，将所有图片合并为一个PDF文档并下载。" },
    ],
    faq: [
      { question: "支持哪些图片格式转PDF？", answer: "支持JPG/JPEG、PNG、WebP三种格式的图片转为PDF。" },
      { question: "可以调整图片顺序吗？", answer: "可以。支持通过拖拽调整图片在PDF中的排列顺序。" },
      { question: "生成的PDF是什么纸张大小？", answer: "支持A4和Letter两种常见纸张大小，同时支持纵向和横向页面方向。" },
    ],
  },
  "image-convert": {
    slug: "/image-convert",
    name: "图片格式转换",
    steps: [
      { name: "上传图片", text: "拖拽或点击上传需要转换格式的图片，支持批量。" },
      { name: "选择目标格式", text: "选择输出格式为JPG、PNG或WebP。" },
      { name: "设置输出质量", text: "调节输出图片的质量参数。" },
      { name: "开始转换并下载", text: "点击转换，完成后下载转换后的图片。" },
    ],
    faq: [
      { question: "支持哪些格式互转？", answer: "支持JPG、PNG、WebP三种格式之间的任意互转。" },
      { question: "可以批量转换吗？", answer: "可以。支持同时上传多张图片并批量转换为同一格式。" },
      { question: "转换后有质量损失吗？", answer: "转为PNG格式为无损转换。转为JPG或WebP时可调节质量参数，质量越高损失越小。" },
    ],
  },
  "pdf-merge-split": {
    slug: "/pdf-merge-split",
    name: "PDF合并/拆分",
    steps: [
      { name: "上传PDF文件", text: "拖拽或点击上传一个或多个PDF文件。" },
      { name: "选择操作模式", text: "选择合并模式（多个PDF合并为一个）或拆分模式（将PDF拆分为单页）。" },
      { name: "调整文件顺序", text: "在合并模式下，可拖拽调整PDF的合并顺序。" },
      { name: "执行操作并下载", text: "点击执行，完成后下载合并或拆分后的PDF文件。" },
    ],
    faq: [
      { question: "可以合并多少个PDF？", answer: "没有数量限制，您可以合并任意数量的PDF文件。" },
      { question: "拆分PDF后每页都是独立文件吗？", answer: "是的。拆分后PDF的每一页都会生成为独立的PDF文件，可单独下载。" },
      { question: "合并后的PDF文件质量会下降吗？", answer: "不会。PDF合并是无损操作，不会降低原始文件的质量。" },
    ],
  },
};
