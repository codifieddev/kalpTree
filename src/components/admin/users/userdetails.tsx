import { Eye, EyeOff } from "lucide-react";

export const Userdetails = ({
  handleInputChange,
  formData,
  showPassword,
  setShowPassword,
}: any) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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

        <hr className="col-span-2" />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="KalpTree"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Website URL
          </label>

          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white">
            <input
              type="text"
              name="businsess_url"
              value={formData.businsess_url}
              onChange={handleInputChange}
              className="flex-1 px-3 py-3 outline-none"
              placeholder="kalptree"
            />

            <span className="px-2 text-gray-500">.kalptree.com</span>

            <button
              type="button"
              onClick={() => {
                // later call API to check availability
                console.log("Check URL:", formData.businsess_url);
              }}
              className="px-4 py-3 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all"
            >
              Check
            </button>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Permission Roles
        </label>
        <div className="space-y-3">
          <label
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.role === "business"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="business"
              checked={formData.role === "business"}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <div className="font-semibold text-gray-900">Business Owner</div>
              <div className="text-sm text-gray-600">
                Manage services and make purchases using added payment method.
              </div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Service Type
        </label>
        <div className="space-y-3">
          <label
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.service === "WEBSITE_ONLY"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="service"
              value="WEBSITE_ONLY"
              checked={formData.service === "WEBSITE_ONLY"}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <div className="font-semibold text-gray-900">Website Only</div>
              <div className="text-sm text-gray-600">
                Basic website hosting and management
              </div>
            </div>
          </label>

          <label
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.service === "ECOMMERCE"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="service"
              value="ECOMMERCE"
              checked={formData.service === "ECOMMERCE"}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <div className="font-semibold text-gray-900">E-commerce</div>
              <div className="text-sm text-gray-600">
                Full e-commerce functionality with payment processing
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
