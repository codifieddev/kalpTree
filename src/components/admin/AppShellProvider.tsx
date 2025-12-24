'use client';

import { useEffect, useState } from "react";
import { AppShellClient } from "./AppShellClient";
import { Website, User } from "./AppShell";

type AppShellProviderProps = {
  children: React.ReactNode;
};

export function AppShellProvider({ children }: AppShellProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [currentTenant, setCurrentTenant] = useState<any | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
  const [loggedinTenant, setLoggedinTenant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/appshell-data');
        const data = await response.json();
        
        setUser(data.user);
        setTenants(data.tenants);
        setCurrentTenant(data.currentTenant);
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
      tenants={tenants}
      currentTenant={currentTenant}
      user={user}
      loggedinTenant={loggedinTenant}
    >
      {children}
    </AppShellClient>
  );
}