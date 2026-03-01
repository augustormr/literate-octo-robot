declare module 'react-simple-maps' {
  import { ComponentType, ReactNode } from 'react'

  interface ComposableMapProps {
    projectionConfig?: Record<string, unknown>
    className?: string
    children?: ReactNode
  }

  interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    children?: ReactNode
  }

  interface GeographiesProps {
    geography: string | Record<string, unknown>
    children: (data: { geographies: Geography[] }) => ReactNode
  }

  interface Geography {
    rsmKey: string
    properties: Record<string, string>
  }

  interface GeographyProps {
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: Record<string, string>
      hover?: Record<string, string>
      pressed?: Record<string, string>
    }
    key?: string
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
}
