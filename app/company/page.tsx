import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営者情報',
  description: '施工管理転職ナビの運営者情報ページです。',
};

export default function CompanyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
        運営者情報
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 text-left w-1/3">
                サイト名
              </th>
              <td className="px-6 py-4 text-gray-600">施工管理転職ナビ</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 text-left">
                運営
              </th>
              <td className="px-6 py-4 text-gray-600">施工管理転職ナビ編集部</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 text-left">
                設立
              </th>
              <td className="px-6 py-4 text-gray-600">2026年</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 text-left">
                事業内容
              </th>
              <td className="px-6 py-4 text-gray-600">
                施工管理技士向け転職情報の提供、転職エージェント比較サイトの運営
              </td>
            </tr>
            <tr>
              <th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 text-left">
                お問い合わせ
              </th>
              <td className="px-6 py-4 text-gray-600">後日設置予定</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 mt-8 leading-relaxed">
        本サイトは施工管理技士の転職活動をサポートすることを目的として運営しています。
        47都道府県×5工種別に最適な転職エージェントを比較・紹介しています。
      </p>
    </div>
  );
}
