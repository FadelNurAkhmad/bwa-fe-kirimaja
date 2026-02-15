import { META_DATA, useMeta } from "@/hooks/use-meta"; // Asumsi path berdasarkan useMeta
import { useShipments } from "@/hooks/use-shipment";
import { Page } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { AddSquare } from "iconsax-reactjs";
import { DataTable, useColumns } from "./components";
import { PermissionGuard } from "@/components";
import { useState } from "react";

export default function SendPackagePage() {
  useMeta(META_DATA["send-package"]);

  const columns = useColumns();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: shipments = [], isLoading, error } = useShipments();

  // Filter shipments berdasarkan search query
  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.tracking_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      shipment.shipment_detail?.package_type
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      shipment.pickup_address?.address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      shipment.shipment_detail?.destination_address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      shipment.shipment_detail?.recipient_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Penanganan Error State
  if (error) {
    return (
      <Page title="Kirim Paket 🚚 🏠">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load shipments"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <PermissionGuard permission="shipments.read">
      <Page
        title="Kirim Paket 🚚 🏠"
        action={
          <PermissionGuard permission="shipments.create">
            <Link to="/send-package/add">
              <Button variant="darkGreen">
                Buat Pengiriman Baru
                <AddSquare className="ml-auto" variant="Bold" size="20" />
              </Button>
            </Link>
          </PermissionGuard>
        }
      >
        <Input
          type="text"
          placeholder="Cari Pengiriman"
          className="mb-4 w-full max-w-sm bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <DataTable
            data={filteredShipments}
            columns={columns}
            title="Pengiriman Sebelumnya"
          />
        )}
      </Page>
    </PermissionGuard>
  );
}
