// components/PaymentHistory.tsx
import React from "react";

// Define the Payment interface
interface Payment {
  id: string;
  month: string;
  amount: number;
  paidOn: string;
  status: "paid" | "pending" | "overdue";
}

interface PaymentHistoryProps {
  payments: Payment[];
  onViewAllClick?: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  onViewAllClick = () => console.log("View payment history clicked"),
}) => {
  // Function to render the payment status badge
  const renderStatusBadge = (status: Payment["status"]) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
    };

    const statusText = {
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
    };

    return (
      <span
        className={`px-4 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
      >
        {statusText[status]}
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
      <h2 className="text-3xl font-bold mb-2">Payment History</h2>
      <p className="text-gray-600 mb-6">Recent rent and utility payments</p>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{payment.month}</h3>
                <p className="text-gray-500">Paid on {payment.paidOn}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold">
                  ${payment.amount.toLocaleString()}
                </span>
                {renderStatusBadge(payment.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAllClick}
        className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
      >
        View Payment History
      </button>
    </div>
  );
};

export default PaymentHistory;
