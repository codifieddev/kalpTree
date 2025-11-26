"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Website, User } from "./AppShell";

type AppShellClientProps = {
  children: React.ReactNode;
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
};

export function AppShellClient({
  children,
  websites,
  currentWebsite: initialCurrentWebsite,
  user,
}: AppShellClientProps) {
  const [currentWebsite, setCurrentWebsite] = useState(initialCurrentWebsite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleWebsiteChange = async (websiteId: string) => {
    const newWebsite = websites.find(w => w.websiteId === websiteId) || null;
    setCurrentWebsite(newWebsite);

    startTransition(async () => {
      try {
        // Call API to update the current website cookie
        const response = await fetch('/api/session/website', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ websiteId }),
        });

        if (response.ok) {
          // Refresh the page to update server-side state
          router.refresh();
        } else {
          console.error('Failed to update website context');
          // Revert the optimistic update
          setCurrentWebsite(initialCurrentWebsite);
        }
      } catch (error) {
        console.error('Error updating website context:', error);
        // Revert the optimistic update
        setCurrentWebsite(initialCurrentWebsite);
      }
    });
  };

  return (
    <AppShell
      websites={websites}
      currentWebsite={currentWebsite}
      user={user}
      onWebsiteChange={handleWebsiteChange}
    >
      {children}
    </AppShell>
  );
}