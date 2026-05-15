export const formatYen = (amount: number): string => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};
