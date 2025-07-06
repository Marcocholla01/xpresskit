// src/config/roles.ts
export enum Roles {
  CUSTOMER = 'CUSTOMER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// Optional: role hierarchy (for inheritance if needed)
export const roleHierarchy = {
  [Roles.SUPER_ADMIN]: [Roles.ADMIN, Roles.MODERATOR, Roles.CUSTOMER],
  [Roles.ADMIN]: [Roles.MODERATOR, Roles.CUSTOMER],
  [Roles.MODERATOR]: [Roles.CUSTOMER],
  [Roles.CUSTOMER]: [],
};
