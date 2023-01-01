export const parseUSTName = (name: string) => {
  const lessonName = name.split(" (")[0] || "";
  const section = name.split(" ")[2]?.replace(/[()]/g, "") || "";
  return { lessonName, section };
};
