//import { Button, Col, Container, Card, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
//import { Link, useNavigate } from "react-router-dom";
//import { useEffect, useContext, useState } from "react";
import { useEffect, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
//import api from "../api/api";

function LogoutPage() {
  const navigate = useNavigate();

  const { setLoggedInUser } = useContext(AuthContext);
  //const [user, setUser] = useState({});
  //const [form, setForm] = useState({
    //name: "",
  //});
  //const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        //const response = await api.get("/user/profile");
        //setUser(response.data);
        //setForm({ name: response.data.name });
        signOut()
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  });

  function signOut() {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    navigate("/");
  }

  return (
    <div>  
    </div>
  );
}

export default LogoutPage;