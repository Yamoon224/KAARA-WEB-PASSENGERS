"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Button, Modal } from "@/shared/components/ui";
import { useAsyncData } from "@/shared/hooks/useAsyncData";
import { config } from "@/shared/lib/config";
import { formatDayCompact, todayIso } from "@/shared/lib/format";
import { tripService } from "@/services";
import { PassengerCounter, searchHref } from "./TripSearchForm";

/**
 * Formulaire de recherche Aeroexpress.
 *
 * Origine et destination sont fixes (Abidjan -> aeroport, un seul sens) :
 * pas de selecteur de ville ni de bouton d'inversion, juste la date et le
 * nombre de passagers. La soumission reutilise `searchHref` de
 * `TripSearchForm` et mene donc a la meme page `/search` que le bus - aucune
 * nouvelle page de resultats n'est necessaire.
 */
export function AirportTransferSearchForm() {
  const router = useRouter();
  const loadCities = useCallback(() => tripService.cityOptions(), []);
  const { data: cities } = useAsyncData(loadCities);

  const [date, setDate] = useState(todayIso(1));
  const [passengers, setPassengers] = useState(1);
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);

  const originName = cities?.find((city) => city.slug === config.airportTransfer.origin)?.name ?? "Abidjan";
  const destinationName =
    cities?.find((city) => city.slug === config.airportTransfer.destination)?.name ?? "Aéroport Félix-Houphouët-Boigny";

  function submit(event: FormEvent) {
    event.preventDefault();

    router.push(
      searchHref({
        origin: config.airportTransfer.origin,
        destination: config.airportTransfer.destination,
        date,
        passengers,
      }),
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Rechercher un Aéroexpress" className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
        <div className="px-4 py-3">
          <span className="block text-xs text-stone-500">D&apos;où</span>
          <span className="mt-0.5 block text-lg font-extrabold text-stone-900">{originName}</span>
        </div>

        <div className="border-t border-stone-200 px-4 py-3">
          <span className="block text-xs text-stone-500">Où</span>
          <span className="mt-0.5 block text-lg font-extrabold text-stone-900">{destinationName}</span>
        </div>

        <div className="grid grid-cols-2 divide-x divide-stone-200 border-t border-stone-200">
          <label className="relative px-4 py-3">
            <span className="block text-xs text-stone-500">Quand</span>
            <span className="mt-0.5 block text-lg font-extrabold capitalize text-stone-900">{formatDayCompact(date)}</span>
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(event) => setDate(event.target.value)}
              required
              aria-label="Date du depart"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          <button type="button" onClick={() => setIsPassengersOpen(true)} className="px-4 py-3 text-left">
            <span className="block text-xs text-stone-500">Qui va</span>
            <span className="mt-0.5 block text-lg font-extrabold text-stone-900">{passengers}</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-full bg-[#0e1a3a] text-base font-bold text-white shadow-sm transition-colors hover:bg-[#16295c] active:translate-y-px"
      >
        Trouver un Aéroexpress
      </button>

      <Modal
        isOpen={isPassengersOpen}
        onClose={() => setIsPassengersOpen(false)}
        title="Voyageurs"
        size="sm"
        footer={<Button onClick={() => setIsPassengersOpen(false)}>Valider</Button>}
      >
        <PassengerCounter value={passengers} onChange={setPassengers} />
      </Modal>
    </form>
  );
}
