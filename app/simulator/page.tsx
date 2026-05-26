import { Metadata } from 'next';
import SalarySimulator from '../../components/SalarySimulator';

export const metadata: Metadata = {
  title: '施工管理 年収シミュレーター｜転職後の年収を無料診断',
  description:
    '工種・経験年数・資格をもとに転職後の想定年収を診断。施工管理技士の年収アップ幅を無料でシミュレーション。',
  alternates: { canonical: 'https://sekoukan-navi.com/simulator/' },
};

export default function SimulatorPage() {
  return (
    <div style={{ backgroundColor: '#0d1829', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">

        {/* ページヘッダー */}
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', color: '#f59e0b', letterSpacing: '0.2em' }}
          >
            SALARY SIMULATOR
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>
            施工管理 年収シミュレーター
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            工種・経験年数・資格をもとに、転職後の想定年収を診断します。
          </p>
        </div>

        <SalarySimulator />

      </div>
    </div>
  );
}
