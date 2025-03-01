export type ResourceMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ResourceErrorData = {
  status: number;
  message: string;
};

export type ResourceInterface = {
  /** Уникальный ключ ресурса */
  key: string;
  url: string;
  method: ResourceMethod;
};
