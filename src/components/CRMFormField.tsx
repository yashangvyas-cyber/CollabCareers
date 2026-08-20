/**
 * Form primitives copied from the CollabCRM staging DOM (Edit Candidate /
 * Add Candidate screens). Every class string here is verbatim from the live app
 * — see CollabCrawl `modules/recruitment/dom/candidate_edit_0.html`.
 *
 * Staging nesting for one field:
 *   <div>
 *     <div><div class="flex items-end min-h-6"><label class="label">…</label>
 *          <span class="text-error-500 pe-1">*</span></div><div></div></div>
 *     <div class="rounded-lg relative mt-1.5"><input class="…" /></div>
 *   </div>
 * Selects are react-select, so they render as a styled control div rather than
 * a native <select>.
 */
import { ReactNode } from 'react';

/** Verbatim staging input class. */
export const INPUT_CLASS =
  'rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white w-full 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs placeholder:!text-gray-450';

/** Label row — staging wraps the label in its own div pair. */
export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div>
      <div className="flex items-end min-h-6">
        <label className="label">{label}&nbsp;</label>
        {required && <span className="text-error-500 pe-1">*</span>}
      </div>
      <div />
    </div>
  );
}

/** A labelled field. `children` is the control, already styled. */
export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="rounded-lg relative mt-1.5">{children}</div>
    </div>
  );
}

/** Plain text input, staging classes. */
export function TextField({
  label,
  required,
  value,
  onChange,
  type = 'text',
  maxLength,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label} required={required}>
      <input
        type={type}
        required={required}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </Field>
  );
}

/** The react-select chevron, copied from staging (20px, fill #ccc). */
function SelectChevron() {
  return (
    <div className="2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__indicators css-1wy0on6">
      <div
        className="2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__indicator 2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__dropdown-indicator css-1xc3v61-indicatorContainer"
        aria-hidden="true"
      >
        <svg className="transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.9999 13.9394L17.4696 8.46973L18.5303 9.53039L11.9999 16.0607L5.46961 9.53039L6.53027 8.46973L11.9999 13.9394Z" fill="#ccc" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Select styled as staging's react-select control. A native <select> is layered
 * over it transparently so the control stays keyboard- and screen-reader-usable
 * without pulling react-select into the prototype.
 */
export function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  disabled,
  placeholder = 'Select',
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className={disabled ? 'cursor-not-allowed mt-1.5' : 'mt-1.5'}>
        <div
          className={`w-full 2xl:text-sm 2xl-to-xl:text-xs text-xs css-b62m3t-container relative ${
            disabled ? 'react-select--is-disabled' : ''
          }`}
        >
          <div
            className={`2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__control rounded-lg border bg-white flex items-center justify-between px-3 2xl:h-10 2xl-to-xl:h-9 h-9 ${
              disabled ? 'border-gray-300 bg-gray-50' : 'border-gray-300'
            }`}
          >
            <div className="2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__value-container flex-1 min-w-0">
              {value ? (
                <div className={`2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__single-value truncate ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
                  {value}
                </div>
              ) : (
                <div className="2xl:text-sm 2xl-to-xl:text-xs text-xs react-select__placeholder text-gray-450">{placeholder}</div>
              )}
            </div>
            <SelectChevron />
          </div>
          {!disabled && (
            <select
              required={required}
              value={value}
              onChange={e => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="">{placeholder}</option>
              {options.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A field that is shown but not editable. Staging renders these as the same
 * control, greyed and non-interactive (`cursor-not-allowed`, disabled input /
 * `react-select--is-disabled`) rather than as plain text.
 */
export function LockedField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <FieldLabel label={label} />
      <div className="rounded-lg relative mt-1.5 cursor-not-allowed">
        <input
          type="text"
          value={value || '–'}
          disabled
          readOnly
          className={`${INPUT_CLASS} !bg-gray-50 !text-gray-500 cursor-not-allowed`}
        />
      </div>
    </div>
  );
}

/**
 * One section of a CollabCRM form: left 1/4 title + hint, right 3/4 white card.
 * `id` mirrors the anchor ids staging puts on each section
 * (business_unit, application_information, candidate_Information, …).
 */
export function FormSection({
  id,
  title,
  hint,
  children,
  cols = 3,
  first,
}: {
  id: string;
  title: string;
  hint: string;
  children: ReactNode;
  cols?: 2 | 3 | 4;
  first?: boolean;
}) {
  const colClass = cols === 4 ? 'lg:grid-cols-4' : cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
  return (
    <div id={id} className={`flex lg:flex-row flex-col gap-2${first ? '' : ' 2xl:mt-4 mt-3'}`}>
      <div className="2xl:w-1/4 2xl-to-xl:w-[20%] w-[20%]">
        <div className="flex items-center min-h-6">
          <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-medium">{title}</p>
        </div>
        <p className="text-gray-400 2xl:text-xs 2xl-to-xl:text-xxs text-xxs mt-1 max-w-[80%] w-full">{hint}</p>
      </div>
      <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
        <div className={`grid grid-cols-1 ${colClass} gap-3`}>{children}</div>
      </div>
    </div>
  );
}
