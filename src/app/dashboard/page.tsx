import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoices, getRevenueOverTime } from "@/lib/data"
import { CreditCard, Users, DollarSign, Activity } from "lucide-react"
import { RevenueChart } from "@/components/dashboard/revenue-chart"

export default async function DashboardPage() {
  const invoices = await getInvoices()
  const revenueData = await getRevenueOverTime()

  const totalInvoices = invoices.length
  const totalAmount = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0)
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Invoices
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{new Set(invoices.map(i => i.client_name)).size}</div>
            <p className="text-xs text-muted-foreground">
              Active clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paid Invoices
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{paidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Processed this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <div className="text-sm text-muted-foreground">
                You made {paidInvoices} sales this month.
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
                {invoices.slice(0, 5).map(inv => (
                    <div key={inv.id} className="flex items-center">
                        <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{inv.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                            {inv.status}
                        </p>
                        </div>
                        <div className="ml-auto font-medium">+${inv.amount?.toFixed(2)}</div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

