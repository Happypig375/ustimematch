export const getPathAdvisorUrl = (venue: string) => {
  let searchParam = "";

  // Rm 1007, LSK Bldg (80)
  if (venue.includes("LSK") && venue.includes("Rm"))
    searchParam = "lsk" + venue.split(",")[0]?.replace("Rm ", "");
  // G012, LSK Bldg (199)
  else if (venue.includes("LSK")) searchParam = "lsk" + venue.split(",")[0];
  // G009A, CYT Bldg (80)
  else if (venue.includes("CYT")) searchParam = "cyt" + venue.split(",")[0];
  // Lecture Theater C (211)
  else if (venue.includes("Lecture Theater"))
    searchParam = venue.replace("Lecture Theater ", "lt").substring(0, 3);
  // Rm 2407, Lift 17-18 (126)
  else if (venue.includes("Rm")) searchParam = venue.substring(3, 7);

  return "https://pathadvisor.ust.hk/search/" + searchParam;
};
