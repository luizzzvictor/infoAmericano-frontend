import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import styles from "../p2-style.module.css";



function VitCaso() {
  return (
    <Container  variant="light" className= { styles.inicial } style={{width: "80%"}}>
    <p> O pronto cumprimento das medidas de reparação às vítimas com apoio de seus representantes é a base norteadora deste sistema.</p>
    <p> Desta forma, este espaço é reservado exclusivamente para esclarecer o estado atual do seu caso e permitir a denúncia de qualquer obstáculo ou dificuldade que tenha sido cometida pelos órgãos responsáveis pelo atendimento das medidas.</p>
    <p> Este ambiente é protegido e toda informação que for cadastrada será visualizada exclusivamente pelo administrador do sistema.</p>
    <p> Utilize o formulário abaixo e informe com detalhes o que está prejudicando o cumprimento das medidas de seu caso.</p>


// render Form para descrição do caso e lançamento da denúncia


    </Container>
  );
}

export default VitCaso;
