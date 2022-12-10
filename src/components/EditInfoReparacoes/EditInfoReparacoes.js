import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function EditInfoReparacoes({
  id,
  apiURL,
  reparacao,
  setReparacao,
  infoIndex,
}) {
  const [form, setForm] = useState({
    tribunal: "",
    unidade_judiciaria: "",
    cargo_informante: "",
    infos_relevantes: "",
    notificar_status_cumprimento: "",
  });

  // uso do modal
  const [show, setShow] = useState(false);

  //alteração do modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // -------- USE EFFECT PARA REQUISIÇÃO --------
  useEffect(() => {
    const fetchReparacao = async () => {
      const response = await axios.get(`${apiURL}/${id}`);
      console.log(response.data);
      setForm(response.data.infos_cumprimento[infoIndex]);
    };
    fetchReparacao();
  }, [apiURL, id]);

  // monitoramento dos inputs do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  // envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const clone = { ...reparacao };

      delete clone._id;

      clone.infos_cumprimento.splice(infoIndex, 1, form);
      // clone.infos_cumprimento.push(form);

      console.log(clone);

      await axios.put(`${apiURL}/${id}`, clone);

      const response = await axios.get(`${apiURL}/${id}`);
      setReparacao(response.data);

      setShow(false);

      toast.success(
        "Informação sobre cumprimento de medidas atualizada com sucesso!",
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
    } catch (error) {
      console.log(error);
      toast.error("Não foi possível atualizar a informação de cumprimento", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  // renderização
  return (
    <div style={{ fontFamily: "Playfair Display" }}>
      <Button variant="primary" onClick={handleShow}>
        Editar Informação
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        style={{ fontFamily: "Playfair Display" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Editar informações sobre cumprimento de medidas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tribunal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira o nome do Tribunal de origem da informação"
                name="tribunal"
                value={form.tribunal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Unidade Judiciária</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira a Unidade Judiciária prestadora das informações"
                name="unidade_judiciaria"
                value={form.unidade_judiciaria}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cargo do responsável pelas informações</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira o Cargo do Responsável"
                name="cargo_informante"
                value={form.cargo_informante}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Informações Relevantes sobre o Cumprimento
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Insira as informações relevantes sobre o cumprimento da Medida de Reparação"
                name="infos_relevantes"
                value={form.infos_relevantes}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Notificar Alteração/Manutenção do Status de Cumprimento
              </Form.Label>
              <Form.Select
                name="notificar_status_cumprimento"
                onChange={handleChange}
              >
                <option value="0">Selecione uma opção</option>
                <option value="Pendente de cumprimento">
                  Pendente de Cumprimento
                </option>
                <option value="Cumprida">Cumprida</option>
                <option value="Parcialmente cumprida">
                  Parcialmente Cumprida
                </option>
                <option value="Descumprida">Descumprida</option>
              </Form.Select>
            </Form.Group>
            <Button className="mt-4" variant="success" type="submit">
              Atualizar Informação
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EditInfoReparacoes;
