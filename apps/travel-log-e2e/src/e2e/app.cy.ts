describe('travel-log', () => {
  beforeEach(() => cy.visit('/'));

  it('should display title', () => {
    cy.get('h1').contains('Travel log');
  });
});
