const CAREER_START_DATE = new Date(2021, 7, 1); // August 2021

export function getYearsOfExperience() {
  const now = new Date();
  const years = Math.round(
    Number.parseFloat(now - CAREER_START_DATE) / (365.25 * 24 * 60 * 60 * 1000),
  );
  return years;
}
