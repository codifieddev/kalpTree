"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard, Plus, ShieldCheck, Trash2 } from "lucide-react";

type Method = {
  id: string;
  brand: "visa" | "mastercard";
  last4: string;
  exp: string;
  default: boolean;
};

export default function page() {
  const [methods, setMethods] = useState<Method[]>([
    { id: "pm_1", brand: "visa", last4: "4242", exp: "12/27", default: true },
    { id: "pm_2", brand: "mastercard", last4: "4444", exp: "08/26", default: false },
  ]);

  const setDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, default: m.id === id })));
  };

  const removeMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment methods</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your cards and billing security.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add new card
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add payment method</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">Name on card</div>
                  <Input placeholder="John Doe" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">ZIP / Postal</div>
                  <Input placeholder="10001" />
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">Card number</div>
                <Input placeholder="4242 4242 4242 4242" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">Expiry</div>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">CVC</div>
                  <Input placeholder="123" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  This is UI only — connect your Stripe/Payment API here.
                </div>
                <Button onClick={() => {}}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Methods list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saved cards</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {methods.map((m) => (
            <div key={m.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-slate-50">
                    <CreditCard className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-slate-900">
                        {m.brand.toUpperCase()} •••• {m.last4}
                      </div>
                      {m.default ? <Badge className="bg-slate-900 hover:bg-slate-900">Default</Badge> : null}
                    </div>
                    <div className="text-sm text-slate-600">Expires {m.exp}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!m.default ? (
                    <Button variant="outline" onClick={() => setDefault(m.id)}>
                      Set default
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Default
                    </Button>
                  )}

                  <Button variant="destructive" onClick={() => removeMethod(m.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {!methods.length ? (
            <div className="rounded-lg border bg-white p-8 text-center">
              <div className="text-sm font-semibold text-slate-900">No payment methods</div>
              <div className="mt-1 text-sm text-slate-600">Add a card to pay for subscriptions.</div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Billing security + address */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md border bg-slate-50">
                <ShieldCheck className="h-5 w-5 text-slate-800" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">PCI compliant storage</div>
                <div className="text-sm text-slate-600">
                  Your card data should be handled by Stripe (or your provider), not stored in your DB.
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-sm text-slate-600">
              Recommended: enable “3DS / SCA” and keep billing webhooks for invoice status updates.
            </div>

            <div className="flex gap-2">
              <Button variant="outline">View webhook logs</Button>
              <Button variant="outline">Configure provider</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">Company</div>
                <Input placeholder="Codified Web Solutions" />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">Tax ID / GST</div>
                <Input placeholder="Optional" />
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-slate-600">Address</div>
              <Input placeholder="Street / Area" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">City</div>
                <Input placeholder="Jaipur" />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">State</div>
                <Input placeholder="Rajasthan" />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">ZIP</div>
                <Input placeholder="302001" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save address</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
