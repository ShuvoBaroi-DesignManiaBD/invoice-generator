import { AccountForm } from "./account-form";
import { getUserMetadata } from "@/app/dashboard/settings/actions";

export default async function AccountPage() {
  const metadata = await getUserMetadata();

  const initialData = {
    fullName: (metadata.full_name as string) || "",
  };

  return <AccountForm initialData={initialData} />;
}
