import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { CustomerTable } from "@/components/CustomerTable";
import { RecentActivity } from "@/components/RecentActivity";
import { Users, TrendingUp, DollarSign, Target } from "lucide-react";

import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t("dashboard.overviewTitle")}</h1>
          <p className="text-muted-foreground">{t("dashboard.overviewSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={t("dashboard.metrics.activeCustomers")}
            value="2,543"
            icon={Users}
            trend={{ value: "12.5%", isPositive: true }}
          />
          <MetricCard
            title={t("dashboard.metrics.opportunities")}
            value="87"
            icon={Target}
            trend={{ value: "8.3%", isPositive: true }}
          />
          <MetricCard
            title={t("dashboard.metrics.monthlyRevenue")}
            value="245K €"
            icon={DollarSign}
            trend={{ value: "23.1%", isPositive: true }}
          />
          <MetricCard
            title={t("dashboard.metrics.conversionRate")}
            value="68%"
            icon={TrendingUp}
            trend={{ value: "3.2%", isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerTable />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
