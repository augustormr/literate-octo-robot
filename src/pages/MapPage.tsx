import { useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVisitedCountries, useTrips } from '@/hooks/useTrips'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function MapPage() {
  const { data: visitedCountries = [] } = useVisitedCountries()
  const { data: trips = [] } = useTrips()

  const visitedCodes = useMemo(
    () => new Set(visitedCountries.map((c) => c.country_code)),
    [visitedCountries]
  )

  const tripCountryCodes = useMemo(
    () => new Set(trips.map((t) => t.country_code).filter(Boolean)),
    [trips]
  )

  const allVisited = useMemo(
    () => new Set([...visitedCodes, ...tripCountryCodes]),
    [visitedCodes, tripCountryCodes]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">World Map</h1>
        <p className="text-muted-foreground">
          {allVisited.size} countries explored
        </p>
      </div>

      <Card>
        <CardContent className="p-2">
          <ComposableMap
            projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
            className="h-[400px] w-full md:h-[500px]"
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const iso = geo.properties?.ISO_A2 ?? ''
                    const isVisited = allVisited.has(iso)
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isVisited ? 'hsl(243 75% 59%)' : 'hsl(var(--muted))'}
                        stroke="hsl(var(--border))"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: isVisited
                              ? 'hsl(243 75% 50%)'
                              : 'hsl(var(--accent))',
                            outline: 'none',
                          },
                          pressed: { outline: 'none' },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </CardContent>
      </Card>

      {/* Country list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visited Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {visitedCountries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {visitedCountries.map((c) => (
                <Badge key={c.id} variant="secondary">
                  {c.country_name}
                  {c.visit_count > 1 && (
                    <span className="ml-1 text-xs opacity-70">
                      x{c.visit_count}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Countries you visit will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
