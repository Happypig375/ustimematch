describe("tour", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shown on initial visit", () => {
    cy.dataCy("tour-modal").should("exist");
  });

  it("does not show on subsequent visit", () => {
    cy.dataCy("tour-skip").click();
    cy.reload();

    cy.dataCy("tour-modal").should("not.exist");
  });

  it("shows correct navigation", () => {
    cy.dataCy("tour-skip").should("exist");
    cy.dataCy("tour-prev").should("not.exist");
    cy.dataCy("tour-next").should("exist");

    cy.dataCy("tour-next").click();
    cy.dataCy("tour-next").click();
    cy.dataCy("tour-next").click();

    cy.dataCy("tour-next").should("contain.text", "Start!");
  });

  it("returns to empty store after navigation", () => {
    cy.dataCy("tour-skip").click();

    cy.store("timetable", "personalTimetable").should("be.null");
    cy.store("timetable", "timetablesTree").its("length").should("eq", 0);
    cy.store("ui", "showTimematch").should("be.false");
  });

  it("returns to previous store on manual trigger", () => {
    cy.actions("timetable", "addFolder", "test");

    cy.visit("/tutorial");
    cy.dataCy("tour-launch").click();
    cy.dataCy("tour-skip").click();

    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "test");
  });
});

export {};
