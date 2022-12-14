import {
  Button,
  Container,
  Image,
  Nav,
  Navbar,
  OverlayTrigger,
  Popover,
  // Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

function NavBar() {
  const { loggedInUser } = useContext(AuthContext);
  console.log(loggedInUser)
  

  return (
    <>
      {loggedInUser && (
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>InfoAmericano</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* {loggedInUser && (
              <> */}
                {/* <Link className="nav-link" to="/"           >Página inicial</Link> */}
                <Link className="nav-link" to="/usuario">
                  Usuários
                </Link>
                <Link className="nav-link" to="/municipio">
                  Municípios
                </Link>
                <Link className="nav-link" to="/orgao">
                  Órgãos
                </Link>
                <Link className="nav-link" to="/caso">
                  Casos
                </Link>
                <Link className="nav-link" to="/reparacao">
                  Reparações
                </Link>
                {/* <Link className="nav-link" to="/informacao" >Informações</Link> */}
                <Link className="nav-link" to="/assunto">
                  Assuntos
                </Link>
                <Link className="nav-link" to="/logout">
                  Logout
                </Link>
                <Container style={{display: "flex", justifyContent:"flex-end"}}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">
                          {loggedInUser.user.name}
                        </Popover.Header>
                        <Popover.Body>
                          <strong>Perfil:</strong>{" "}
                          {loggedInUser.user.role}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    {({ ref, ...triggerHandler }) => (
                      <Button
                        variant="light"
                        {...triggerHandler}
                        className="d-inline-flex align-items-center"
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
                </Container>

                {/* </>
            )}
            {!loggedInUser && (
              <> }
                <Link className="nav-link" to="/"            >Página inicial</Link>
                <Link className="nav-link" to="/login"       >Login</Link>
                <Link className="nav-link" to="/sign-up"     >Cadastre-se</Link>
              { </>
            )} */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}

export default NavBar;
