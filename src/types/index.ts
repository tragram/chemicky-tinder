import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface TinderProfile {
  name: string;
  description: string;
  age: string;
  job: string;
  images: string[];
}