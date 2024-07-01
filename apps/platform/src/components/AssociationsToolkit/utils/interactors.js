import { v1 } from "uuid";

export function getInteractorIds(targetRowInteractorsRequest) {
  if (!targetRowInteractorsRequest?.data?.target?.interactions?.rows) {
    return [];
  }

  const interactorsIds = [
    ...new Set(
      targetRowInteractorsRequest.data.target.interactions.rows
        .map(int => int.targetB?.id)
        .filter(id => id !== null && id !== undefined)
    ),
  ];

  return interactorsIds;
}

export function getInteractorIdsPLS(targetInteractorsRows, cut = 0.6) {
  if (!targetInteractorsRows) {
    return [];
  }

  const interactorsIds = [
    ...new Set(
      targetInteractorsRows
        .map(int => {
          if (int.score < cut) return null;
          return int.targetB?.id;
        })
        .filter(id => id !== null && id !== undefined)
    ),
  ];

  return interactorsIds;
}

export function getTargetRowInteractors(targetRowInteractorsRequest, ids) {
  if (!targetRowInteractorsRequest?.data?.target?.interactions?.rows) {
    return [];
  }

  const rows = targetRowInteractorsRequest.data.target.interactions.rows;

  const targetRowInteractors = ids.map(id => {
    const item = rows.find(row => row.targetB?.id === id) || {};
    const targetB = item.targetB || {};

    return {
      id: targetB.id || v1(),
      targetSymbol: targetB.approvedSymbol || "",
      dataSources: {},
      prioritisations: {},
      diseaseName: "",
      score: 0,
      interactionScore: item.score,
      target: {
        id: targetB.id || "",
        approvedSymbol: targetB.approvedSymbol || "",
      },
    };
  });

  return targetRowInteractors;
}

export function getTargetRowInteractorsPLS(rows, ids) {
  if (!rows) {
    return [];
  }

  const targetRowInteractors = ids.map(id => {
    const item = rows.find(row => row.targetB?.id === id) || {};
    const targetB = item.targetB || {};

    return {
      id: targetB.id || v1(),
      targetSymbol: targetB.approvedSymbol || "",
      dataSources: {},
      prioritisations: {},
      diseaseName: "",
      score: 0,
      interactionScore: item.score,
      target: {
        id: targetB.id || "",
        approvedSymbol: targetB.approvedSymbol || "",
      },
    };
  });

  return targetRowInteractors;
}
