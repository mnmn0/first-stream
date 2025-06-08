import axios, {type AxiosError, type AxiosResponse} from 'axios';
import useSWR, {type SWRConfiguration} from 'swr';

const api = axios.create({
  baseURL: process.env.VITE_APP_API_ENDPOINT,
});

const fetcher = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchWithParams = async ([url, params]: [
  string,
  Record<string, unknown>,
]) => {
  const res = await api.get(url, {
    params,
  });
  return res.data;
};

/**
 * Hooks for Http Request
 * @returns
 */
export const useHttp = () => {
  // const alert = useAlertSnackbar();

  return {
    /**
     * GET Request
     * Implemented with SWR
     * @param url
     * @param config
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: <Data = unknown, Error = unknown>(
      url: string | [string, ...unknown[]] | null,
      config?: SWRConfiguration,
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSWR<Data, AxiosError<Error>>(
        url,
        typeof url === 'string' ? fetcher : fetchWithParams,
        {
          ...config,
        },
      );
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getOnce: <RES = unknown, DATA = unknown>(
      url: string,
      params?: DATA,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorProcess?: (err: unknown) => void,
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .get<RES, AxiosResponse<RES>, DATA>(url, {
            params,
          })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            if (errorProcess) {
              errorProcess(err);
            } else {
              // alert.openError(getErrorMessage(err));
            }
            reject(err);
          });
      });
    },

    /**
     * POST Request
     * @param url
     * @param data
     * @param errorProcess
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: <RES = any, DATA = any>(
      url: string,
      data: DATA,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorProcess?: (err: unknown) => void,
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .post<RES, AxiosResponse<RES>, DATA>(url, data)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            if (errorProcess) {
              errorProcess(err);
            } else {
              // alert.openError(getErrorMessage(err));
            }
            reject(err);
          });
      });
    },

    /**
     * PUT Request
     * @param url
     * @param data
     * @param errorProcess
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put: <RES = any, DATA = any>(
      url: string,
      data: DATA,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorProcess?: (err: unknown) => void,
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .put<RES, AxiosResponse<RES>, DATA>(url, data)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            if (errorProcess) {
              errorProcess(err);
            } else {
              // alert.openError(getErrorMessage(err));
            }
            reject(err);
          });
      });
    },
    /**
     * DELETE Request
     * @param url
     * @param params
     * @param errorProcess
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: <RES = any, DATA = any>(
      url: string,
      params?: DATA,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorProcess?: (err: unknown) => void,
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .delete<RES, AxiosResponse<RES>, DATA>(url, {
            params,
          })
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            if (errorProcess) {
              errorProcess(err);
            } else {
              // alert.openError(getErrorMessage(err));
            }
            reject(err);
          });
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    patch: <RES = any, DATA = any>(
      url: string,
      data: DATA,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorProcess?: (err: unknown) => void,
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .patch<RES, AxiosResponse<RES>, DATA>(url, data)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            if (errorProcess) {
              errorProcess(err);
            } else {
              // alert.openError(getErrorMessage(err));
            }
            reject(err);
          });
      });
    },
  };
};
