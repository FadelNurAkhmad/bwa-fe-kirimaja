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

/**
 * Definisi tipe data untuk satu item menu di sidebar.
 */
type MenuItem = {
  title: string; // Nama yang akan tampil di menu
  url: string; // Alamat tujuan (link)
  icon: any; // Ikon yang akan ditampilkan
  permission?: string; // (Opsional) Kunci hak akses yang dibutuhkan untuk melihat menu ini
};

/**
 * Struktur data statis untuk menu navigasi.
 * Terbagi menjadi navMain (menu umum) dan masterSidebar (menu administratif).
 */
const data = {
  versions: [],
  navMain: [
    {
      title: "Main Menu",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Chart2 }, // Tanpa permission: Bisa dilihat semua user
        {
          title: "Kirim Paket",
          url: "/send-package",
          icon: BoxTick,
          permission: "shipments.create",
        },
        { title: "Lacak Paket", url: "/track-package", icon: Routing },
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
          permission: "history.read",
        },
        { title: "Alamat Saya", url: "/user-addresses", icon: Location },
        { title: "Profile", url: "/profile", icon: User },
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
  const location = useLocation(); // Mengambil lokasi URL saat ini
  const { hasPermission } = usePermission(); // Hook kustom untuk mengecek apakah user punya hak akses tertentu

  /**
   * Fungsi untuk mengecek apakah menu tersebut sedang aktif (diklik).
   * Mengembalikan true jika pathname saat ini cocok dengan URL menu.
   */
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
   * Mengecek apakah grup "Master Menu" boleh ditampilkan.
   * Jika user tidak punya akses ke SATUPUN item di dalamnya, maka seluruh grup disembunyikan.
   */
  const hasAccessToMasterMenu = (items: MenuItem[]) => {
    return items.some((item) => {
      if (item.permission) {
        return hasPermission(item.permission);
      }
      return true; // Jika menu tidak butuh permission, dianggap punya akses
    });
  };

  /**
   * Fungsi untuk me-render komponen UI menu standar.
   * Jika menu memiliki 'permission', menu dibungkus dengan <PermissionGuard>.
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

    // Filter akses: Hanya tampil jika user memenuhi syarat permission
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
   * Fungsi render khusus untuk item yang berada di dalam sub-menu (Master Menu).
   * Memiliki ukuran ikon yang sedikit berbeda (lebih kecil).
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
      {/* HEADER: Menampilkan Logo dan Nama Aplikasi */}
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
        {/* LOOPING MENU UTAMA: Dashboard, Kirim Paket, dll. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{item.items?.map(renderMenuItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* LOOPING MENU MASTER: Hanya tampil jika user punya akses ke menu administratif (Cabang, Karyawan, dll) */}
        {data.masterSidebar.map((masterGroup) => {
          if (!hasAccessToMasterMenu(masterGroup.items)) {
            return null; // Sembunyikan seluruh grup jika tidak ada akses sama sekali
          }

          return (
            <Collapsible
              key={masterGroup.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                {/* Trigger untuk buka-tutup (accordion) menu Master */}
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="...">
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
