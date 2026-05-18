"use client";

interface Props {
  onDraft: () => void;
  onSubmit: () => void;
  flash: string;
  hasDraft: boolean;
}

export default function ActionButtons({ onDraft, onSubmit, flash, hasDraft }: Props) {
  return (
    <div className="flex items-center justify-between pt-2">
      {/* Flash message */}
      <div className="h-5">
        {flash && (
          <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {flash}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Create draft — only show if no draft exists yet */}
        {!hasDraft && (
          <button
            onClick={onDraft}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Create Draft
          </button>
        )}

        {/* Submit */}
        <button
          onClick={onSubmit}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-all active:scale-[0.98]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {hasDraft ? "Submit Draft" : "Submit"}
        </button>
      </div>
    </div>
  );
}