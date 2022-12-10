import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../p2-style.module.css";

function NavigationBar(props) {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <Navbar className={styles.navbar} collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand
          className={styles.navbarBtn}
          onClick={() => {
            navigate(`/inicial`);
          }}
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >
          InfoAmericano
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className={styles.navbarBtn}
              onClick={() => {
                navigate(`/reparacoes/`);
              }}
            >
              Medidas de Reparacão por Caso
            </Nav.Link>
            <NavDropdown title="Links Úteis" id="collasible-nav-dropdown">
              <NavDropdown.Item
                target="_blank"
                href="https://www.corteidh.or.cr/index.cfm?lang=pt"
              >
                Página da Corte IDH
              </NavDropdown.Item>
              <NavDropdown.Item
                target="_blank"
                href="https://www.cnj.jus.br/poder-judiciario/relacoes-internacionais/monitoramento-e-fiscalizacao-das-decisoes-da-corte-idh/"
              >
                Página da UMF/CNJ
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                target="_blank"
                href="https://app.powerbi.com/view?r=eyJrIjoiN2E1OTlmNTUtYWE4My00OWI3LTg5ZDktNTQ4OTExOTQ5MWM2IiwidCI6ImFkOTE5MGU2LWM0NWQtNDYwMC1iYzVjLWVjYTU1NGNjZjQ5NyIsImMiOjJ9&pageName=ReportSection99c9b36388ded0a2e72e"
              >
                Monitoramento das Medidas de Reparação
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              className={styles.navbarBtn}
              onClick={() => {
                navigate(`/sobre`);
              }}
            >
              Sobre
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
