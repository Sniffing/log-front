import { AxiosResponse } from 'axios';

export function generateMockAxisResponse<T>(data?: T): Promise<AxiosResponse<T>> {
  return Promise.resolve({
    data: data ?? undefined,
    status: 200,
    statusText: '',
    headers: '',
    config: {}
  });
}