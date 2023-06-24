describe('Collections', () => {
  beforeEach(() => cy.visit('/'));

  describe('Before authentication', () => {
    it('should display welcome message', () => {
      cy.get('col-header h1').contains('Collections');
    });

    it('User should be able to authenticate himself', () => {
      cy.get('[name="email"]').type('mr.test@gmail.com');
      cy.get('[name="password"]').type('azerty123456');
      cy.get('.dev-auth button').click();

      cy.get('col-login col-loader').should('not.be.exist');

      cy.get('col-dashboard').should('be.exist');
    });
  });

  describe('Once authenticated', () => {
    beforeEach(() => {
      cy.get('col-login col-loader').should('not.be.exist');
    });

    describe('Dashboard', () => {
      it('User should see loader in games card', () => {
        cy.get('mat-card:nth-of-type(1) col-loader').should('be.exist');
      });

      it('User should see how many games he has', () => {
        cy.get('mat-card:nth-of-type(1) mat-card-subtitle').contains('170');
      });
    });

    describe('Sidepanel', () => {
      // it('User should be open Sidepanel', () => {
      //   click('col-header mat-toolbar button');
      //   waitForVisibility('mat-sidenav');
      //   expect(isDisplayed('mat-sidenav')).toBeTruthy();
      // });
      //
      // it('User should see her account information', () => {
      //   click('col-header mat-toolbar button');
      //   waitForVisibility('mat-sidenav');
      //   expect(getText('.user .email')).toEqual('mr.test@gmail.com');
      // });
      //
      // it('User should be close Sidepanel', async () => {
      //   if ((await getBrowserName()) !== 'firefox') {
      //     click('col-header mat-toolbar button');
      //     waitForVisibility('mat-sidenav');
      //     clickElementAtPoint('.mat-drawer-backdrop', { x: 330, y: 292 });
      //     waitForInvisibility('mat-sidenav');
      //     expect(isDisplayed('mat-sidenav')).toBeFalsy();
      //   }
      // });
      //
      // it('Sidepanel should be closed when user navigate', () => {
      //   click('col-header mat-toolbar button');
      //   waitForVisibility('mat-sidenav');
      //   expect(isDisplayed('mat-sidenav')).toBeTruthy();
      //   click('mat-sidenav mat-nav-list a:nth-of-type(1)');
      //   waitForInvisibility('mat-sidenav');
      //   expect(isDisplayed('mat-sidenav')).toBeFalsy();
      // });
    });

    describe('Game List', () => {
      // beforeEach(() => {
      //   page.goToGameList();
      //   waitForPresence('mat-list-item:nth-of-type(1)');
      // });
      //
      // it('User should navigate on games list', () => {
      //   expect(isPresent('col-games-list')).toBeTruthy();
      // });
      //
      // it('User should see game in list', () => {
      //   expect(isPresent('mat-list-item:nth-of-type(1) .mat-list-avatar[src="assets/400x200.png"]')).toBeTruthy();
      //
      //   expect(waitThisText('mat-list-item:nth-of-type(1) .mat-list-text h3', `A Bug's Life`)).toBeTruthy();
      //
      //   expect(waitThisText('mat-list-item:nth-of-type(1) .mat-list-text p', 'Game Boy')).toBeTruthy();
      // });
      // it('User sould be able to mark game as acquired', () => {
      //   const checkbox = new MatCheckboxHelper('mat-list-item:nth-of-type(1) mat-checkbox');
      //   const snackbar = new MatSnackBarHelper('snack-bar-container simple-snack-bar');
      //   checkbox.toggle();
      //   expect(snackbar.text).toContain(`Jeux sauvegardé !`);
      //   snackbar.click();
      //   expect(snackbar.closed).toBeTruthy();
      //   expect(checkbox.checked).toBeTruthy();
      // });
      // it('User sould be able to mark game as not acquired', () => {
      //   const checkbox = new MatCheckboxHelper('mat-list-item:nth-of-type(1) mat-checkbox');
      //   const snackbar = new MatSnackBarHelper('snack-bar-container simple-snack-bar');
      //   checkbox.toggle();
      //   expect(snackbar.text).toContain(`Jeux sauvegardé !`);
      //   sleep(1000);
      //   expect(snackbar.closed).toBeTruthy();
      //   expect(checkbox.checked).toBeFalsy();
      // });
    });

    describe('Game detail', () => {
      // beforeEach(() => {
      //   page.goToGameList();
      //   waitForPresence('mat-list-item:nth-of-type(1)');
      //   click('mat-list-item:nth-of-type(1)');
      //   waitForPresence('col-game-detail');
      // });
      //
      // it('User should navigate on game detail', () => {
      //   expect(isPresent('col-game-detail')).toBeTruthy();
      // });
      //
      // it('User should see game detail', () => {
      //   const consoleSelect = new MatSelectHelper('[formcontrolname="console"]');
      //   const acquiredToggle = new MatSlideButtonHelper('[formcontrolname="acquired"]');
      //   const titleInput = new MatInputHelper('[formcontrolname="title"]');
      //
      //   expect(page.hasThisTitle(`A Bug's Life`)).toBeTruthy();
      //   expect(titleInput.value).toEqual(`A Bug's Life`);
      //   expect(consoleSelect.value).toEqual(`Game Boy`);
      //   expect(acquiredToggle.checked).toBeFalsy();
      // });
      // it('User should see header title update', () => {});
      // it('User should see form errors', () => {});
      // it('User should save a game', () => {});
    });

    // describe('New game', () => {
    //   it('User should navigate to new game detail', () => {});
    //   it('User should see new game title', () => {});
    //   it('User should save a game', () => {});
    //   it('User should delete a game', () => {});
    // });
  });
});
