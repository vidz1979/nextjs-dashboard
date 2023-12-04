import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline"

import { InvoiceStatus } from "@/app/lib/definitions"
import FieldErrors from "@/app/ui/edit/field-errors"

export default function InvoiceStatusField({
  field,
  value,
  required = false,
  errors = [],
}: {
  field: string
  value?: InvoiceStatus
  required?: boolean
  errors?: string[]
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">
        Status do pedido
      </legend>
      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              id="pending"
              name={field}
              type="radio"
              value="pending"
              defaultChecked={value === "pending"}
              required={required}
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
              aria-describedby={field + "-error"}
            />
            <label
              htmlFor="pending"
              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
            >
              Pendente <ClockIcon className="h-4 w-4" />
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="paid"
              name={field}
              type="radio"
              value="paid"
              defaultChecked={value === "paid"}
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
              aria-describedby={field + "-error"}
            />
            <label
              htmlFor="paid"
              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
            >
              Pago <CheckIcon className="h-4 w-4" />
            </label>
          </div>
        </div>
      </div>
      <FieldErrors id={field + "-error"} errors={errors} />
    </fieldset>
  )
}
