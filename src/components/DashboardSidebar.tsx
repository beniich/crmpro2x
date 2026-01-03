import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useBrandingStore } from "@/stores/useBrandingStore";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

// Clés de navigation avec leurs clés de traduction
import { LayoutDashboard, Users, UserPlus, CalendarDays, BedDouble, Stethoscope, Receipt, BarChart3, Settings, ShieldCheck, Activity, TrendingUp, MessageSquare, ClipboardList, SquareKanban, Briefcase, ShoppingBag, CheckSquare, FileText } from "lucide-react";

// Common items visible in all workspaces
const commonItems = [
  { titleKey: "nav.dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.messages", url: "/messages", icon: MessageSquare }, // Chat is universal
  { titleKey: "nav.security", url: "/security", icon: ShieldCheck },
  { titleKey: "nav.settings", url: "/settings", icon: Settings },
];

// CRM / Enterprise specific items
const crmItems = [
  { titleKey: "nav.clients", url: "/companies", icon: Briefcase },
  { titleKey: "nav.deals", url: "/deals", icon: TrendingUp },
  { titleKey: "nav.tasks", url: "/tasks", icon: CheckSquare },
  { titleKey: "nav.products", url: "/products", icon: ShoppingBag },
  { titleKey: "nav.invoices", url: "/finance/invoices", icon: FileText },
  { titleKey: "nav.reports", url: "/analytics", icon: BarChart3 },
];

// Medical / Hospital specific items
const medicalItems = [
  { titleKey: "nav.patients", url: "/patients", icon: Users },
  { titleKey: "nav.agenda", url: "/schedule", icon: CalendarDays },
  { titleKey: "nav.secretary", url: "/secretary", icon: ClipboardList },
  { titleKey: "nav.staff", url: "/staff", icon: Stethoscope },
  { titleKey: "nav.resources", url: "/resources/map", icon: BedDouble },
  { titleKey: "nav.board", url: "/board", icon: SquareKanban }, // Kanban for patient flow
  { titleKey: "nav.reports", url: "/reports", icon: BarChart3 },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { appName, logoUrl, iconUrl, footerText } = useBrandingStore();
  const { t } = useTranslation();
  const { getActiveWorkspace } = useWorkspaceStore();

  const activeWorkspace = getActiveWorkspace();
  const isMedical = activeWorkspace?.type === 'clinic' || activeWorkspace?.type === 'hospital' || activeWorkspace?.type === 'dental' || activeWorkspace?.type === 'private_practice';

  // Combine items: Common items + Context specific items
  // We filter reports from specific lists if they are already in common, but here common only has Settings/Security/Dashboard/Messages.
  // Actually commonItems does NOT have Reports, so we keep reports in specific lists.
  // Wait, let's put Dashboard first, then specific items, then common utils (Settings, etc).

  const mainNavItems = isMedical ? medicalItems : crmItems;
  const dashboardUrl = isMedical ? "/dashboard" : "/crm";

  // Re-organize: Dashboard -> [Specific] -> Messages -> Security -> Settings
  const topItems = [{ titleKey: "nav.dashboard", url: dashboardUrl, icon: LayoutDashboard }];
  const bottomItems = [
    { titleKey: "nav.messages", url: "/messages", icon: MessageSquare },
    { titleKey: "nav.security", url: "/security", icon: ShieldCheck },
    { titleKey: "nav.settings", url: "/settings", icon: Settings },
  ];

  const navigationItems = [...topItems, ...mainNavItems, ...bottomItems];

  const isActive = (path: string) => currentPath === path;
  const currentYear = new Date().getFullYear();

  return (
    <Sidebar collapsible="icon" className="glass-panel border-r-0 flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300">
      <div className="p-2 border-b border-sidebar-border">
        <WorkspaceSwitcher />
      </div>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Pied de page avec copyright et sélecteur de langue */}
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-3">
        {state === "expanded" && (
          <div className="flex justify-center">
            <LanguageSelector variant="outline" size="sm" showLabel />
          </div>
        )}
        {state === "expanded" ? (
          <div className="text-center text-xs text-sidebar-foreground/50 space-y-1">
            <p className="font-medium">{footerText}</p>
            <p>© {currentYear} - {t('common.allRightsReserved')}</p>
          </div>
        ) : (
          <div className="text-center text-[10px] text-sidebar-foreground/50">
            <p>©{currentYear}</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
