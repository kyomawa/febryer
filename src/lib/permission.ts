import { Role } from "@prisma/client";

// ======================================== USERS ==========================================

export function canManageUsers(role: Role, targetUserRole: Role, userId: string, connectedUserId: string): boolean {
  if (role === "OWNER") return true;
  if (role === "ADMIN" && (!targetUserRole || targetUserRole === "USER" || userId === connectedUserId)) return true;
  if (role === "USER" && userId === connectedUserId) return true;
  return false;
}

export function canAddUser(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

export function canEditUser(role: Role, targetUserRole?: Role): boolean {
  if (role === "OWNER") return true;
  if (role === "ADMIN" && (!targetUserRole || targetUserRole === "USER")) return true;
  return false;
}

export function canDeleteUser(role: Role, targetUserRole?: Role): boolean {
  if (role === "OWNER") return true;
  if (role === "ADMIN" && (!targetUserRole || targetUserRole === "USER")) return true;
  return false;
}

// ======================================== PRODUCTS ==========================================

export function canManageProducts(role: Role, productCreatedById: string, userId?: string): boolean {
  if (role === "OWNER" || role === "ADMIN") return true;
  if (role === "USER" && productCreatedById === userId) return true;
  return false;
}

export function canAddProduct(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "USER";
}

export function canEditProduct(role: Role, productCreatedById: string, userId: string): boolean {
  if (role === "OWNER") return true;
  if (role === "ADMIN") return true;
  if (role === "USER" && productCreatedById === userId) return true;
  return false;
}

export function canDeleteProduct(role: Role, productCreatedById: string, userId: string): boolean {
  if (role === "OWNER") return true;
  if (role === "ADMIN") return true;
  if (role === "USER" && productCreatedById === userId) return true;
  return false;
}

// ======================================== JOBS ==========================================

export function canManageJobs(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

export function canAddJob(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

export function canEditJob(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

export function canDeleteJob(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

// ======================================== CATEGORIES ==========================================

export function canManageCategories(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "USER";
}

export function canAddCategory(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "USER";
}

export function canEditCategory(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "USER";
}

export function canDeleteCategory(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}
