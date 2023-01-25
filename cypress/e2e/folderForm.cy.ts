describe("folder form validity", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
    cy.dataCy("add-folder").click();
  });

  it("shows error on empty name", () => {
    cy.folderForm();

    cy.dataCy("input-error-name").should("contain.text", "Please enter a name");
  });

  it("shows error on long name", () => {
    cy.folderForm("12345678901234567890123456789012345678901");

    cy.dataCy("input-error-name").should(
      "contain.text",
      "The name is too long",
    );
  });

  it("can trim name", () => {
    cy.folderForm(" trim ");

    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "trim");
  });
});

describe("folder form actions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
    cy.dataCy("add-folder").click();
    cy.dataCy("folder-form-name-input").focus().type("test");
    cy.dataCy("folder-form").submit();
  });

  it("can add", () => {
    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "test");
  });

  it("can edit", () => {
    cy.dataCy("sortable-tree-item").click();
    cy.folderForm(" edited");

    cy.store("timetable", "timetablesTree")
      .its(0)
      .its("name")
      .should("eq", "test edited");
  });

  it("can delete", () => {
    cy.dataCy("sortable-tree-item").click();
    cy.dataCy("delete-alert-trigger").click();
    cy.dataCy("delete-alert-delete").click();

    cy.store("timetable", "timetablesTree").its("length").should("eq", 0);
  });
});

export {};
