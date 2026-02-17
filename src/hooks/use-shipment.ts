import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "@/lib/api/services/shipment";
import type { CreateShipmentRequest } from "@/lib/api/types/shipment";
import { toast } from "react-hot-toast"; // Atau library toast yang Anda gunakan

// Query keys
export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  list: (filters: string) => [...shipmentKeys.lists(), { filters }] as const,
  details: () => [...shipmentKeys.all, "detail"] as const,
  detail: (id: number) => [...shipmentKeys.details(), id] as const,
};

// Get all shipments
export const useShipments = () => {
  return useQuery({
    queryKey: shipmentKeys.lists(),
    queryFn: shipmentService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get shipment by ID
export const useShipment = (id: number) => {
  return useQuery({
    queryKey: shipmentKeys.detail(id),
    queryFn: () => shipmentService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create shipment
export const useCreateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShipmentRequest) => shipmentService.create(data),
    onSuccess: () => {
      toast.success("Pengiriman berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDownloadPdf = () => {
  return useMutation({
    mutationFn: (id: number) => shipmentService.downloadPdf(id),
    onSuccess: (blob) => {
      // Membuat URL sementara dari data Blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `shipment-${Date.now()}.pdf`;

      // Menambahkan elemen ke DOM secara sementara untuk memicu klik
      document.body.appendChild(link);
      link.click();

      // Bersihkan elemen dan URL setelah digunakan
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useTrackShipment = () => {
  return useMutation({
    mutationFn: (trackingNumber: string) =>
      shipmentService.trackByNumber(trackingNumber),
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
