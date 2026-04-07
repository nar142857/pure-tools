export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛠️</span>
              <span className="font-bold text-blue-600">PureTools</span>
            </div>
            <p className="text-sm text-gray-500">
              你的文件，从不离开你的电脑。所有处理在浏览器本地完成，零上传，保护隐私。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">PDF工具</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>PDF压缩</li>
              <li>PDF转图片</li>
              <li>PDF合并/拆分</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">图片工具</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>图片压缩</li>
              <li>图片转PDF</li>
              <li>图片格式转换</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} PureTools. 所有文件处理均在您的浏览器本地完成，不会上传至任何服务器。</p>
        </div>
      </div>
    </footer>
  );
}
