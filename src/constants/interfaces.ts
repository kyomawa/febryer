export interface FilterAndSortControlsProps {
  filters: {
    status: string;
    startTime: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      status: string;
      startTime: string;
    }>
  >;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
}
