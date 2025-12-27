"use client";

import { useEffect, useState } from "react";
import { AppShellClient } from "./AppShellClient";
import { Website, User } from "./AppShell";
import { useParams, useSearchParams } from "next/navigation";

type AppShellProviderProps = {
  children: React.ReactNode;
};

export function AppShellProvider({ children }: AppShellProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [currentAgency, setCurrentAgency] = useState<any | null>(null);
  const [business, setBusiness] = useState<any[]>([]);
  const [currentbusiness, setCurrentBusiness] = useState<any | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
  const [loggedinTenant, setLoggedinTenant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const query = useSearchParams();
  const tenantId = query.get("tenantId");
  const businessid = query.get("businessid");
  const url = params.website;

  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/appshell-data?url=${url}&businessid=${businessid}&tenantId=${tenantId}`
        );
        const data = await response.json();
        setAgencies(data.agencies);
        setCurrentAgency(data.currentagency);
        setUser(data.user);
        setBusiness(data.business);
        setCurrentBusiness(data.currentbusiness);
        setWebsites(data.websites);
        setCurrentWebsite(data.currentWebsite);
        setLoggedinTenant(data.loggedinTenant);
      } catch (error) {
        console.error("Failed to load app shell data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AppShellClient
      websites={websites}
      currentWebsite={currentWebsite}
      tenants={business}
      currentTenant={currentbusiness}
      user={user}
      loggedinTenant={loggedinTenant}
      agencies={agencies}
      currentagency={currentAgency}
    >
      {children}
    </AppShellClient>
  );
}
