describe("theme", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("tour-skip").click();
  });

  it("defaults to light theme", () => {
    cy.get("html").should("have.class", "light");
  });

  it("can toggle", () => {
    cy.get("html").should("have.class", "light");

    cy.dataCy("theme-toggle").click();
    cy.get("html").should("have.class", "dark");

    cy.dataCy("theme-toggle").click();
    cy.get("html").should("have.class", "light");
  });

  it("can persist", () => {
    cy.dataCy("theme-toggle").click();
    cy.reload();

    cy.get("html").should("have.class", "dark");
  });
});

export {};
