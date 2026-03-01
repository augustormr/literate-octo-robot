import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useViewScope } from '@/contexts/ViewScopeContext'
import type { Trip, TripWithDetails, Flight, Hotel, Restaurant, Transport } from '@/types'
import { toast } from 'sonner'
import {
  isDemoMode,
  DEMO_TRIPS,
  DEMO_FLIGHTS,
  DEMO_HOTELS,
  DEMO_LOYALTY,
  DEMO_VISITED_COUNTRIES,
  DEMO_USER_ID,
} from '@/lib/demo'

export function useTrips() {
  const { user } = useAuth()
  const { scope } = useViewScope()

  return useQuery({
    queryKey: ['trips', user?.id, scope],
    queryFn: async () => {
      if (isDemoMode()) {
        return [...DEMO_TRIPS]
      }

      let query = supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: false })

      if (scope === 'my' && user) {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Trip[]
    },
    enabled: !!user,
  })
}

export function useTripDetail(tripId: string | undefined) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (!tripId) throw new Error('No trip ID')

      if (isDemoMode()) {
        const trip = DEMO_TRIPS.find((t) => t.id === tripId)
        if (!trip) throw new Error('Trip not found')
        return {
          ...trip,
          flights: DEMO_FLIGHTS.filter((f) => f.trip_id === tripId),
          hotels: DEMO_HOTELS.filter((h) => h.trip_id === tripId),
          restaurants: [] as Restaurant[],
          transports: [] as Transport[],
        } as TripWithDetails
      }

      const [tripRes, flightsRes, hotelsRes, restaurantsRes, transportsRes] =
        await Promise.all([
          supabase.from('trips').select('*').eq('id', tripId).single(),
          supabase.from('flights').select('*').eq('trip_id', tripId).order('departure_time'),
          supabase.from('hotels').select('*').eq('trip_id', tripId).order('check_in'),
          supabase.from('restaurants').select('*').eq('trip_id', tripId).order('reservation_date'),
          supabase.from('transports').select('*').eq('trip_id', tripId).order('pickup_time'),
        ])

      if (tripRes.error) throw tripRes.error

      return {
        ...tripRes.data,
        flights: (flightsRes.data ?? []) as Flight[],
        hotels: (hotelsRes.data ?? []) as Hotel[],
        restaurants: (restaurantsRes.data ?? []) as Restaurant[],
        transports: (transportsRes.data ?? []) as Transport[],
      } as TripWithDetails
    },
    enabled: !!tripId && !!user,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (trip: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (isDemoMode()) {
        const now = new Date().toISOString()
        const newTrip: Trip = {
          ...trip,
          id: `demo-trip-${Date.now()}`,
          user_id: DEMO_USER_ID,
          created_at: now,
          updated_at: now,
        }
        DEMO_TRIPS.unshift(newTrip)
        return newTrip
      }

      const { data, error } = await supabase
        .from('trips')
        .insert({ ...trip, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as Trip
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create trip: ${error.message}`)
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Trip> & { id: string }) => {
      if (isDemoMode()) {
        const idx = DEMO_TRIPS.findIndex((t) => t.id === id)
        if (idx === -1) throw new Error('Trip not found')
        DEMO_TRIPS[idx] = { ...DEMO_TRIPS[idx], ...updates, updated_at: new Date().toISOString() }
        return DEMO_TRIPS[idx]
      }

      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Trip
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip', data.id] })
      toast.success('Trip updated')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update trip: ${error.message}`)
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemoMode()) {
        const idx = DEMO_TRIPS.findIndex((t) => t.id === id)
        if (idx !== -1) DEMO_TRIPS.splice(idx, 1)
        return
      }

      const { error } = await supabase.from('trips').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip deleted')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete trip: ${error.message}`)
    },
  })
}

export function useCreateFlight() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (flight: Omit<Flight, 'id' | 'user_id' | 'created_at'>) => {
      if (isDemoMode()) {
        const newFlight: Flight = {
          ...flight,
          id: `demo-flight-${Date.now()}`,
          user_id: DEMO_USER_ID,
          created_at: new Date().toISOString(),
        }
        DEMO_FLIGHTS.push(newFlight)
        return newFlight
      }

      const { data, error } = await supabase
        .from('flights')
        .insert({ ...flight, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as Flight
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip', data.trip_id] })
      toast.success('Flight added')
    },
    onError: (error: Error) => {
      toast.error(`Failed to add flight: ${error.message}`)
    },
  })
}

export function useCreateHotel() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (hotel: Omit<Hotel, 'id' | 'user_id' | 'created_at'>) => {
      if (isDemoMode()) {
        const newHotel: Hotel = {
          ...hotel,
          id: `demo-hotel-${Date.now()}`,
          user_id: DEMO_USER_ID,
          created_at: new Date().toISOString(),
        }
        DEMO_HOTELS.push(newHotel)
        return newHotel
      }

      const { data, error } = await supabase
        .from('hotels')
        .insert({ ...hotel, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as Hotel
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip', data.trip_id] })
      toast.success('Hotel added')
    },
    onError: (error: Error) => {
      toast.error(`Failed to add hotel: ${error.message}`)
    },
  })
}

export function useLoyaltyPrograms() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['loyalty-programs', user?.id],
    queryFn: async () => {
      if (isDemoMode()) {
        return [...DEMO_LOYALTY]
      }

      const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('user_id', user!.id)
        .order('program_name')
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useVisitedCountries() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['visited-countries', user?.id],
    queryFn: async () => {
      if (isDemoMode()) {
        return [...DEMO_VISITED_COUNTRIES]
      }

      const { data, error } = await supabase
        .from('visited_countries')
        .select('*')
        .eq('user_id', user!.id)
        .order('country_name')
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}
