import React from 'react';
import LoginForm from './Loginform';
import Regform from './Regform';
import { ThemeProvider } from '@mui/system';
import theme from './Theme.jsx';
import { BrowserRouter } from 'react-router-dom'

describe('Form', () => {
  it('Render Login page', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.get('input[name=email]').should('be.visible');
    cy.get('input[name=password]').should('be.visible');
    cy.get('button[name=sign-in]').should('be.visible');
    cy.get('.link').should('be.visible');
  });

  it('Render Register page', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Regform />
        </BrowserRouter>
      </ThemeProvider>
    );

    cy.get('input[name=email]').should('be.visible');
    cy.get('input[name=password]').should('be.visible');
    cy.get('input[name=name]').should('be.visible');
    cy.get('button[name=sign-up]').should('be.visible');
    cy.get('.link').should('be.visible');
  });
})
