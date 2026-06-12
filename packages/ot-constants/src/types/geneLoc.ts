export interface IGeneomicLocation {
  chromosome?: string;
  start?: number;
  end?: number;
  strand?: string;
}

export enum GenomicLocationPresentationType {
    PLAIN = "plain",
    CHIP = "chip",
}
