// utils/tooltipHelper.js
export const extractTooltipData = (item) => {
  const tooltip = item.tooltip || {};

  return {
    name: tooltip.name || item.name,
    type: tooltip.type || item.type,
    description: tooltip.description || item.description,
    id: tooltip.id || item.id,
    statChanges: tooltip.statChanges || item.statChanges,
  };
};
