import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { DataTable } from "./components/datatable";
import { columns } from "./components/datatable/columns";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { type Shipment } from "@/lib/api/types/shipment";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { PermissionGuard } from "@/components";
import { useHistory } from "@/hooks/use-history";

export default function HistoryPage() {
  // Use custom meta hook
  // Use custom meta hook
  useMeta(META_DATA.history);

  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mengambil data dari hook useHistory
  const { data: shipments = [], error } = useHistory();

  // Effect untuk logika pencarian/filter
  useEffect(() => {
    const filtered = shipments.filter(
      (shipment) =>
        shipment.tracking_number
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shipment.shipment_details?.[0]?.recipient_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shipment.delivery_status
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    setFilteredShipments(filtered);
  }, [searchQuery, shipments]);

  // Handler untuk input pencarian
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Effect untuk menangani error
  useEffect(() => {
    if (error) {
      toast.error("Gagal memuat riwayat pengiriman");
    }
  }, [error]);

  return (
    <>
      <PermissionGuard permission="history.read">
        <Page title="Riwayat Pengiriman 📜⏰">
          <Input
            type="text"
            placeholder="Cari Pengiriman"
            className="mb-4 w-full max-w-sm bg-white"
            value={searchQuery}
            onChange={handleSearch}
          />
          <DataTable
            data={filteredShipments}
            columns={columns}
            title="Paket yang Sudah Dikirim"
          />
          <Toaster position="top-right" />
        </Page>
      </PermissionGuard>
    </>
  );
}
