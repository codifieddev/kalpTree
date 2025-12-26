import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search } from "lucide-react";

export default function page() {
  const rows = [
    { id: "INV-10029", date: "Dec 02, 2025", amount: "$79.00", status: "paid", method: "Visa •••• 4242" },
    { id: "INV-10011", date: "Nov 02, 2025", amount: "$79.00", status: "paid", method: "Visa •••• 4242" },
    { id: "INV-09984", date: "Oct 02, 2025", amount: "$79.00", status: "paid", method: "Visa •••• 4242" },
    { id: "INV-09931", date: "Sep 02, 2025", amount: "$79.00", status: "failed", method: "Visa •••• 4242" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment history</h1>
          <p className="mt-1 text-sm text-slate-600">
            View invoices, payments, and download receipts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button>Download all</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input className="pl-9" placeholder="Search invoice id, amount, status…" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">This month</Button>
            <Button variant="outline">Last 3 months</Button>
            <Button variant="outline">This year</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment method</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold text-slate-900">{r.id}</TableCell>
                    <TableCell className="text-slate-600">{r.date}</TableCell>
                    <TableCell className="text-slate-900">{r.amount}</TableCell>
                    <TableCell>
                      {r.status === "paid" ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">Paid</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{r.method}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!rows.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <div>Showing {rows.length} invoices</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
