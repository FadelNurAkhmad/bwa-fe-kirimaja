import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes : data dianggap fresh, selama 5 menit data tidak akan refetch
      gcTime: 10 * 60 * 1000, // 10 minutes : cache dibuang jika tidak dipakai
      retry: 1, // retry 1x jika request gagal
    },
    mutations: {
      retry: 1, // retry 1x untuk mutation (POST/PUT/DELETE)
    },
  },
});

// Membuat root React dan menempel ke elemen <div id="root">
createRoot(document.getElementById("root")!).render(
  // Provider utama React Query agar seluruh app bisa pakai useQuery/useMutation
  <QueryClientProvider client={queryClient}>
    {/* Provider routing agar routing bekerja */}
    <BrowserRouter>
      {/* Root component aplikasi */}
      <App />
      {/* Global toaster untuk notifikasi */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </BrowserRouter>
    {/* Devtools React Query (biasanya hanya untuk development) */}
    <ReactQueryDevtools />
  </QueryClientProvider>,
);
