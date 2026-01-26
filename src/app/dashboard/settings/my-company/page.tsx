import { CompanyForm } from "./company-form";
import { getUserMetadata } from "@/app/dashboard/settings/actions";

export default async function MyCompanyPage() {
  const metadata = await getUserMetadata();

  const initialData = {
    companyName: (metadata.company_name as string) || "",
    companyEmail: (metadata.company_email as string) || "",
    companyAddress: (metadata.company_address as string) || "",
    companyPhone: (metadata.company_phone as string) || "",
    companyVat: (metadata.company_vat as string) || "",
    companyRegNumber: (metadata.company_reg_number as string) || "",
  };

  return <CompanyForm initialData={initialData} />;
}
