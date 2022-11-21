import Tooltip from '@material-ui/core/Tooltip';
import priorityCols from '../static_datasets/prioritizationCols';

const colors = {
  Precedence: '#bebada',
  Tractability: '#fb9a99',
  Doability: '#6a3d9a',
  Safety: '#e31a1c',
};

function AggregationsRow({ cols }) {
  return (
    <div className="category-container">
      {cols.map(({ id }) => {
        if (id === 'name') return null;
        if (id === 'score') return null;
        const dataSource = priorityCols.filter(el => el.id === id)[0];
        const { category } = dataSource;
        const style = { backgroundColor: colors[category] };
        return (
          <Tooltip title={category} key={id}>
            <div className="category-indicator">
              <div style={style}></div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default AggregationsRow;
