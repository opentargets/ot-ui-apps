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
    pixelGapStartToStart?: number;
    bpPerPixel?: number;
    previousLayout?: Record<string, number>; // for stability
  }
): PackResult {
  const {
    pixelGap = 0,
    pixelGapStartToStart = 0,
    bpPerPixel = 1,
    previousLayout = {}
  } = options;

  const gapBp = pixelGap * bpPerPixel;
  const startGapBp = pixelGapStartToStart * bpPerPixel;

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
  const rowLastStart: number[] = [];

  const idToRow: PackResult = {};

  for (const interval of sorted) {
    const start = interval._start;
    const end = interval._end;

    let assignedRow = -1;

    // 1. Try preferred row (stability)
    const preferred = interval._preferredRow;
    if (
      preferred !== undefined &&
      rowEnd[preferred] !== undefined
    ) {
      const endOK = rowEnd[preferred] + gapBp <= start;
      const startOK =
        rowLastStart[preferred] + startGapBp <= start;

      if (endOK && startOK) {
        assignedRow = preferred;
      }
    }

    // 2. Otherwise, find first compatible row (stable order)
    if (assignedRow === -1) {
      for (let r = 0; r < rowEnd.length; r++) {
        const endOK = rowEnd[r] + gapBp <= start;
        const startOK =
          rowLastStart[r] + startGapBp <= start;

        if (endOK && startOK) {
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
    rowLastStart[assignedRow] = start;
  }

  return idToRow;
}