import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Popover,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../p2-style.module.css";
import api from "../../api/api";

import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";

function NavigationBar() {
  const { loggedInUser } = useContext(AuthContext);

  // console.log(loggedInUser)

  const [orgao, setOrgao] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await api.get(`usuario/profileNV`);
        setOrgao(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, []);

  // console.log(usuario)

  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {!loggedInUser && (
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
                <Nav.Link
                  className={styles.navbarBtn}
                  onClick={() => {
                    navigate(`/sign-up`);
                  }}
                >
                  Cadastre-se
                </Nav.Link>
                <Nav.Link
                  className={styles.navbarBtn}
                  onClick={() => {
                    navigate(`/login`);
                  }}
                >
                  Login
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      {loggedInUser && (
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
                {loggedInUser.user.role === "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/usuario`);
                    }}
                  >
                    Usuários
                  </Nav.Link>
                )}
                {loggedInUser.user.role === "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/municipio`);
                    }}
                  >
                    Municípios
                  </Nav.Link>
                )}
                {loggedInUser.user.role === "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/orgao`);
                    }}
                  >
                    Órgãos
                  </Nav.Link>
                )}
                {loggedInUser.user.role === "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/caso`);
                    }}
                  >
                    Casos
                  </Nav.Link>
                )}
                {loggedInUser.user.role === "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/reparacao`);
                    }}
                  >
                    Reparações
                  </Nav.Link>
                )}
                {loggedInUser.user.role === "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/assunto`);
                    }}
                  >
                    Assuntos
                  </Nav.Link>
                )}
                {loggedInUser.user.role !== "admin" && (
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
                )}
                {loggedInUser.user.role !== "admin" && (
                  <Nav.Link
                    className={styles.navbarBtn}
                    onClick={() => {
                      navigate(`/sobre`);
                    }}
                  >
                    Sobre
                  </Nav.Link>
                )}

                <Nav.Link
                  className={styles.navbarBtn}
                  onClick={() => {
                    navigate(`/logout`);
                  }}
                >
                  Logout
                </Nav.Link>
                {/* {isLoading && (
                  <Spinner className="mt-4" animation="border" />
                )} */}

                {!isLoading && (
                  <OverlayTrigger
                    placement="bottom"
                    style={{ cursor: "pointer" }}                    
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">
                          {loggedInUser.user.name}
                        </Popover.Header>
                        <Popover.Body>
                          <strong>Tribunal:</strong> {orgao} <br></br>{" "}
                          <strong>Perfil:</strong> {loggedInUser.user.role}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    {({ ref, ...triggerHandler }) => (
                      <Button
                        variant="light"
                        {...triggerHandler}
                        className="d-inline-flex align-items-center"
                        onClick={() => {
                    navigate(`/profile`);
                  }}
                      >
                        <Image
                          ref={ref}
                          roundedCircle
                          src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                          style={{ width: "30px" }}
                        />
                      </Button>
                    )}
                  </OverlayTrigger>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}

export default NavigationBar;
