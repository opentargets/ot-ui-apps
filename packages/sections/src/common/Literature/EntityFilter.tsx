import { Box, Chip, InputLabel } from "@mui/material";
import { useLiterature, useLiteratureDispatch } from "./LiteratureContext";
import { fetchSimilarEntities } from "./requests";
import { useAutoAnimate } from '@formkit/auto-animate/react'

type EntityFilterProps = {
  category: 'Disease' | 'Target' | 'Drug';
  name?: string,
  id?: string,
};

export default function EntityFilter({ category, name, id }: EntityFilterProps) {
  
  const literature = useLiterature();
  const {
    entities,
    selectedEntities: selectedChips,
    loadingEntities,
  } = literature;
  const literatureDispatch = useLiteratureDispatch();

  const [parent] = useAutoAnimate();

  const validateEntity = entity => {
    if (id === entity.object?.id) return null;
    if (selectedChips.find(s => s.object.id === entity.object.id)) return null;
    return entity;
  };

  const handleSelectChip = async e => {
    const {
      query,
      id: bibliographyId,
      category,
      globalEntity,
      endYear,
      endMonth,
      startYear,
      startMonth,
    } = literature;
    const newChips = [
      ...selectedChips,
      {
        score: e.score,
        object: {
          name: e.object.name || e.object.approvedSymbol,
          id: e.object.id,
          __typename: e.object.__typename,
        },
      },
    ];
    literatureDispatch({ type: 'selectedEntities', value: newChips });
    literatureDispatch({ type: 'loadingEntities', value: true });
    const request = await fetchSimilarEntities({
      query,
      id: bibliographyId,
      category,
      entities: newChips,
      endYear,
      endMonth,
      startYear,
      startMonth,
    });
    const data = request.data[globalEntity];
    const update = {
      // entities: data.similarEntities,
      entities: [...data.similarTargets, ...data.similarDrugs, ...data.similarDiseases],
      litsIds: data.literatureOcurrences?.rows?.map(({ pmid }) => pmid),
      litsCount: data.literatureOcurrences?.filteredCount,
      earliestPubYear: data.literatureOcurrences?.earliestPubYear,
      cursor: data.literatureOcurrences?.cursor,
      loadingEntities: false,
      page: 0,
    };
    literatureDispatch({ type: 'stateUpdate', value: update });
  };

  const handleDeleteChip = async index => {
    const {
      query,
      id: bibliographyId,
      category,
      globalEntity,
      endYear,
      endMonth,
      startYear,
      startMonth,
    } = literature;
    const newChips =
      [...selectedChips.slice(0, index), ...selectedChips.slice(index + 1)];
    literatureDispatch({ type: 'selectedEntities', value: newChips });
    literatureDispatch({ type: 'loadingEntities', value: true });
    const request = await fetchSimilarEntities({
      query,
      id: bibliographyId,
      category,
      entities: newChips,
      endYear,
      endMonth,
      startYear,
      startMonth,
    });
    const data = request.data[globalEntity];
    const update = {
      // entities: data.similarEntities,
      entities: [...data.similarTargets, ...data.similarDrugs, ...data.similarDiseases],
      litsIds: data.literatureOcurrences?.rows?.map(({ pmid }) => pmid),
      litsCount: data.literatureOcurrences?.filteredCount,
      earliestPubYear: data.literatureOcurrences?.earliestPubYear,
      cursor: data.literatureOcurrences?.cursor,
      loadingEntities: false,
      page: 0,
    };
    literatureDispatch({ type: 'stateUpdate', value: update });
  };

  // single list of entities to map to chips - selected and unselected
  const entityList = [];
  if (name) {
    entityList.push({
      key: id,
      label: name,
      title: `ID: ${id}`,
      color: "primary",
    });
  }
  for (const [i, e] of selectedChips.entries()) {
    if (e.object.__typename === category) {
      entityList.push({
        key: e.object.id,
        label: e.object.name,
        title: `Score: ${e.score} ID: ${e.object.id}`,
        color: "primary",
        clickable: true,
        disabled: loadingEntities,
        onClick: () => handleDeleteChip(i),
        onDelete: () => handleDeleteChip(i),
      });
    }
  }
  for (const e of entities) {
    if (e.object.__typename === category) {
      if (e.object && validateEntity(e)) {
        entityList.push({
          key: e.object.id,
          style: { opacity: loadingEntities ? 0.5 : 1 },
          label: e.object.name || e.object.approvedSymbol,
          disabled: loadingEntities,
          clickable: true,
          onClick: () => handleSelectChip(e),
          title: `Score: ${e.score} ID: ${e.object.id}`,
          color: "primary",
          variant: "outlined",
        })
      }
      else if (!e.object) {
        entityList.push({
          key: `empty-entity-${e.id}`,
          style: { opacity: loadingEntities ? 0.5 : 1 },
          label: e.id,
          disabled: true,
          title: "Missing object entity",
          color: "secondary",
          variant: "outlined",
        })
      }
    }
  }

  return (

    <div>
      <Box display="flex" flexDirection="column" gap={1} alignItems="baseline">
        <InputLabel>{category}</InputLabel>
        <Box display="flex" flexWrap="wrap" gap={1} ref={parent}>
          { entityList.map(o => <Chip key={o.key} {...o} />)  /* !! explicit key for now to avoid lint error */ }
        </Box>
      </Box> 
    </div>
  );
}