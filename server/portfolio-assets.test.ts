import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  const now = new Date();
  return {
    user: {
      id: 1,
      openId: "portfolio-owner",
      name: "Seeya Sameer Kangutkar",
      email: "seeya@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("portfolioAssets.upload", () => {
  it("rejects unsupported MIME types before storage upload", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.portfolioAssets.upload({
        category: "project",
        filename: "notes.txt",
        mimeType: "text/plain" as never,
        contentBase64: "dGVzdA==",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects files larger than 8 MB", async () => {
    const caller = appRouter.createCaller(createContext());
    const oversized = Buffer.alloc(8 * 1024 * 1024 + 1).toString("base64");

    await expect(
      caller.portfolioAssets.upload({
        category: "project",
        filename: "large.png",
        mimeType: "image/png",
        contentBase64: oversized,
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});


describe("portfolioAssets access control", () => {
  it("rejects unauthenticated asset listing", async () => {
    const context = createContext();
    const caller = appRouter.createCaller({ ...context, user: undefined });
    await expect(caller.portfolioAssets.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
