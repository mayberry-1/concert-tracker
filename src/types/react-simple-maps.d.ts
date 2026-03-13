declare module "react-simple-maps" {
  import { ReactNode, CSSProperties } from "react";

  export interface GeographyProps {
    geography: unknown;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: { default?: CSSProperties; hover?: CSSProperties; pressed?: CSSProperties };
    [key: string]: unknown;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    [key: string]: unknown;
  }

  export interface GeographiesProps {
    geography: string;
    children: (props: { geographies: GeoFeature[] }) => ReactNode;
  }

  export interface GeoFeature {
    rsmKey: string;
    properties: Record<string, string>;
    [key: string]: unknown;
  }

  export interface ComposableMapProps {
    projection?: string;
    style?: CSSProperties;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
}
