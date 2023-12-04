import Image from "next/image"
import clsx from "clsx"

import { deleteInvoice } from "@/app/lib/actions"
import { fetchFilteredInvoices } from "@/app/lib/data"
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils"
import { DeleteButton, UpdateButton } from "@/app/ui/button"
import InvoiceStatusPill from "@/app/ui/display/status-pill"

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const pedidos = await fetchFilteredInvoices(query, currentPage)

  function desktopVersion() {
    return (
      <table className="table text-gray-900">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              Cliente
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              E-mail
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              Valor
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              Data
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              Status
            </th>
            <th scope="col" className="relative py-3 pl-6 pr-3">
              <span className="sr-only">Editar</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {pedidos?.map((pedido) => (
            <tr
              key={pedido.id}
              className={clsx(
                "w-full border-b py-3 text-sm last-of-type:border-none",
                "[&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg",
                "[&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              )}
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={pedido.image_url}
                    className="rounded-full"
                    width={28}
                    height={28}
                    alt={`${pedido.name}'s profile picture`}
                  />
                  <p>{pedido.name}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-3">{pedido.email}</td>
              <td className="whitespace-nowrap px-3 py-3">
                {formatCurrency(pedido.amount)}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {formatDateToLocal(pedido.date)}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                <InvoiceStatusPill status={pedido.status} />
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                  <UpdateButton
                    url={`/dashboard/pedidos/${pedido.id}/editar`}
                  />
                  <DeleteButton action={deleteInvoice.bind(null, pedido.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  function mobileVersion() {
    return pedidos?.map((pedido) => (
      <div key={pedido.id} className="mb-2 w-full rounded-md bg-white p-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <div className="mb-2 flex items-center">
              <Image
                src={pedido.image_url}
                className="mr-2 rounded-full"
                width={28}
                height={28}
                alt={`${pedido.name}'s profile picture`}
              />
              <p>{pedido.name}</p>
            </div>
            <p className="text-sm text-gray-500">{pedido.email}</p>
          </div>
          <InvoiceStatusPill status={pedido.status} />
        </div>
        <div className="flex w-full items-center justify-between pt-4">
          <div>
            <p className="text-xl font-medium">
              {formatCurrency(pedido.amount)}
            </p>
            <p>{formatDateToLocal(pedido.date)}</p>
          </div>
          <div className="flex justify-end gap-2">
            <UpdateButton url={`/dashboard/pedidos/${pedido.id}/editar`} />
            <DeleteButton action={deleteInvoice.bind(null, pedido.id)} />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">{mobileVersion()}</div>
          <div className="hidden min-w-full md:block">{desktopVersion()}</div>
        </div>
      </div>
    </div>
  )
}
