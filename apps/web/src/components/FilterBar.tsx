import { Button, Flex } from "theme-ui";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
  sx?: any;
}

const FilterBar = ({ options, active, onChange, sx }: FilterBarProps) => {
  return (
    <Flex sx={{ gap: 2, ...sx }}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={active === option.value ? "toggleActive" : "toggleInactive"}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Flex>
  );
};

export default FilterBar;
