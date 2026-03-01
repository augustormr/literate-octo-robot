// ─── User & Profile ──────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  share_with_family: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Trips ───────────────────────────────────────────────────────────────────

export type TripStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  destination_city: string | null;
  destination_country: string | null;
  country_code: string | null;
  color: string | null;
  status: TripStatus;
  notes: string | null;
  source: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// ─── Flights ─────────────────────────────────────────────────────────────────

export interface Flight {
  id: string;
  trip_id: string;
  flight_number: string;
  airline: string | null;
  operating_airline: string | null;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  actual_departure_time: string | null;
  actual_arrival_time: string | null;
  aircraft_type: string | null;
  duration_minutes: number | null;
  distance_km: number | null;
  gate: string | null;
  terminal: string | null;
  booking_reference: string | null;
  codeshare_partners: string[] | null;
  display_order: number | null;
  source: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
}

// ─── Hotels ──────────────────────────────────────────────────────────────────

export interface Hotel {
  id: string;
  trip_id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  check_in: string;
  check_out: string;
  booking_reference: string | null;
  rating: number | null;
  review_notes: string | null;
  display_order: number | null;
  source: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
}

// ─── Restaurants ─────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  trip_id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  reservation_date: string | null;
  reservation_time: string | null;
  party_size: number | null;
  booking_reference: string | null;
  rating: number | null;
  review_notes: string | null;
  display_order: number | null;
  source: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
}

// ─── Transport ───────────────────────────────────────────────────────────────

export interface Transport {
  id: string;
  trip_id: string;
  name: string;
  pickup_time: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  booking_reference: string | null;
  display_order: number | null;
  source: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
}

// ─── Loyalty Programs ────────────────────────────────────────────────────────

export type ProgramType = 'airline' | 'hotel' | 'other';

export interface LoyaltyProgram {
  id: string;
  program_name: string;
  program_type: ProgramType;
  membership_number: string | null;
  tier_status: string | null;
  notes: string | null;
  user_id: string;
  guest_traveler_id: string | null;
  created_at: string;
}

// ─── Guest Travelers ─────────────────────────────────────────────────────────

export interface GuestTraveler {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_by: string;
  created_at: string;
}

// ─── Visited Countries ──────────────────────────────────────────────────────

export interface VisitedCountry {
  id: string;
  country_code: string;
  country_name: string;
  first_visited: string | null;
  visit_count: number;
  user_id: string;
  created_at: string;
}

// ─── Sharing ─────────────────────────────────────────────────────────────────

export interface SharedTrip {
  id: string;
  trip_id: string;
  token: string;
  created_by: string;
  expires_at: string | null;
  created_at: string;
}

// ─── Family ──────────────────────────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface FamilyInvitation {
  id: string;
  email: string;
  invited_by: string;
  status: InvitationStatus;
  created_at: string;
}

// ─── Roles ───────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'member';

export interface UserRole {
  id: string;
  user_id: string;
  role: Role;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

// ─── Email Connections ───────────────────────────────────────────────────────

export type EmailProvider = 'google' | 'outlook';

export interface EmailConnection {
  id: string;
  user_id: string;
  provider: EmailProvider;
  email: string;
  export_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ─── App Settings ────────────────────────────────────────────────────────────

export interface AppSettings {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

// ─── Composite Types ─────────────────────────────────────────────────────────

export interface TripWithDetails extends Trip {
  flights: Flight[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  transports: Transport[];
}

// ─── View ────────────────────────────────────────────────────────────────────

export type ViewScope = 'my' | 'family';
