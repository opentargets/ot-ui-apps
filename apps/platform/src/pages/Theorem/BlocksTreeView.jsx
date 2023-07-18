import { v1 } from 'uuid';
import { TreeItem, TreeView } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faCaretDown,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';

import { styled } from '@material-ui/core';

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  '& .MuiTreeItem-label': {
    fontSize: '13px',
  },
  '& .MuiTreeItem-iconContainer': {
    width: '10px',
  },
  '& .MuiTreeItem-iconContainer svg': {
    fontSize: '15px',
  },
}));

function BlocksTreeView({ blocksState }) {
  return (
    <TreeView
      defaultCollapseIcon={<FontAwesomeIcon icon={faCaretDown} />}
      defaultExpandIcon={<FontAwesomeIcon icon={faCaretRight} />}
      defaultEndIcon={<FontAwesomeIcon icon={faMinus} />}
      multiSelect
    >
      {blocksState.map(({ entity, sections, inputs }) => (
        <StyledTreeItem
          key={v1()}
          nodeId={v1()}
          label={`${entity} ${inputs[0]}`}
        >
          {sections.map(section => (
            <StyledTreeItem key={v1()} nodeId={v1()} label={section} />
          ))}
        </StyledTreeItem>
      ))}
    </TreeView>
  );
}

export default BlocksTreeView;
