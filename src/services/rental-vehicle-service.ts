import { apiFetch } from "@/shared/lib/api-client";
import type { ReadOptions } from "@/shared/lib/api-client";
import type { Paginated, RentalVehicle, RentalVehicleCategory } from "@/shared/types/api";

export interface RentalVehicleSearchParams {
  city_id?: string;
  category?: RentalVehicleCategory | "";
  seats?: number;
  min_price?: number;
  max_price?: number;
  with_driver_available?: boolean;
  is_featured?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

/** Recherche publique : uniquement les fiches actives, parcourable sans compte. */
export function search(params: RentalVehicleSearchParams = {}, read: ReadOptions = {}): Promise<Paginated<RentalVehicle>> {
  return apiFetch<Paginated<RentalVehicle>>("/rental-vehicles/search", { query: { ...params }, ...read });
}
