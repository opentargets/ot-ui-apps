import { useState, useMemo, createContext } from 'react';
// import ls from 'local-storage';

import usePlatformApi from '../hooks/usePlatformApi';

const SectionOrderContext = createContext();

function SectionOrderProvider({ sections, children }) {
  const { data, entity } = usePlatformApi();
  const [sectionOrder, setSectionOrder] = useState(
    // ls.get(`${lsSectionsField || entity}SectionsOrder`) ||
    sections.map(section => section.definition.id)
  );

  const updateSectionOrder = newSectionOrder => {
    setSectionOrder(newSectionOrder);
    // ls.set(`${lsSectionsField || entity}SectionsOrder`, newSectionOrder);
  };

  const shouldRender = section => {
    const { hasData, external } = section.props.definition;

    // TODO: review this.
    return external || (data && hasData(data?.[entity])) || false;
  };

  const sectionOrderValue = useMemo(
    () => ({ sectionOrder, updateSectionOrder, shouldRender }),
    [{ sectionOrder, updateSectionOrder, shouldRender }]
  );

  return (
    <SectionOrderContext.Provider value={sectionOrderValue}>
      {children}
    </SectionOrderContext.Provider>
  );
}

export default SectionOrderProvider;
export { SectionOrderContext };
