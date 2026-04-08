/**
 * 空模块桩文件（Empty Module Stub）
 *
 * Turbopack 的 resolveAlias 不支持 false 值（webpack 支持），
 * 因此需要用一个空模块文件来替代。
 *
 * 用途：pdfjs-dist 等库会引用 Node.js 原生模块 canvas 和 encoding，
 * 但浏览器环境不需要这些模块。通过在 next.config.ts 中配置：
 *   turbopack.resolveAlias = { canvas: "src/empty.ts", encoding: "src/empty.ts" }
 * 让打包器在遇到这些引用时加载此空模块，避免构建报错。
 *
 * ⚠️ 请勿删除此文件，否则生产构建会失败。
 * 参考：next.config.ts 中的 turbopack.resolveAlias 配置
 */
export default {};
export {};
