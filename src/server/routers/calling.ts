import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { prisma } from 'server/prisma';
import { createCallingSchema, editCallingSchema } from 'utils/auth';


import { z } from 'zod';

export const callingRouter = createTRPCRouter({
  //Listar a los usuarios con su sucursal adjunta
  findManyCalling: publicProcedure.query(async () => {
    const callings = await prisma.calling.findMany();
    return callings;
  }),
  createCalling: publicProcedure.input(createCallingSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      
      await ctx.prisma.calling.create({          
        data: {                
            requirement:input.requirement,
            min_exp_work:input.min_exp_work,    
            userId:ctx.session?.user?.id,
            resultAt:input.resultAt,
            expiresAt:input.expiresAt            
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  updateCalling: protectedProcedure
  .input(editCallingSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.calling.update({
        where: { id: input.id },
        data: {                
            requirement:input.requirement,
            min_exp_work:input.min_exp_work,    
            userId:ctx.session?.user?.id,
            resultAt:input.resultAt,
            expiresAt:input.expiresAt      
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

});