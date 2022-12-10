import React from "react";
import { Alert, Col, Container, Image, Row } from "react-bootstrap";

function Sobre(props) {
  return (
    <Container style={{ width: "80%" }}>
      <Row className="pt-5 d-flex justify-content-center align-items-center">
        <Col>
          <Image
            src="https://i.ytimg.com/vi/v3JV13-0-ZU/maxresdefault.jpg"
            alt="Cançado"
            className="mb-3"
            fluid
            rounded
            style={{width:"80%"}}
            
          />
          <blockquote className="blockquote text-right">
            <p className="mb-0" style={{ textAlign: "justify", fontFamily: "Playfair Display" }}>
              É o dever daqueles de nós que ainda estão vivos resistir e lutar
              contra o esquecimento, tão comum nestes tempos efêmeros e
              pós-modernos. Os mortos precisam de nossa lealdade, eles são
              totalmente dependentes dela. O dever dos vivos para com os mortos,
              portanto, não se limita a garantir o respeito pelos restos mortais
              e dar-lhes um enterro adequado; esse dever também é acompanhado de
              uma lembrança permanente.
            </p>{" "}
            <br />
            <footer className="blockquote-footer">
              A.A. Cançado Trindade em{" "}
              <cite title="Source Title">
                Voto Apartado no Caso da Comunidade Moiwana Vs. Suriname (par.
                93)
              </cite>
            </footer>
          </blockquote>
        </Col>
        <Col>
          <Alert key={1} variant="light" className="text-center" style={{fontFamily: "Playfair Display" }} >
            A plataforma <b>InfoAmericano</b> foi criada pelos servidores do
            Judiciário Federal <a href="https://github.com/luizzzvictor">Luiz Silva</a> e{" "}
            <a href="https://github.com/bgsrio">Bruno de Sousa</a> como projeto FrontEnd do BootCamp de{" "}
            <em>WebDevelopment Full-Time</em> da IronHack São Paulo, em parceria
            com a Escola Nacional de Administração Pública - ENAP, entre Outubro
            e Dezembro de 2022.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default Sobre;
