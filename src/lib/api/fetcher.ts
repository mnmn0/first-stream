export const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then(r => r.json());
