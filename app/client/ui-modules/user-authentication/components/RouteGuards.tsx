import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { Role } from "/app/shared/user-role-identifier";

// Agent-only routes
export const AgentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[Role.AGENT]}>{children}</ProtectedRoute>
);

// Tenant-only routes
export const TenantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[Role.TENANT]}>{children}</ProtectedRoute>
);

// Landlord-only routes
export const LandlordRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[Role.LANDLORD]}>{children}</ProtectedRoute>
);

// Routes accessible by all authenticated users
export const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[Role.AGENT, Role.TENANT, Role.LANDLORD]}>{children}</ProtectedRoute>
); 