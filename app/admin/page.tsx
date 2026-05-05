import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";
import EarningReportChart from "@/components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart";
import SalesOverviewChart from "@/components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart";
import SalesByCountryWidget from "@/components/shadcn-space/blocks/dashboard-shell-01/salesbycountrywidget";
import StatisticsBlock from "@/components/shadcn-space/blocks/dashboard-shell-01/statistics";
import TopProductTable from "@/components/shadcn-space/blocks/dashboard-shell-01/top-product-table";

export default function AdminPage() {
  return (
    <AppSidebar>
      <div className="grid grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
        <div className="col-span-12">
          <StatisticsBlock />
        </div>
        <div className="xl:col-span-8 col-span-12">
          <SalesOverviewChart />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <EarningReportChart />
        </div>
        <div className="xl:col-span-8 col-span-12">
          <TopProductTable />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <SalesByCountryWidget />
        </div>
      </div>
    </AppSidebar>
  );
}
