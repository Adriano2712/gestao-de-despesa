import PropTypes from 'prop-types';

function StatTile({ label, value, critical }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className={`stat-tile-value${critical ? ' is-critical' : ''}`}>{value}</span>
    </div>
  );
}

StatTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  critical: PropTypes.bool,
};

export default StatTile;
