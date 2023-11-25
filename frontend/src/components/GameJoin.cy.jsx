import React from 'react';
import GameJoin from './GameJoin';
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom';

describe('Alert', () => {
  it('Render Session Joining', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GameJoin />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.contains('Enter Your Name').and('be.visible');
    cy.get('input[name=name]').should('be.visible');
    cy.get('button[name=play-start]').should('be.visible');

    cy.get('.alert').should('exist');
    cy.get('.alert').should('not.be.visible');

    cy.get('.AlertTitle').should('exist');
    cy.get('.AlertTitle').should('not.be.visible');
  });
});
