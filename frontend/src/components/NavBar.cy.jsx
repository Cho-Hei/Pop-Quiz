import React from 'react'
import NavBar from './NavBar'
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom'

describe('NavBar tests', () => {
  it('Render navBar without props', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.get('a').contains('BigBrain').should('have.attr', 'href', '/dashboard');
    cy.get('button').contains('Logout').should('be.visible');
  });
})
