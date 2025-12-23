"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function stripDangerous(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function px(n: number) {
  return `${Math.round(n)}px`;
}

function htmlToBlocks(html: string) {
  const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html");
  const root = doc.body.firstElementChild as HTMLElement | null;
  const children = Array.from(root?.children ?? []);
  // If user typed plain text without block wrappers, keep it as one block
  if (!children.length && (root?.textContent || "").trim()) return [`<p>${root?.innerHTML ?? ""}</p>`];
  return children.map((el) => el.outerHTML);
}

function blocksToHtml(blocks: string[]) {
  return blocks.join("");
}

/* -------------------------------------------------------
   Types
------------------------------------------------------- */
type TabMode = "edit" | "customize";
type CustomizeTab = "templates" | "text" | "layout";
type PageFormat = "A4" | "LETTER";
type DateFormat = "MM.YYYY" | "MMM YYYY" | "YYYY";

type TemplateId = "classic" | "traditional" | "professional" | "primeATS" | "clean" | "simpleATS";

type HeaderDesign = "minimal" | "bannerTop" | "splitLeft" | "boxed" | "underline";
type FooterDesign = "strip" | "darkStrip" | "lightStrip" | "boxed" | "none";

type HeaderAlign = "left" | "center" | "right";
type LogoPosition = "left" | "right" | "none";

type ResumePage = {
  id: string;
  title: string;
  html: string;

  // auto-generated continuation pages
  auto?: boolean;
  parentId?: string;
  pageIndex?: number; // 1..N within the parent
};

type ResumeData = {
  name: string;
  email: string;

  phone: string;
  address: string;
  website: string;
  footerEmail: string;

  logoDataUrl?: string;

  pages: ResumePage[];
};

type TypographySettings = {
  fontFamily: "Inter" | "Garamond" | "Times" | "Arial";
  baseSizePx: number;
  lineHeight: number;
  letterSpacingEm: number;
  headingWeight: 600 | 700 | 800 | 900;
  bodyWeight: 400 | 500 | 600;
};

type LayoutSettings = {
  format: PageFormat;
  marginTopBottomIn: number;
  marginLeftRightIn: number;
  headerFooterIn: number;
  betweenSectionsPt: number;
  betweenTitleContentPt: number;
  betweenBlocksPt: number;
  dateFormat: DateFormat;
};

type HeaderElementSettings = {
  nameFontSizePx: number;
  nameLetterSpacingEm: number;
  showNameUppercase: boolean;

  logoWidthPx: number;
  logoHeightPx: number;
  logoRadiusPx: number;
  logoBorderPx: number;
};

type ThemeSettings = {
  primary: string;
  template: TemplateId;

  headerDesign: HeaderDesign;
  footerDesign: FooterDesign;

  headerAlign: HeaderAlign;
  logoPosition: LogoPosition;

  headerBgColor: string; // editable background for header templates
  headerBgUsePrimary: boolean;

  headerElements: HeaderElementSettings;
};

const PRESET_COLORS = ["#2563EB", "#0EA5E9", "#10B981", "#F97316", "#EF4444", "#111827"];

/* -------------------------------------------------------
   Template Styles (base)
------------------------------------------------------- */
function templateStyles(template: TemplateId, primary: string) {
  switch (template) {
    case "traditional":
      return {
        bodyClass: "font-serif text-slate-700",
        sectionTitleClass: "font-semibold tracking-[0.22em] uppercase",
        sectionBar: "bg-slate-100",
        divider: "#E2E8F0",
        accent: primary,
      };
    case "professional":
      return {
        bodyClass: "font-sans text-slate-700",
        sectionTitleClass: "font-bold tracking-[0.18em] uppercase",
        sectionBar: "bg-slate-100",
        divider: "#E2E8F0",
        accent: primary,
      };
    case "primeATS":
      return {
        bodyClass: "font-sans text-slate-700",
        sectionTitleClass: "font-bold tracking-[0.18em] uppercase",
        sectionBar: "bg-white border border-slate-200",
        divider: "#E2E8F0",
        accent: primary,
      };
    case "clean":
      return {
        bodyClass: "font-sans text-slate-700",
        sectionTitleClass: "font-semibold tracking-[0.18em] uppercase",
        sectionBar: "bg-slate-100",
        divider: "#E2E8F0",
        accent: primary,
      };
    case "simpleATS":
      return {
        bodyClass: "font-sans text-slate-700",
        sectionTitleClass: "font-semibold tracking-[0.18em] uppercase",
        sectionBar: "bg-white border-b border-slate-200",
        divider: "#E2E8F0",
        accent: primary,
      };
    case "classic":
    default:
      return {
        bodyClass: "font-serif text-slate-700",
        sectionTitleClass: "font-semibold tracking-[0.22em] uppercase",
        sectionBar: "bg-slate-100",
        divider: "#E2E8F0",
        accent: primary,
      };
  }
}

/* -------------------------------------------------------
   Main Page
------------------------------------------------------- */
export default function ResumeBuilderPage() {
  const [mode, setMode] = useState<TabMode>("customize");
  const [customTab, setCustomTab] = useState<CustomizeTab>("templates");
  const [zoom, setZoom] = useState(0.9);

  const [theme, setTheme] = useState<ThemeSettings>({
    primary: "#111827",
    template: "classic",

    headerDesign: "minimal",
    footerDesign: "strip",

    headerAlign: "center",
    logoPosition: "right",

    headerBgColor: "#0F172A",
    headerBgUsePrimary: true,

    headerElements: {
      nameFontSizePx: 34,
      nameLetterSpacingEm: 0.14,
      showNameUppercase: true,

      logoWidthPx: 56,
      logoHeightPx: 56,
      logoRadiusPx: 10,
      logoBorderPx: 1,
    },
  });

  const [typography, setTypography] = useState<TypographySettings>({
    fontFamily: "Garamond",
    baseSizePx: 16,
    lineHeight: 1.7,
    letterSpacingEm: 0.02,
    headingWeight: 800,
    bodyWeight: 400,
  });

  const [layout, setLayout] = useState<LayoutSettings>({
    format: "A4",
    marginTopBottomIn: 1,
    marginLeftRightIn: 1,
    headerFooterIn: 0.5,
    betweenSectionsPt: 24,
    betweenTitleContentPt: 18,
    betweenBlocksPt: 12,
    dateFormat: "MM.YYYY",
  });

  const [resume, setResume] = useState<ResumeData>({
    name: "VIJENDRA JAT",
    email: "vijendrajat693@gmail.com",
    phone: "+91-123-456-7890",
    address: "123 Anywhere St, Any City, ST 1234",
    website: "@reallygreatsite",
    footerEmail: "hello@reallygreatsite.com",
    pages: [
      {
        id: uid("pg"),
        title: "PROFILE",
        html:
          "<p><b>Proven ability</b></p><p>to establish and maintain excellent communication and relationships with clients. Adept in general accounting and finance transactions.</p><p>Committed to utilizing my skills to help others, while working towards the mission of a company. Patient-care oriented, bringing forth a compassionate and friendly attitude.</p>",
      },
    ],
  });

  const [selectedPageId, setSelectedPageId] = useState<string>(resume.pages[0]?.id);

  useEffect(() => {
    if (!resume.pages.some((p) => p.id === selectedPageId)) {
      setSelectedPageId(resume.pages[0]?.id || "");
    }
  }, [resume.pages, selectedPageId]);

  const pagePx = useMemo(() => {
    // A4 @96dpi: 794 x 1123, Letter @96dpi: 816 x 1056
    return layout.format === "A4" ? { w: 794, h: 1123 } : { w: 816, h: 1056 };
  }, [layout.format]);

  const cssVars = useMemo(() => {
    return {
      ["--primary" as any]: theme.primary,
      ["--fontFamily" as any]:
        typography.fontFamily === "Inter"
          ? "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
          : typography.fontFamily === "Garamond"
          ? "Garamond, Georgia, serif"
          : typography.fontFamily === "Times"
          ? '"Times New Roman", Times, serif'
          : "Arial, Helvetica, sans-serif",
      ["--baseSize" as any]: `${typography.baseSizePx}px`,
      ["--lineHeight" as any]: `${typography.lineHeight}`,
      ["--letterSpacing" as any]: `${typography.letterSpacingEm}em`,
    } as React.CSSProperties;
  }, [theme.primary, typography]);

  const handleReset = () => {
    setZoom(0.9);
    setTheme({
      primary: "#2563EB",
      template: "traditional",
      headerDesign: "minimal",
      footerDesign: "strip",
      headerAlign: "center",
      logoPosition: "right",
      headerBgColor: "#0F172A",
      headerBgUsePrimary: true,
      headerElements: {
        nameFontSizePx: 34,
        nameLetterSpacingEm: 0.14,
        showNameUppercase: true,
        logoWidthPx: 56,
        logoHeightPx: 56,
        logoRadiusPx: 10,
        logoBorderPx: 1,
      },
    });
    setTypography({
      fontFamily: "Garamond",
      baseSizePx: 16,
      lineHeight: 1.7,
      letterSpacingEm: 0.02,
      headingWeight: 800,
      bodyWeight: 400,
    });
    setLayout({
      format: "A4",
      marginTopBottomIn: 1,
      marginLeftRightIn: 1,
      headerFooterIn: 0.5,
      betweenSectionsPt: 24,
      betweenTitleContentPt: 18,
      betweenBlocksPt: 12,
      dateFormat: "MM.YYYY",
    });
  };

  const downloadPdf = () => {
    // Browser print => user can "Save as PDF"
    const oldTitle = document.title;
    document.title = `${resume.name}_Resume`;
    window.print();
    document.title = oldTitle;
  };

  const selectedPage = resume.pages.find((p) => p.id === selectedPageId);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* PRINT CSS */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-page {
            box-shadow: none !important;
            transform: none !important;
            margin: 0 !important;
          }
          @page {
            margin: 0;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Top Bar */}
      <div className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-slate-800">Resume Builder</div>
          </div>

          <div className="flex items-center rounded-sm bg-slate-100 p-1">
            <button
              className={`rounded-md px-5 py-2 text-sm font-semibold ${
                mode === "edit" ? "bg-white shadow-sm" : "text-slate-600"
              }`}
              onClick={() => setMode("edit")}
            >
              Edit
            </button>
            <button
              className={`rounded-md px-5 py-2 text-sm font-semibold ${
                mode === "customize" ? "bg-white shadow-sm" : "text-slate-600"
              }`}
              onClick={() => setMode("customize")}
            >
              Customize
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="text-sm font-semibold text-slate-700">{Math.round(zoom * 100)}%</div>
              <button
                className="h-8 w-8 rounded-md border border-slate-200 hover:bg-slate-50"
                onClick={() => setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.6, 1.4))}
              >
                −
              </button>
              <button
                className="h-8 w-8 rounded-md border border-slate-200 hover:bg-slate-50"
                onClick={() => setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.6, 1.4))}
              >
                +
              </button>
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                style={{ color: theme.primary }}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>

            <button
              className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              style={{ background: theme.primary }}
              onClick={downloadPdf}
            >
              Download PDF
            </button>

            <button className="h-10 w-10 rounded-md border border-slate-200 bg-white shadow-sm hover:bg-slate-50">
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-12">
        {/* LEFT PANEL */}
        <div className="no-print lg:col-span-5">
          {mode === "edit" ? (
            <PagesEditorPanel
              primary={theme.primary}
              pages={resume.pages.filter((p) => !p.auto)} // editor shows base pages (auto pages are generated)
              selectedPageId={selectedPageId}
              onSelectPage={setSelectedPageId}
              onAddPage={() => {
                const n: ResumePage = {
                  id: uid("pg"),
                  title: "NEW PAGE",
                  html: "<p>Write here...</p>",
                };
                setResume((r) => ({ ...r, pages: [...r.pages.filter((p) => !p.auto), n] }));
                setSelectedPageId(n.id);
              }}
              onDuplicatePage={() => {
                if (!selectedPage) return;
                const base = selectedPage.auto ? resume.pages.find((p) => p.id === selectedPage.parentId) : selectedPage;
                if (!base) return;
                const dup: ResumePage = {
                  id: uid("pg"),
                  title: `${base.title} (Copy)`,
                  html: base.html,
                };
                setResume((r) => ({ ...r, pages: [...r.pages.filter((p) => !p.auto), dup] }));
                setSelectedPageId(dup.id);
              }}
              onDeletePage={() => {
                const basePages = resume.pages.filter((p) => !p.auto);
                if (!basePages.length) return;
                const toDeleteId = selectedPage?.auto ? selectedPage.parentId : selectedPageId;
                const next = basePages.filter((p) => p.id !== toDeleteId);
                setResume((r) => ({ ...r, pages: next.length ? next : r.pages.filter((p) => !p.auto) }));
                setSelectedPageId(next[0]?.id ?? "");
              }}
              onChangePageTitle={(title) => {
                const basePages = resume.pages.filter((p) => !p.auto);
                const id = selectedPage?.auto ? selectedPage.parentId : selectedPageId;
                setResume((r) => ({
                  ...r,
                  pages: basePages.map((p) => (p.id === id ? { ...p, title } : p)),
                }));
              }}
              valueHtml={selectedPage?.auto ? (resume.pages.find((p) => p.id === selectedPage.parentId)?.html ?? "") : (selectedPage?.html ?? "")}
              onChangeHtml={(html) => {
                const basePages = resume.pages.filter((p) => !p.auto);
                const id = selectedPage?.auto ? selectedPage.parentId : selectedPageId;
                setResume((r) => ({
                  ...r,
                  pages: basePages.map((p) => (p.id === id ? { ...p, html } : p)),
                }));
              }}
            />
          ) : (
            <CustomizePanel
              theme={theme}
              setTheme={setTheme}
              typography={typography}
              setTypography={setTypography}
              layout={layout}
              setLayout={setLayout}
              resume={resume}
              setResume={setResume}
              tab={customTab}
              setTab={setCustomTab}
            />
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-7">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="no-print mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">Preview</div>
              <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                Demo
              </button>
            </div>

            <div
              className="no-print relative overflow-auto rounded-md border border-slate-200 bg-white p-4"
              style={{ height: "calc(100vh - 180px)" }}
            >
              <div className="mx-auto flex justify-center">
                <div style={{ ...cssVars, width: px(pagePx.w) }} className="relative">
                  <PaginatedPreview
                    pageWidthPx={pagePx.w}
                    pageHeightPx={pagePx.h}
                    zoom={zoom}
                    theme={theme}
                    typography={typography}
                    layout={layout}
                    resume={resume}
                    setResume={setResume}
                  />
                </div>
              </div>
            </div>

            {/* PRINT-ONLY version (no scaling, no UI) */}
            <div className="print-only mx-auto">
              <div style={{ ...cssVars, width: px(pagePx.w) }} className="relative">
                <PaginatedPreview
                  pageWidthPx={pagePx.w}
                  pageHeightPx={pagePx.h}
                  zoom={1}
                  theme={theme}
                  typography={typography}
                  layout={layout}
                  resume={resume}
                  setResume={setResume}
                />
              </div>
            </div>

            <div className="no-print mt-4 flex items-center justify-between">
              <button className="rounded-md px-4 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-95">
                Back
              </button>

              <div className="text-sm text-slate-500">Saved</div>

              <button
                className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                style={{ background: theme.primary }}
              >
                Next: Untitled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Pages Editor Panel (Left) - Add/Duplicate/Delete Pages
------------------------------------------------------- */
function PagesEditorPanel({
  primary,
  pages,
  selectedPageId,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onChangePageTitle,
  valueHtml,
  onChangeHtml,
}: {
  primary: string;
  pages: ResumePage[];
  selectedPageId?: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onChangePageTitle: (t: string) => void;
  valueHtml: string;
  onChangeHtml: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = valueHtml || "";
  }, [valueHtml, selectedPageId]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    const html = stripDangerous(editorRef.current?.innerHTML ?? "");
    onChangeHtml(html);
  };

  const onInput = () => {
    const html = stripDangerous(editorRef.current?.innerHTML ?? "");
    onChangeHtml(html);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-slate-900">Pages</div>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={onDuplicatePage}
          >
            Duplicate
          </button>
          <button
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={onDeletePage}
          >
            Delete
          </button>
          <button
            className="rounded-md px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
            style={{ background: primary }}
            onClick={onAddPage}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPage(p.id)}
            className={`rounded-md border px-4 py-3 text-left transition ${
              selectedPageId === p.id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="text-sm font-semibold">{p.title}</div>
            <div className={`mt-1 text-xs ${selectedPageId === p.id ? "text-white/70" : "text-slate-500"}`}>
              Click to edit
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-600">Page Title</label>
        <input
          value={pages.find((p) => p.id === selectedPageId)?.title ?? ""}
          onChange={(e) => onChangePageTitle(e.target.value)}
          className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[var(--primary)]"
          style={{ ["--primary" as any]: primary } as React.CSSProperties}
        />
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <ToolBtn onClick={() => exec("bold")} label="B" />
          <ToolBtn onClick={() => exec("italic")} label="I" />
          <ToolBtn onClick={() => exec("underline")} label="U" />
          <div className="mx-1 h-7 w-[1px] bg-slate-200" />
          <ToolBtn onClick={() => exec("insertUnorderedList")} label="•" />
          <ToolBtn onClick={() => exec("insertOrderedList")} label="1." />
          <div className="mx-1 h-7 w-[1px] bg-slate-200" />
          <ToolBtn
            onClick={() => {
              const url = prompt("Enter URL");
              if (url) exec("createLink", url);
            }}
            label="🔗"
          />
          <ToolBtn
            onClick={() => {
              exec("removeFormat");
              exec("unlink");
            }}
            label="✕"
          />
        </div>

        <button
          className="h-10 w-10 rounded-md text-white shadow-sm"
          style={{ background: primary }}
          onClick={() => {
            editorRef.current?.focus();
            exec("insertText", "New line... ");
          }}
        >
          +
        </button>
      </div>

      <div className="mt-3 rounded-md border border-slate-200 bg-white p-4">
        <div
          ref={editorRef}
          className="min-h-[360px] outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
        />
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Tip: paragraphs / list items paginate best. (Very long single paragraphs can’t split perfectly.)
      </div>
    </div>
  );
}

function ToolBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 w-10 rounded-md border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}

/* -------------------------------------------------------
   Customize Panel
------------------------------------------------------- */
function CustomizePanel({
  theme,
  setTheme,
  typography,
  setTypography,
  layout,
  setLayout,
  resume,
  setResume,
  tab,
  setTab,
}: {
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  typography: TypographySettings;
  setTypography: React.Dispatch<React.SetStateAction<TypographySettings>>;
  layout: LayoutSettings;
  setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  tab: CustomizeTab;
  setTab: (t: CustomizeTab) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex rounded-md bg-slate-100 p-1">
        <button
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${
            tab === "templates" ? "bg-white shadow-sm" : "text-slate-600"
          }`}
          onClick={() => setTab("templates")}
        >
          Template & Colors
        </button>
        <button
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${
            tab === "text" ? "bg-white shadow-sm" : "text-slate-600"
          }`}
          onClick={() => setTab("text")}
        >
          Text
        </button>
        <button
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${
            tab === "layout" ? "bg-white shadow-sm" : "text-slate-600"
          }`}
          onClick={() => setTab("layout")}
        >
          Layout
        </button>
      </div>

      {tab === "templates" ? (
        <TemplatesAndColors theme={theme} setTheme={setTheme} />
      ) : tab === "text" ? (
        <TextSettings typography={typography} setTypography={setTypography} theme={theme} setTheme={setTheme} />
      ) : (
        <LayoutSettingsPanel layout={layout} setLayout={setLayout} />
      )}

      {/* Header/Footer editable */}
      <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Header & Footer Content</div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name" value={resume.name} onChange={(v) => setResume((r) => ({ ...r, name: v }))} />
          <Field label="Email (Header)" value={resume.email} onChange={(v) => setResume((r) => ({ ...r, email: v }))} />
          <Field label="Phone (Footer)" value={resume.phone} onChange={(v) => setResume((r) => ({ ...r, phone: v }))} />
          <Field label="Website/Handle (Footer)" value={resume.website} onChange={(v) => setResume((r) => ({ ...r, website: v }))} />
          <Field label="Footer Email" value={resume.footerEmail} onChange={(v) => setResume((r) => ({ ...r, footerEmail: v }))} />
          <Field label="Address (Footer)" value={resume.address} onChange={(v) => setResume((r) => ({ ...r, address: v }))} />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-600">Header Logo</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                setResume((r) => ({ ...r, logoDataUrl: url }));
              }}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold hover:file:bg-slate-200"
            />
            {resume.logoDataUrl ? (
              <button
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setResume((r) => ({ ...r, logoDataUrl: undefined }))}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>

        {/* Logo editor */}
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">Logo Editor</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumberField
              label="Width (px)"
              value={theme.headerElements.logoWidthPx}
              min={30}
              max={140}
              step={1}
              onChange={(v) => setTheme((t) => ({ ...t, headerElements: { ...t.headerElements, logoWidthPx: v } }))}
            />
            <NumberField
              label="Height (px)"
              value={theme.headerElements.logoHeightPx}
              min={30}
              max={140}
              step={1}
              onChange={(v) => setTheme((t) => ({ ...t, headerElements: { ...t.headerElements, logoHeightPx: v } }))}
            />
            <NumberField
              label="Border Radius (px)"
              value={theme.headerElements.logoRadiusPx}
              min={0}
              max={24}
              step={1}
              onChange={(v) => setTheme((t) => ({ ...t, headerElements: { ...t.headerElements, logoRadiusPx: v } }))}
            />
            <NumberField
              label="Border Width (px)"
              value={theme.headerElements.logoBorderPx}
              min={0}
              max={6}
              step={1}
              onChange={(v) => setTheme((t) => ({ ...t, headerElements: { ...t.headerElements, logoBorderPx: v } }))}
            />
          </div>
        </div>

        {/* Title editor */}
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">Title (Name) Editor</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumberField
              label="Font Size (px)"
              value={theme.headerElements.nameFontSizePx}
              min={20}
              max={48}
              step={1}
              onChange={(v) =>
                setTheme((t) => ({ ...t, headerElements: { ...t.headerElements, nameFontSizePx: v } }))
              }
            />
            <NumberField
              label="Letter Spacing (em)"
              value={theme.headerElements.nameLetterSpacingEm}
              min={0}
              max={0.3}
              step={0.01}
              float
              onChange={(v) =>
                setTheme((t) => ({ ...t, headerElements: { ...t.headerElements, nameLetterSpacingEm: v } }))
              }
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                theme.headerElements.showNameUppercase ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
              onClick={() =>
                setTheme((t) => ({
                  ...t,
                  headerElements: { ...t.headerElements, showNameUppercase: !t.headerElements.showNameUppercase },
                }))
              }
            >
              Uppercase
            </button>
            <div className="ml-auto text-xs text-slate-500">Align via “Header Align” in Template settings.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-600">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[var(--primary)]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  float,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  float?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-600">{label}</div>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const raw = e.target.value;
          const n = float ? Number(parseFloat(raw)) : Number(parseInt(raw, 10));
          onChange(clamp(isNaN(n) ? min : n, min, max));
        }}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
      />
    </label>
  );
}

/* -------------------------------------------------------
   Templates & Colors + Header/Footer Design Templates + Align
------------------------------------------------------- */
function TemplatesAndColors({
  theme,
  setTheme,
}: {
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}) {
  const templates: { id: TemplateId; title: string; badge?: string }[] = [
    { id: "classic", title: "Classic" },
    { id: "traditional", title: "Traditional" },
    { id: "professional", title: "Professional" },
    { id: "primeATS", title: "Prime ATS", badge: "ATS" },
    { id: "clean", title: "Clean" },
    { id: "simpleATS", title: "Simple ATS", badge: "ATS" },
  ];

  const headerDesigns: { id: HeaderDesign; title: string }[] = [
    { id: "minimal", title: "Minimal" },
    { id: "bannerTop", title: "Top Banner" },
    { id: "splitLeft", title: "Split Left" },
    { id: "boxed", title: "Boxed" },
    { id: "underline", title: "Underline" },
  ];

  const footerDesigns: { id: FooterDesign; title: string }[] = [
    { id: "strip", title: "Color Strip" },
    { id: "darkStrip", title: "Dark Strip" },
    { id: "lightStrip", title: "Light Strip" },
    { id: "boxed", title: "Boxed" },
    { id: "none", title: "None" },
  ];

  return (
    <div className="mt-5 space-y-4">
      {/* Main color */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">Main color</div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-14 rounded-md border border-slate-200" style={{ background: theme.primary }} />
            <div className="text-sm font-semibold text-slate-600">{theme.primary.toUpperCase()}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              className={`h-10 w-10 rounded-md border transition ${
                theme.primary === c ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200"
              }`}
              style={{ background: c }}
              onClick={() => setTheme((t) => ({ ...t, primary: c }))}
            />
          ))}

          <div className="ml-auto flex items-center gap-2">
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => setTheme((t) => ({ ...t, primary: e.target.value }))}
              className="h-10 w-10 cursor-pointer rounded-md border border-slate-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Templates grid */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">Templates</div>
          <div className="text-xs text-slate-500">Click any template</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme((s) => ({ ...s, template: t.id }))}
              className={`relative rounded-md border p-3 text-left transition ${
                theme.template === t.id ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-slate-200"
              }`}
              style={{ ["--primary" as any]: theme.primary } as React.CSSProperties}
            >
              {t.badge ? (
                <span className="absolute right-2 top-2 rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                  {t.badge}
                </span>
              ) : null}

              <div className="mb-2 text-sm font-semibold text-slate-800">{t.title}</div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="h-2 w-10 rounded bg-slate-300" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-2 w-full rounded bg-slate-200" />
                  <div className="h-2 w-4/5 rounded bg-slate-200" />
                  <div className="h-2 w-3/5 rounded bg-slate-200" />
                </div>
                <div className="mt-3 h-2 w-9 rounded bg-slate-300" />
              </div>

              {theme.template === t.id ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ background: theme.primary }}
                  >
                    ✓
                  </span>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Header style templates */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Header Design</div>
        <div className="grid grid-cols-2 gap-2">
          {headerDesigns.map((h) => (
            <button
              key={h.id}
              className={`rounded-md border px-4 py-3 text-left text-sm font-semibold ${
                theme.headerDesign === h.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              onClick={() => setTheme((t) => ({ ...t, headerDesign: h.id }))}
            >
              {h.title}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SelectBox
            label="Header Align"
            value={theme.headerAlign}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => setTheme((t) => ({ ...t, headerAlign: v as HeaderAlign }))}
          />
          <SelectBox
            label="Logo Position"
            value={theme.logoPosition}
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => setTheme((t) => ({ ...t, logoPosition: v as LogoPosition }))}
          />
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold text-slate-800">Header Background</div>

          <div className="flex items-center gap-3">
            <button
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                theme.headerBgUsePrimary ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
              onClick={() => setTheme((t) => ({ ...t, headerBgUsePrimary: true }))}
            >
              Use Primary
            </button>
            <button
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                !theme.headerBgUsePrimary ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
              onClick={() => setTheme((t) => ({ ...t, headerBgUsePrimary: false }))}
            >
              Custom Color
            </button>

            <div className="ml-auto flex items-center gap-2">
              <input
                type="color"
                value={theme.headerBgColor}
                onChange={(e) => setTheme((t) => ({ ...t, headerBgColor: e.target.value }))}
                className="h-10 w-10 cursor-pointer rounded-md border border-slate-200 bg-white"
                disabled={theme.headerBgUsePrimary}
                title={theme.headerBgUsePrimary ? "Disable 'Use Primary' to edit" : "Pick color"}
              />
              <div className="text-xs text-slate-500">
                {theme.headerBgUsePrimary ? "Primary" : theme.headerBgColor.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer style templates */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Footer Design</div>
        <div className="grid grid-cols-2 gap-2">
          {footerDesigns.map((f) => (
            <button
              key={f.id}
              className={`rounded-md border px-4 py-3 text-left text-sm font-semibold ${
                theme.footerDesign === f.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              onClick={() => setTheme((t) => ({ ...t, footerDesign: f.id }))}
            >
              {f.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-600">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* -------------------------------------------------------
   Text Settings
------------------------------------------------------- */
function TextSettings({
  typography,
  setTypography,
  theme,
  setTheme,
}: {
  typography: TypographySettings;
  setTypography: React.Dispatch<React.SetStateAction<TypographySettings>>;
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}) {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-800">Primary Font</div>
        <select
          value={typography.fontFamily}
          onChange={(e) => setTypography((t) => ({ ...t, fontFamily: e.target.value as any }))}
          className="mt-2 w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-800 outline-none"
        >
          <option value="Inter">Inter</option>
          <option value="Garamond">Garamond</option>
          <option value="Times">Times New Roman</option>
          <option value="Arial">Arial</option>
        </select>
      </div>

      <SliderRow
        title="Base Size (px)"
        value={typography.baseSizePx}
        min={14}
        max={20}
        step={1}
        rightLabel={`${typography.baseSizePx}px`}
        onChange={(v) => setTypography((t) => ({ ...t, baseSizePx: v }))}
      />

      <SliderRow
        title="Line Height"
        value={typography.lineHeight}
        min={1.2}
        max={2.0}
        step={0.05}
        rightLabel={typography.lineHeight.toFixed(2)}
        onChange={(v) => setTypography((t) => ({ ...t, lineHeight: v }))}
      />

      <SliderRow
        title="Letter Spacing"
        value={typography.letterSpacingEm}
        min={0}
        max={0.2}
        step={0.01}
        rightLabel={`${typography.letterSpacingEm.toFixed(2)}em`}
        onChange={(v) => setTypography((t) => ({ ...t, letterSpacingEm: v }))}
      />

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-800">Font Weight</div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[400, 500, 600].map((w) => (
            <button
              key={w}
              className={`rounded-md border px-3 py-3 text-sm font-semibold ${
                typography.bodyWeight === w ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
              onClick={() => setTypography((t) => ({ ...t, bodyWeight: w as any }))}
            >
              {w}
            </button>
          ))}
          <button
            className={`rounded-md border px-3 py-3 text-sm font-semibold ${
              typography.headingWeight === 900 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
            }`}
            onClick={() => setTypography((t) => ({ ...t, headingWeight: 900 }))}
          >
            900
          </button>
        </div>
        <div className="mt-3 text-xs text-slate-500">Heading weight is used for name + page title.</div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-800">Name Align</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              className={`rounded-md border px-3 py-3 text-sm font-semibold ${
                theme.headerAlign === a ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
              onClick={() => setTheme((t) => ({ ...t, headerAlign: a }))}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  title,
  value,
  min,
  max,
  step,
  rightLabel,
  onChange,
}: {
  title: string;
  value: number;
  min: number;
  max: number;
  step: number;
  rightLabel: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{rightLabel}</div>
      </div>
      <input
        className="mt-3 w-full"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* -------------------------------------------------------
   Layout Settings
------------------------------------------------------- */
function LayoutSettingsPanel({
  layout,
  setLayout,
}: {
  layout: LayoutSettings;
  setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
}) {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-800">Format</div>
        <select
          value={layout.format}
          onChange={(e) => setLayout((l) => ({ ...l, format: e.target.value as any }))}
          className="mt-2 w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-800 outline-none"
        >
          <option value="A4">A4 (8.27” × 11.69”)</option>
          <option value="LETTER">Letter (8.5” × 11”)</option>
        </select>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Margins & Paddings</div>

        <SliderRow
          title="Header & Footer"
          value={layout.headerFooterIn}
          min={0.3}
          max={1.2}
          step={0.05}
          rightLabel={`${layout.headerFooterIn.toFixed(2)} in`}
          onChange={(v) => setLayout((l) => ({ ...l, headerFooterIn: v }))}
        />

        <div className="mt-3" />

        <SliderRow
          title="Top & bottom"
          value={layout.marginTopBottomIn}
          min={0.5}
          max={1.5}
          step={0.05}
          rightLabel={`${layout.marginTopBottomIn.toFixed(2)} in`}
          onChange={(v) => setLayout((l) => ({ ...l, marginTopBottomIn: v }))}
        />

        <div className="mt-3" />

        <SliderRow
          title="Left & right"
          value={layout.marginLeftRightIn}
          min={0.5}
          max={1.5}
          step={0.05}
          rightLabel={`${layout.marginLeftRightIn.toFixed(2)} in`}
          onChange={(v) => setLayout((l) => ({ ...l, marginLeftRightIn: v }))}
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Spacing</div>

        <SliderRow
          title="Between sections"
          value={layout.betweenSectionsPt}
          min={8}
          max={32}
          step={1}
          rightLabel={`${layout.betweenSectionsPt} pt`}
          onChange={(v) => setLayout((l) => ({ ...l, betweenSectionsPt: v }))}
        />

        <div className="mt-3" />

        <SliderRow
          title="Between Titles & Content"
          value={layout.betweenTitleContentPt}
          min={8}
          max={32}
          step={1}
          rightLabel={`${layout.betweenTitleContentPt} pt`}
          onChange={(v) => setLayout((l) => ({ ...l, betweenTitleContentPt: v }))}
        />

        <div className="mt-3" />

        <SliderRow
          title="Between Content blocks"
          value={layout.betweenBlocksPt}
          min={6}
          max={24}
          step={1}
          rightLabel={`${layout.betweenBlocksPt} pt`}
          onChange={(v) => setLayout((l) => ({ ...l, betweenBlocksPt: v }))}
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-800">Date format</div>
        <select
          value={layout.dateFormat}
          onChange={(e) => setLayout((l) => ({ ...l, dateFormat: e.target.value as any }))}
          className="mt-2 w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-800 outline-none"
        >
          <option value="MM.YYYY">MM.YYYY</option>
          <option value="MMM YYYY">MMM YYYY</option>
          <option value="YYYY">YYYY</option>
        </select>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Pagination Engine
   - Base pages are in resume.pages with auto=false
   - We generate continuation pages (auto=true) if content overflows
   - We regenerate from scratch whenever content/theme/typography/layout changes
------------------------------------------------------- */
function PaginatedPreview({
  pageWidthPx,
  pageHeightPx,
  zoom,
  theme,
  typography,
  layout,
  resume,
  setResume,
}: {
  pageWidthPx: number;
  pageHeightPx: number;
  zoom: number;
  theme: ThemeSettings;
  typography: TypographySettings;
  layout: LayoutSettings;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
}) {
  const t = templateStyles(theme.template, theme.primary);

  // measure body (content) available height per page using a hidden skeleton
  const bodyMeasureRef = useRef<HTMLDivElement>(null);
  const [bodyMaxHeight, setBodyMaxHeight] = useState(600);

  const marginX = layout.marginLeftRightIn * 96;
  const marginY = layout.marginTopBottomIn * 96;
  const headerFooter = layout.headerFooterIn * 96;

  const betweenSectionsPx = (layout.betweenSectionsPt / 72) * 96;
  const betweenTitleContentPx = (layout.betweenTitleContentPt / 72) * 96;
  const betweenBlocksPx = (layout.betweenBlocksPt / 72) * 96;

  // Compute body container height once per settings
  useLayoutEffect(() => {
    if (!bodyMeasureRef.current) return;
    setBodyMaxHeight(bodyMeasureRef.current.clientHeight);
  }, [
    pageWidthPx,
    pageHeightPx,
    theme.template,
    theme.headerDesign,
    theme.footerDesign,
    theme.headerAlign,
    theme.logoPosition,
    theme.primary,
    theme.headerBgColor,
    theme.headerBgUsePrimary,
    theme.headerElements,
    typography,
    layout,
    resume.logoDataUrl,
    resume.name,
    resume.email,
    resume.phone,
    resume.website,
    resume.footerEmail,
    resume.address,
  ]);

  // Hidden measurer for blocks
  const blocksMeasureRef = useRef<HTMLDivElement | null>(null);

  // Repaginate state => write back with auto pages
  useLayoutEffect(() => {
    const blocksMeasurer = blocksMeasureRef.current;
    if (!blocksMeasurer) return;

    // 1) Take only base pages (ignore existing autos), but also merge old autos into their parent if present
    //    (Since base pages already store the main content, we simply use base pages as the single source of truth.)
    const basePages = resume.pages.filter((p) => !p.auto).map((p) => ({ ...p, html: p.html || "" }));

    // 2) Create new final pages list with auto continuations
    const nextPages: ResumePage[] = [];

    const cssFont: React.CSSProperties = {
      fontFamily: "var(--fontFamily)",
      fontSize: "var(--baseSize)",
      lineHeight: "var(--lineHeight)" as any,
      letterSpacing: "var(--letterSpacing)" as any,
    };

    // Configure the measurer to match body width and styling
    const contentWidthPx = pageWidthPx - marginX * 2;
    blocksMeasurer.style.width = `${contentWidthPx}px`;
    blocksMeasurer.style.height = `${bodyMaxHeight}px`;
    blocksMeasurer.style.paddingLeft = `0px`;
    blocksMeasurer.style.paddingRight = `0px`;
    blocksMeasurer.style.paddingTop = `0px`;
    blocksMeasurer.style.paddingBottom = `0px`;
    blocksMeasurer.style.overflow = "hidden";
    Object.assign(blocksMeasurer.style, {
      fontFamily: (cssFont as any).fontFamily,
      fontSize: (cssFont as any).fontSize,
      lineHeight: (cssFont as any).lineHeight,
      letterSpacing: (cssFont as any).letterSpacing,
    });

    for (const base of basePages) {
      // Convert this page's html into blocks
      const allBlocks = htmlToBlocks(base.html);

      // If empty => still one page
      if (!allBlocks.length) {
        nextPages.push({ ...base, auto: false });
        continue;
      }

      let remaining = [...allBlocks];
      let pageIndex = 1;

      while (remaining.length) {
        // Reset measurer content for this page: include title bar first
        blocksMeasurer.innerHTML = "";

        // Title block markup (must match preview)
        blocksMeasurer.insertAdjacentHTML(
          "beforeend",
          `
          <div style="padding-top:${betweenSectionsPx}px;">
            <div class="rounded-md px-4 py-3 ${t.sectionBar}" style="margin-bottom:${betweenTitleContentPx}px;">
              <div class="${t.sectionTitleClass}" style="color:#0F172A;font-size:14px;font-weight:${typography.headingWeight};">
                ${escapeHtml(base.title)}
              </div>
            </div>
          </div>
        `
        );

        let fitCount = 0;

        // Now try fit blocks
        for (let i = 0; i < remaining.length; i++) {
          blocksMeasurer.insertAdjacentHTML("beforeend", wrapBodyBlock(remaining[i], betweenBlocksPx, t.bodyClass, typography.bodyWeight));
          if (blocksMeasurer.scrollHeight > bodyMaxHeight) {
            // overflow: remove the last inserted wrapper
            blocksMeasurer.lastElementChild?.remove();
            break;
          }
          fitCount++;
        }

        // Safety: if nothing fits, force at least one block to avoid infinite loop
        if (fitCount === 0) fitCount = 1;

        const fit = remaining.slice(0, fitCount);
        remaining = remaining.slice(fitCount);

        if (pageIndex === 1) {
          nextPages.push({
            ...base,
            auto: false,
            pageIndex: 1,
            html: blocksToHtml(fit),
          });
        } else {
          nextPages.push({
            id: uid("pg_auto"),
            title: `${base.title} (${pageIndex})`,
            html: blocksToHtml(fit),
            auto: true,
            parentId: base.id,
            pageIndex,
          });
        }

        pageIndex++;
      }
    }

    // 3) Only setState if changed (avoid loops)
    const sig = (pages: ResumePage[]) =>
      pages
        .map((p) => `${p.id}|${p.title}|${p.auto ? "1" : "0"}|${(p.html || "").length}`)
        .join("::");

    const prevSig = sig(resume.pages);
    const nextSig = sig(nextPages);

    if (prevSig !== nextSig) {
      setResume((r) => ({ ...r, pages: nextPages }));
    }
  }, [
    bodyMaxHeight,
    pageWidthPx,
    pageHeightPx,
    theme,
    typography,
    layout,
    resume.pages,
    setResume,
    marginX,
    betweenSectionsPx,
    betweenTitleContentPx,
    t.sectionBar,
    t.sectionTitleClass,
    t.bodyClass,
  ]);

  // Render pages
  return (
    <>
      {/* Hidden page skeleton to measure available body height */}
      <div className="pointer-events-none absolute left-[-99999px] top-0 opacity-0">
        <div
          style={{
            width: px(pageWidthPx),
            height: px(pageHeightPx),
          }}
          className="print-page overflow-hidden rounded-md bg-white"
        >
          <ResumePreviewSinglePage
            theme={theme}
            typography={typography}
            layout={layout}
            resume={resume}
            t={t}
            page={{
              id: "measure",
              title: "PROFILE",
              html: "<p>Measure</p>",
            }}
            bodyRef={bodyMeasureRef}
            pageWidthPx={pageWidthPx}
            pageHeightPx={pageHeightPx}
          />
        </div>
      </div>

      {/* Hidden measurer for blocks */}
      <div className="pointer-events-none absolute left-[-99999px] top-0 opacity-0">
        <div ref={blocksMeasureRef} />
      </div>

      {/* Visible pages */}
      <div className="flex flex-col items-center gap-6">
        {resume.pages.map((p) => (
          <div
            key={p.id}
            style={{
              width: px(pageWidthPx),
              height: px(pageHeightPx),
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              willChange: "transform",
              marginBottom: zoom === 1 ? 0 : 24,
            }}
            className="print-page relative overflow-hidden rounded-md bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          >
            <ResumePreviewSinglePage
              theme={theme}
              typography={typography}
              layout={layout}
              resume={resume}
              t={t}
              page={p}
              pageWidthPx={pageWidthPx}
              pageHeightPx={pageHeightPx}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function escapeHtml(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function wrapBodyBlock(blockHtml: string, betweenBlocksPx: number, bodyClass: string, bodyWeight: number) {
  return `
    <div class="${bodyClass}" style="font-weight:${bodyWeight}; margin-top:${betweenBlocksPx}px;">
      ${blockHtml}
    </div>
  `;
}

/* -------------------------------------------------------
   Single Page Renderer (Header + Page Content + Footer)
------------------------------------------------------- */
function ResumePreviewSinglePage({
  theme,
  typography,
  layout,
  resume,
  t,
  page,
  bodyRef,
  pageWidthPx,
  pageHeightPx,
}: {
  theme: ThemeSettings;
  typography: TypographySettings;
  layout: LayoutSettings;
  resume: ResumeData;
  t: ReturnType<typeof templateStyles>;
  page: ResumePage;
  bodyRef?: React.RefObject<HTMLDivElement>;
  pageWidthPx: number;
  pageHeightPx: number;
}) {
  const marginX = layout.marginLeftRightIn * 96;
  const marginY = layout.marginTopBottomIn * 96;
  const headerFooter = layout.headerFooterIn * 96;

  const betweenSectionsPx = (layout.betweenSectionsPt / 72) * 96;
  const betweenTitleContentPx = (layout.betweenTitleContentPt / 72) * 96;
  const betweenBlocksPx = (layout.betweenBlocksPt / 72) * 96;

  const previewStyle: React.CSSProperties = {
    fontFamily: "var(--fontFamily)",
    fontSize: "var(--baseSize)",
    lineHeight: "var(--lineHeight)" as any,
    letterSpacing: "var(--letterSpacing)" as any,
  };

  const alignClass =
    theme.headerAlign === "left" ? "text-left" : theme.headerAlign === "right" ? "text-right" : "text-center";

  const headerGrid = theme.headerAlign === "center" ? "grid-cols-1" : "grid-cols-2";

  const headerBg = theme.headerBgUsePrimary ? theme.primary : theme.headerBgColor;

  const headerDecor = (() => {
    switch (theme.headerDesign) {
      case "bannerTop":
        return <div className="absolute left-0 top-0 h-16 w-full" style={{ background: headerBg }} />;
      case "splitLeft":
        return <div className="absolute left-0 top-0 h-full w-[38%]" style={{ background: `${headerBg}14` }} />;
      case "boxed":
        return <div className="absolute left-0 top-0 h-[120px] w-full" style={{ background: `${headerBg}12` }} />;
      case "underline":
        return (
          <div
            className="absolute left-1/2 top-[92px] h-[3px] w-[60%] -translate-x-1/2 rounded-full"
            style={{ background: headerBg }}
          />
        );
      case "minimal":
      default:
        return null;
    }
  })();

  const footerStyle = (() => {
    switch (theme.footerDesign) {
      case "darkStrip":
        return { bg: "#0F172A", text: "white" };
      case "lightStrip":
        return { bg: "#F1F5F9", text: "#0F172A" };
      case "boxed":
        return { bg: "transparent", text: "#0F172A" };
      case "none":
        return { bg: "transparent", text: "transparent" };
      case "strip":
      default:
        return { bg: theme.primary, text: "white" };
    }
  })();

  const logoBoxStyle: React.CSSProperties = {
    width: theme.headerElements.logoWidthPx,
    height: theme.headerElements.logoHeightPx,
    // borderRadius: theme.headerElements.logoRadiusPx,
    // borderWidth: theme.headerElements.logoBorderPx,
  };

  const nameText = theme.headerElements.showNameUppercase ? resume.name.toUpperCase() : resume.name;

  return (
    <div className="relative h-full w-full overflow-hidden" style={previewStyle}>
      {/* Header decoration */}
      <div className="pointer-events-none absolute inset-0"></div>

      <div className="relative flex h-full flex-col">
        {/* Header */}
        <div
          className={`relative  ${alignClass}`}
          style={{
            paddingLeft: marginX,
            paddingRight: marginX,
            paddingTop: headerFooter,
            paddingBottom: 18,

               background: footerStyle.bg,
          }}
        >
          <div className={`grid items-center gap-4 ${headerGrid}`}>
            {/* Logo LEFT */}
            {theme.logoPosition === "left" && resume.logoDataUrl ? (
              <div className="flex justify-start">
                <div
                  className="flex items-center justify-center overflow-hidden "
                  style={logoBoxStyle}>
                
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resume.logoDataUrl} alt="logo" className="h-full w-full object-contain" />
                </div>
              </div>
            ) : null}

            {/* Name + Email */}
            <div className="min-w-0">
              <div
                style={{
                  fontWeight: typography.headingWeight,
                  fontSize: theme.headerElements.nameFontSizePx,
                  color: "#fff",
                  letterSpacing: `${theme.headerElements.nameLetterSpacingEm}em`,
                }}
              >
                {nameText}
              </div>
              <div className="mt-1 text-slate-500" style={{ fontSize: 14, color: "#fff" }}>
                {resume.email}
              </div>
            </div>

            {/* Logo RIGHT */}
            {theme.logoPosition === "right" && resume.logoDataUrl ? (
              <div className="flex justify-end">
                <div
                  className="flex items-center justify-center overflow-hidden border border-slate-200 bg-white  shadow-sm"
                  style={logoBoxStyle}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resume.logoDataUrl} alt="logo" className="h-full w-full object-contain" />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: t.divider, marginLeft: marginX, marginRight: marginX }} />

        {/* Body (this is what we measure for pagination) */}
        <div
          ref={bodyRef as any}
          className="flex-1 overflow-hidden"
          style={{
            paddingLeft: marginX,
            paddingRight: marginX,
            paddingTop: betweenSectionsPx,
            paddingBottom: betweenSectionsPx / 2,
          }}
        >
          <div className={`rounded-md px-4 py-3 ${t.sectionBar}`} style={{ marginBottom: betweenTitleContentPx }}>
            <div
              className={`${t.sectionTitleClass}`}
              style={{ color: "#0F172A", fontSize: 14, fontWeight: typography.headingWeight }}
            >
              {page.title}
            </div>
          </div>

          <div className={`${t.bodyClass}`} style={{ fontWeight: typography.bodyWeight }}>
            <div
              className="prose prose-sm max-w-none"
              style={{ display: "grid", rowGap: betweenBlocksPx }}
              dangerouslySetInnerHTML={{ __html: stripDangerous(page.html) }}
            />
          </div>
        </div>

        {/* Footer */}
        {theme.footerDesign !== "none" ? (
          <div
            style={{
              paddingLeft: marginX,
              paddingRight: marginX,
              paddingTop: 14,
              paddingBottom: 14,
              background: footerStyle.bg,
              color: footerStyle.text as any,
            }}
          >
            {theme.footerDesign === "boxed" ? (
              <div className="rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <FooterContent resume={resume} color="#0F172A" />
              </div>
            ) : (
              <FooterContent resume={resume} color={footerStyle.text} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FooterContent({ resume, color }: { resume: ResumeData; color: any }) {
  return (
    <>
      <div className="flex items-center justify-between gap-0 text-[12px]" style={{ color }}>
        <span className="flex items-center gap-2">
          <FaPhoneAlt /> {resume.phone}
        </span>
        <span className="flex items-center gap-2">
          <TbWorld /> {resume.website}
        </span>
        <span className="flex items-center gap-2">
          <MdEmail /> {resume.footerEmail}
        </span>
      </div>

      <div className="mt-2 text-[11px] opacity-90" style={{ color }}>
        <span className="flex items-center gap-2">
          <IoLocationSharp /> {resume.address}
        </span>
      </div>
    </>
  );
}
