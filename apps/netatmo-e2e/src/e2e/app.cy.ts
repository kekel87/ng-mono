describe('netatmo', () => {
  beforeEach(() => cy.visit('/'));

  it('should be redirect to netatmo auth page', () => {
    cy.url().should('include', 'https://auth.netatmo.com/');
  });
});
