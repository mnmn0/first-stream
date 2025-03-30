import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// テスト後のクリーンアップ
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// 環境変数の設定
process.env.VITE_APP_API_ENDPOINT = 'http://localhost:3000';