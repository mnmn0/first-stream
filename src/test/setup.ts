import {cleanup} from '@testing-library/react';
import {afterEach, vi} from 'vitest';

// テスト後のクリーンアップ
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// 環境変数の設定
process.env.VITE_APP_API_ENDPOINT = 'http://localhost:3000';
