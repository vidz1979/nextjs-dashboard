import { randomInt } from "crypto"
import { unstable_noStore as noStore } from "next/cache"
import { sql } from "@vercel/postgres"

import {
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  SelectField,
  User,
} from "./definitions"
import { formatCurrency } from "./utils"

async function simulateDelay(text: string, ms: number) {
  if (process.env.NODE_ENV == "development") {
    console.log("Simulating delay for", text)
    await new Promise((resolve) =>
      setTimeout(resolve, randomInt(ms * 0.7, ms * 1.3))
    )
  }
}

export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore()

  await simulateDelay("fetchRevenue", 2000)

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    const data = await sql<Revenue>`SELECT * FROM revenue`

    return data.rows
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch revenue data.")
  }
}

export async function fetchLatestInvoices() {
  noStore()

  await simulateDelay("fetchLatestInvoices", 2000)

  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }))
    return latestInvoices
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch the latest invoices.")
  }
}

export async function fetchCardData() {
  noStore()
  try {
    const invoiceSumPaidPromise = sql`SELECT SUM(amount) FROM invoices WHERE status = 'paid'`
    const invoiceSumPendingPromise = sql`SELECT SUM(amount) FROM invoices WHERE status = 'pending'`
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`

    const data = await Promise.all([
      invoiceSumPaidPromise,
      invoiceSumPendingPromise,
      invoiceCountPromise,
      customerCountPromise,
    ])

    return {
      totalPaidInvoices: formatCurrency(data[0].rows[0].sum ?? "0"),
      totalPendingInvoices: formatCurrency(data[1].rows[0].sum ?? "0"),
      numberOfInvoices: Number(data[2].rows[0].count ?? "0"),
      numberOfCustomers: Number(data[3].rows[0].count ?? "0"),
    }
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch statistics.")
  }
}

const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url,
        count(*) OVER() AS total_count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `

    return invoices.rows
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch invoices.")
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore()

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch total number of invoices.")
  }
}

export async function fetchInvoiceById(id: string) {
  noStore()

  await simulateDelay("fetchInvoiceById", 1000)

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }))

    return invoice[0]
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch invoice.")
  }
}

export async function fetchCustomers() {
  // noStore()

  await simulateDelay("fetchCustomers", 1000)

  try {
    const data = await sql<SelectField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `

    const customers = data.rows
    return customers
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch all customers.")
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore()
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }))

    return customers
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch customer table.")
  }
}

export async function getUser(email: string): Promise<User | undefined> {
  noStore()
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`
    return user.rows[0] as User
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}
