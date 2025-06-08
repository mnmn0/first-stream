import {beforeEach, describe, expect, it, vi} from 'vitest';
import axios from 'axios';
import {renderHook, waitFor} from '@testing-library/react';
import {useHttp} from '../use-http';
import useSWR from 'swr';

// モックの設定
vi.mock('axios', () => {
  const mockGet = vi.fn(() => Promise.resolve({ data: {} }));
  const mockPost = vi.fn(() => Promise.resolve({ data: {} }));
  const mockPut = vi.fn(() => Promise.resolve({ data: {} }));
  const mockDelete = vi.fn(() => Promise.resolve({ data: {} }));
  const mockPatch = vi.fn(() => Promise.resolve({ data: {} }));

  return {
    default: {
      create: vi.fn(() => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete,
        patch: mockPatch,
      })),
    },
  };
});

vi.mock('swr', () => ({
  default: vi.fn((key, fetcher) => {
    // fetcherを実行してGETリクエストをシミュレートするのだ
    if (typeof key === 'string') {
      fetcher(key);
    }
    return {
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    };
  }),
}));

// 環境変数をモックするのだ
vi.stubEnv('VITE_APP_API_ENDPOINT', 'http://localhost:3000');

describe('useHttp', () => {
  let mockAxios: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = (axios.create as ReturnType<typeof vi.fn>)();
  });

  describe('get with SWR', () => {
    it('SWRを使用したGETリクエストが正しく設定されるのだ', async () => {
      const { result } = renderHook(() => useHttp());
      result.current.get('/test');

      expect(useSWR).toHaveBeenCalledWith(
        '/test',
        expect.any(Function),
        expect.any(Object),
      );
    });

    it('fetcherが正しく動作するのだ', async () => {
      const { result } = renderHook(() => useHttp());
      result.current.get('/test');

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith('/test');
      });
    });
  });

  describe('getOnce', () => {
    it('単発のGETリクエストが成功した場合、正しいデータを返すのだ', async () => {
      const mockData = { data: 'テストデータ' };
      mockAxios.get.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useHttp());
      const response = await result.current.getOnce('/test');

      expect(response.data).toEqual(mockData);
      expect(mockAxios.get).toHaveBeenCalledWith('/test', {
        params: undefined,
      });
    });

    it('単発のGETリクエストが失敗した場合、エラーを処理するのだ', async () => {
      const mockError = new Error('テストエラー');
      // mockResolvedValueOnceをmockRejectedValueOnceに変更するのだ
      mockAxios.get.mockRejectedValueOnce(mockError);

      const mockErrorProcess = vi.fn();
      const { result } = renderHook(() => useHttp());

      try {
        await result.current.getOnce('/test', undefined, mockErrorProcess);
        // 成功した場合は失敗なのだ
        throw new Error('Promiseが成功してしまったのだ');
      } catch (error) {
        expect(error).toBe(mockError);
        expect(mockErrorProcess).toHaveBeenCalledWith(mockError);
      }
    });
  });

  describe('post', () => {
    it('POSTリクエストが成功した場合、正しいデータを返すのだ', async () => {
      const mockData = { data: 'テストデータ' };
      const postData = { test: 'データ' };
      mockAxios.post.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useHttp());
      const response = await result.current.post('/test', postData);

      expect(response.data).toEqual(mockData);
      expect(mockAxios.post).toHaveBeenCalledWith('/test', postData);
    });

    it('POSTリクエストが失敗した場合、エラーを処理するのだ', async () => {
      const mockError = new Error('テストエラー');
      const postData = { test: 'データ' };
      mockAxios.post.mockRejectedValueOnce(mockError);

      const mockErrorProcess = vi.fn();
      const { result } = renderHook(() => useHttp());

      await expect(
        result.current.post('/test', postData, mockErrorProcess),
      ).rejects.toThrow('テストエラー');

      expect(mockErrorProcess).toHaveBeenCalledWith(mockError);
    });
  });

  describe('put', () => {
    it('PUTリクエストが成功した場合、正しいデータを返すのだ', async () => {
      const mockData = { data: 'テストデータ' };
      const putData = { test: 'データ' };
      mockAxios.put.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useHttp());
      const response = await result.current.put('/test', putData);

      expect(response.data).toEqual(mockData);
      expect(mockAxios.put).toHaveBeenCalledWith('/test', putData);
    });
  });

  describe('delete', () => {
    it('DELETEリクエストが成功した場合、正しいデータを返すのだ', async () => {
      const mockData = { data: 'テストデータ' };
      mockAxios.delete.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useHttp());
      const response = await result.current.delete('/test');

      expect(response.data).toEqual(mockData);
      expect(mockAxios.delete).toHaveBeenCalledWith('/test', {
        params: undefined,
      });
    });
  });

  describe('patch', () => {
    it('PATCHリクエストが成功した場合、正しいデータを返すのだ', async () => {
      const mockData = { data: 'テストデータ' };
      const patchData = { test: 'データ' };
      mockAxios.patch.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useHttp());
      const response = await result.current.patch('/test', patchData);

      expect(response.data).toEqual(mockData);
      expect(mockAxios.patch).toHaveBeenCalledWith('/test', patchData);
    });
  });
});
