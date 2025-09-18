"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "/app/client/ui-modules/theming-shadcn/Dialog";
import { useAppSelector } from "/app/client/store";
import { apiGetLoginHistory } from "/app/client/library-modules/apis/user/user-account-api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginHistoryModal({ isOpen, onClose }: Props): React.JSX.Element {
  const authUser = useAppSelector((s) => s.currentUser.authUser);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [items, setItems] = React.useState<{ loginAt: string; timezone: string }[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const userId = authUser?.userId;

  const load = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await apiGetLoginHistory(userId, page, pageSize);
      setItems(res.items);
      setTotalPages(res.totalPages);
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, pageSize]);

  React.useEffect(() => {
    if (isOpen) {
      void load();
    }
  }, [isOpen, load]);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Login History</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-gray-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">No logins yet.</div>
          ) : (
                         <ul className="divide-y">
               {items.map((it, idx) => (
                 <li key={idx} className="p-3 text-sm">
                   <div className="font-medium text-black">
                     {new Date(it.loginAt).toLocaleString()}
                   </div>
                   <div className="text-gray-600 text-xs">
                     {it.timezone}
                   </div>
                 </li>
               ))}
             </ul>
          )}
        </div>
        <div className="flex items-center justify-between pt-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm text-gray-700">Page {page} of {totalPages}</div>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



