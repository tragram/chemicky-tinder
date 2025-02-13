import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface TinderRecord {
  name: string;
  description: string;
  age: string;
  job: string;
  images: string[];
}

export class TinderProfile {
  constructor(
    public name: string,
    public description: string,
    public age: string,
    public job: string,
    public images: string[]
  ) { }

  id(): string {
    return this.name.toLowerCase().replace(/\s+/g, '-');
  }
}

export const createTinderProfile = (record: TinderRecord): TinderProfile => {
  return new TinderProfile(record.name, record.description, record.age, record.job, record.images);
};