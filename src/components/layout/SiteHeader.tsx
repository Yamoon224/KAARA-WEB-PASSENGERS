"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/shared/components/brand/Logo";
import { Avatar, LinkButton } from "@/shared/components/ui";
import { IconHeart, IconMenu, IconUser } from "@/shared/components/ui/icons";
import { useAuth } from "@/shared/features/auth/AuthContext";
import { useInfoModal } from "@/features/info-modal/InfoModalProvider";
import { cn } from "@/shared/lib/cn";
import { SERVICE_LINKS } from "./menuLinks";

/** "Actif" en cyan pour ce qui est vraiment reservable en ligne, "Bientôt" en gris pour le reste. */
function MenuBadge({ badge }: { badge?: string }) {
  if (!badge) return null;
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
        badge === "Actif" ? "bg-brand-400 text-white" : "bg-white/12 text-white/60",
      )}
    >
      {badge}
    </span>
  );
}

/** Liste des services : seul contenu du menu burger, un petit popover et non plus un tiroir plein ecran. */
function ServiceList({ onNavigate }: { onNavigate: () => void }) {
  const { openInfo } = useInfoModal();

  return (
    <ul className="flex flex-col gap-0.5">
      {SERVICE_LINKS.map((item) =>
        item.kind === "link" ? (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
            >
              {item.label}
              <MenuBadge badge={item.badge} />
            </Link>
          </li>
        ) : (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => openInfo(item.title, item.text)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10"
            >
              {item.label}
              <MenuBadge badge={item.badge} />
            </button>
          </li>
        ),
      )}
    </ul>
  );
}

/**
 * En-tete du site voyageur : logo, connexion, menu. Rien d'autre.
 *
 * Chaque lien de plus dans cette barre est un lien de moins de large pour le
 * titre en dessous, sur un telephone tenu d'une main. Le bouton burger
 * n'ouvre plus qu'un petit popover listant les services (Bus/Car,
 * Appartements...) ; tout le reste (theme, compte) vit ailleurs dans le site.
 */
export function SiteHeader() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="no-print sticky top-0 z-30 border-b border-[var(--hairline)] bg-[var(--surface)]">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="rounded-sm" aria-label="Kaara, accueil">
            <Logo tone="brand" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/favorites"
              aria-label="Mes favoris"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-stone-500 ring-1 md:inline-flex ring-inset ring-stone-200 hover:bg-stone-100 dark:text-stone-300 dark:ring-stone-700 dark:hover:bg-stone-800"
            >
              <IconHeart className="h-4 w-4" />
            </Link>

            {user ? (
              <>
                <LinkButton
                  href="/my-tickets"
                  variant="outline"
                  size="sm"
                  icon={<IconUser className="h-3.5 w-3.5" />}
                  className="hidden sm:inline-flex"
                >
                  Mon espace
                </LinkButton>
                <Link
                  href="/my-tickets"
                  aria-label="Mon espace"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full sm:hidden"
                >
                  <Avatar name={user.name} size="sm" />
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full bg-brand-400 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-500 active:translate-y-px sm:px-4"
              >
                Se connecter
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Ouvrir le menu"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <span aria-hidden="true" className="grad-brand block h-1 w-full" />
      </header>

      {/* Petit popover des services, ancre sous le bouton burger : plus un
          tiroir plein ecran, juste la liste "Nos services". Le reste
          (connexion, favoris) reste accessible directement dans l'en-tete.
          `absolute` (pas `fixed`) : se positionne par rapport a la colonne
          mobile de PublicLayout (`relative`), pas par rapport a la fenetre -
          sur grand ecran, le popover reste colle au bouton burger plutot que
          de se plaquer au bord reel du navigateur. */}
      {isMenuOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={closeMenu}
          className="absolute inset-0 z-40 cursor-default"
        />
      ) : null}

      <aside
        aria-label="Menu"
        className={cn(
          "absolute right-4 top-[68px] z-40 w-56 origin-top-right rounded-2xl bg-[#0e1a3a] p-2 shadow-card",
          "transition-all duration-150 ease-out",
          isMenuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <ServiceList onNavigate={closeMenu} />
      </aside>
    </>
  );
}
