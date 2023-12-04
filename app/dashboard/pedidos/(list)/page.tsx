import { Suspense } from "react"

import { fetchInvoicesPages } from "@/app/lib/data"
import { CreateButton } from "@/app/ui/button"
import { lusitana } from "@/app/ui/fonts"
import Pagination from "@/app/ui/pagination"
import Table from "@/app/ui/pedidos/table"
import Search from "@/app/ui/search"
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"

export default async function InvoicesListPage({
  searchParams,
}: {
  searchParams?: {
    q?: string
    page?: string
  }
}) {
  const query = searchParams?.q || ""
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchInvoicesPages(query)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Pedidos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar pedidos..." />
        <CreateButton url="/dashboard/pedidos/novo" label="Criar pedido" />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
