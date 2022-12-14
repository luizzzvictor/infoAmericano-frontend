import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";

import ReparacoesList from "./components/ReparacoesList/ReparacoesList";
import ReparacoesDetails from "./components/ReparacoesDetails/ReparacoesDetails";
// import ErrorPage from "./pages/ErrorPage";
// import HomePage from "./pages/HomePage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Apresentacao from "./pages/Apresentacao";
import Sobre from "./pages/Sobre";

import { ToastContainer } from "react-toastify";

import { AuthContextComponent } from "./contexts/authContext";
//import { useContext } from "react";
import ProtectRoute from "./components/ProtectRoute";

import HomePage       from "./pages/HomePage";
import LoginPage      from "./pages/LoginPage";
import LogoutPage     from "./pages/LogoutPage";
import SignUpPage     from "./pages/SignUpPage";
import ErrorPage      from "./pages/ErrorPage";

import NavBar         from "./components/NavBar";

import Usuario        from "./components/Usuarios";
import Municipio      from "./components/Municipios";
import Orgao          from "./components/Orgaos";
import Assunto        from "./components/Assuntos";
import Caso           from "./components/Casos";

/*
import ReparacaoPage  from "./pages/ReparacaoPage";
import InformacaoPage from "./pages/InformacaoPage";
*/

function App() {

  return (
    <div className="App">
      <AuthContextComponent>
        <NavBar />
        <ToastContainer/>
        <NavigationBar />
        <Routes>

          <Route path="/"             element={<HomePage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/logout"       element={<LogoutPage />} />
          <Route path="/sign-up"      element={<SignUpPage />} />

          <Route path="/usuario"      element={<ProtectRoute Component={Usuario} />} />
          <Route path="/municipio"    element={<ProtectRoute Component={Municipio} />} />
          <Route path="/orgao"        element={<ProtectRoute Component={Orgao} />} />
          <Route path="/assunto"      element={<ProtectRoute Component={Assunto} />} />
          <Route path="/caso"         element={<ProtectRoute Component={Caso} />} />

          <Route path="/inicial"        element={<Apresentacao/>} />          
          <Route path="/reparacoes"     element={<ReparacoesList/>} />
          <Route path="/reparacoes/:id" element={<ReparacoesDetails/> } />
          <Route path='/sobre'          element={<Sobre/>} />

          <Route path="*"              element={<ErrorPage />} />          

          {/*
          <Route path="/reparacao"       element={<ProtectRoute Component={ReparacaoPage} />} />
          <Route path="/informacao"      element={<ProtectRoute Component={InformacaoPage} />} />
           */}

          {/* 
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} /> */
          }

        </Routes>
      </AuthContextComponent>
    </div>
  );
}

export default App;
