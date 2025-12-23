import { auth } from "@/auth";
import { AccountSharing } from "@/components/admin/accountsharing/accountsharing";
import { GrantAccessComponent } from "@/components/admin/accountsharing/grantaccess/grantaccess";

export default async function WebsiteGrantAccess() {

    const session = await auth()
   
  return (
    <div className="space-y-6">
      <GrantAccessComponent user={session?.user} />
    </div>
  );
}
