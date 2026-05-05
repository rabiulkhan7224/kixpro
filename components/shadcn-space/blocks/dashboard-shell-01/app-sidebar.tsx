"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo/logo";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Megaphone,
  Settings,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
  isActive?: boolean;
};

// ---------- E‑commerce Navigation ----------
export const navData: NavItem[] = [
  // Dashboard
  { label: "MAIN", isSection: true },
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin", isActive: true },

  // Catalog
  { label: "CATALOG", isSection: true },
  {
    title: "Products",
    icon: Package,
    href: "/admin/products",
    children: [
      { title: "All Products", href: "/admin/products" },
      { title: "Add New", href: "/admin/products/new" },
      { title: "Categories", href: "/admin/categories" },
      { title: "Attributes", href: "/admin/attributes" },
    ],
  },
  {
    title: "Categories",
    icon: Tag,
    href: "/admin/categories",
  },
  {
    title: "Attributes",
    icon: Tag,
    href: "/admin/attributes",
  },

  // Sales
  { label: "SALES", isSection: true },
  { title: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { title: "Invoices", icon: ShoppingCart, href: "/admin/invoices" },
  { title: "Shipments", icon: ShoppingCart, href: "/admin/shipments" },

  // Customers
  { label: "CUSTOMERS", isSection: true },
  { title: "All Customers", icon: Users, href: "/admin/customers" },
  { title: "Groups", icon: Users, href: "/admin/customer-groups" },

  // Marketing
  { label: "MARKETING", isSection: true },
  { title: "Discounts", icon: Megaphone, href: "/admin/discounts" },
  { title: "Coupons", icon: Megaphone, href: "/admin/coupons" },

  // Settings
  { label: "SETTINGS", isSection: true },
  { title: "Store Settings", icon: Settings, href: "/admin/settings" },
  { title: "Shipping & Tax", icon: Settings, href: "/admin/shipping-tax" },
];

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar className="py-4 px-0 bg-background">
        <div className="flex flex-col gap-6 bg-background">
          {/* ---------------- Header ---------------- */}
          <SidebarHeader className="py-0 px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <a href="/admin" className="w-full h-full">
                  <Logo />
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* ---------------- Content ---------------- */}
          <SidebarContent className="overflow-hidden gap-0 px-0">
            <SimpleBar
              autoHide={true}
              className="h-[calc(100vh-348px)] border-b border-border"
            >
              <div className="px-4">
                <NavMain items={navData} />
              </div>
            </SimpleBar>

            {/* ---- Replace promo card with store stats ---- */}
            <div className="pt-4 px-4">
              <Card className="shadow-none ring-0 bg-muted/50 px-4 py-4">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Today’s sales</span>
                    <span className="text-sm font-semibold">$1,240</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Orders</span>
                    <span className="text-sm font-semibold">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Visitors</span>
                    <span className="text-sm font-semibold">324</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs"
                    asChild
                  >
                    <a href="/admin/analytics">
                      View full report
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </SidebarContent>
        </div>
      </Sidebar>

      {/* ---------------- Main Layout ---------------- */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex items-center border-b px-6 py-3 bg-background">
          <SiteHeader />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
