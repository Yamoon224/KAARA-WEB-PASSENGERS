import { BottomNav } from "@/components/layout/BottomNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { InfoModalProvider } from "@/features/info-modal/InfoModalProvider";

/**
 * Coquille du site voyageur : en-tete court, contenu, pied de page.
 *
 * La navigation basse (mobile uniquement) flotte par-dessus le bas de page :
 * le padding du pied de page lui reserve la place pour qu'aucun lien ne se
 * retrouve cache derriere elle.
 *
 * `max-w-md mx-auto` : sur grand ecran, tout l'espace voyageur (en-tete,
 * sections pleine largeur comprises) reste a une largeur de telephone plutot
 * que de s'etirer - le fond de page (`--canvas`) comble les cotes. Les
 * sections qui posent leur propre couleur de fond (hero, bandeaux) heritent
 * donc de cette largeur sans rien y faire : elles sont deja a l'interieur.
 * `relative` : sert d'ancrage aux elements `absolute` du header (popover du
 * menu burger) pour qu'ils restent dans cette colonne plutot que de se
 * positionner par rapport a la fenetre entiere (effet de `fixed`).
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <InfoModalProvider>
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col shadow-[0_0_40px_-12px_rgb(0_0_0_/_0.25)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <BottomNav />
      </div>
    </InfoModalProvider>
  );
}
