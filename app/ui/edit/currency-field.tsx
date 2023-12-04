import { CurrencyDollarIcon } from "@heroicons/react/24/outline"

import FieldErrors from "@/app/ui/edit/field-errors"

export default function CurrencyField({
  label,
  field,
  value,
  placeholder,
  required = false,
  errors = [],
}: {
  label?: string
  field: string
  value?: number
  placeholder?: string
  required?: boolean
  errors?: string[]
}) {
  return (
    <div className="mb-4">
      <label htmlFor={field} className="mb-2 block text-sm font-medium">
        {label ?? field}
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id={field}
            name={field}
            type="number"
            step="0.01"
            defaultValue={value}
            required={required}
            aria-describedby={field + "-error"}
            placeholder={placeholder ?? "Digite o valor em R$"}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <FieldErrors id={field + "-error"} errors={errors} />
    </div>
  )
}
