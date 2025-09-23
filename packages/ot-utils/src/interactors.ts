export enum InteractorsSource {
  INTACT = "intact",
  REACTOME = "reactome",
  SIGNOR = "signor",
  STRING = "string",
}

export const INTERACTORS_SOURCES = {
  INTACT: InteractorsSource.INTACT,
  REACTOME: InteractorsSource.REACTOME,
  SIGNOR: InteractorsSource.SIGNOR,
  STRING: InteractorsSource.STRING,
};

export const INTERACTORS_SOURCE_THRESHOLD = {
  [INTERACTORS_SOURCES.INTACT]: 0.42,
  [INTERACTORS_SOURCES.STRING]: 0.75,
  [INTERACTORS_SOURCES.SIGNOR]: null,
  [INTERACTORS_SOURCES.REACTOME]: null,
};

interface TargetRowInteractorsRequest {
  data?: {
    target?: {
      interactions?: {
        rows?: Array<{
          targetB?: {
            id: string;
          };
        }>;
      };
    };
  };
}

export function getInteractorIds(targetRowInteractorsRequest: TargetRowInteractorsRequest) {
  if (!targetRowInteractorsRequest?.data?.target?.interactions?.rows) {
    return [];
  }

  const interactorsIds = [
    ...new Set(
      targetRowInteractorsRequest.data.target.interactions.rows
        .map((int) => int.targetB?.id)
        .filter((id) => id !== null && id !== undefined)
    ),
  ];

  return interactorsIds;
}
