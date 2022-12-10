import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import EditInfoReparacoes from "../EditInfoReparacoes/EditInfoReparacoes";
import AddInfoReparacoes from "../AddInfoReparacoes/AddInfoReparacoes";

function ReparacoesDetails({ apiURL, form, setForm }) {
  const [reparacao, setReparacao] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // -------- USE EFFECT PARA REQUISIÇÃO --------
  useEffect(() => {
    try {
      const fetchReparacao = async () => {
        const response = await axios.get(`${apiURL}/${id}`);

        setReparacao(response.data);
        setIsLoading(false);
      };
      fetchReparacao();
    } catch (error) {
      console.log(error);
    }
  }, [apiURL, id]);

  // -------- FUNÇÃO PARA DELETAR ITEM --------
  const deleteReparacao = async (index) => {
    const clone = { ...reparacao };

    delete clone._id;

    clone.infos_cumprimento.splice(index, 1);

    console.log(clone);

    await axios.put(`${apiURL}/${id}`, clone);

    const response = await axios.get(`${apiURL}/${id}`);
    setReparacao(response.data);

    toast.success(
      "Informação sobre cumprimento de medidas deletada com sucesso!",
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };

  // mapeia as arrays de infos dentro do caso
  let allInfos;
  if (!isLoading) {
    allInfos = reparacao.infos_cumprimento.map((info, index) => {
      return (
        <Container
          key={index}
          className="my-4 d-flex justify-content-center align-items-center"
        >
          <Card className="text-center w-100">
            <Card.Header>
              <Card.Title className="m-0">
                <h3> Informações dos Responsáveis sobre o Cumprimento</h3>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col className="text-center">
                  <Card.Text>
                    <strong> Tribunal Informante:</strong> <br />
                    {info.tribunal}
                  </Card.Text>
                  <Card.Text>
                    <strong> Unidade interna do Tribunal:</strong> <br />
                    {info.unidade_judiciaria}
                  </Card.Text>
                  <Card.Text>
                    <strong> Cargo do Usuário:</strong> <br />
                    {info.cargo_informante}
                  </Card.Text>
                  <Card.Text>
                    <strong>
                      {" "}
                      Descrição das ações tomadas para cumprir Medida de
                      Reparação:
                    </strong>{" "}
                    <br />
                    {info.infos_relevantes}
                  </Card.Text>
                  <Card.Text>
                    <strong>
                      {" "}
                      Notificar alteração do status de cumprimento:
                    </strong>{" "}
                    <br />
                    {info.notificar_status_cumprimento}
                  </Card.Text>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <EditInfoReparacoes
                    id={id}
                    apiURL={apiURL}
                    reparacao={reparacao}
                    setReparacao={setReparacao}
                    infoIndex={index}
                  />
                </Col>
                <Col>
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Voltar
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    onClick={() => deleteReparacao(index)}
                  >
                    Excluir Informação sobre Cumprimento
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      );
    });
  }

  // -------- RENDERIZAÇÃO DE HTML --------
  return (
    <>
      <Container
        className="p-4 my-4 text-bg-secondary text-white"
        style={{ fontFamily: "Playfair Display" }}
      >
        <Row>
          <Col>
            <Card.Header>
              <Card.Title className="m-4">
                <h1> {reparacao.caso}</h1>
              </Card.Title>
            </Card.Header>
          </Col>
        </Row>
      </Container>
      <Container
        className="bg-light border"
        style={{ fontFamily: "Playfair Display" }}
      >
        <Row>
          <Col style={{ textAlign: "justify" }} sm={10}>
            <h6> {reparacao.reparacao}</h6>
          </Col>
          <Col sm={2}>
            <h5>
              <strong>Status Atual:</strong> <br />{" "}
              {reparacao.estado_cumprimento}
            </h5>
          </Col>
        </Row>
      </Container>
      <Container
        style={{ fontFamily: "Playfair Display", marginBottom: "2rem" }}
      >
        <AddInfoReparacoes
          apiURL={apiURL}
          form={form}
          setForm={setForm}
          id={id}
          reparacao={reparacao}
          setReparacao={setReparacao}
        />
      </Container>
      <Container style={{ fontFamily: "Playfair Display" }}>
        {isLoading && <Spinner className="mt-4" animation="border" />}
        {!isLoading && <Container>{allInfos}</Container>}
      </Container>
    </>
  );
}

export default ReparacoesDetails;
