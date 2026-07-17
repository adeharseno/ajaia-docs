import { describe, it, expect } from "vitest";
import { canAccessDocument, isOwner } from "@/lib/access";

describe("canAccessDocument", () => {
  const document = { ownerId: "user-owner" };

  it("allows the owner", () => {
    expect(canAccessDocument(document, [], "user-owner")).toBe(true);
  });

  it("allows a user the document was shared with", () => {
    expect(canAccessDocument(document, ["user-shared"], "user-shared")).toBe(true);
  });

  it("denies a user with no ownership or share", () => {
    expect(canAccessDocument(document, ["user-shared"], "user-stranger")).toBe(false);
  });

  it("denies access when the share list is empty and user is not owner", () => {
    expect(canAccessDocument(document, [], "user-stranger")).toBe(false);
  });
});

describe("isOwner", () => {
  it("returns true only for the owner", () => {
    const document = { ownerId: "user-owner" };
    expect(isOwner(document, "user-owner")).toBe(true);
    expect(isOwner(document, "someone-else")).toBe(false);
  });
});
