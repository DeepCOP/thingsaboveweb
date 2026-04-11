export type AdoptionStat = {
  value: string;
  label: string;
  valueClassName: string;
};

export type AdoptionGrowthPoint = {
  label: string;
  value: number;
};

export type AdoptionAvatar = {
  label: string;
  className: string;
  compact?: boolean;
};

export type AdoptionMetrics = {
  stats: AdoptionStat[];
  growthData: AdoptionGrowthPoint[];
  axisLabels: string[];
  chartRangeLabel: string;
  avatars: AdoptionAvatar[];
};
