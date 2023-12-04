import Link from "next/link"
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"

export function CreateButton({ url, label }: { url: string; label: string }) {
  return (
    <Link
      href={url}
      className={clsx(
        "flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors",
        "hover:bg-blue-500 focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      )}
    >
      <span className="hidden md:block">{label}</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function UpdateButton({ url }: { url: string }) {
  return (
    <Link href={url} className="rounded-md border p-2 hover:bg-gray-100">
      <PencilIcon className="w-5" />
    </Link>
  )
}

export function DeleteButton({ action }: { action: () => Promise<any> }) {
  return (
    <form action={action}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Deletar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  )
}
