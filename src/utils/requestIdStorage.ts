// src/utils/requestIdStorage.ts

const REQUEST_ID_KEY = 'userFlowRequestId';

export const saveRequestId = (id: string): void => {
  localStorage.setItem(REQUEST_ID_KEY, id);
};

export const getRequestId = (): string | null => {
  return localStorage.getItem(REQUEST_ID_KEY);
};

export const clearRequestId = (): void => {
  localStorage.removeItem(REQUEST_ID_KEY);
};