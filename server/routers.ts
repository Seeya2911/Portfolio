import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPortfolioAsset, getPublicPortfolioAssets, listPortfolioAssets } from "./db";
import { storagePut } from "./storage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  portfolioAssets: router({
    publicMap: publicProcedure.query(() => getPublicPortfolioAssets()),
    list: protectedProcedure.query(({ ctx }) => listPortfolioAssets(ctx.user.id)),
    upload: protectedProcedure
      .input(z.object({
        category: z.enum(["profile", "resume", "certificate", "project", "other"]),
        filename: z.string().min(1).max(180),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
        contentBase64: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const content = Buffer.from(input.contentBase64, "base64");
        if (content.byteLength > 8 * 1024 * 1024) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Files must be 8 MB or smaller." });
        }
        const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
        const stored = await storagePut(
          `portfolio-assets/${ctx.user.id}/${input.category}/${safeFilename}`,
          content,
          input.mimeType,
        );
        return createPortfolioAsset({
          ownerId: ctx.user.id,
          category: input.category,
          filename: input.filename,
          storageKey: stored.key,
          storageUrl: stored.url,
          mimeType: input.mimeType,
          sizeBytes: content.byteLength,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
