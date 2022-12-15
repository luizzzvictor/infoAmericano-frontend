import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";

function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefone: "",
    role: "",
    orgao: "",
    caso_correlato: {},
    confirmEmail: true,
    aprovadoUser: true,
    active: true,
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    console.log(form)
  }
  //////////////////////RENDER ORGAOS NO FORM/////////////////////////////////
  const [orgaos, setOrgaos] = useState({});

  useEffect(() => {
    try {
      const fetchReparacao = async () => {
        const response = await api.get(`/orgao/getall-nologin`);

        setOrgaos(response.data);
      };
      fetchReparacao();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const renderizarOrgaos = Array.from(orgaos).map((o) => {
    return <option value={o._id}>{o.NOM_ORGAO}</option>;
  });

  //////////////////////RENDER VÍTIMA/REPRESENTANTE NO FORM/////////////////////////////////
  const [casos, setCasos] = useState({});

  useEffect(() => {
    try {
      const fetchCasos = async () => {
        const response = await api.get(`/casosCorteIDH/`);
        setCasos(response.data);
      };
      fetchCasos();
      console.log(casos);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(casos);

  const renderizarCasoVitima = Array.from(casos).map((nomeCaso) => {
    return <option value={nomeCaso._id}>{nomeCaso.caso}</option>;
  });

  /////////////////////////////////////////////////////////

  async function handleSubmit(e) {
    e.preventDefault();

    //conferir se a senhas estão iguais
    if (form.password !== form.confirmPassword) {
      alert("Senhas incompatíveis");
      return;
    }

    //disparo a requisição de cadastro para o meu servidor
    try {

      if (form.role === "admin" || "prestador" || "interessado") {
        delete form.caso_correlato
      }

      console.log(form);
      await api.post("/usuario/sign-up", { ...form });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container
      style={{ height: "100vh" }}
      className="d-flex flex-column align-items-center justify-content-center"
    >
      <Form className="w-50" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Insira um nome para identificação"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Endereço de e-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="Insira o seu melhor endereço de e-mail"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insira uma senha válida"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirmar senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirme a senha válida criada anteriormente"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Insira seu número de telefone com DDD"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo Usuário: </Form.Label>

          <Form.Select name="role" value={form.role} onChange={handleChange}>
            <option value="">Selecione uma opção</option>
            <option value="admin">Administrador</option>
            <option value="vitima">Vítima</option>
            <option value="interessado">Interessado</option>
            <option value="representante">Representante</option>
            <option value="prestador">
              Autoridade Prestadora de Informação
            </option>
          </Form.Select>
          {/* <Form.Control
            type="text"
            placeholder="admin / prestador / vitima / representante / interessado"
            name="role"
            value={form.role}
            onChange={handleChange}
          /> */}
        </Form.Group>
        {form.role === "vitima" && (
          <Form.Group className="mb-3">
            <Form.Label>Caso Correlato à Vítima ou Representante: </Form.Label>
            <Form.Select
              name="caso_correlato"
              value={form.caso_correlato}
              onChange={handleChange}
            >
              <option value="">Selecione uma opção</option>
              {renderizarCasoVitima}
            </Form.Select>
          </Form.Group>
        )}

        {form.role === "representante" && (
          <Form.Group className="mb-3">
            <Form.Label>Caso Correlato à Vítima ou Representante: </Form.Label>
            <Form.Select
              name="caso_correlato"
              value={form.caso_correlato}
              onChange={handleChange}
            >
              <option value="">Selecione uma opção</option>
              {renderizarCasoVitima}
            </Form.Select>
          </Form.Group>
        )}

        {/* <Form.Group className="mb-3">
          <Form.Label>Código Órgão (CNJ): </Form.Label>
          <Form.Control
            type="text"
            placeholder="Código numérico conforme tabela CNJ"
            name="orgao"
            value={form.orgao}
            onChange={handleChange}
          />
        </Form.Group> */}

        <Form.Group>
          <Form.Label>Tribunal</Form.Label>
          <Form.Select name="orgao" value={form.orgao} onChange={handleChange}>
            <option value="0">Selecione uma opção</option>
            {renderizarOrgaos}
          </Form.Select>
        </Form.Group>

        <Button className="my-3" variant="dark" type="submit">
          Cadastrar usuário
        </Button>
      </Form>
      <Form.Text>
        Já possui cadastro? Faça já o
        <Link className="text-warning fw-bold text-decoration-none" to="/login">
          {" "}
          login
        </Link>
        .
      </Form.Text>
    </Container>
  );
}

export default SignUpPage;
