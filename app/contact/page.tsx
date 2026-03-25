'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqpgdrn';

const inputBase: React.CSSProperties = {
  width: '100%',
  border: '2px solid #d1d5db',
  borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  color: '#111827',
  backgroundColor: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          (json as { error?: string }).error ||
            '送信に失敗しました。時間をおいて再度お試しください。'
        );
        setStatus('error');
      }
    } catch {
      setErrorMsg('通信エラーが発生しました。インターネット接続をご確認ください。');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* ページタイトル */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold tracking-widest mb-2"
          style={{
            fontFamily: 'Oswald, sans-serif',
            color: '#f59e0b',
            letterSpacing: '0.2em',
          }}
        >
          CONTACT
        </p>
        <h1
          className="text-2xl font-bold pb-3 border-b-2"
          style={{ color: '#1a2744', borderColor: '#f59e0b' }}
        >
          お問い合わせ
        </h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          サイトの内容・掲載情報に関するご質問・ご意見はこちらからお送りください。
          <br />
          内容を確認のうえ、順次ご返信いたします。
        </p>
      </div>

      {/* 送信成功 */}
      {status === 'success' && (
        <div
          className="rounded-xl p-6 mb-8 text-center"
          style={{ backgroundColor: '#f0fdf4', border: '2px solid #86efac' }}
        >
          <p className="text-2xl mb-2">✅</p>
          <p className="font-bold text-green-800 text-lg mb-1">
            お問い合わせありがとうございました
          </p>
          <p className="text-sm text-green-700">
            内容を確認のうえ、担当者よりご連絡いたします。
          </p>
        </div>
      )}

      {/* エラー */}
      {status === 'error' && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: '#fff1f2', border: '2px solid #fda4af' }}
        >
          <p className="text-sm text-red-700 font-medium">⚠️ {errorMsg}</p>
        </div>
      )}

      {/* フォーム */}
      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* お名前 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#1a2744' }}
            >
              お名前
              <span className="ml-1 text-xs font-normal" style={{ color: '#f59e0b' }}>
                必須
              </span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="山田 太郎"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1a2744')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#1a2744' }}
            >
              メールアドレス
              <span className="ml-1 text-xs font-normal" style={{ color: '#f59e0b' }}>
                必須
              </span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="example@email.com"
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1a2744')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* お問い合わせ種別 */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#1a2744' }}
            >
              お問い合わせ種別
              <span className="ml-1 text-xs font-normal" style={{ color: '#f59e0b' }}>
                必須
              </span>
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue=""
              style={inputBase}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1a2744')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            >
              <option value="" disabled>
                選択してください
              </option>
              <option value="サイトについて">サイトについて</option>
              <option value="掲載内容について">掲載内容について</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* お問い合わせ内容 */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#1a2744' }}
            >
              お問い合わせ内容
              <span className="ml-1 text-xs font-normal" style={{ color: '#f59e0b' }}>
                必須
              </span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="お問い合わせ内容をご記入ください"
              style={{ ...inputBase, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1a2744')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-lg py-3 text-sm font-semibold tracking-wide transition-opacity"
            style={
              status === 'submitting'
                ? { backgroundColor: '#9ca3af', color: '#ffffff', cursor: 'not-allowed' }
                : { backgroundColor: '#1a2744', color: '#ffffff', cursor: 'pointer' }
            }
          >
            {status === 'submitting' ? (
              '送信中...'
            ) : (
              <>
                送信する{' '}
                <span style={{ color: '#f59e0b' }}>→</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
