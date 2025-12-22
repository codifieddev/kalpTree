import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    tenantId: string;
    role: string;
    permissions: string[];
    name: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      tenantId: string;
      // tenantSlug: string;
      role: string;
      permissions: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    email: string;
    role: string;
    tenantId: string;
    permissions: string[];
    name: string;
  }
}
