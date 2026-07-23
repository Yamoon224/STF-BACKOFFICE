import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, roleLabel, statusLabel } from "./format";

describe("formatDate", () => {
  it("formats an ISO date as DD/MM/YYYY", () => {
    expect(formatDate("2026-07-14T09:12:00.000000Z")).toBe("14/07/2026");
  });

  it("returns an em dash for null", () => {
    expect(formatDate(null)).toBe("-");
  });
});

describe("formatDateTime", () => {
  it("returns an em dash for null", () => {
    expect(formatDateTime(null)).toBe("-");
  });

  it("includes both date and time", () => {
    const result = formatDateTime("2026-07-14T09:12:00.000000Z");
    expect(result).toMatch(/14\/07\/2026/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});

describe("statusLabel", () => {
  it("translates every known backend status to French", () => {
    expect(statusLabel("pending")).toBe("En attente");
    expect(statusLabel("active")).toBe("Active");
    expect(statusLabel("suspended")).toBe("Suspendue");
    expect(statusLabel("actif")).toBe("Actif");
    expect(statusLabel("a_venir")).toBe("À venir");
    expect(statusLabel("resolu")).toBe("Résolu");
    expect(statusLabel("publie")).toBe("Publié");
    expect(statusLabel("mentorat")).toBe("Mentorat");
  });

  it("falls back to the raw value for an unknown status", () => {
    expect(statusLabel("un_statut_inconnu")).toBe("un_statut_inconnu");
  });
});

describe("roleLabel", () => {
  it("translates every seeded role to its French display name", () => {
    expect(roleLabel("admin")).toBe("Administratrice STF");
    expect(roleLabel("staff")).toBe("Collaboratrice STF");
    expect(roleLabel("mentor")).toBe("Mentore");
    expect(roleLabel("mentee")).toBe("Mentée");
    expect(roleLabel("donor")).toBe("Bailleur / partenaire");
  });

  it("falls back to the raw value for an unknown role", () => {
    expect(roleLabel("inconnu")).toBe("inconnu");
  });
});
