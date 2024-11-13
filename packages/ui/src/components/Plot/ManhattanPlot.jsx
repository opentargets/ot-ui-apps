
import {
  Plot,
  XAxis,
  YAxis,
  XTick,
  YTick,
  XLabel,
  YLabel,
  XTitle,
  XGrid,
  YGrid,
  Circle,
  Segment,
} from '.';

import * as d3 from "../../../../../node_modules/d3";


// ========== chromosome lengths ==========

// from: https://www.ncbi.nlm.nih.gov/grc/human/data
// (first tab: "Chromosome lengths")
const chromosomeInfo = [
  { chromosome: '1',  length: 248956422 },
  { chromosome: '2',	length: 242193529 },
  { chromosome: '3',	length: 198295559 },
  { chromosome: '4',	length: 190214555 },
  { chromosome: '5',	length: 181538259 },
  { chromosome: '6',	length: 170805979 },
  { chromosome: '7',	length: 159345973 },
  { chromosome: '8',	length: 145138636 },
  { chromosome: '9',  length: 138394717 },
  { chromosome: '10',	length: 133797422 },
  { chromosome: '11',	length: 135086622 },
  { chromosome: '12',	length: 133275309 },
  { chromosome: '13',	length: 114364328 },
  { chromosome: '14',	length: 107043718 },
  { chromosome: '15',	length: 101991189 },
  { chromosome: '16',	length: 90338345  },
  { chromosome: '17',	length: 83257441  },
  { chromosome: '18',	length: 80373285  },
  { chromosome: '19',	length: 58617616  },
  { chromosome: '20',	length: 64444167  },
  { chromosome: '21',	length: 46709983  },
  { chromosome: '22',	length: 50818468  },
  { chromosome: 'X',	length: 156040895 },
  { chromosome: 'Y',  length: 57227415  },
];

const cumulativeLengths = [...d3.cumsum(chromosomeInfo, d => d.length)];

const genomeLength = cumulativeLengths.at(-1);
cumulativeLengths.forEach((c, i) => {
  const start = cumulativeLengths[i - 1] ?? 0;
  chromosomeInfo[i].start = start;
  chromosomeInfo[i].midpoint = (start + c) / 2;
});


// ========== credible set data ==========

// downloaded data from GWAS credible set widget on study page 
//  - https://genetics--ot-platform.netlify.app/study/FINNGEN_R11_G6_MYONEU
//  - from genetics netlify preview, 5/11/24
//  - manually changed 'x10' scientific strings to numbers with 'e' notation
const credibleSets = [
  {
    "leadVariant": "2_176833368_G_C",
    "pValue": 9.812999725341797e-29,
    "beta": 1.78142,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 1
  },
  {
    "leadVariant": "2_182725396_C_G",
    "pValue": 2.0209999084472656e-15,
    "beta": 1.88092,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 1
  },
  {
    "leadVariant": "2_178527202_G_T",
    "pValue": 9.468999862670898e-43,
    "beta": 2.50628,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 2
  },
  {
    "leadVariant": "3_133502828_C_T",
    "pValue": 3.1429998874664307e-26,
    "beta": 2.39005,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 2
  },
  {
    "leadVariant": "2_69971691_C_T",
    "pValue": 1.934999942779541e-11,
    "beta": 2.70286,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 3
  },
  {
    "leadVariant": "3_123909270_G_T",
    "pValue": 2.119999885559082e-9,
    "beta": 1.42897,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 2
  },
  {
    "leadVariant": "3_129274020_G_A",
    "pValue": 9.961000442504883e-39,
    "beta": 1.64242,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 7
  },
  {
    "leadVariant": "3_125959818_C_G",
    "pValue": 1.0149999856948853e-38,
    "beta": 2.9011,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 2
  },
  {
    "leadVariant": "13_59255897_CCT_C",
    "pValue": 2.700000047683716e-8,
    "beta": -0.778397,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 5
  },
  {
    "leadVariant": "3_135574097_C_A",
    "pValue": 7.104000091552734e-14,
    "beta": 1.89334,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 4
  },
  {
    "leadVariant": "3_128084826_G_A",
    "pValue": 1.277999997138977e-66,
    "beta": 3.1711,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 1
  },
  {
    "leadVariant": "2_186704353_G_A",
    "pValue": 8.9350004196167e-13,
    "beta": 1.81246,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 1
  },
  {
    "leadVariant": "3_137766724_A_T",
    "pValue": 2.318000078201294e-11,
    "beta": 1.68788,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 6
  },
  {
    "leadVariant": "7_143351678_C_T",
    "pValue": 1.7300000190734863e-8,
    "beta": 0.420331,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 4
  },
  {
    "leadVariant": "17_63747701_G_A",
    "pValue": 1.1540000438690186e-11,
    "beta": 1.81591,
    "finemappingMethod": "SuSie",
    "credibleSetSize": 3
  }
];

// currently inefficient since finds correct chromosome
function cumulativePosition(id) {
  const parts = id.split('_');  // not necessary in platform since can get in query
  const [chromosome, position] = [parts[0], Number(parts[1])];
  return chromosomeInfo.find(elmt => elmt.chromosome === chromosome).start + position;
}
const genomePositions = {};
credibleSets.forEach(({ leadVariant }) => {
  genomePositions[leadVariant] = cumulativePosition(leadVariant);
});

const pValueMin = d3.min(credibleSets, d => d.pValue);
const pValueMax = 1;


// ========== plot ==========

const background = '#fff';
const markColor = '#3489ca';

export default function ManhattanPlot() {
  return (
    <Plot
      background={background}
      width="1200"
      height="360"
      padding={{ top: 40, right: 20, bottom: 40, left: 100 }}
      data={credibleSets}
      yReverse
      scales={{
        x: d3.scaleLinear().domain([0, genomeLength]),
        y: d3.scaleLog().domain([pValueMin, pValueMax]),
      }}
      xTick={chromosomeInfo}
    >
      <XTick
        values={tickData => tickData.map(chromo => chromo.start)} tickLength={15}/>
      <XAxis />
      <XLabel 
        values={tickData => tickData.map(chromo => chromo.midpoint)}
        format={(_, i, __, tickData) => tickData[i].chromosome}
        padding={6}
      />
      <XGrid values={tickData => tickData.map(chromo => chromo.start)} stroke="#ccc" />
      <XTitle fontSize={10} position="top" align="left" textAnchor="end" padding={14}>
        -log_10(pValue)
      </XTitle>
      <YAxis />
      <YTick />
      <YLabel format={v => -Math.log10(v)} />
      <Segment
        x={d => genomePositions[d.leadVariant]}
        xx={d => genomePositions[d.leadVariant]}
        y={d => d.pValue}
        yy={pValueMax}
        fill="transparent"
        stroke={markColor}
        strokeWidth={1}
        strokeOpacity={0.7}
        area={24}
      />
      <Circle
        x={d => genomePositions[d.leadVariant]}
        y={d => d.pValue}
        fill={background}
        fillOpacity={1}
        stroke={markColor}
        strokeWidth={1.2}
        area={24}
      />
    </Plot>
  );
}