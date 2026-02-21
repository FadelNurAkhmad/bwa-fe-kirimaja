import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { DataTable } from "./components/datatable";
import { courierColumns } from "./components/datatable/courier-columns";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useCourierShipments } from "@/hooks/use-delivery";
import { Button, PermissionGuard } from "@/components";

export default function DeliveryPage() {
  // Use custom meta hook
  useMeta(META_DATA.delivery);

  const [searchTerm, setSearchTerm] = useState("");

  // Mengambil data menggunakan hook TanStack Query
  const { data: shipments = [], error, refetch } = useCourierShipments();
  // data: shipments = []:
  // Mengambil properti data (hasil respon dari API) dan mengganti namanya menjadi shipments agar lebih deskriptif di dalam kode.
  // = [] adalah default value. Jika data belum tersedia (misal saat sedang loading atau jika API mengembalikan null), variabel shipments akan berisi array kosong sehingga fungsi .filter() atau .map() di bawahnya tidak akan menyebabkan error crash.

  // error:
  // Berisi objek kesalahan jika permintaan API gagal. Jika tidak ada error, nilainya adalah null. Variabel ini digunakan untuk menampilkan pesan error di UI.

  // refetch:
  // Sebuah fungsi yang bisa kamu panggil secara manual (misal lewat tombol "Refresh") untuk memaksa aplikasi mengambil data terbaru dari server tanpa harus memuat ulang halaman.

  // Filter shipments based on search term
  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.tracking_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.shipment_details?.[0]?.package_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.shipment_details?.[0]?.destination_address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.shipment_details?.[0]?.recipient_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleRefresh = () => {
    refetch();
    toast.success("Pengiriman berhasil diperbarui");
  };

  // State tampilan jika terjadi error
  if (error) {
    return (
      <Page title="Daftar Pengiriman 🚚📦">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-red-500 mb-4">Error: {error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </Page>
    );
  }
  return (
    <>
      <PermissionGuard permission="delivery.read">
        <Page title="Daftar Pengiriman 🚚📦">
          <div className="mb-4 flex gap-4 items-center">
            <Input
              type="text"
              placeholder="Cari berdasarkan nomor resi, produk, atau alamat"
              className="w-full max-w-md bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DataTable
            data={filteredShipments}
            columns={courierColumns(handleRefresh)}
            title="Semua Pengiriman"
          />
        </Page>
      </PermissionGuard>
    </>
  );
}
