type Accessor<T, R> = (item: T) => R;
type Comparator<T> = (a: T, b: T) => number;
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BreakpointHelper = `${Breakpoint}${'Down' | 'Up' | 'Only' | ''}`;

export const generateComparatorFromAccessor = <T, R extends string | number>(
  accessor: Accessor<T, R>
): Comparator<T> => (a: T, b: T) => {
  const aValue = accessor(a);
  const bValue = accessor(b);
  if (aValue > bValue) return 1;
  if (aValue === bValue) return 0;
  return -1;
};

export const breakpointMatch = (
  breakpoint: Breakpoint,
  breakpointHelper: BreakpointHelper
): boolean => {
  const breakpointMap: Record<Breakpoint, number> = { 
    xs: 0, 
    sm: 1, 
    md: 2, 
    lg: 3, 
    xl: 4 
  };
  
  const isDownComparator = breakpointHelper.includes('Down');
  const isUpComparator = breakpointHelper.includes('Up');

  const breakpointIndex = breakpointMap[breakpoint];
  const breakpointHelperIndex = breakpointMap[
    breakpointHelper.replace(/Down|Up|Only/g, '') as Breakpoint
  ];

  if (breakpointIndex === breakpointHelperIndex) return true;
  if (isDownComparator && breakpointIndex <= breakpointHelperIndex) return true;
  if (isUpComparator && breakpointIndex >= breakpointHelperIndex) return true;

  return false;
};