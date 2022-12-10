import React from "react";
import { Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../p2-style.module.css";

function Apresentacao(props) {
  const navigate = useNavigate()
  return (
    <Container  style={{width: "80%"}}>
      <Alert key={1} variant="light" className= { styles.inicial }>
        A plataforma <b>InfoAmericano</b> monitora as informações prestadas pelo
        <em>
          <b> Poder Judiciário brasileiro</b>
        </em>{" "}
        acerca do cumprimento das medidas de reparação ordenadas pela{" "}
        <em>
          <b>Corte Interamericana de Direitos Humanos</b>
        </em>{" "}
        nos casos relacionados ao Estado brasileiro.
        <br /> <br /> Os dados dispostos na página{" "}
        <Alert.Link onClick={()=> navigate('/reparacoes')}>Medidas de Reparação por Caso</Alert.Link>{" "}
        baseiam-se nas Resoluções emitidas pelo Tribunal Interamericano e
        dispostas na página{" "}
        <Alert.Link href="https://www.corteidh.or.cr/casos_en_supervision_por_pais.cfm?lang=pt">
          página institucional
        </Alert.Link>{" "} da Corte IDH.        
      </Alert>
    </Container>
  );
}

export default Apresentacao;
