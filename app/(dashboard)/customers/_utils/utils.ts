export const formatYen = (amount: number): string => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};

export const CUSTOMER_STATUS_CONFIG = {
  active: { label: "Active", className: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  inactive: { label: "Inactive", className: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-400" },
  pending_payment: { label: "Pending Payment", className: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

export const SUPPLIER_TYPE_CONFIG = {
  auction: { label: "Auction", className: "bg-blue-50 text-blue-700 border-blue-200" },
  dealer: { label: "Dealer", className: "bg-purple-50 text-purple-700 border-purple-200" },
  local_supplier: { label: "Local Supplier", className: "bg-orange-50 text-orange-700 border-orange-200" },
};