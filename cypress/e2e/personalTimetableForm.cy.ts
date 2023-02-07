import timetable from "../fixtures/timetable.json";

describe("personal timetable form actions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
    cy.dataCy("add-personal-timetable").click();
    cy.timetableForm(timetable.name, timetable.plannerURL);
  });

  it("can add", () => {
    cy.store("timetable", "personalTimetable")
      .its("name")
      .should("eq", timetable.name);
    cy.store("timetable", "personalTimetable")
      .its("plannerURL")
      .should("eq", timetable.plannerURL);
  });

  it("can edit", () => {
    cy.dataCy("edit-personal-timetable").click();
    cy.timetableForm(" edited");

    cy.store("timetable", "personalTimetable")
      .its("name")
      .should("eq", timetable.name + " edited");
  });

  it("can delete", () => {
    cy.dataCy("edit-personal-timetable").click();
    cy.dataCy("delete-alert-trigger").click();
    cy.dataCy("delete-alert-delete").click();

    cy.store("timetable", "personalTimetable").should("eq", null);
  });
});
