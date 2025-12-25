import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Globe,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Crown,
  BadgeCheck,
} from "lucide-react";

type Business = {
  id: string;
  name: string;
  subtext?: string; // like "Agency panel" / "Franchise panel"
  websitesCount?: number;
  membersCount?: number;
  status?: "active" | "paused";
  plan?: "Free" | "Pro" | "Agency";
  primaryDomain?: string;
  href: string; // open business dashboard
};

function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "neutral" | "purple" | "green" | "amber";
}) {
  const cls =
    variant === "purple"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : variant === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : variant === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function BusinessIcon({ tone = "blue" }: { tone?: "blue" | "dark" | "purple" }) {
  const bg =
    tone === "purple" ? "bg-purple-600" : tone === "dark" ? "bg-slate-900" : "bg-[#0b6d8e]";
  return (
    <div className={`h-14 w-14 rounded-md ${bg} grid place-items-center text-white font-bold`}>
      <Users className="h-6 w-6" />
    </div>
  );
}

export default async function Website() {
  // ✅ Replace this demo with your API later
  const businesses: Business[] = [
    {
      id: "b1",
      name: "TEST1",
      subtext: "Franchise panel",
      websitesCount: 3,
      membersCount: 12,
      status: "active",
      plan: "Agency",
      primaryDomain: "test.localhost:55803",
      href: "/admin/businesses/test1",
    },
    {
      id: "b2",
      name: "Creative Consult",
      subtext: "Agency panel",
      websitesCount: 8,
      membersCount: 6,
      status: "active",
      plan: "Pro",
      primaryDomain: "creativeconsult.co.in",
      href: "/admin/businesses/creative-consult",
    },
    {
      id: "b3",
      name: "Goodyear Live",
      subtext: "Business panel",
      websitesCount: 1,
      membersCount: 3,
      status: "paused",
      plan: "Free",
      primaryDomain: "livegoodyear.creativeconsult.co.in",
      href: "/admin/businesses/goodyear-live",
    },
  ];

  return (
    <div className="w-full max-w-[1200px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[26px] font-semibold text-slate-900">Businesses</h2>
        <p className="text-sm text-muted-foreground">
          Manage businesses, switch context, and open a dashboard for each.
        </p>
      </div>

      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Card className="rounded-md border bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-slate-100 grid place-items-center">
                <Sparkles className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Quick tip</div>
                <div className="text-xs text-muted-foreground">
                  Create a new business to separate websites, users, and billing.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/rolesandpermission">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Roles & Permissions
            </Link>
          </Button>

          <Button asChild className="rounded-full">
            <Link href="/admin/businesses/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* List (Hostinger-ish cards) */}
      <div className="space-y-4">
        {businesses.map((b, idx) => {
          const planBadge =
            b.plan === "Agency" ? (
              <Badge variant="purple">
                <Crown className="mr-1 h-3.5 w-3.5" />
                Agency
              </Badge>
            ) : b.plan === "Pro" ? (
              <Badge variant="green">
                <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                Pro
              </Badge>
            ) : (
              <Badge>Free</Badge>
            );

          const statusBadge =
            b.status === "active" ? (
              <Badge variant="green">Active</Badge>
            ) : (
              <Badge variant="amber">Paused</Badge>
            );

          return (
            <Card key={b.id} className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}
                  <div className="flex items-start gap-5">
                    <BusinessIcon tone={idx % 3 === 0 ? "blue" : idx % 3 === 1 ? "dark" : "purple"} />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[26px] font-semibold text-slate-900 truncate">
                          {b.name}
                        </div>
                        <Link href={b.href} className="text-slate-400 hover:text-slate-600">
                          <ExternalLink className="h-5 w-5" />
                        </Link>

                        {planBadge}
                        {statusBadge}
                      </div>

                      {b.subtext ? (
                        <div className="mt-1 text-sm text-muted-foreground">{b.subtext}</div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button
                          asChild
                          variant="secondary"
                          className="h-10 rounded-full px-4 text-sm font-semibold text-white"
                        >
                          <Link href={`${b.href}/websites`} className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                             Websites{" "}
                            <span className="ml-1 rounded-full bg-white/50 px-2 py-0.5 text-xs">
                              {b.websitesCount ?? 0}
                            </span>
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          className="h-10 rounded-full px-4 text-sm font-semibold text-white"
                        >
                          <Link href={`${b.href}/users`} className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Members{" "}
                            <span className="ml-1 rounded-full bg-white/50 px-2 py-0.5 text-xs">
                              {b.membersCount ?? 0}
                            </span>
                          </Link>
                        </Button>

                        {b.primaryDomain ? (
                          <Badge>
                            <Globe className="mr-1 h-3.5 w-3.5" />
                            {b.primaryDomain}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                    <Button asChild variant="outline" className="h-10 rounded-xl px-5 text-sm font-semibold">
                      <Link href={`${b.href}/settings`} className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-10 rounded-xl px-5 text-sm font-semibold">
                      <Link href={b.href} className="flex items-center gap-2">
                        Open Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
