"use client"

import Link from "next/link"
import clsx from "clsx"
import { useFormState } from "react-dom"

import { createInvoice, updateInvoice } from "@/app/lib/actions"
import { InvoiceForm, SelectField } from "@/app/lib/definitions"
import { Button } from "@/app/ui/button"
import CurrencyField from "@/app/ui/edit/currency-field"
import DropdownLookupField from "@/app/ui/edit/dropdown-lookup-field"
import InvoiceStatusField from "@/app/ui/edit/status-edit"

export default function InvoiceEditForm({
  invoice,
  customers,
}: {
  invoice?: InvoiceForm
  customers: SelectField[]
}) {
  const initialState = { message: null, errors: {} }

  const action = invoice ? updateInvoice.bind(null, invoice.id) : createInvoice
  // const action = createInvoice
  const [state, dispatch] = useFormState(action, initialState)

  return (
    <form action={dispatch}>
      <div id={"form-error"} aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="mb-2 text-center text-sm text-red-500">
            {state.message}
          </p>
        )}
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <DropdownLookupField
          selectedId={invoice?.customer_id}
          source={customers}
          field="customerId"
          label="Cliente"
          placeholder="Selecione um cliente"
          errors={state.errors?.customerId}
        />

        <CurrencyField
          label="Valor do pedido"
          field="amount"
          value={invoice?.amount}
          errors={state.errors?.amount}
        />

        <InvoiceStatusField
          field="status"
          value={invoice?.status}
          errors={state.errors?.status}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pedidos"
          className={clsx(
            "flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600",
            "transition-colors hover:bg-gray-200"
          )}
        >
          Cancelar
        </Link>
        <Button type="submit">{invoice ? "Editar" : "Criar"} Pedido</Button>
      </div>
    </form>
  )
}
