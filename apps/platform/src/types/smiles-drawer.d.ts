declare module 'smiles-drawer' {
  interface DrawerConfig {
    width?: number;
    height?: number;
  }

  interface DrawerInstance {
    draw(tree: unknown, canvasId: string): void;
  }

  export class Drawer {
    constructor(config: DrawerConfig);
    draw(tree: unknown, canvasId: string): void;
  }

  export function parse(
    smiles: string,
    onSuccess: (tree: unknown) => void,
    onError: () => void
  ): void;
}
