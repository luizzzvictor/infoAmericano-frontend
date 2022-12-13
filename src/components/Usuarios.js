import api from "../api/api.js";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  Container,
  Form,
  Spinner,
  Table,
  Modal,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faUpDown,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../contexts/authContext";

function Usuarios() {
  const { setLoggedInUser } = useContext(AuthContext);

  // Matriz de dados carregada da base de dados
  const [mUsuarios, setUsuarios] = useState([]);
  // Está carregando dados da Internet?
  const [isLoading, setIsLoading] = useState(true);
  // Variável que guarda a string de busca "pesquisa"
  const [search, setSearch] = useState("");
  // Matriz que guarda os dados do Form (pega os dados INCLUSÃO e ALTERAÇÃO)
  const [form, setForm] = useState([]);
  // Variável que guarda o Status do FORM ativo (se é INCLUSÃO ou ALTERAÇÃO)
  const [statusAlt, setStatusAlt] = useState(false);

  // Variável que guarda o Status da JANELA MODAL (se está visível ou não)
  const [show, setShow] = useState(false);
  // Função que Fecha a JANELA MODAL e desativa STATUS de eventual FORM de Alteração
  const handleClose = () => {
    setShow(false);
    setStatusAlt(false);
  };
  // Função que Abre a JANELA MODAL
  const handleShow = () => setShow(true);

  // Faz com que a função de Leitura dos dados só aconteça na primeira vez que o código for executado
  useEffect(() => {
    lerUsuarios();
  }, []);

  //////////////////////RENDER ORGAOS NO FORM/////////////////////////////////
  const [orgaos, setOrgaos] = useState({});

  useEffect(() => {
    try {
      const fetchReparacao = async () => {
        // const response = await axios.get(`${apiURL}/${id}`);
        const response = await api.get(`/orgao/getall-nologin`);

        setOrgaos(response.data);
        // console.log(Array.from(orgaos))
      };
      fetchReparacao();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(mUsuarios)

  const renderizarOrgaos = Array.from(orgaos).map((o) => {
    return <option value={o._id}>{o.NOM_ORGAO}</option>;
  });

  /////////////////////////////////////////////////////////

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerUsuarios = () => {
    try {
      const fetchUsuarios = async () => {
        const response = await api.get("/usuario/getall");
        //let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
        let tempData = [...response.data];
        setUsuarios(tempData);
        setIsLoading(false);
      };
      fetchUsuarios();
    } catch (error) {
      console.log(error);
    }
  };

  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const preparaFormNova = () => {
    handleShow();
    setForm({
      name: "",
      email: "",
      passwordHash: "",
      telefone: "",
      role: "",
      orgao: "",
      confirmEmail: true,
      aprovadoUser: true,
      active: true,
    });
  };

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo usuário
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraUsuario = (id) => {
    try {
      setIsLoading(true);
      const fetchUsuarios = async () => {
        const response = await api.get(`/usuario/getid/${id}`);
        console.log(response)
        setForm({
          name: response.data.name,
          _id: response.data._id,
          email: response.data.email,
          telefone: response.data.telefone,
          role: response.data.role,
          orgao: response.data.orgao,
          confirmEmail: response.data.confirmEmail,
          aprovadoUser: response.data.aprovadoUser,
          active: response.data.active,
        });
        setStatusAlt(true);
        handleShow();
        setIsLoading(false);
      };
      fetchUsuarios();
    } catch (error) {
      console.log(error);
    }
  };

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo usuário
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteUsuario = (id) => {
    try {
      setIsLoading(true);
      const fetchUsuarios = async () => {
        await api.delete(`/usuario/deleteid/${id}`);
        lerUsuarios();
      };
      fetchUsuarios();
    } catch (error) {
      console.log(error);
    }
  };

  // executa cada vez que uma tecla é pressionada em um formulário (alteração ou inclusão)
  // copia o novo conteúdo do campo respectivo (já com essa nova tecla) para o respectivo
  // campo na matriz "form"
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // executa a cada vez que um campo do formulário perder o foco
  // objetivos: verificar a validade, ajustar o campo
  const handleBlur = (e) => {};

  // dispara quando o usuário clica em "GRAVAR" no Formulário (alteração ou inclusão)
  // grava o conteúdo ma matriz "form" na base de dados da internet
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  // Fecha a JANELA MODAL do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (statusAlt) {
        const clone = { ...form };
        delete clone._id;
        console.log(clone);
        await api.put(`/usuario/replaceid/${form._id}`, clone);
      } else {
        await api.post("/usuario/insert", form);
      }
      lerUsuarios();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  // prepara na variável "renderUsuarios"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderUsuarios = mUsuarios
    .filter((Usuario) =>
      Usuario.name.toLowerCase().includes(search.toLowerCase())
    )
    .map((Usuario) => {
      return (
        <tr key={Usuario._id}>
          <td className="p-1">{Usuario.name}</td>
          <td className="p-1">{Usuario.email}</td>
          <td className="p-1">{Usuario.telefone}</td>
          <td className="p-1">{Usuario.role}</td>
          <td className="p-1">{Usuario.orgao[0].NOM_ORGAO}</td>
          <td className="p-1">{Usuario.confirmEmail}</td>
          <td className="p-1">{Usuario.aprovadoUser}</td>
          <td className="p-1">{Usuario.active}</td>

          <td className="p-1 text-center">
            <Button
              className="p-0"
              variant=""
              onClick={(event) => {
                alteraUsuario(Usuario._id);
              }}
            >
              <FontAwesomeIcon style={{ color: "blue" }} icon={faPen} />
            </Button>
          </td>

          <td className="p-1 text-center">
            <Button
              className="p-0"
              variant=""
              onClick={(event) => {
                deleteUsuario(Usuario._id);
              }}
            >
              <FontAwesomeIcon style={{ color: "red" }} icon={faTrash} />
            </Button>
          </td>
        </tr>
      );
    });

  const classifica = (property, type) => {
    let xUsuarios = [...mUsuarios];
    if (type === "number") {
      if (
        parseInt(xUsuarios[0][property]) >
        parseInt(xUsuarios[xUsuarios.length - 1][property])
      ) {
        xUsuarios.sort((a, b) =>
          parseInt(a[property]) > parseInt(b[property]) ? 1 : -1
        );
      } else {
        xUsuarios.sort((a, b) =>
          parseInt(a[property]) < parseInt(b[property]) ? 1 : -1
        );
      }
    } else {
      if (
        xUsuarios[0][property].toLowerCase() >
        xUsuarios[xUsuarios.length - 1][property].toLowerCase()
      ) {
        xUsuarios.sort((a, b) =>
          a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1
        );
      } else {
        xUsuarios.sort((a, b) =>
          a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1
        );
      }
    }
    setUsuarios(xUsuarios);
  };

  return (
    <div className="Usuarios">
      <Container>
        {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
        {/* Mostra, também, o botão de ADICIONAR um REGISTRO NOVO */}
        <Form className="my-4 d-flex">
          <Button variant="" onClick={preparaFormNova}>
            <FontAwesomeIcon style={{ color: "blue" }} icon={faPlus} />
          </Button>
          <Form.Control
            type="search"
            placeholder="Procurar Usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>

        {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
        <Modal show={show} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>
              {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
              {statusAlt && <p>Alterar Usuario</p>}
              {!statusAlt && <p>Novo Usuario</p>}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 lh-1 fw-bold">
                <Form.Label>Nome: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o nome completo do Usuário"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <Form.Group className="mb-3 lh-1 fw-bold">
                <Form.Label>E-mail: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o E-mail funcional do Usuario"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <Form.Group className="mb-3 lh-1 fw-bold">
                <Form.Label>Telefone: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o telefone (com DDD) do Usuario"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <Form.Group className="mb-3 lh-1 fw-bold">
                <Form.Label>Tipo do Usuário: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="admin, prestador, interessado, vitima, representante"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
              {/* <Form.Group className="mb-3 lh-1 fw-bold">
                <Form.Label>Nome do Órgão: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome do Tribunal"
                  name="orgao"
                  value={form.orgao}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group> */}
              <Form.Group>
                <Form.Label>Tribunal</Form.Label>
                <Form.Select
                  name="orgao"
                  value={form.orgao}
                  onChange={handleChange}
                >
                  <option value="0">Selecione uma opção</option>
                  {renderizarOrgaos}
                </Form.Select>
              </Form.Group>

              <div className="row">
                <div className="col-4">
                  <Form.Group
                    className="mb-3 lh-1 fw-bold"
                    style={{ width: "120px" }}
                  >
                    <Form.Label>E-mail Conf</Form.Label>
                    <Form.Control
                      type="text"
                      name="confirmEmail"
                      value={form.confirmEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-4">
                  <Form.Group
                    className="mb-3 lh-1 fw-bold"
                    style={{ width: "120px" }}
                  >
                    <Form.Label>Usuário Aprov.</Form.Label>
                    <Form.Control
                      type="text"
                      name="aprovadouser"
                      value={form.aprovadoUser}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className="col-4">
                  <Form.Group
                    className="mb-3 lh-1 fw-bold"
                    style={{ width: "120px" }}
                  >
                    <Form.Label>Ativo</Form.Label>
                    <Form.Control
                      type="text"
                      name="active"
                      value={form.active}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="text-center">
                <Button
                  style={{ width: "70%" }}
                  variant="success"
                  type="submit"
                >
                  GRAVAR
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Apresenta OU não o componente que indica "carregando dados..." */}
        {isLoading && <Spinner className="" animation="border" />}

        {/* Se não está carregando os DADOS então já mostra na tela (em formato de tabela) */}
        {/* A origem dos dados é a variável render????? construída acima */}
        {!isLoading && (
          <Table className="mt-4" bordered hover>
            <thead>
              <tr>
                <th
                  onClick={() => classifica("name", "text")}
                  className="text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">Nome</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("email", "text")}
                  className="text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">E-mail</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("telefone", "text")}
                  className=" text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">Telefone</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("role", "text")}
                  className=" text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">Tipo</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("orgao", "text")}
                  className=" text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">Cod. Órgão</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("ConfirmEmail", "text")}
                  className=" text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">E-mail Conf.</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("aprovadoUser", "text")}
                  className=" text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">Usuário Aprov.</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>
                <th
                  onClick={() => classifica("active", "text")}
                  className=" text-center"
                >
                  <div className="d-flex">
                    <div className="col-11">Usuário Ativo.</div>
                    <div className="col-1">
                      {" "}
                      <FontAwesomeIcon
                        style={{ color: "blue" }}
                        icon={faUpDown}
                      />{" "}
                    </div>
                  </div>
                </th>

                <th className=" text-center">A</th>
                <th className=" text-center">E</th>
              </tr>
            </thead>
            <tbody>{renderUsuarios}</tbody>
          </Table>
        )}
      </Container>
    </div>
  );
}

export default Usuarios;

// ---------------------------------------------------------------------//
