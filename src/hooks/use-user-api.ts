import type { User } from '@/types/user';
import useHttp from './use-http';

/**
 * ユーザーに関連するAPIを呼び出すカスタムフック
 *
 * @returns ユーザー関連APIの呼び出しをまとめたオブジェクト
 */
const useUserApi = () => {
  const http = useHttp();

  return {
    /**
     * 全ユーザーを取得する
     *
     * @param refreshIntervalFunction - 更新間隔を指定する関数
     * @returns ユーザー一覧
     */
    users: (refreshIntervalFunction?: (data?: User[]) => number) => {
      return http.get<User[]>('user', {
        refreshInterval: refreshIntervalFunction,
      });
    },
    /**
     * 指定したユーザーIDの情報を取得する
     *
     * @param userId - ユーザーID
     * @returns ユーザーの詳細情報
     */
    getUser: (userId: string) => {
      return http.getOnce<User>(`user/${userId}`);
    },
    /**
     * 指定したemailの情報を取得する
     *
     * @param email - email
     * @returns ユーザーの詳細情報
     */
    getUserByEmail: (email: string) => {
      return http.get<User>(email ? `user/search/${email}` : null);
    },
  };
};

export default useUserApi;
