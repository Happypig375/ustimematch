describe("theme", () => {
  it("defaults to light theme", () => {
    cy.visit("/");

    cy.get("html").should("have.class", "light");
  });

  it("can toggle", () => {
    cy.visit("/");

    cy.get("html").should("have.class", "light");

    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("have.class", "dark");

    cy.get('[data-cy="theme-toggle"]').click();
    cy.get("html").should("have.class", "light");
  });

  it("can persist", () => {
    cy.visit("/");

    cy.get('[data-cy="theme-toggle"]').click();
    cy.reload();
    cy.get("html").should("have.class", "dark");
  });
});

export {};
