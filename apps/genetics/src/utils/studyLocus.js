import { generateComparator } from './index';


//TODO: fix the error
const log2h4h3Comparator = generateComparator((d) => d.log2h4h3);


export function filterGwasColocalisation(data, state) {
    
    return (
        data.filter((d) => d.log2h4h3 >= state.log2h4h3SliderValue)
        .filter((d) => d.h4 >= state.h4SliderValue)
        .sort(log2h4h3Comparator)
        .reverse()
    );
}

export function filterQtlColocalisation(data, state) {
  return (
    data.filter((d) => d.log2h4h3 >= state.log2h4h3SliderValue)
  .filter((d) => d.h4 >= state.h4SliderValue)
  .sort(log2h4h3Comparator)
  .reverse()
  );
}
