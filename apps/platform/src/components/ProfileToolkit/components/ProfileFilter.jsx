import FilterComponent from "../../FilterComponent";
import { useProfileContext, getDefaultProfileFilters } from "../index";

export default function ProfileFilter() {
  const { profileFilter, setProfileFilter, entity } = useProfileContext();
  const profileSections = getDefaultProfileFilters(entity);

  return (
    <FilterComponent
      filterItems={profileSections}
      selectedItems={profileFilter}
      setSelectedItems={setProfileFilter}
      defaultItems={profileSections}
      title="Filter sections"
      label="name"
    />
  );
}
