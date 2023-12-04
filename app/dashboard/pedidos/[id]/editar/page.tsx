import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data"
import Breadcrumbs from "@/app/ui/breadcrumbs"
import NotFound from "@/app/ui/not-found"
import InvoiceEditForm from "@/app/ui/pedidos/edit-form"

export default async function InvoiceEditPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params.id
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])

  if (!invoice) {
    return (
      <NotFound
        message="Pedido solicitado não encontrado"
        backlink="/dashboard/pedidos"
      />
    )
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Pedidos", href: "/dashboard/pedidos" },
          {
            label: "Edit Invoice",
            href: `/dashboard/pedidos/${id}/editar`,
            active: true,
          },
        ]}
      />
      <InvoiceEditForm invoice={invoice} customers={customers} />
    </main>
  )
}
