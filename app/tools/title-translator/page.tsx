import { Metadata } from 'next';
import TitleTranslator from '../../../components/TitleTranslator';

export const metadata: Metadata = {
  title: '職務経歴書の「肩書き」翻訳ツール｜施工管理転職ナビ',
  description:
    '現場監督・施工管理の経験を、応募先に刺さる職務経歴書の表現に翻訳。大手ゼネコン・異業種など応募先タイプ別に2〜3パターンをAIが提案します。無料でお試しください。',
  alternates: { canonical: 'https://sekoukan-navi.com/tools/title-translator/' },
};

export default function TitleTranslatorPage() {
  return (
    <div style={{ backgroundColor: '#f6f4ef', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-5 py-12 sm:py-16">

        {/* ページヘッダー */}
        <header className="mb-8">
          <p
            className="text-xs font-bold mb-3"
            style={{
              fontFamily: '"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif',
              color: '#c0492f',
              letterSpacing: '0.22em',
            }}
          >
            施工管理転職ナビ｜無料ツール
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold leading-snug mb-4"
            style={{
              fontFamily: '"Hiragino Mincho ProN","Yu Mincho",serif',
              color: '#1c2b3a',
              letterSpacing: '0.01em',
            }}
          >
            職務経歴書の「肩書き」翻訳ツール
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: '"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif',
              color: '#6d7682',
            }}
          >
            同じ経歴でも、応募先によって「現場監督」と書くか「施工管理」と書くかで連想される人物像が変わります。
            あなたの経験をもとに、応募先が連想しやすい職種・肩書きの表現をAIが提案します。経歴を盛るツールではなく、同じ事実をより伝わる言葉へ翻訳するツールです。
          </p>

          <div className="h-px my-6" style={{ backgroundColor: '#dcd6cb' }} />
        </header>

        <TitleTranslator />

      </div>
    </div>
  );
}
