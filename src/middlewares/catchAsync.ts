// src/middlewares/catchAsync.ts
export const catchAsync =
  (handler: (req: any, res: any, next: any) => Promise<any>) => (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
