import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  storagePut: vi.fn().mockResolvedValue({ key: "portfolio-assets/1/project/demo.png", url: "/manus-storage/portfolio-assets/1/project/demo.png" }),
  createPortfolioAsset: vi.fn().mockImplementation(async (asset) => ({ id: 7, ...asset })),
  listPortfolioAssets: vi.fn().mockResolvedValue([]),
  getPublicPortfolioAssets: vi.fn().mockResolvedValue({}),
}));

vi.mock("./storage", () => ({ storagePut: mocks.storagePut }));
vi.mock("./db", () => ({
  createPortfolioAsset: mocks.createPortfolioAsset,
  listPortfolioAssets: mocks.listPortfolioAssets,
  getPublicPortfolioAssets: mocks.getPublicPortfolioAssets,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: {
    id: 1,
    openId: "portfolio-owner",
    name: "Seeya Sameer Kangutkar",
    email: "seeya@example.com",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("portfolioAssets.upload success path", () => {
  it("uploads bytes to storage and persists only metadata", async () => {
    const caller = appRouter.createCaller(context);
    const result = await caller.portfolioAssets.upload({
      category: "project",
      filename: "demo.png",
      mimeType: "image/png",
      contentBase64: Buffer.from("demo-bytes").toString("base64"),
    });

    expect(mocks.storagePut).toHaveBeenCalledWith(
      "portfolio-assets/1/project/demo.png",
      expect.any(Buffer),
      "image/png",
    );
    expect(mocks.createPortfolioAsset).toHaveBeenCalledWith(expect.objectContaining({
      ownerId: 1,
      category: "project",
      storageKey: "portfolio-assets/1/project/demo.png",
      storageUrl: "/manus-storage/portfolio-assets/1/project/demo.png",
      sizeBytes: 10,
    }));
    expect(result?.storageUrl).toContain("/manus-storage/");
  });
});
