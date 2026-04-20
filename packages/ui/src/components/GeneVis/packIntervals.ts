type GenomicLocation = {
  start: number;
  end: number;
  strand: number;
  chromosome: string;
};

type Target = {
  id: string;
  approvedSymbol: string;
  biotype: string;
  canonicalExons: any;
  genomicLocation: GenomicLocation;
};

type IntervalInput = {
  target: Target;
};

type PackResult = Record<string, number>; // id -> rowIndex

export function packIntervals(
  intervals: IntervalInput[],
  options: {
    pixelGap?: number;
    pixelGapCenterToCenter?: number;
    bpPerPixel?: number;
    previousLayout?: Record<string, number>; // for stability
  }
): PackResult {
  const {
    pixelGap = 0,
    pixelGapCenterToCenter = 0,
    bpPerPixel = 1,
    previousLayout = {}
  } = options;

  const gapBp = pixelGap * bpPerPixel;
  const centerGapBp = pixelGapCenterToCenter * bpPerPixel;

  const sorted = intervals
    .map((d, i) => ({
      ...d,
      _index: i,
      _start: d.target.genomicLocation.start,
      _end: d.target.genomicLocation.end,
      _preferredRow: previousLayout[d.target.id]
    }))
    .sort((a, b) => a._start - b._start || a._index - b._index);

  // Track per-row state
  const rowEnd: number[] = [];
  const rowLastCenter: number[] = [];

  const idToRow: PackResult = {};

  for (const interval of sorted) {
    const start = interval._start;
    const end = interval._end;
    const center = (start + end) / 2;

    let assignedRow = -1;

    // 1. Try preferred row (stability)
    const preferred = interval._preferredRow;
    if (
      preferred !== undefined &&
      rowEnd[preferred] !== undefined
    ) {
      const endOK = rowEnd[preferred] + gapBp <= start;
      const centerOK =
        rowLastCenter[preferred] + centerGapBp <= center;

      if (endOK && centerOK) {
        assignedRow = preferred;
      }
    }

    // 2. Otherwise, find first compatible row (stable order)
    if (assignedRow === -1) {
      for (let r = 0; r < rowEnd.length; r++) {
        const endOK = rowEnd[r] + gapBp <= start;
        const centerOK =
          rowLastCenter[r] + centerGapBp <= center;

        if (endOK && centerOK) {
          assignedRow = r;
          break; // first-fit → stable
        }
      }
    }

    // 3. If none found, create new row
    if (assignedRow === -1) {
      assignedRow = rowEnd.length;
    }

    const id = interval.target.id;
    idToRow[id] = assignedRow;

    rowEnd[assignedRow] = end;
    rowLastCenter[assignedRow] = center;
  }

  return idToRow;
}