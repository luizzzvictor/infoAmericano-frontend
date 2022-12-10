import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Corteidh from "../../src/image/Corteidh.png";
import styles from "../p2-style.module.css";

const HomePage = () => {
  return (
    <Container
      style={{ height: "100vh" }}
      className="d-flex align-items-center justify-content-center"
    >
      <Card style={{ width: "30rem", border: "none" }}>
        <Card.Img variant="top" src={Corteidh} alt="logoCIDH" />
        <Card.Body>
          <Button className={styles.home} variant="my-4" size="lg">
            <Link className="nav-link" to="/inicial">
              InfoAmericano
            </Link>
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomePage;