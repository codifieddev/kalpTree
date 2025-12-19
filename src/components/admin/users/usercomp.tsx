"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Store,
  Mail,
  Key,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function UsersPage({ user }: any) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    password: "",
    role: "business",
    service: "ECOMMERCE",
    website_name: "",
    website_url: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedUser, setExpandedUser] = useState(null);
  console.log(user);

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/public/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: formData.slug,
          tenantName: formData.name,
          adminEmail: formData.email,
          adminPassword: formData.password,
          role: formData.role,
          serviceType: formData.service,
          website_name: formData.website_name,
          createdById: user.id,
          website_url: `${formData.website_url}.kalptree.com`
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "User created successfully!" });
        setFormData({
          name: "",
          slug: "",
          email: "",
          password: "",
          role: "business",
          service: "ECOMMERCE",
          website_name: "",
          website_url: ""
        });
        fetchUsers();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create user",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while creating the user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage your business and franchise users
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create New User
            </h2>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Demo Tenant"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Slug
                </div>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="demo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </div>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="business">Business</option>
                <option value="franchise">Franchise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Service Type
                </div>
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="WEBSITE_ONLY">Website Only</option>
                <option value="ECOMMERCE">Ecommerce</option>
              </select>
            </div>

            <hr className="col-span-2"/>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Business Name
                </div>
              </label>
              <input
                type="text"
                name="website_name"
                value={formData.website_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="PeanutOrg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Website Demo URL
                </div>
              </label>

              <div className="flex items-center w-full border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                <input
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  required
                  className="flex-1 px-4 py-3 outline-none text-gray-900"
                  placeholder="shadcnstudio"
                />
                <span className="px-4 py-3 bg-gray-100 text-gray-600 text-sm border-l border-gray-300">
                  .kalptree.com
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] font-semibold shadow-lg"
          >
            {isSubmitting ? "Creating User..." : "Create User"}
          </button>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>

          {/* {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No users found. Create your first user above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all"
                >
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            user.role === "business"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : "bg-gradient-to-br from-green-500 to-green-600"
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase() ||
                            user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            {user.name || "Unnamed"}
                          </h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              user.role === "business"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.role === "business" ? (
                              <Building2 className="w-4 h-4 inline mr-1" />
                            ) : (
                              <Store className="w-4 h-4 inline mr-1" />
                            )}
                            {user.role}
                          </span>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              user.subscriptionStatus === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.subscriptionStatus || "inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleUserDetails(user._id)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          {expandedUser === user._id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedUser === user._id && (
                    <div className="p-5 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Slug</p>
                          <p className="font-semibold text-gray-900">
                            {user.slug || "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Plan</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {user.plan || "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Custom Domain
                          </p>
                          <p className="font-semibold text-gray-900">
                            {user.customDomainVerified ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Verified
                              </span>
                            ) : (
                              <span className="text-gray-400 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> Not Verified
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {user.status || "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Created At
                          </p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Updated At
                          </p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {user.updatedAt
                              ? new Date(user.updatedAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
