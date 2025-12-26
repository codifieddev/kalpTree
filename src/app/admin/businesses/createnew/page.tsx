// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// import {
//   ArrowLeft,
//   Building2,
//   Globe,
//   Store,
//   Mail,
//   ShieldCheck,
//   LayoutDashboard,
//   Sparkles,
//   ExternalLink,
//   CheckCircle2,
//   Users,
//   Settings2,
//   Wand2,
// } from "lucide-react";

// /* ---------------------------------
//  Helpers / Types
// ---------------------------------- */
// function cn(...c: (string | null | undefined | false)[]) {
//   return c.filter(Boolean).join(" ");
// }

// type WebsiteType = "WEBSITE_ONLY" | "ECOMMERCE";
// type PermissionRole = "admin" | "collaborator";
// type EmailProvider = "GOOGLE_WORKSPACE" | "MICROSOFT_365" | "OTHER";

// type BusinessForm = {
//   businessName: string;
//   domain: string;
//   websiteType: WebsiteType;

//   enableDomainServices: boolean;

//   enableWpAdmin: boolean;
//   wpAdminUrl: string;

//   enableEmail: boolean;
//   emailProvider: EmailProvider;

//   role: PermissionRole;

//   enableTeamInvite: boolean;
//   teamEmail: string;
// };

// export default function AddNewBusinessPage() {
//   const router = useRouter();

//   const [step, setStep] = React.useState<1 | 2 | 3>(1);
//   const [loading, setLoading] = React.useState(false);

//   const [form, setForm] = React.useState<BusinessForm>({
//     businessName: "",
//     domain: "",
//     websiteType: "WEBSITE_ONLY",

//     enableDomainServices: true,

//     enableWpAdmin: false,
//     wpAdminUrl: "",

//     enableEmail: false,
//     emailProvider: "GOOGLE_WORKSPACE",

//     role: "admin",

//     enableTeamInvite: false,
//     teamEmail: "",
//   });

//   const isValidStep1 =
//     form.businessName.trim().length >= 2 &&
//     form.domain.trim().length >= 3 &&
//     form.domain.includes(".");

//   const isValidStep2 =
//     !form.enableWpAdmin || form.wpAdminUrl.trim().startsWith("http");

//   const isValidStep3 =
//     !form.enableTeamInvite || form.teamEmail.trim().includes("@");

//   const canContinue =
//     (step === 1 && isValidStep1) ||
//     (step === 2 && isValidStep2) ||
//     (step === 3 && isValidStep3);

//   const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

//   const initials = React.useMemo(() => {
//     const d = form.domain.trim();
//     if (!d) return "BZ";
//     const parts = d.split(".");
//     const a = (parts[0]?.[0] || "B").toUpperCase();
//     const b = (parts[1]?.[0] || "Z").toUpperCase();
//     return `${a}${b}`;
//   }, [form.domain]);

//   function goNext() {
//     if (!canContinue) return;
//     setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 3));
//   }

//   function goBack() {
//     setStep((s) => (s === 3 ? 2 : s === 2 ? 1 : 1));
//   }

//   async function onCreate() {
//     if (!isValidStep1 || !isValidStep2 || !isValidStep3) return;

//     try {
//       setLoading(true);

//       // ✅ Replace with your API call:
//       // await fetch("/api/businesses", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) })

//       await new Promise((r) => setTimeout(r, 700));
//       router.push("/admin/businesses");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="w-full max-w-[1200px] space-y-6">
//       {/* TOP HERO */}
//       <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_60%_90%,rgba(16,185,129,0.14),transparent_40%)]" />
//         <div className="relative p-6 md:p-8">
//           <div className="flex items-start justify-between gap-4 flex-wrap">
//             <div className="space-y-1">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Link href="/admin/businesses" className="hover:text-slate-900">
//                   Businesses
//                 </Link>
//                 <span>/</span>
//                 <span className="text-slate-900">Add new</span>
//               </div>
//               <h1 className="text-[26px] md:text-[30px] font-semibold text-slate-900">
//                 Add New Business
//               </h1>
//               <p className="text-sm text-muted-foreground max-w-2xl">
//                 Create in 3 steps: details → services → access. Clean, fast and
//                 professional.
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button variant="outline" className="rounded-full" asChild>
//                 <Link href="/admin/businesses">
//                   <ArrowLeft className="mr-2 h-4 w-4" />
//                   Back
//                 </Link>
//               </Button>

//               <Button className="rounded-full" asChild>
//                 <Link href="/admin">
//                   <LayoutDashboard className="mr-2 h-4 w-4" />
//                   Admin Home
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           {/* Progress */}
//           <div className="mt-6">
//             <div className="flex items-center justify-between text-xs text-muted-foreground">
//               <span>Step {step} of 3</span>
//               <span>{progress}%</span>
//             </div>
//             <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
//               <div
//                 className="h-full rounded-full bg-slate-900 transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//         {/* LEFT */}
//         <div className="lg:col-span-8 space-y-4">
//           {/* Step Tabs */}
//           <Card className="rounded-3xl border bg-white shadow-sm">
//             <CardContent className="p-4 md:p-5">
//               <div className="grid grid-cols-3 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className={cn(
//                     "rounded-2xl border px-4 py-3 text-left transition",
//                     step === 1
//                       ? "bg-slate-900 text-white"
//                       : "bg-white hover:bg-slate-50"
//                   )}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Building2
//                       className={cn(
//                         "h-4 w-4",
//                         step === 1 ? "text-white" : "text-slate-700"
//                       )}
//                     />
//                     <span className="text-sm font-semibold">Details</span>
//                   </div>
//                   <div
//                     className={cn(
//                       "mt-1 text-xs",
//                       step === 1 ? "text-white/75" : "text-muted-foreground"
//                     )}
//                   >
//                     Name, domain, type
//                   </div>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => isValidStep1 && setStep(2)}
//                   disabled={!isValidStep1}
//                   className={cn(
//                     "rounded-2xl border px-4 py-3 text-left transition",
//                     step === 2
//                       ? "bg-slate-900 text-white"
//                       : "bg-white hover:bg-slate-50",
//                     !isValidStep1 && "opacity-60 cursor-not-allowed"
//                   )}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Settings2
//                       className={cn(
//                         "h-4 w-4",
//                         step === 2 ? "text-white" : "text-slate-700"
//                       )}
//                     />
//                     <span className="text-sm font-semibold">Services</span>
//                   </div>
//                   <div
//                     className={cn(
//                       "mt-1 text-xs",
//                       step === 2 ? "text-white/75" : "text-muted-foreground"
//                     )}
//                   >
//                     WP, email, domain
//                   </div>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => isValidStep1 && isValidStep2 && setStep(3)}
//                   disabled={!isValidStep1 || !isValidStep2}
//                   className={cn(
//                     "rounded-2xl border px-4 py-3 text-left transition",
//                     step === 3
//                       ? "bg-slate-900 text-white"
//                       : "bg-white hover:bg-slate-50",
//                     (!isValidStep1 || !isValidStep2) &&
//                       "opacity-60 cursor-not-allowed"
//                   )}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Users
//                       className={cn(
//                         "h-4 w-4",
//                         step === 3 ? "text-white" : "text-slate-700"
//                       )}
//                     />
//                     <span className="text-sm font-semibold">Access</span>
//                   </div>
//                   <div
//                     className={cn(
//                       "mt-1 text-xs",
//                       step === 3 ? "text-white/75" : "text-muted-foreground"
//                     )}
//                   >
//                     Roles & invite
//                   </div>
//                 </button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Form */}
//           <Card className="rounded-3xl border bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg">
//                 {step === 1
//                   ? "Business details"
//                   : step === 2
//                   ? "Connect services"
//                   : "Access & roles"}
//               </CardTitle>
//               <p className="text-sm text-muted-foreground">
//                 {step === 1
//                   ? "Add basic info to create a business."
//                   : step === 2
//                   ? "Enable optional services like WordPress and email."
//                   : "Set role and optionally invite a team member."}
//               </p>
//             </CardHeader>

//             <CardContent className="pt-0 p-5 space-y-6">
//               {/* STEP 1 */}
//               {step === 1 && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label className="text-sm">Business name</Label>
//                       <Input
//                         className="h-11 rounded-2xl"
//                         value={form.businessName}
//                         onChange={(e) =>
//                           setForm((p) => ({
//                             ...p,
//                             businessName: e.target.value,
//                           }))
//                         }
//                         placeholder="e.g. Creative Consult"
//                       />
//                       <div className="text-xs text-muted-foreground">
//                         Visible in dashboard & reports.
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm">Domain</Label>
//                       <div className="relative">
//                         <Globe className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
//                         <Input
//                           className="h-11 rounded-2xl pl-11"
//                           value={form.domain}
//                           onChange={(e) =>
//                             setForm((p) => ({ ...p, domain: e.target.value }))
//                           }
//                           placeholder="e.g. yourdomain.com"
//                         />
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Use primary domain without https.
//                       </div>
//                     </div>
//                   </div>

//                   {/* Website Type cards (instead of dropdown) */}
//                   <div className="rounded-3xl border bg-slate-50 p-4">
//                     <div className="space-y-2">
//                       <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//                         <Store className="h-4 w-4" />
//                         Website type
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Choose Website Only or Ecommerce.
//                       </div>

//                       <RadioGroup
//                         value={form.websiteType}
//                         onValueChange={(v) =>
//                           setForm((p) => ({
//                             ...p,
//                             websiteType: v as WebsiteType,
//                           }))
//                         }
//                         className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3"
//                       >
//                         <Label
//                           htmlFor="wt_website_only"
//                           className="cursor-pointer"
//                         >
//                           <Card
//                             className={cn(
//                               "rounded-2xl border p-4 transition hover:bg-white",
//                               form.websiteType === "WEBSITE_ONLY"
//                                 ? "border-purple-500 bg-purple-50/60"
//                                 : "border-border bg-white"
//                             )}
//                           >
//                             <div className="flex items-start gap-3">
//                               <RadioGroupItem
//                                 id="wt_website_only"
//                                 value="WEBSITE_ONLY"
//                                 className="mt-1"
//                               />
//                               <div className="flex-1">
//                                 <div className="font-semibold text-slate-900">
//                                   Website only
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Best for landing pages, blogs, content sites.
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>
//                         </Label>

//                         <Label htmlFor="wt_ecommerce" className="cursor-pointer">
//                           <Card
//                             className={cn(
//                               "rounded-2xl border p-4 transition hover:bg-white",
//                               form.websiteType === "ECOMMERCE"
//                                 ? "border-purple-500 bg-purple-50/60"
//                                 : "border-border bg-white"
//                             )}
//                           >
//                             <div className="flex items-start gap-3">
//                               <RadioGroupItem
//                                 id="wt_ecommerce"
//                                 value="ECOMMERCE"
//                                 className="mt-1"
//                               />
//                               <div className="flex-1">
//                                 <div className="font-semibold text-slate-900">
//                                   Ecommerce
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Orders, checkout, payments & shipping.
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>
//                         </Label>
//                       </RadioGroup>

//                       <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
//                         Ecommerce enables orders, payments, shipping & product
//                         workflows.
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}

//               {/* STEP 2 */}
//               {step === 2 && (
//                 <>
//                   <div className="grid grid-cols-1 gap-3">
//                     {/* Domain Services */}
//                     <div className="rounded-3xl border p-4">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="space-y-1">
//                           <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//                             <Globe className="h-4 w-4" />
//                             Domain services
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             DNS/SSL status & verification tools.
//                           </div>
//                         </div>
//                         <Switch
//                           checked={form.enableDomainServices}
//                           onCheckedChange={(v) =>
//                             setForm((p) => ({ ...p, enableDomainServices: v }))
//                           }
//                         />
//                       </div>
//                     </div>

//                     {/* WordPress Admin */}
//                     <div className="rounded-3xl border p-4">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="space-y-1">
//                           <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//                             <ShieldCheck className="h-4 w-4" />
//                             WordPress Admin
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             Show WP Admin shortcut on business card.
//                           </div>
//                         </div>
//                         <Switch
//                           checked={form.enableWpAdmin}
//                           onCheckedChange={(v) =>
//                             setForm((p) => ({ ...p, enableWpAdmin: v }))
//                           }
//                         />
//                       </div>

//                       {form.enableWpAdmin && (
//                         <div className="mt-4 space-y-2">
//                           <Label className="text-sm">WP Admin URL</Label>
//                           <Input
//                             className="h-11 rounded-2xl"
//                             value={form.wpAdminUrl}
//                             onChange={(e) =>
//                               setForm((p) => ({
//                                 ...p,
//                                 wpAdminUrl: e.target.value,
//                               }))
//                             }
//                             placeholder="https://yourdomain.com/wp-admin"
//                           />
//                           {!isValidStep2 && (
//                             <div className="text-xs text-red-600">
//                               Please enter a valid URL starting with http/https.
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Email */}
//                     <div className="rounded-3xl border p-4">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="space-y-1">
//                           <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//                             <Mail className="h-4 w-4" />
//                             Email
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             Enable “Set up email / Manage email” actions.
//                           </div>
//                         </div>
//                         <Switch
//                           checked={form.enableEmail}
//                           onCheckedChange={(v) =>
//                             setForm((p) => ({ ...p, enableEmail: v }))
//                           }
//                         />
//                       </div>

//                       {form.enableEmail && (
//                         <div className="mt-4 space-y-3">
//                           <div className="text-sm font-semibold text-slate-900">
//                             Provider
//                           </div>

//                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                             {[
//                               {
//                                 key: "GOOGLE_WORKSPACE",
//                                 title: "Google Workspace",
//                                 desc: "Gmail + domain email",
//                               },
//                               {
//                                 key: "MICROSOFT_365",
//                                 title: "Microsoft 365",
//                                 desc: "Outlook + admin",
//                               },
//                               {
//                                 key: "OTHER",
//                                 title: "Other",
//                                 desc: "Custom provider",
//                               },
//                             ].map((p) => (
//                               <button
//                                 key={p.key}
//                                 type="button"
//                                 onClick={() =>
//                                   setForm((prev) => ({
//                                     ...prev,
//                                     emailProvider: p.key as EmailProvider,
//                                   }))
//                                 }
//                                 className={cn(
//                                   "rounded-2xl border px-4 py-3 text-left transition hover:bg-white",
//                                   form.emailProvider === p.key
//                                     ? "border-purple-500 bg-purple-50/60"
//                                     : "border-border bg-slate-50"
//                                 )}
//                               >
//                                 <div className="text-sm font-semibold text-slate-900">
//                                   {p.title}
//                                 </div>
//                                 <div className="text-xs text-muted-foreground mt-0.5">
//                                   {p.desc}
//                                 </div>
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}

//               {/* STEP 3 */}
//               {step === 3 && (
//                 <>
//                   {/* Permission Roles cards */}
//                   <div className="rounded-3xl border bg-slate-50 p-4">
//                     <div className="text-sm font-semibold text-slate-900">
//                       Permission roles
//                     </div>

//                     <RadioGroup
//                       value={form.role}
//                       onValueChange={(v) =>
//                         setForm((p) => ({ ...p, role: v as PermissionRole }))
//                       }
//                       className="mt-3 space-y-3"
//                     >
//                       <Label htmlFor="role_admin" className="cursor-pointer">
//                         <Card
//                           className={cn(
//                             "rounded-2xl border p-4 transition hover:bg-white",
//                             form.role === "admin"
//                               ? "border-purple-500 bg-purple-50/60"
//                               : "border-border bg-white"
//                           )}
//                         >
//                           <div className="flex items-start gap-3">
//                             <RadioGroupItem
//                               id="role_admin"
//                               value="admin"
//                               className="mt-1"
//                             />
//                             <div className="flex-1">
//                               <div className="font-semibold text-slate-900">
//                                 Admin
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 Manage services and make purchases using added
//                                 payment method.
//                               </div>
//                             </div>
//                           </div>
//                         </Card>
//                       </Label>

//                       <Label htmlFor="role_collab" className="cursor-pointer">
//                         <Card
//                           className={cn(
//                             "rounded-2xl border p-4 transition hover:bg-white",
//                             form.role === "collaborator"
//                               ? "border-purple-500 bg-purple-50/60"
//                               : "border-border bg-white"
//                           )}
//                         >
//                           <div className="flex items-start gap-3">
//                             <RadioGroupItem
//                               id="role_collab"
//                               value="collaborator"
//                               className="mt-1"
//                             />
//                             <div className="flex-1">
//                               <div className="font-semibold text-slate-900">
//                                 Collaborator
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 Manage services.{" "}
//                                 <span className="font-semibold">Can't</span>{" "}
//                                 make purchases.
//                               </div>
//                             </div>
//                           </div>
//                         </Card>
//                       </Label>
//                     </RadioGroup>
//                   </div>

//                   {/* Invite team */}
//                   <div className="rounded-3xl border p-4">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="space-y-1">
//                         <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//                           <Users className="h-4 w-4" />
//                           Invite team member
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           Optional. You can invite later from Users section.
//                         </div>
//                       </div>
//                       <Switch
//                         checked={form.enableTeamInvite}
//                         onCheckedChange={(v) =>
//                           setForm((p) => ({ ...p, enableTeamInvite: v }))
//                         }
//                       />
//                     </div>

//                     {form.enableTeamInvite && (
//                       <div className="mt-4 space-y-2">
//                         <Label className="text-sm">Team email</Label>
//                         <Input
//                           className="h-11 rounded-2xl"
//                           value={form.teamEmail}
//                           onChange={(e) =>
//                             setForm((p) => ({ ...p, teamEmail: e.target.value }))
//                           }
//                           placeholder="name@company.com"
//                         />
//                         {!isValidStep3 && (
//                           <div className="text-xs text-red-600">
//                             Please enter a valid email.
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Recommended next */}
//                   <div className="rounded-3xl border p-4">
//                     <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
//                       <Wand2 className="h-4 w-4" />
//                       Recommended next
//                     </div>

//                     <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//                       {[
//                         "Setup branding (logo/colors)",
//                         "Create your first page",
//                         "Connect domain DNS",
//                         "Invite team members",
//                       ].map((t) => (
//                         <div
//                           key={t}
//                           className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2"
//                         >
//                           <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                           {t}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               )}

//               <Separator />

//               {/* Actions */}
//               <div className="flex items-center justify-between gap-2 flex-wrap">
//                 <Button
//                   variant="outline"
//                   className="rounded-full"
//                   onClick={goBack}
//                   disabled={step === 1 || loading}
//                   type="button"
//                 >
//                   Back
//                 </Button>

//                 {step < 3 ? (
//                   <Button
//                     className="rounded-full"
//                     type="button"
//                     onClick={goNext}
//                     disabled={!canContinue || loading}
//                   >
//                     Continue
//                   </Button>
//                 ) : (
//                   <Button
//                     className="rounded-full"
//                     type="button"
//                     onClick={onCreate}
//                     disabled={
//                       loading || !isValidStep1 || !isValidStep2 || !isValidStep3
//                     }
//                   >
//                     {loading ? "Creating..." : "Create business"}
//                   </Button>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT: PREVIEW */}
//         <div className="lg:col-span-4 space-y-4">
//           <Card className="rounded-3xl border bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base flex items-center gap-2">
//                 <Sparkles className="h-4 w-4 text-slate-700" />
//                 Live preview
//               </CardTitle>
//               <p className="text-sm text-muted-foreground">
//                 This is how it will look in your Businesses list.
//               </p>
//             </CardHeader>

//             <CardContent className="pt-0 p-5">
//               <div className="rounded-3xl border bg-slate-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center font-semibold">
//                     {initials}
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-center gap-2">
//                       <div className="text-base font-semibold text-slate-900 truncate">
//                         {form.domain.trim() ? form.domain.trim() : "yourdomain.com"}
//                       </div>
//                       <ExternalLink className="h-4 w-4 text-slate-400" />
//                     </div>

//                     <div className="mt-1 text-sm text-muted-foreground truncate">
//                       {form.businessName.trim()
//                         ? form.businessName.trim()
//                         : "Business name"}
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs">
//                         <Store className="h-3.5 w-3.5 text-slate-600" />
//                         {form.websiteType === "ECOMMERCE" ? "Ecommerce" : "Website"}
//                       </span>

//                       <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs">
//                         <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
//                         {form.role === "admin" ? "Admin" : "Collaborator"}
//                       </span>

//                       <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs">
//                         <Mail className="h-3.5 w-3.5 text-slate-600" />
//                         {form.enableEmail ? "Manage email" : "Set up email"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {form.enableWpAdmin && form.wpAdminUrl.trim().startsWith("http") && (
//                   <div className="mt-4 flex justify-end">
//                     <Button variant="outline" className="rounded-full" asChild>
//                       <a
//                         href={form.wpAdminUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         WordPress Admin
//                         <ExternalLink className="ml-2 h-4 w-4" />
//                       </a>
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Tips */}
//           <Card className="rounded-3xl border bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base">Smart checks</CardTitle>
//               <p className="text-sm text-muted-foreground">
//                 We’ll guide you to finish setup without confusion.
//               </p>
//             </CardHeader>

//             <CardContent className="pt-0 p-5 space-y-3 text-sm">
//               <div className="flex items-start gap-3">
//                 <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
//                   <CheckCircle2
//                     className={cn(
//                       "h-4 w-4",
//                       isValidStep1 ? "text-emerald-600" : "text-slate-400"
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <div className="font-medium text-slate-900">Details ready</div>
//                   <div className="text-muted-foreground">
//                     Add business name + valid domain.
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
//                   <CheckCircle2
//                     className={cn(
//                       "h-4 w-4",
//                       isValidStep2 ? "text-emerald-600" : "text-slate-400"
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <div className="font-medium text-slate-900">Services ok</div>
//                   <div className="text-muted-foreground">
//                     WP Admin URL should be valid if enabled.
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
//                   <CheckCircle2
//                     className={cn(
//                       "h-4 w-4",
//                       isValidStep3 ? "text-emerald-600" : "text-slate-400"
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <div className="font-medium text-slate-900">Access set</div>
//                   <div className="text-muted-foreground">
//                     Team email optional (valid if used).
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       </div>
//   )
// }

import { auth } from "@/auth";
import BusinessCreatePage from "@/components/admin/users/usercomp";

export default async function AddBusiness() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="space-y-6">
      <BusinessCreatePage user={user} />
    </div>
  );
} 
