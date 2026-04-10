import { ImageResponse } from 'next/og';
import { getPrefById, getJobTypeById, PREFS, JOB_TYPES } from '../../../lib/constants';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const params: { pref: string; job_type: string }[] = [];
  PREFS.forEach((pref) => {
    JOB_TYPES.forEach((job) => {
      params.push({ pref: pref.id, job_type: job.id });
    });
  });
  return params;
}

export default function Image({
  params,
}: {
  params: { pref: string; job_type: string };
}) {
  const pref = getPrefById(params.pref);
  const jobType = getJobTypeById(params.job_type);

  const prefName = pref?.name ?? '全国';
  const jobTypeName = jobType?.fullName ?? '施工管理';
  const avgSalary = (pref?.avgSalary ?? 450) + (jobType?.avgSalary ?? 0);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#1a2744',
          padding: '0',
          border: '8px solid #f59e0b',
          boxSizing: 'border-box',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '40px 64px 0',
          }}
        >
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, marginRight: '0px' }}>施工管理</span>
          <span style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 700 }}>転職</span>
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>ナビ</span>
        </div>

        {/* タイトル */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '28px 64px 0',
          }}
        >
          <div style={{ display: 'flex', color: '#f59e0b', fontSize: '48px', fontWeight: 800, lineHeight: 1.2 }}>
            {prefName}の{jobTypeName}転職
          </div>
          <div style={{ display: 'flex', color: '#c8d8f0', fontSize: '28px', fontWeight: 600, marginTop: '12px' }}>
            おすすめエージェント比較
          </div>
        </div>

        {/* 下部バッジ行 */}
        <div style={{ display: 'flex', gap: '20px', padding: '0 64px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#243460', borderRadius: '12px', padding: '16px 28px' }}>
            <span style={{ color: '#93b4d4', fontSize: '14px' }}>平均年収の目安</span>
            <span style={{ color: '#f59e0b', fontSize: '28px', fontWeight: 800, marginTop: '4px' }}>約{avgSalary}万円〜</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#243460', borderRadius: '12px', padding: '16px 28px' }}>
            <span style={{ color: '#93b4d4', fontSize: '14px' }}>掲載エージェント数</span>
            <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, marginTop: '4px' }}>7社以上</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
