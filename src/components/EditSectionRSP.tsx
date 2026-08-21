/**
 * Right side panel for section-wise editing, copied from the CollabCRM staging
 * DOM (`modules/payroll/dom/cfg_loan_edit_rsp.html` — "Edit Request Type").
 *
 * Staging shell, verbatim:
 *   <div class="fixed inset-0 overflow-hidden">
 *     <div class="absolute inset-0 overflow-hidden">
 *       <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
 *         <div class="pointer-events-auto w-[560px]">…
 * Header is `p-4 border-b border-gray-200 sticky top-0 bg-white z-50` with an
 * `icon-x-close` absolute at top-right; the footer holds Cancel + Save.
 *
 * Each panel saves only its own section — there is no page-level save.
 */
import { ReactNode } from 'react';
import { X } from 'lucide-react';

export default function EditSectionRSP({
  title,
  subject,
  onClose,
  onSave,
  children,
}: {
  /** e.g. "Edit Professional Details" */
  title: string;
  /** Indigo suffix after the dash — the candidate's name on staging. */
  subject?: string;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 overflow-hidden z-[200]">
      {/* Backdrop — click to dismiss, same as the headlessui dialog on staging. */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
        <div className="pointer-events-auto w-[560px] max-w-[100vw]">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-50 relative">
              <h1 className="2xl:text-lg 2xl-to-xl:text-base text-base font-semibold">
                <span>
                  {title}
                  {subject && <> - <span className="text-indigo-600">{subject}</span></>}
                </span>
              </h1>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-xl text-gray-500 absolute 2xl:top-[22px] top-[18px] right-[22px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={e => { e.preventDefault(); onSave(); }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="p-4 space-y-4 overflow-y-auto flex-1">{children}</div>

              {/* Footer — Cancel + Save, staging button class strings. */}
              <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="outline-none rounded-lg disabled:cursor-not-allowed disabled:opacity-100 hover:opacity-90 px-4 bg-white 2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-semibold border border-gray-300 2xl:py-1.5 py-1 2xl:h-9 2xl-to-xl:h-8 h-8"
                >
                  <div className="flex items-center justify-center gap-2">Cancel</div>
                </button>
                <button
                  type="submit"
                  className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white 2xl:py-1.5 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs relative"
                >
                  <div className="flex items-center justify-center gap-2">Save</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
