import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { TruckFast } from "iconsax-reactjs";
import { useMeta, META_DATA } from "@/hooks/use-meta";

export default function RegisterPage() {
	// Use custom meta hook
	useMeta(META_DATA.register);

	return (
		<>
			<div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
				{/* Left side - Register Form */}
				<div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
					{/* Logo */}
					<div className="text-center">
						<div className="flex items-center justify-center mb-6">
							<TruckFast
								className="text-primary size-8 mr-3"
								variant="Bulk"
								size={32}
							/>
							<h1 className="text-3xl font-bold text-dark-green">
								KirimAja
							</h1>
						</div>
					</div>

					{/* Welcome Text */}
					<div className="text-center space-y-2">
						<h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
							Bergabung dengan kami! 🚀
						</h2>
						<p className="text-gray-600 text-base">
							Buat akun baru untuk memulai pengiriman
						</p>
					</div>

					{/* Register Form */}
					<div className="w-full p-6 lg:p-8">
						<form className="space-y-6">
							<div className="space-y-2">
								<Label
									htmlFor="name"
									className="text-base font-medium text-gray-900"
								>
									Nama Lengkap
								</Label>
								<Input
									id="name"
									type="text"
									placeholder="Nama Lengkap"
									className="h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-base font-medium text-gray-900"
								>
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="Email"
									className="h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-base font-medium text-gray-900"
								>
									Password
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="Password"
									className="h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="confirmPassword"
									className="text-base font-medium text-gray-900"
								>
									Konfirmasi Password
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Konfirmasi Password"
									className="h-12 px-4 text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-lg transition-colors"
								/>
							</div>
							<Button
								className="w-full mt-4"
								type="button"
								variant="darkGreen"
								disabled={false}
							>
								Daftar
							</Button>
						</form>
						<p className="mt-4 text-center text-sm text-gray-600">
							Sudah punya akun?{" "}
							<Link
								to="/auth/login"
								className="text-primary font-medium hover:underline"
							>
								Masuk di sini
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
