import { Suspense } from "react"

import { CreateButton } from "@/app/ui/button"
import Table from "@/app/ui/clientes/table"
import { lusitana } from "@/app/ui/fonts"
import Pagination from "@/app/ui/pagination"
import Search from "@/app/ui/search"
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"

export default async function ClientesListPage({
  searchParams,
}: {
  searchParams?: {
    q?: string
    page?: string
  }
}) {
  const query = searchParams?.q || ""
  const currentPage = Number(searchParams?.page) || 1
  // const totalPages = await fetchInvoicesPages(query)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar clientes..." />
        <CreateButton url="/dashboard/clientes/novo" label="Inserir cliente" />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={1} />
      </div>
    </div>
  )
}
