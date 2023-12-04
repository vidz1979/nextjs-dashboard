"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { signIn } from "@/auth"
import { sql } from "@vercel/postgres"
import { AuthError } from "next-auth"
import { z } from "zod"

const FormSchema = z.object({
  id: z.string().uuid().optional(),
  customerId: z
    .string({
      invalid_type_error: "Por favor selecione um cliente.",
    })
    .uuid(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Por favor digite um valor maior que $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Por favor selecione um status.",
  }),
  date: z.string(),
})

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor corrija os erros abaixo e tente novamente.",
    }
  }

  const data = FormSchema.parse({
    ...validatedFields.data,
    amount: validatedFields.data.amount * 100, // convert to cents
    date: new Date().toISOString().split("T")[0],
  })

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${data.customerId}, ${data.amount}, ${data.status}, ${data.date})
    `
  } catch (error) {
    return { message: "Erro de banco de dados: Falha ao criar pedido" }
  }

  revalidatePath("/dashboard/pedidos")
  redirect("/dashboard/pedidos")
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor corrija os erros abaixo e tente novamente.",
    }
  }

  const data = FormSchema.parse({
    ...validatedFields.data,
    amount: validatedFields.data.amount * 100, // convert to cents
    date: new Date().toISOString().split("T")[0],
  })

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${data.customerId}, amount = ${data.amount}, status = ${data.status}
      WHERE id = ${id}
    `
  } catch (error) {
    return { message: "Erro de banco de dados: Falha ao atualizar pedido" }
  }

  revalidatePath("/dashboard/pedidos")
  redirect("/dashboard/pedidos")
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`
  } catch (error) {
    return { message: "Erro de banco de dados: Falha ao deletar pedido" }
  }

  revalidatePath("/dashboard/pedidos")
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciais inválidas."
        default:
          return "Aconteceu um erro inesperado."
      }
    }
    throw error
  }
}
