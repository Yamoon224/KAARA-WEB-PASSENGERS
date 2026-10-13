"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/cn";

export type Pillar = "bus" | "appartements" | "location-auto" | "aeroexpress";

interface PillarDef {
  key: Pillar;
  label: string;
  icon: string;
  href: string;
}

const PILLARS: PillarDef[] = [
  { key: "bus", label: "Bus", icon: "🚍", href: "/" },
  { key: "appartements", label: "Appartements", icon: "🏢", href: "/?onglet=appartements" },
  { key: "location-auto", label: "Location auto", icon: "🚘", href: "/?onglet=location-auto" },
  { key: "aeroexpress", label: "Aéroexpress", icon: "✈️", href: "/?onglet=aeroexpress" },
];

const TAB_CLASS = "relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-colors";

/**
 * Les 4 piliers de la plateforme, en tabs.
 *
 * Chaque tab est un lien : changer d'onglet change d'URL (`?onglet=...`), ce
 * qui rend la vue partageable et rejouable apres un rechargement - meme
 * logique que `TripSearchForm.searchHref`.
 */
export function PillarTabs({ active }: { active: Pillar }) {
  return (
    <div role="tablist" aria-label="Choisir un service" className="grid grid-cols-4 gap-2 sm:gap-3">
      {PILLARS.map((pillar) => {
        const isActive = pillar.key === active;

        const tabClassName = cn(
          TAB_CLASS,
          isActive
            ? "border-transparent bg-brand-50 dark:bg-transparent"
            : "border-[var(--hairline)] bg-[var(--surface)] hover:border-brand-300 dark:border-transparent dark:bg-transparent",
        );

        return (
          <Link key={pillar.key} href={pillar.href} role="tab" aria-selected={isActive} className={tabClassName}>
            {isActive ? (
              <span className="absolute -right-1.5 -top-1.5 rounded-full bg-fuchsia px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                Actif
              </span>
            ) : null}
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-colors",
                isActive ? "bg-brand-400 shadow-md" : "bg-[var(--surface-muted)]",
              )}
              aria-hidden="true"
            >
              {pillar.icon}
            </span>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-50">{pillar.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
