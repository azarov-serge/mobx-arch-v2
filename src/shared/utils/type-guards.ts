import { AxiosResponse } from 'axios';

export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

export const isAxiosResponse = (value: unknown): value is AxiosResponse =>
  isObject(value) && 'data' in value && 'status' in value;
