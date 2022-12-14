import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import EditInfoReparacoes from "../EditInfoReparacoes/EditInfoReparacoes";
import AddInfoReparacoes from "../AddInfoReparacoes/AddInfoReparacoes";
import api from "../../api/api";
import * as moment from "moment/moment.js";
import "moment/locale/pt-br";

import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import generatePDF from "../../services/reportGenerator";
import styles from "../../p2-style.module.css";


function ReparacoesDetails() {
  const { loggedInUser } = useContext(AuthContext);

  const [reparacao, setReparacao] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // console.log(loggedInUser)

  // -------- USE EFFECT PARA REQUISIÇÃO --------
  useEffect(() => {
    try {
      const fetchReparacao = async () => {
        // const response = await axios.get(`${apiURL}/${id}`);
        const response = await api.get(`/reparacao/${id}`);

        setReparacao(response.data);
        setIsLoading(false);
      };
      fetchReparacao();
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  function rendEdit(info, index) {
    if (!loggedInUser) {
      // console.log("Usuário não logado!")
    } else {
      if (
        loggedInUser.user._id === info.usuario_informante._id ||
        loggedInUser.user.role === "admin"
      ) {
        return (
          <EditInfoReparacoes
            id={id}
            setReparacao={setReparacao}
            infoIndex={index}
          />
        );
      }
    }
  }
  function rendDel(info, index) {
    if (!loggedInUser) {
      // console.log("Usuário não logado!")
    } else {
      if (
        loggedInUser.user._id === info.usuario_informante._id ||
        loggedInUser.user.role === "admin"
      ) {
        return (
          <Button variant="danger" onClick={() => deleteReparacao(index)}>
            Excluir Informação sobre Cumprimento
          </Button>
        );
      }
    }
  }

  // -------- FUNÇÃO PARA DELETAR ITEM --------
  const deleteReparacao = async (index) => {
    const response = await api.get(`reparacao/${id}`);
    const idDaInfo = response.data.infos_cumprimento[index]._id;
    // console.log(idDaInfo);
    await api.delete(`/info/${idDaInfo}`);

    const reRender = await api.get(`reparacao/${id}`);
    setReparacao(reRender.data);

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
                <h3 style={{fontSize: "1.2rem"}}> Informações dos Responsáveis sobre o Cumprimento</h3>
              </Card.Title>
            </Card.Header>
            <Container style={{ display: "flex", fontSize: "14px" }}>
              <p>
                Informação prestada em {moment(info.createdAt).format("LLL")}
              </p>
            </Container>
            <Card.Body>
              <Row>
                <Col className="text-center">
                  <Card.Text>
                    <strong> Tribunal Informante:</strong> <br />
                    {info.usuario_informante.orgao[0].NOM_ORGAO}
                  </Card.Text>
                  <Card.Text>
                    <strong> Usuário Responsável por prestar Informação</strong>{" "}
                    <br />
                    {info.usuario_informante.name}
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
                    {info.notificar_estado_cumprimento}
                  </Card.Text>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>{rendEdit(info, index)}</Col>
                <Col>
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Voltar
                  </Button>
                </Col>
                <Col>{rendDel(info, index)}</Col>
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
                <h1> {reparacao.nome_caso}</h1>
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
      <Container style={{marginTop: "10px", display: "flex", justifyContent:"flex-end"}}>
        <button
          className="btn btn-primary"
          onClick={() => generatePDF(reparacao)}
        >
          Gerar Relatório Gerencial
        </button>      
        
      </Container>
      <Container
        style={{ fontFamily: "Playfair Display", marginBottom: "2rem" }}
      >
        {loggedInUser && (
          <AddInfoReparacoes id={id} setReparacao={setReparacao} />
        )}
      </Container>
      <Container style={{display: "flex"}} >
      <Row>
        <h4 className={styles.listaFull}>Histórico de Informações prestadas</h4>          
      </Row>      
      </Container>
      <Row>
      <hr className={styles.divider}></hr>   

      </Row>
      <Container style={{ fontFamily: "Playfair Display" }}>
        {isLoading && <Spinner className="mt-4" animation="border" />}
        {!isLoading && <Container>{allInfos}</Container>}
      </Container>
    </>
  );
}

export default ReparacoesDetails;
