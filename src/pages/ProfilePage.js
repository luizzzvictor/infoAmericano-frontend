import { Button, Col, Container, Card, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import api from "../api/api";
// import EditUser from "../components/EditUser";

function ProfilePage() {
  const navigate = useNavigate();

  const { loggedInUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    name: "",
  });
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get("/usuario/profile");
        setUser(response.data);
        setForm({ name: response.data.name });
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  }, [reload]);

  const [orgao, setOrgao] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await api.get(`usuario/profileNV`);
        setOrgao(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, []);

  const [infosPrestadas, setInfosPrestadas] = useState();
  const [isLoading2, setIsLoading2] = useState(true);

  useEffect(() => {
    async function fetchInfosData() {
      try {
        const response = await api.get(`info/getinfosprestadas`);
        setInfosPrestadas(response.data);
        setIsLoading2(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchInfosData();
  }, []);

  async function handleDeleteUser() {
    try {
      await api.delete("/user/delete");
    } catch (error) {
      console.log(error);
      alert("Algo deu errado no delete do user");
    }
  }

  const renderRoleName = () => {
    if (user.role === "admin") {
      return "Administrador";
    }
    if (user.role === "vitima") {
      return "Vítima";
    }
    if (user.role === "prestador") {
      return "Autoridade Prestadora de Informação";
    }
    if (user.role === "interessado") {
      return "Interessado";
    }
    if (user.role === "representante") {
      return "Representante";
    }
  };

  return (
    <div>
      <Container className="mt-5">
        <Row className="align-items-center mb-5">
          <Col>
            <Card>
              <h4 style={{ marginTop: "15px" }}>{user.name}</h4>
              <p>
                <strong>E-mail:</strong> {user.email}
              </p>
              <p>
                <strong>Tribunal:</strong> {orgao}
              </p>
              <p>
                <strong>Perfil:</strong> {renderRoleName()}
              </p>
            </Card>
          </Col>
          <Col>
            <h5>
              {" "}
              Você possui{" "}
              <strong style={{ color: "green" }}>
                {" "}
                {isLoading2 && (
                  <Spinner className="mt-4" animation="border" />
                )}{" "}
                {!isLoading2 && infosPrestadas.length} Informações
              </strong>{" "}
              prestadas sobre Medidas de Reparação outorgadas pela Corte IDH.
            </h5>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="danger" onClick={handleDeleteUser}>
              Excluir perfil
            </Button>
          </Col>
          <Col>            
              <Button
                variant="dark"
                onClick={() => {
                  navigate(`/profile/infos`);
                }}
              >
                Ver Informações
              </Button>       
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProfilePage;
