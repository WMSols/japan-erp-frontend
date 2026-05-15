"use client";

interface ScrollableTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps any <table> in a horizontally scrollable container.
 * On small screens the table scrolls; on large screens it fills naturally.
 */
export default function ScrollableTable({ children, className = "" }: ScrollableTableProps) {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-gray-100 ${className}`}>
      <table className="w-full min-w-[640px] text-sm border-collapse">
        {children}
      </table>
    </div>
  );
}

// ── Shared table primitives ───────────────────────────────────────────────────

export function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100 whitespace-nowrap ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  right,
  mono,
  muted,
  className = "",
}: {
  children: React.ReactNode;
  right?: boolean;
  mono?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <td
      className={[
        "px-4 py-3 border-b border-gray-50 whitespace-nowrap",
        right ? "text-right" : "text-left",
        mono ? "font-mono text-xs" : "text-sm",
        muted ? "text-gray-400" : "text-gray-700",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}