import type { Trip, Flight, Hotel, LoyaltyProgram, VisitedCountry } from '@/types'

// ─── Demo Mode State ────────────────────────────────────────────────────────

let _demoMode = false

export function isDemoMode() {
  return _demoMode
}

export function enableDemoMode() {
  _demoMode = true
}

export function disableDemoMode() {
  _demoMode = false
}

// ─── Demo User ──────────────────────────────────────────────────────────────

export const DEMO_USER_ID = 'demo-user-00000000-0000-0000-0000-000000000000'

export const DEMO_USER = {
  id: DEMO_USER_ID,
  email: 'demo@travelhub.app',
  user_metadata: { full_name: 'Demo Traveler' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2025-01-01T00:00:00Z',
} as const

export const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  full_name: 'Demo Traveler',
  avatar_url: null,
  share_with_family: false,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
}

// ─── Demo Trips ─────────────────────────────────────────────────────────────

export const DEMO_TRIPS: Trip[] = [
  {
    id: 'demo-trip-1',
    name: 'Tokyo Adventure',
    start_date: '2026-03-15',
    end_date: '2026-03-25',
    destination_city: 'Tokyo',
    destination_country: 'Japan',
    country_code: 'JP',
    color: '#EF4444',
    status: 'upcoming',
    notes: 'Cherry blossom season trip!',
    source: 'manual',
    user_id: DEMO_USER_ID,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'demo-trip-2',
    name: 'Lisbon Weekend',
    start_date: '2026-02-20',
    end_date: '2026-03-03',
    destination_city: 'Lisbon',
    destination_country: 'Portugal',
    country_code: 'PT',
    color: '#10B981',
    status: 'ongoing',
    notes: 'Exploring the historic neighborhoods',
    source: 'manual',
    user_id: DEMO_USER_ID,
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
  {
    id: 'demo-trip-3',
    name: 'Paris Getaway',
    start_date: '2025-12-20',
    end_date: '2025-12-28',
    destination_city: 'Paris',
    destination_country: 'France',
    country_code: 'FR',
    color: '#3B82F6',
    status: 'completed',
    notes: 'Holiday trip to Paris',
    source: 'manual',
    user_id: DEMO_USER_ID,
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-01T10:00:00Z',
  },
  {
    id: 'demo-trip-4',
    name: 'NYC Business Trip',
    start_date: '2025-10-05',
    end_date: '2025-10-10',
    destination_city: 'New York',
    destination_country: 'United States',
    country_code: 'US',
    color: '#F59E0B',
    status: 'completed',
    notes: null,
    source: 'manual',
    user_id: DEMO_USER_ID,
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-15T10:00:00Z',
  },
]

// ─── Demo Flights ───────────────────────────────────────────────────────────

export const DEMO_FLIGHTS: Flight[] = [
  {
    id: 'demo-flight-1',
    trip_id: 'demo-trip-1',
    flight_number: 'NH206',
    airline: 'ANA',
    operating_airline: null,
    departure_airport: 'LIS',
    arrival_airport: 'NRT',
    departure_time: '2026-03-15T10:30:00Z',
    arrival_time: '2026-03-16T06:45:00Z',
    actual_departure_time: null,
    actual_arrival_time: null,
    aircraft_type: 'Boeing 787-9',
    duration_minutes: 795,
    distance_km: 11100,
    gate: null,
    terminal: '1',
    booking_reference: 'ABC123',
    codeshare_partners: null,
    display_order: 1,
    source: 'manual',
    notes: null,
    user_id: DEMO_USER_ID,
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'demo-flight-2',
    trip_id: 'demo-trip-3',
    flight_number: 'TP442',
    airline: 'TAP Portugal',
    operating_airline: null,
    departure_airport: 'LIS',
    arrival_airport: 'CDG',
    departure_time: '2025-12-20T08:00:00Z',
    arrival_time: '2025-12-20T11:30:00Z',
    actual_departure_time: null,
    actual_arrival_time: null,
    aircraft_type: 'Airbus A320neo',
    duration_minutes: 150,
    distance_km: 1735,
    gate: 'B22',
    terminal: '1',
    booking_reference: 'XYZ789',
    codeshare_partners: null,
    display_order: 1,
    source: 'manual',
    notes: null,
    user_id: DEMO_USER_ID,
    created_at: '2025-11-01T10:00:00Z',
  },
]

// ─── Demo Hotels ────────────────────────────────────────────────────────────

export const DEMO_HOTELS: Hotel[] = [
  {
    id: 'demo-hotel-1',
    trip_id: 'demo-trip-1',
    name: 'Park Hyatt Tokyo',
    address: '3-7-1-2 Nishi Shinjuku',
    city: 'Tokyo',
    country: 'Japan',
    check_in: '2026-03-16',
    check_out: '2026-03-25',
    booking_reference: 'HYT-9876',
    rating: 5,
    review_notes: null,
    display_order: 1,
    source: 'manual',
    notes: 'Lost in Translation vibes',
    user_id: DEMO_USER_ID,
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'demo-hotel-2',
    trip_id: 'demo-trip-3',
    name: 'Hotel Le Marais',
    address: '12 Rue de Rivoli',
    city: 'Paris',
    country: 'France',
    check_in: '2025-12-20',
    check_out: '2025-12-28',
    booking_reference: 'PAR-5432',
    rating: 4,
    review_notes: 'Great location near the Louvre',
    display_order: 1,
    source: 'manual',
    notes: null,
    user_id: DEMO_USER_ID,
    created_at: '2025-11-01T10:00:00Z',
  },
]

// ─── Demo Loyalty Programs ──────────────────────────────────────────────────

export const DEMO_LOYALTY: LoyaltyProgram[] = [
  {
    id: 'demo-loyalty-1',
    program_name: 'TAP Miles&Go',
    program_type: 'airline',
    membership_number: '1234567890',
    tier_status: 'Gold',
    notes: null,
    user_id: DEMO_USER_ID,
    guest_traveler_id: null,
    created_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'demo-loyalty-2',
    program_name: 'World of Hyatt',
    program_type: 'hotel',
    membership_number: '9876543210',
    tier_status: 'Globalist',
    notes: null,
    user_id: DEMO_USER_ID,
    guest_traveler_id: null,
    created_at: '2025-01-01T10:00:00Z',
  },
]

// ─── Demo Visited Countries ─────────────────────────────────────────────────

export const DEMO_VISITED_COUNTRIES: VisitedCountry[] = [
  { id: 'demo-vc-1', country_code: 'PT', country_name: 'Portugal', first_visited: '2020-06-15', visit_count: 12, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
  { id: 'demo-vc-2', country_code: 'FR', country_name: 'France', first_visited: '2021-08-10', visit_count: 5, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
  { id: 'demo-vc-3', country_code: 'US', country_name: 'United States', first_visited: '2022-03-01', visit_count: 3, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
  { id: 'demo-vc-4', country_code: 'ES', country_name: 'Spain', first_visited: '2021-05-20', visit_count: 8, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
  { id: 'demo-vc-5', country_code: 'IT', country_name: 'Italy', first_visited: '2022-09-12', visit_count: 2, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
  { id: 'demo-vc-6', country_code: 'GB', country_name: 'United Kingdom', first_visited: '2023-04-01', visit_count: 4, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
  { id: 'demo-vc-7', country_code: 'JP', country_name: 'Japan', first_visited: '2024-11-10', visit_count: 1, user_id: DEMO_USER_ID, created_at: '2025-01-01T10:00:00Z' },
]
