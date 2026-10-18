import { useTranslation } from "gatsby-plugin-react-i18next";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Text } from "theme-ui";
import { colors } from "../../theme/theme";
import type { Technology } from "../../types";

const CustomTooltip = ({ active, payload }: any) => {
  const { t } = useTranslation("common");
  if (!active || !payload?.length) return null;
  const { name, projects } = payload[0].payload;
  return (
    <Box
      sx={{
        bg: "#1a1f1a",
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
        {name}
      </Text>
      <Text sx={{ color: "rgba(255,255,255,0.6)", fontSize: 0 }}>
        {projects}{" "}
        {projects === 1 ? t("project_singular") : t("project_plural")}
      </Text>
    </Box>
  );
};

interface SkillsChartProps {
  technologies: Technology[];
  maxItems?: number;
}

const SkillsChart = ({ technologies, maxItems = 10 }: SkillsChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = [...technologies]
    .sort((a, b) => (b.projects?.length ?? 0) - (a.projects?.length ?? 0))
    .slice(0, maxItems)
    .map((t) => ({ name: t.name, projects: t.projects?.length ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height={data.length * 44}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{
            fill: "white",
            fontSize: 13,
            fontFamily: "Raleway, sans-serif",
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
        />
        <Bar
          dataKey="projects"
          radius={[0, 4, 4, 0]}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={activeIndex === index ? colors.orange : colors.secondary}
              opacity={activeIndex !== null && activeIndex !== index ? 0.35 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SkillsChart;
