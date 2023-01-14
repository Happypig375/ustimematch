import timetable from "../fixtures/timetable.json";

describe("personal timetable form", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="add-personal-timetable"]').click();
    cy.get('[data-cy="timetable-form-name-input"]').type(timetable.name);
    cy.get('[data-cy="timetable-form-planner-url-input"]')
      .focus()
      .type(timetable.plannerURL);
    cy.get('[data-cy="timetable-form"]').submit();
  });

  it("can add", () => {
    cy.window()
      .its("store")
      .its("timetable")
      .invoke("personalTimetable")
      .its("name")
      .should("eq", timetable.name);

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("personalTimetable")
      .its("plannerURL")
      .should("eq", timetable.plannerURL);
  });

  it("can edit", () => {
    cy.get('[data-cy="edit-personal-timetable"]').click();
    cy.get('[data-cy="timetable-form-name-input"]').clear().type("Edited");
    cy.get('[data-cy="timetable-form"]').submit();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("personalTimetable")
      .its("name")
      .should("eq", "Edited");
  });

  it("can delete", () => {
    cy.get('[data-cy="edit-personal-timetable"]').click();
    cy.get('[data-cy="delete-alert-trigger"]').click();
    cy.get('[data-cy="delete-alert-delete"]').click();

    cy.window()
      .its("store")
      .its("timetable")
      .invoke("personalTimetable")
      .should("eq", null);
  });
});
