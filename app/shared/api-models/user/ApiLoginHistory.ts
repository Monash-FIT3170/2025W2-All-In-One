export type ApiLoginEntry = {
  loginAt: string; // ISO string for client simplicity
  timezone: string;
};

export type ApiLoginHistoryPage = {
  items: ApiLoginEntry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};



