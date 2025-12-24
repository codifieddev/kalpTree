"use client";

import { useState } from "react";
import {
  UserPlus,
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  Palette,
} from "lucide-react";
import { Userdetails } from "./userdetails";
import { Businessdetails } from "./businessdetails";
import { Brandingdetails } from "./brandingdetails";

export default function UsersPage({ user }: any) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "business",
    service: "ECOMMERCE",
    business_name: "",
    businsess_url: "",

    // Business Details
    businessdetails: {
      business_website_url: "",
      tagline: "",
      industry: "Architecture",
      founded_year: "2023",
      about: "",
      public_email: "",
      phone: "",
      headquarters: "",
    },

    // Branding
    branding: {
      logo: null,
      primary_color: "#6366f1",
      secondary_color: "#8b5cf6",
      tertiary_color: "#ec4899",
      typography: "Inter",
    },

    createdById: user.id,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedUser, setExpandedUser] = useState(null);
  const [logoPreview, setLogoPreview] = useState<any>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");

  const handleInputChange = (e: any) => {
    const { name, value, type, files } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
      return;
    }

    // Handle business name (alphanumeric + space only)
    if (name === "business_name") {
      if (!/^[a-zA-Z0-9 ]*$/.test(value)) return;

      setFormData((prev: any) => ({
        ...prev,
        business_name: value,
        businsess_url: slugify(value),
      }));
      return;
    }

    // Handle file upload
    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setFormData((prev: any) => ({
          ...prev,
          branding: {
            ...prev.branding,
            logo: file,
          },
        }));

        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
      return;
    }

    // Normal fields
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage({ type: "", text: "" });

      const fd = new FormData();

      // Root fields
      fd.append("email", formData.email);
      fd.append("password", formData.password);
      fd.append("role", formData.role);
      fd.append("service", formData.service);
      fd.append("business_name", formData.business_name);
      fd.append("businsess_url", formData.businsess_url);
      fd.append("createdById", formData.createdById);

      // Business details (nested → stringify)
      fd.append("businessdetails", JSON.stringify(formData.businessdetails));

      // Branding fields
      fd.append(
        "branding",
        JSON.stringify({
          primary_color: formData.branding.primary_color,
          secondary_color: formData.branding.secondary_color,
          tertiary_color: formData.branding.tertiary_color,
          typography: formData.branding.typography,
        })
      );

      // Logo file
      if (formData.branding.logo) {
        fd.append("logo", formData.branding.logo);
      }

      const res = await fetch("/api/public/onboarding", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();

      if (result.tenantId) {
        setFormData({
          email: "",
          password: "",
          role: "business",
          service: "ECOMMERCE",
          business_name: "",
          businsess_url: "",

          // Business Details
          businessdetails: {
            business_website_url: "",
            tagline: "",
            industry: "Architecture",
            founded_year: "2023",
            about: "",
            public_email: "",
            phone: "",
            headquarters: "",
          },

          // Branding
          branding: {
            logo: null,
            primary_color: "#6366f1",
            secondary_color: "#8b5cf6",
            tertiary_color: "#ec4899",
            typography: "Inter",
          },

          createdById: user.id,
        });
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "user", label: "User Details", icon: User },
    { id: "business", label: "Business Details", icon: Briefcase },
    { id: "branding", label: "Branding", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Business Management
          </h1>
          <p className="text-gray-600">
            Create and manage business accounts with complete branding
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                      activeTab === tab.id
                        ? "text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            )}

            {/* User Details Tab */}
            {activeTab === "user" && (
              <Userdetails
                handleInputChange={handleInputChange}
                formData={formData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}

            {/* Business Details Tab */}
            {activeTab === "business" && (
              <Businessdetails
                handleInputChange={handleInputChange}
                formData={formData}
              />
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <Brandingdetails
                handleInputChange={handleInputChange}
                formData={formData}
                logoPreview={logoPreview}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(
                    (t) => t.id === activeTab
                  );
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
                disabled={activeTab === "user"}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {activeTab === "branding" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    {isSubmitting ? "Creating User..." : "Create User"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const currentIndex = tabs.findIndex(
                        (t) => t.id === activeTab
                      );
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].id);
                      }
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        {/* <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            All Users
          </h2>

          <div className="text-center py-12 text-gray-500">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No users found. Create your first user above!</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
