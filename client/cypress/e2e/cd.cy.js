describe("Gestion des CD", () => {
    it("ajoute un CD, l'affiche dans la liste puis le supprime", () => {
        const title = `Test CD ${Date.now()}`;

        cy.visit("/");

        cy.get('input[name="title"]').type(title);
        cy.get('input[name="artist"]').type("Test Artist");
        cy.get('input[name="year"]').type("2024");
        cy.contains("button", "Ajouter").click();

        cy.contains("li", title).should("be.visible");
        cy.contains("li", title)
            .should("contain", "Test Artist")
            .and("contain", "2024");

        cy.contains("li", title).find(".delete-btn").click();
        cy.contains("li", title).should("not.exist");
    });
});
