import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../api/api";
import styles from "../../p2-style.module.css";

function AddInfoReparacoes({ id, setReparacao }) {
  const [form, setForm] = useState({
    // tribunal: "",
    unidade_judiciaria: "",
    infos_relevantes: "",
    notificar_estado_cumprimento: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/info/${id}`, form);

      // console.log(form);

      const response = await api.get(`/reparacao/${id}`);
      setReparacao(response.data);

      setForm({
        // tribunal: "",
        unidade_judiciaria: "",
        infos_relevantes: "",
        notificar_estado_cumprimento: "",
      });

      toast.success("Novas informações cadastradas!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <h2 className={styles.listForm}>
        Novas informações sobre Medida de Reparação
      </h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            {/* <Form.Group className="mb-3">
              <Form.Label>Tribunal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira o nome do Tribunal de origem da informação"
                name="tribunal"
                value={form.tribunal}
                onChange={handleChange}
              />
            </Form.Group> */}
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Unidade Judiciária</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira a unidade Judiciária prestadora das informações"
                name="unidade_judiciaria"
                value={form.unidade_judiciaria}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Informações sobre a medida de reparacao</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Insira as informações relevantes sobre o cumprimento da Medida de Reparação"
                name="infos_relevantes"
                value={form.infos_relevantes}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>
                Notificar Alteração/Manutenção do Status de Cumprimento
              </Form.Label>
              <Form.Select
                name="notificar_estado_cumprimento"
                onChange={handleChange}
              >
                <option value="0">Selecione uma opção</option>
                <option value="Pendente de cumprimento">
                  Pendente de cumprimento
                </option>
                <option value="Cumprida">Cumprida</option>
                <option value="Parcialmente cumprida">
                  Parcialmente cumprida
                </option>
                <option value="Descumprida">Descumprida</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button className="mt-4" variant="success" type="submit">
          Cadastrar informação
        </Button>
      </Form>
    </Container>
  );
}

export default AddInfoReparacoes;
