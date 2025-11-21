import { ObjectId } from 'mongodb';

// Base document with multi-tenant support
export interface BaseDocument {
  _id: ObjectId;
  tenantId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Tenant (franchise/client)
export interface Tenant extends Omit<BaseDocument, 'tenantId'> {
  slug: string; // subdomain: "franchise1"
  name: string; // "Franchise Store 1"
  email: string;
  phone?: string;

  // Whitelabel settings
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };

  // Domain configuration
  customDomain?: string; // "store.example.com"
  customDomainVerified: boolean;

  // Billing & subscription
  plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  subscriptionEndsAt?: Date;

  // Payment gateway credentials (encrypted)
  paymentGateways: {
    stripe?: {
      publishableKey: string;
      secretKey: string; // Store encrypted
    };
    razorpay?: {
      keyId: string;
      keySecret: string; // Store encrypted
    };
  };

  // Feature flags
  features: {
    websiteEnabled: boolean;
    ecommerceEnabled: boolean;
    blogEnabled: boolean;
    invoicesEnabled: boolean;
  };

  // Settings
  settings: {
    locale: string; // "en-US"
    currency: string; // "USD"
    timezone: string; // "America/New_York"
    taxRate?: number; // 0.08 (8%)
  };

  // Status
  status: 'active' | 'suspended' | 'pending';
}

// User (tenant-level access)
export interface User extends BaseDocument {
  email: string;
  passwordHash: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'active' | 'invited' | 'suspended';
  lastLoginAt?: Date;

  // Permissions (optional granular control)
  permissions?: {
    website?: boolean;
    ecommerce?: boolean;
    invoices?: boolean;
    settings?: boolean;
  };
}

// Super Admin (platform-level access)
export interface SuperAdmin {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin';
  createdAt: Date;
  updatedAt: Date;
}
