import { fetchCustomers } from "@/app/lib/data"
import Breadcrumbs from "@/app/ui/breadcrumbs"
import InvoiceEditForm from "@/app/ui/pedidos/edit-form"

export default async function InvoiceCreatePage() {
  const [customers] = await Promise.all([fetchCustomers()])

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Pedidos", href: "/dashboard/pedidos" },
          {
            label: "Criar Pedido",
            href: "/dashboard/pedidos/novo",
            active: true,
          },
        ]}
      />
      <InvoiceEditForm customers={customers} />
    </main>
  )
}
