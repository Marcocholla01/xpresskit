// // src/middlewares/authorize.ts
// import { Roles, roleHierarchy } from '@/config/roles';

// export const authorize =
//   (...allowedRoles: Roles[]) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     const userRole = req.user?.role;

//     if (!userRole) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const inheritedRoles = roleHierarchy[userRole] ?? [];
//     const effectiveRoles = [userRole, ...inheritedRoles];

//     const hasAccess = allowedRoles.some(role => effectiveRoles.includes(role));

//     if (!hasAccess) {
//       return res.status(403).json({ message: 'Forbidden: Insufficient role' });
//     }

//     next();
//   };

// middlewares/authorized.ts

import type { Roles } from '@/config/roles';

import type { RequestHandler } from 'express';

export const isAuthorized = (...roles: Roles[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role as Roles)) {
      res.status(401).json({
        message: `Operation not permitted for role: ${req.auth?.role || 'unknown'}. Access denied`,
      });
      return; // ✅ explicitly return void here
    }

    next(); // still return void here
  };
};
