import { Button, Flex } from "theme-ui";

const FilterBar = ({ options, active, onChange, sx }) => {
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
