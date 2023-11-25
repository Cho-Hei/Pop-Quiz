import React from 'react';
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom';
import WaitingLobby from './WaitingLobby.jsx';

describe('Waiting Lobby for player', () => {
  it('Render this when session is active but not started', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <WaitingLobby />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.contains('Waiting to start', { matchCase: false });
    cy.get('.LoadingImage').should('be.visible');
  });
});
