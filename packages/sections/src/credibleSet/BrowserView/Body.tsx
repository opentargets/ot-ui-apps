import { useQuery } from "@apollo/client";
import { GeneVis, SectionItem } from "ui";
import { definition } from ".";
import Description from "./Description";
import { useEffect, useState } from "react";
import BROWSER_VIEW_QUERY from "./BrowserViewQuery.gql";

type BodyProps = {
	id: string;
	entity: string;
};

function Body({ id, entity }: BodyProps) {
  const [data, setData] = useState<any[] | null>(null);

  // trivial request to satisfy SectionItem; not used for rendering yet
  const variables = { studyLocusId: id };
  const request = useQuery(BROWSER_VIEW_QUERY, { variables });

  // select data
  const chromosome = "19";
  const start = 43_000_000;
  const end = 46_000_000;

  // load local chromosome data
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const mod = await import(`./genesByChromosome/chr${chromosome}.json`);
        const arr = (mod as any).default ?? mod;

        // filter to those within (or overlapping) start-to-end
        let filtered = Array.isArray(arr)
          ? arr.filter((item: any) => {
              const gs = Number(item.start);
              const ge = Number(item.end);
              return Number.isFinite(gs) && Number.isFinite(ge) && ge >= start && gs <= end;
            })
          : [];

        // !! FILTER ON BIOTYPE HERE FOR NOW !!
        filtered = filtered.filter(o => (
          // !o.biotype.includes("pseudogene") && 
          !o.biotype.includes("RNA")
        ));
        
        // rewrite data into format returned by API
        if (!cancelled) {
          const formatted = filtered.map(o => ({
            target: {
              id: o.id,
              approvedSymbol: o.name,
              biotype: o.biotype,
              canonicalExons: o.exons,
              genomicLocation: {
                start: o.start,
                end: o.end,
                strand: o.strand,
                chromosome: chromosome,
              }
            }
          }));
          setData(formatted);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load chromosome data", e);
        if (!cancelled) setData([] as any);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [chromosome]);

	return (
		<SectionItem
			definition={definition}
			entity={entity}
			request={request as unknown as any}
			showContentLoading
			loadingMessage="Loading data. This may take some time..."
			renderDescription={() => <Description />}
      renderBody={() => data
        ? <GeneVis
            data={{ genes: data }}
            chromosome={chromosome}
            xMin={start}
            xMax={end}
            geneColor={target => `${target.biotype === "protein_coding" ? "steelblue" : "firebrick"}`}
            geneLabel={target => `${target.genomicLocation.strand === -1 ? "← " : ""}${
              target.approvedSymbol ?? target.id}${
              target.genomicLocation.strand === 1 ? " →" : ""}`
            }
            variantColor={() => "grey"}
          />
        : <h2>Loading...</h2>
      }
		/>
	);
}

export default Body;
