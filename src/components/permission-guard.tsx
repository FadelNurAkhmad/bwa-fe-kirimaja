import { type ReactNode } from "react";

interface PermissionGuardProps {
	permission: string;
	children: ReactNode;
}

// For slicing purposes, this component always renders its children regardless of permission
export function PermissionGuard({ children }: PermissionGuardProps) {
	// In a real implementation, this would check if the user has the specified permission
	// For now, we'll just render the children
	return <>{children}</>;
}
