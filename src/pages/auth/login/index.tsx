import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { TruckFast } from "iconsax-reactjs";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  // 1. Mengatur metadata halaman (seperti Title dan Deskripsi SEO)
  useMeta(META_DATA.login);

  // 2. Mengambil fungsi login dan status loading dari custom hook useAuth
  const { login, isLoggingIn } = useAuth();

  // 3. Konfigurasi form menggunakan React Hook Form dan validasi Zod
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Menghubungkan skema Zod dengan form
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 4. Handler saat form dikirim (submit)
  const onSubmit = (values: LoginFormData) => {
    login(values); // Memanggil fungsi login dari useAuth
  };

  return (
    <>
      <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left side - Login Form */}
        <div className="flex flex-col items-center justify-center max-w-lg mx-auto w-full space-y-6 lg:order-1 p-4 overflow-y-auto">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <TruckFast
                className="text-primary size-8 mr-3"
                variant="Bulk"
                size={32}
              />
              <h1 className="text-3xl font-bold text-dark-green">KirimAja</h1>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Selamat Datang Kembali! 👋
            </h2>
            <p className="text-gray-600 text-base">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form */}
          <div className="w-full p-6 lg:p-8">
            {/* Container utama Form: 
			Menyediakan 'Context' agar semua anak komponen (FormField) 
			bisa mengakses state, validation errors, dan fungsi register dari react-hook-form.
			*/}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)} // 1. Mencegah reload page & menjalankan validasi Zod
                className="space-y-6"
              >
                {/* FormField: Penghubung antara Logic (Zod/Hook Form) dengan UI.
				'name="email"' harus sama dengan yang ada di loginSchema.
				*/}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    /* FormItem: Mengatur spacing/tata letak elemen input secara vertikal */
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-900">
                        Email
                      </FormLabel>

                      {/* FormControl: Tempat 'Slot' input berada. 
						Ia memberikan atribut aksesibilitas otomatis (seperti aria-invalid).
					*/}
                      <FormControl>
                        {/* User mengetik di <Input />. Berkat {...field}, setiap
                        ketikan langsung dicatat oleh react-hook-form. */}
                        <Input
                          {...field} // 2. Menghubungkan onChange, onBlur, dan value secara otomatis
                          type="email"
                          placeholder="Email"
                          className="h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors"
                          disabled={isLoggingIn} // 3. Mencegah input diubah saat proses API sedang jalan
                        />
                      </FormControl>

                      {/* FormMessage: Menampilkan pesan error dari Zod (contoh: "Format email tidak valid") */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Field Password (Alur kerjanya identik dengan Email) */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-900">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Password"
                          className="h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors"
                          disabled={isLoggingIn}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tombol Submit:
				isLoggingIn berasal dari useAuth (useMutation). 
				Jika 'true', tombol otomatis terkunci (disabled) untuk menghindari double-post.
				*/}
                <Button
                  type="submit"
                  variant="darkGreen"
                  className="w-full mt-4"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/auth/register"
                className="text-primary font-medium hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="lg:order-2 w-full h-screen hidden lg:block">
          <div className="lg:hidden w-full max-w-sm mx-auto mb-8 p-4">
            <img
              src="/images/login.png"
              alt="Dashboard Preview"
              className="w-full h-auto object-contain rounded-2xl shadow-lg"
            />
          </div>

          <div className="hidden lg:block w-full h-screen relative overflow-hidden">
            <img
              src="/images/login.png"
              alt="KirimAja Dashboard Interface"
              className="w-full h-full object-cover object-left-top"
            />
          </div>
        </div>
      </div>
    </>
  );
}
