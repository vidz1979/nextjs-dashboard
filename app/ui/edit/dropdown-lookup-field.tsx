import { UserCircleIcon } from "@heroicons/react/24/outline"

import { SelectField } from "@/app/lib/definitions"
import FieldErrors from "@/app/ui/edit/field-errors"

export default function DropdownLookupField({
  selectedId,
  source,
  label,
  field,
  placeholder = "Selecione uma opção",
  required = false,
  errors = [],
}: {
  selectedId?: string | null
  source: SelectField[]
  label?: string
  field: string
  placeholder?: string
  required?: boolean
  errors?: string[]
}) {
  label = label ?? (field[0].toUpperCase() + field.slice(1)).replace("_", " ")
  return (
    <div className="mb-4">
      <label htmlFor={field} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          id={field}
          name={field}
          required={required}
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue={selectedId ?? ""}
          aria-describedby={field + "-error"}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {source.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <FieldErrors id={field + "-error"} errors={errors} />
    </div>
  )
}
