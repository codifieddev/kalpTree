import { Eye, EyeOff } from "lucide-react";

export const Userdetails = ({
  handleInputChange,
  formData,
  showPassword,
  setShowPassword,
  role,
}: any) => {
  return (
    <div className="space-y-6">
      {/* Agency Fields - Only visible for superadmin */}
      {true && (
        <>
          <div className="bg-gray-100 border-2 border-primary-200 rounded-md p-6 mb-6">
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Agency Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agency Name
                </label>
                <input
                  type="text"
                  name="agency_name"
                  value={formData.agency_name || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Digital Agency Co"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agency URL Suffix
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 bg-white">
                  <input
                    type="text"
                    name="agency_url_suffix"
                    value={formData.agency_url_suffix || ""}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-3 outline-none"
                    placeholder="digitalagency"
                  />
                  <span className="px-2 text-gray-500">.kalptree.com</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agency User Email
                </label>
                <input
                  type="email"
                  name="agency_email"
                  value={formData.agency_email || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="agency@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agency Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="agency_password"
                    value={formData.agency_password || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Agency Service Type
                </label>
                <div className="space-y-3">
                  <label
                    className={`flex items-start p-4 rounded-md border-2 cursor-pointer transition-all ${
                      formData.agency_service === "WEBSITE_ONLY"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="agency_service"
                      value="WEBSITE_ONLY"
                      checked={formData.agency_service === "WEBSITE_ONLY"}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 bg-white text-purple-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">
                        Website Only
                      </div>
                      <div className="text-sm text-gray-600">
                        Basic website hosting and management
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start p-4 rounded-md border-2 cursor-pointer transition-all ${
                      formData.agency_service === "ECOMMERCE"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="agency_service"
                      value="ECOMMERCE"
                      checked={formData.agency_service === "ECOMMERCE"}
                      onChange={handleInputChange}
                      className="mt-1 bg-white w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">
                        E-commerce
                      </div>
                      <div className="text-sm text-gray-600">
                        Full e-commerce functionality with payment processing
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />
        </>
      )}

      {/* Business User Fields */}
      <div className="bg-gray-100 border-2 border-primary-200 rounded-md p-6">
        <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
          Business Account Details
        </h3>

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
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="KalpTree"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 bg-white">
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
                  console.log("Check URL:", formData.businsess_url);
                }}
                className="px-4 py-3 bg-primary text-white text-sm font-semibold hover:bg-primary transition-all"
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Permission Roles 
        </label>
        <div className="space-y-3">
          {role === "superadmin" ? (
            <label
              className={`flex items-start p-4 rounded-md border-2 cursor-pointer transition-all ${
                formData.role === "agency"
                  ? "border-primary-500 bg-gray-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="agency"
                checked={formData.role === "agency"}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Agency Owner</div>
                <div className="text-sm text-gray-600">
                  Manage services and make business.
                </div>
              </div>
            </label>
          ) : (
            <label
              className={`flex items-start p-4 rounded-md border-2 cursor-pointer transition-all ${
                formData.role === "business"
                  ? "border-primary-500 bg-gray-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="business"
                checked={formData.role === "business"}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <div className="font-semibold text-gray-900">
                  Business Owner
                </div>
                <div className="text-sm text-gray-600">
                  Manage services and make purchases using added payment method.
                </div>
              </div>
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Service Type
        </label>
        <div className="space-y-3">
          <label
            className={`flex items-start p-4 rounded-md border-2 cursor-pointer transition-all ${
              formData.service === "WEBSITE_ONLY"
                ? "border-primary-500 bg-gray-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="service"
              value="WEBSITE_ONLY"
              checked={formData.service === "WEBSITE_ONLY"}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <div className="font-semibold text-gray-900">Website Only</div>
              <div className="text-sm text-gray-600">
                Basic website hosting and management
              </div>
            </div>
          </label>

          <label
            className={`flex items-start p-4 rounded-md border-2 cursor-pointer transition-all ${
              formData.service === "ECOMMERCE"
                ? "border-primary-500 bg-gray-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="service"
              value="ECOMMERCE"
              checked={formData.service === "ECOMMERCE"}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
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
