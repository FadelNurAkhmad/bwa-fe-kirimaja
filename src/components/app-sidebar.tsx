/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Chart2,
  BoxTick,
  Routing,
  Location,
  User,
  TruckFast,
  ClipboardTick,
  ClipboardClose,
  Buildings,
  UserTag,
  Shield,
  Truck,
} from "iconsax-reactjs";
import { Link, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";
import { usePermission } from "@/hooks/use-permission";
import { PermissionGuard } from "./permission-guard";

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  permission?: string; // Optional permission key
};

const data = {
  versions: [],
  navMain: [
    {
      title: "Main Menu",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Chart2,
          // Dashboard is accessible to all authenticated users
        },
        {
          title: "Kirim Paket",
          url: "/send-package",
          icon: BoxTick,
          permission: "shipments.create",
        },
        {
          title: "Lacak Paket",
          url: "/track-package",
          icon: Routing,
          // Track package is accessible to all authenticated users
        },
        {
          title: "Datar Pengiriman",
          url: "/delivery",
          icon: ClipboardTick,
          permission: "delivery.read",
        },
        {
          title: "Scan Paket",
          url: "/shipment-branch",
          icon: Truck,
          permission: "shipment-branch.read",
        },
        {
          title: "History",
          url: "/history",
          icon: ClipboardClose,
          // History is accessible to all authenticated users
          permission: "history.read",
        },
        {
          title: "Alamat Saya",
          url: "/user-addresses",
          icon: Location,
          // User addresses is accessible to all authenticated users
        },
        {
          title: "Profile",
          url: "/profile",
          icon: User,
          // Profile is accessible to all authenticated users
        },
      ],
    },
  ],
  masterSidebar: [
    {
      title: "Master",
      items: [
        {
          title: "Cabang",
          url: "/branch",
          icon: Buildings,
          permission: "branches.read",
        },
        {
          title: "Karyawan",
          url: "/employee",
          icon: UserTag,
          permission: "employee.read",
        },
        {
          title: "Role",
          url: "/role",
          icon: Shield,
          permission: "permissions.read",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { hasPermission } = usePermission(); // Use the custom hook to check permissions
  const isActive = (url: string) => {
    if (location.pathname.startsWith(url)) {
      if (url === "/") {
        return location.pathname === "/";
      } else {
        return location.pathname.startsWith(url);
      }
    }
  };

  /**
   * Pengecekan apakah user memiliki akses ke salah satu item dalam grup menu utama
   *
   */
  const hasAccessToMasterMenu = (items: MenuItem[]) => {
    return items.some((item) => {
      if (item.permission) {
        return hasPermission(item.permission);
      }
      return true;
    });
  };

  /**
   * Render item menu biasa (tanpa sub-menu)
   *
   */
  const renderMenuItem = (item: MenuItem) => {
    const content = (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)} size="lg">
          <Link to={item.url}>
            {item.icon && (
              <item.icon
                size={30}
                variant="Bold"
                className={
                  isActive(item.url) ? "text-primary" : "text-secondary"
                }
              />
            )}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

    // Jika ada permission, bungkus dengan PermissionGuard
    if (item.permission) {
      return (
        <PermissionGuard key={item.title} permission={item.permission}>
          {content}
        </PermissionGuard>
      );
    }

    return content;
  };

  /**
   * Render item untuk Master Menu (biasanya dengan sub-menu)
   *
   */
  const renderMasterMenuItem = (item: MenuItem) => {
    const content = (
      <SidebarMenuSubItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)} size="lg">
          <Link to={item.url}>
            {item.icon && (
              <item.icon
                size={24}
                variant="Bold"
                className={
                  isActive(item.url) ? "text-primary" : "text-secondary"
                }
              />
            )}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    );

    if (item.permission) {
      return (
        <PermissionGuard key={item.title} permission={item.permission}>
          {content}
        </PermissionGuard>
      );
    }

    return content;
  };

  return (
    <Sidebar {...props}>
      {/* Header Sidebar */}
      <SidebarHeader>
        <div className="flex items-center">
          <TruckFast
            className="text-primary size-8 mr-3"
            variant="Bulk"
            size={32}
          />
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-xl">KirimAja</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-6 pt-0">
        {/* Navigasi Utama */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{item.items?.map(renderMenuItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Master Sidebar dengan Collapsible */}
        {data.masterSidebar.map((masterGroup) => {
          // Hanya render jika user punya akses ke salah satu item
          if (!hasAccessToMasterMenu(masterGroup.items)) {
            return null;
          }

          return (
            <Collapsible
              key={masterGroup.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center justify-between w-full cursor-pointer h-12 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                    {masterGroup.title}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub>
                      {masterGroup.items.map(renderMasterMenuItem)}
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
