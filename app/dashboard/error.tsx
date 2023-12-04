"use client"

import { useEffect } from "react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.log("Ocorreu um erro:", error)
  }, [error])

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <ExclamationTriangleIcon className="w-16 text-red-500" />
      <h2 className="text-center">Ocorreu um erro inesperado!</h2>

      <button
        className="mt-6 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Tentar novamente
      </button>
    </main>
  )
}
