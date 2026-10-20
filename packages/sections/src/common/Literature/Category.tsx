import { useLiterature, useSelectedCategories, useLiteratureDispatch } from "./LiteratureContext";
import { fetchSimilarEntities } from "./requests";
import { useApolloClient, InputLabel, FormGroup, Checkbox, FormControlLabel } from "ui";

const toggleValue = (selected, categories) => {
  const isChecked = categories.indexOf(selected) !== -1;
  if (!isChecked) return [...categories, selected];
  return [...categories.filter(value => value !== selected).sort()];
};

const categories = [
  { name: "target", label: "Target" },
  { name: "disease", label: "Disease" },
  { name: "drug", label: "Drug" },
];

export default function Category() {
  const literature = useLiterature();
  const category = useSelectedCategories();
  const literatureDispatch = useLiteratureDispatch();
  const client = useApolloClient();

  const handleChange = async event => {
    const {
      query,
      id,
      category: bibliographyCategory,
      selectedEntities,
      globalEntity,
      pageSize,
      endYear,
      endMonth,
      startYear,
      startMonth,
    } = literature;
    const {
      target: { name: clicked },
    } = event;
    const newCategories = toggleValue(clicked, bibliographyCategory);
    literatureDispatch({ type: "loadingEntities", value: true });
    const request = await fetchSimilarEntities({
      client,
      query,
      id,
      category: newCategories,
      entities: selectedEntities,
      pageSize,
      endYear,
      endMonth,
      startYear,
      startMonth,
    });
    const data = request.data[globalEntity];
    const update = {
      entities: data.similarEntities?.rows ?? [],
      earliestPubYear: data.literatureOcurrences?.stats?.earliestPubDate,
      litsCount: data.literatureOcurrences?.count,
      litsIds: data.literatureOcurrences?.rows?.map(({ pmid }) => pmid),
      page: 0,
      loadingEntities: false,
      category: newCategories,
    };
    literatureDispatch({ type: "stateUpdate", value: update });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <InputLabel style={{ marginRight: "15px" }} id="demo-mutiple-name-label">
        Tag category:
      </InputLabel>
      <FormGroup row>
        {categories.map(({ name, label }) => (
          <FormControlLabel
            key={name}
            control={
              <Checkbox
                checked={category.indexOf(name) !== -1}
                onChange={handleChange}
                name={name}
                color="primary"
                disabled={literature.loadingEntities}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>
    </div>
  );
}
