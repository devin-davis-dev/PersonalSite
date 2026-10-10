import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { Box, Flex, Text } from "theme-ui";

const CATEGORY_COLORS = {
  frontend: "#FFA630",
  backend: "#2A5F6A",
  infrastructure: "#81B29A",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { label, count, percent } = payload[0].payload;
  return (
    <Box
      sx={{
        bg: "primary",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "6px",
        px: 3,
        py: 2,
      }}
    >
      <Text
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: 1,
          display: "block",
        }}
      >
        {label}
      </Text>
      <Text sx={{ color: "rgba(255,255,255,0.7)", fontSize: 0 }}>
        {count} projects · {Math.round(percent * 100)}%
      </Text>
    </Box>
  );
};

const TechBreakdownChart = ({
  technologies,
  categoryLabels,
  projectsLabel,
}) => {
  const counts = {};
  for (const tech of technologies) {
    const cat = tech.category;
    if (!cat) continue;
    counts[cat] = (counts[cat] || 0) + tech.projects.length;
  }

  const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;

  const data = Object.keys(CATEGORY_COLORS).map((key) => ({
    key,
    label: categoryLabels[key] ?? key,
    color: CATEGORY_COLORS[key],
    count: counts[key] || 0,
    value: counts[key] || 0,
    percent: (counts[key] || 0) / total,
  }));

  return (
    <Flex
      sx={{
        flexDirection: ["column", "row"],
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={95}
          cy={95}
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
      <Flex sx={{ flexDirection: "column", gap: 3 }}>
        {data.map((cat) => (
          <Flex key={cat.key} sx={{ alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: "14px",
                height: "14px",
                borderRadius: "3px",
                bg: cat.color,
                flexShrink: 0,
              }}
            />
            <Box>
              <Text
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 1,
                  display: "block",
                }}
              >
                {cat.label}
              </Text>
              <Text
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 0,
                  display: "block",
                }}
              >
                {Math.round(cat.percent * 100)}% &middot; {cat.count}{" "}
                {projectsLabel}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default TechBreakdownChart;
