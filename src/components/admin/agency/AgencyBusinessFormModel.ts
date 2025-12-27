export interface BusinessDetails {
  business_website_url: string;
  tagline: string;
  industry: string;
  founded_year: string;
  about: string;
  public_email: string;
  phone: string;
  headquarters: string;
}

export interface BrandingDetails {
  logo: File | null;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  typography: string;
}

export interface AgencyBusinessFormModel {
  // Agency fields (for superadmin only)
  agency_name: string;
  agency_url_suffix: string;
  agency_email: string;
  agency_password: string;
  agency_service: string;

  // Business user fields
  email: string;
  password: string;
  role: string;
  service: string;
  business_name: string;
  businsess_url: string;

  businessdetails: BusinessDetails;
  branding: BrandingDetails;
  createdById: string;
}
