import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PREFS, JOB_TYPES, getPrefById, getJobTypeById, getLocalAdvice } from '../../../lib/constants';
import {
  fetchAffiliatesFromSheets,
  fetchSalaryOverrides,
  fetchFAQs,
  generateDefaultFAQs,
  DEFAULT_AFFILIATES,
} from '../../../lib/sheets';
import ComparisonTable from '../../../components/ComparisonTable';
import SalaryCalculator from '../../../components/SalaryCalculator';
import FAQSection from '../../../components/FAQSection';
import StructuredData from '../../../components/StructuredData';
import StickyCtaButton from '../../../components/StickyCtaButton';
import { AffiliateItem } from '../../../lib/types';

// ===== SSG: 235パターン（47都道府県 × 5工種）を全生成 =====
export async function generateStaticParams() {
  const params: { pref: string; job_type: string }[] = [];
  PREFS.forEach((pref) => {
    JOB_TYPES.forEach((job) => {
      params.push({ pref: pref.id, job_type: job.id });
    });
  });
  return params; // 計235件
}

const siteUrl = process.env.SITE_URL || 'https://sekoukan-navi.com';

// ===== メタデータ動的生成 =====
export async function generateMetadata({
  params,
}: {
  params: { pref: string; job_type: string };
}): Promise<Metadata> {
  const pref = getPrefById(params.pref);
  const jobType = getJobTypeById(params.job_type);
  if (!pref || !jobType) return {};

  const year = new Date().getFullYear();
  const baseAvgSalary = pref.avgSalary + jobType.avgSalary;
  const title = `${pref.name}の${jobType.fullName}転職 | 年収${baseAvgSalary}万円〜の求人・エージェント比較【${year}年最新】`;
  const description = `${pref.name}で${jobType.fullName}の転職を成功させるための転職エージェント比較。${pref.name}の平均年収は約${baseAvgSalary}万円〜。求人の特徴・おすすめエージェントを徹底解説。`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${params.pref}/${params.job_type}/`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${siteUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

// ===== メインページ（ビルド時にデータ取得） =====
export default async function PrefJobTypePage({
  params,
}: {
  params: { pref: string; job_type: string };
}) {
  const pref = getPrefById(params.pref);
  const jobType = getJobTypeById(params.job_type);
  if (!pref || !jobType) notFound();

  // ビルド時にGoogle Sheetsからデータ取得
  const [allAffiliates, salaryOverrides, faqMap] = await Promise.all([
    fetchAffiliatesFromSheets(),
    fetchSalaryOverrides(),
    fetchFAQs(),
  ]);

  // 対応工種・地域でフィルタリング
  const affiliates: AffiliateItem[] = allAffiliates.filter((item) => {
    const regionOk =
      item.regions.includes('all') || item.regions.includes(pref.id);
    const jobOk =
      item.jobTypes.includes('all') || item.jobTypes.includes(jobType.id);
    return regionOk && jobOk;
  });

  // 平均年収（スプレッドシート優先 → マスターデータ）
  const salaryKey = `${pref.id}_${jobType.id}`;
  const avgSalary =
    salaryOverrides.get(salaryKey) ?? pref.avgSalary + jobType.avgSalary;

  // FAQ（スプレッドシート優先 → 自動生成）
  const faqs =
    faqMap.get(salaryKey) ??
    generateDefaultFAQs(pref.name, jobType.fullName, avgSalary);

  const pageUrl = `${siteUrl}/${pref.id}/${jobType.id}/`;

  return (
    <>
      {/* JSON-LD 構造化データ */}
      <StructuredData
        prefName={pref.name}
        jobTypeName={jobType.fullName}
        avgSalary={avgSalary}
        faqs={faqs}
        pageUrl={pageUrl}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="パンくずリスト">
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-2">›</span>
          <Link href={`/${pref.id}/`} className="hover:underline">{pref.name}の施工管理転職</Link>
          <span className="mx-2">›</span>
          <span>{jobType.fullName}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {pref.name}で{jobType.fullName}の転職を成功させるための<br className="hidden sm:block" />
          厳選エージェント比較【{new Date().getFullYear()}年最新】
        </h1>

        {/* リード文 */}
        <p className="text-gray-600 leading-relaxed mb-8">
          この記事では、{pref.name}で{jobType.fullName}への転職を考えている方に向けて、
          地域の求人に強い転職エージェントを厳選して比較します。
          {pref.name}の平均年収・求人の特徴・転職成功のポイントも解説します。
        </p>

        {/* 年収サマリーカード */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            label={`${pref.nameShort}の${jobType.name}平均年収`}
            value={`約${avgSalary}万円`}
            sub="経験・資格により変動"
            color="blue"
          />
          <StatCard
            label="1級資格取得後の目安"
            value={`${avgSalary + 80}万円〜`}
            sub="1級施工管理技士"
            color="green"
          />
          <StatCard
            label="転職エージェント経由の実績"
            value={`+${Math.round(avgSalary * 0.15)}万円〜`}
            sub="年収アップの目安"
            color="amber"
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* ===== 比較表（収益の核心） ===== */}
        <ComparisonTable
          affiliates={affiliates.length > 0 ? affiliates : DEFAULT_AFFILIATES}
          prefName={pref.name}
          jobTypeName={jobType.fullName}
        />

        {/* ===== 地域別アドバイス ===== */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-amber-500 pl-4">
            {pref.name}で{jobType.fullName}への転職を成功させるアドバイス
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{getLocalAdvice(jobType.id, pref.id)}</p>
          </div>
        </section>

        {/* ===== 年収アップ診断 ===== */}
        <section className="my-10">
          <SalaryCalculator
            defaultPrefId={pref.id}
            defaultJobTypeId={jobType.id}
            avgSalary={avgSalary}
          />
        </section>

        {/* 地域特性コンテンツ */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            {pref.name}の{jobType.fullName}市場の特徴
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* 注目キーワード */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">注目キーワード</p>
              <div className="flex flex-wrap gap-2">
                {pref.trendKeywords.map((kw) => (
                  <span key={kw} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <ul className="space-y-3">
              {pref.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold shrink-0">▶</span>
                  <p className="text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>{pref.name}</strong>の{jobType.fullName}は、{jobType.description}
                {pref.demandLevel === 'high'
                  ? `特に${pref.name}は求人需要が旺盛で、好条件の求人が多数あります。`
                  : `転職エージェントを活用することで、より多くの選択肢にアクセスできます。`}
              </p>
            </div>
          </div>
        </section>

        {/* 転職成功ポイント */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            {pref.name}で{jobType.fullName}に転職するためのポイント
          </h2>
          <ol className="space-y-4">
            {[
              {
                title: '施工管理特化型エージェントを複数登録する',
                body: `一般転職サービスではなく、建設・施工管理に特化したエージェントを選ぶことで、${pref.name}の${jobType.fullName}求人に強いアドバイザーに担当してもらえます。複数登録することで選択肢が広がります。`,
              },
              {
                title: `${jobType.license}の取得を目指す`,
                body: `資格があることで求人の幅が大幅に広がり、年収交渉でも有利になります。特に1級は管理職候補として高待遇での転職が狙えます。`,
              },
              {
                title: '職務経歴書で「現場規模・人数管理」を具体的に記載',
                body: `施工管理の転職では「どんな規模の現場を・何人のチームで・どのように管理したか」が重視されます。数字を使った具体的な記載が内定率を高めます。`,
              },
            ].map((item, i) => (
              <li key={i} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-5">
                <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ===== FAQ ===== */}
        <FAQSection faqs={faqs} prefName={pref.name} jobTypeName={jobType.fullName} />

        {/* CTA再掲 */}
        <div className="my-10 bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            {pref.name}の{jobType.fullName}求人を今すぐ確認
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            無料登録・最短3分・エージェントが年収交渉も代行
          </p>
          {(affiliates.length > 0 ? affiliates : DEFAULT_AFFILIATES)
            .filter((a) => a.isRecommended)
            .slice(0, 1)
            .map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-block bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
              >
                {item.name}の公式サイトで求人を見る →
              </a>
            ))}
        </div>
        {affiliates.length > 0 && (
          <StickyCtaButton
            href={(affiliates.find(a => a.isRecommended) ?? affiliates[0]).url}
            agentName={(affiliates.find(a => a.isRecommended) ?? affiliates[0]).name}
          />
        )}
      </div>
    </>
  );
}

// ===== 統計カードコンポーネント =====
function StatCard({
  label,
  value,
  sub,
  color,
  className = '',
}: {
  label: string;
  value: string;
  sub: string;
  color: 'blue' | 'green' | 'amber';
  className?: string;
}) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div className={`rounded-xl border p-4 text-center ${colorMap[color]} ${className}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs mt-1 opacity-70">{sub}</div>
    </div>
  );
}
