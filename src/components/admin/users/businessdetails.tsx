import { Building2, MapPin } from "lucide-react";

export const Businessdetails = ({ handleInputChange, formData }: any) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-6 rounded-xl border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          General Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              //   name="businessdetails.business_name"
              value={formData.business_name}
              //   onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="KaplTree"
              disabled={true}
              readOnly={true}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tagline / Slogan
            </label>
            <input
              type="text"
              name="businessdetails.tagline"
              value={formData.businessdetails.tagline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="AI-Powered Architecture & Design"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Industry
            </label>
            <div className="space-y-3">
              <label className="flex items-start p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="businessdetails.industry"
                  value="Architecture"
                  checked={formData.businessdetails.industry === "Architecture"}
                  onChange={handleInputChange}
                  className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Architecture</div>
                  <div className="text-sm text-gray-500">
                    Design and construction services
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="businessdetails.industry"
                  value="Interior Design"
                  checked={
                    formData.businessdetails.industry === "Interior Design"
                  }
                  onChange={handleInputChange}
                  className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    Interior Design
                  </div>
                  <div className="text-sm text-gray-500">
                    Interior space planning and decoration
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="businessdetails.industry"
                  value="Real Estate"
                  checked={formData.businessdetails.industry === "Real Estate"}
                  onChange={handleInputChange}
                  className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Real Estate</div>
                  <div className="text-sm text-gray-500">
                    Property sales and management
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="businessdetails.industry"
                  value="Technology"
                  checked={formData.businessdetails.industry === "Technology"}
                  onChange={handleInputChange}
                  className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Technology</div>
                  <div className="text-sm text-gray-500">
                    Software and tech solutions
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Founded Year
            </label>
            <input
              type="text"
              name="businessdetails.founded_year"
              value={formData.businessdetails.founded_year}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="2023"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              About / Bio
            </label>
            <textarea
              name="businessdetails.about"
              value={formData.businessdetails.about}
              onChange={handleInputChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white resize-none"
              placeholder="KalpTree is the leading platform for visualizing home exteriors using advanced AI material rendering."
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.businessdetails.about.length}/500 characters
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Contact & Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all bg-white">
              <span className="px-3 text-gray-500">https://</span>
              <input
                type="text"
                name="businessdetails.business_website_url"
                value={formData.businessdetails.business_website_url}
                onChange={handleInputChange}
                className="flex-1 px-2 py-3 outline-none"
                placeholder="KalpTree.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Public Email
            </label>
            <input
              type="email"
              name="businessdetails.public_email"
              value={formData.businessdetails.public_email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="contact@KalpTree.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="businessdetails.phone"
              value={formData.businessdetails.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Headquarters Address
            </label>
            <input
              type="text"
              name="businessdetails.headquarters"
              value={formData.businessdetails.headquarters}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="123 Innovation Dr, Tech City, CA"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
