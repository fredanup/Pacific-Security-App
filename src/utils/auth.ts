import * as z from 'zod';

//Consulta utilizada para mostrar a los usuarios con sus sucursales
export const userBranchSchema = z.object({
    id:z.string(),
    name: z.string().nullable(),
    lastName: z.string().nullable(), 
    image: z.string().nullable(),
    email:z.string(),
    role: z.string().nullable(), 
    branchId:z.string().nullable(), 
    Branch: z.object({
      address:z.string().nullable()
    }).nullable()
  });

  export const editUserBranchSchema = z.object({
    id:z.string(),
    name: z.string().nullable(),
    lastName: z.string().nullable(),     
    role: z.string().nullable(), 
    branchId:z.string().nullable()
  });

  export const branchSchema = z.object({
    id:z.string(),
    name: z.string(),
    address: z.string().nullable(),     

  });

  export const documentSchema = z.object({
    document: z.string(),
    key: z.string(),
  });

  export type IUserBranch = z.infer<typeof userBranchSchema>;
  export type IEditUserBranch = z.infer<typeof editUserBranchSchema>;
  export type IBranch = z.infer<typeof branchSchema>;