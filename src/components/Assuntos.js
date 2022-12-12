import api from "../api/api.js";
import { useEffect, useState, useContext } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'

import { AuthContext } from "../contexts/authContext";

function Assuntos() {

  const { setLoggedInUser } = useContext(AuthContext);

  // Matriz de dados carregada da base de dados
  const [mAssuntos, setAssuntos] = useState([]);
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
  const handleClose = () => { setShow(false); setStatusAlt(false); };
  // Função que Abre a JANELA MODAL
  const handleShow  = () => setShow(true);

  // Faz com que a função de Leitura dos dados só aconteça na primeira vez que o código for executado
  useEffect(() => {
    lerAssuntos()
  }, [])  

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerAssuntos = () => {
    try {
      const fetchAssuntos = async () => {
          const response = await api.get("/assunto/getall")
          //let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          let tempData = [...response.data]
          setAssuntos(tempData)
          setIsLoading(false)
      }
      fetchAssuntos()
    } catch (error) {
      console.log(error)
    }
  }

  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const preparaFormNova = () => {
    handleShow();
    setForm({ 
        palavra_chave: "", 
        codigo: "", 
    });
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo assunto
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraAssunto = (id) => {
    try {
      setIsLoading(true)
      const fetchAssuntos = async () => {
          const response = await api.get(`/assunto/getid/${id}`)
          setForm({
            _id:    response.data._id,
            palavra_chave:   response.data.palavra_chave, 
            codigo: response.data.codigo, 
          });
          setStatusAlt(true)
          handleShow()
          setIsLoading(false)
      }
      fetchAssuntos()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo assunto
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteAssunto = (id) => {
    try {
      setIsLoading(true)
      const fetchAssuntos = async () => {
          await api.delete(`/assunto/deleteid/${id}`)
          lerAssuntos()
      }
      fetchAssuntos()
    } catch (error) {
      console.log(error)
    }
  }

  // executa cada vez que uma tecla é pressionada em um formulário (alteração ou inclusão)
  // copia o novo conteúdo do campo respectivo (já com essa nova tecla) para o respectivo
  // campo na matriz "form"
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  // executa a cada vez que um campo do formulário perder o foco
  // objetivos: verificar a validade, ajustar o campo
  const handleBlur = (e) => {
  }

  // dispara quando o assunto clica em "GRAVAR" no Formulário (alteração ou inclusão)
  // grava o conteúdo ma matriz "form" na base de dados da internet
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  // Fecha a JANELA MODAL do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        if ( statusAlt ) {
          const clone = { ...form }
          delete clone._id
          console.log(clone);
          await api.put(`/assunto/replaceid/${form._id}`, clone)
        } else {
          await api.post("/assunto/insert", form)
        }        
        lerAssuntos()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  // prepara na variável "renderAssuntos"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderAssuntos = mAssuntos
  .filter((Assunto) => Assunto.palavra_chave.toLowerCase().includes(search.toLowerCase()))
  .map((Assunto) => {
      return (
          <tr key={Assunto._id}>
              
              <td className="p-1 text-start">{Assunto.palavra_chave}</td>
              <td className="p-1 text-center">{Assunto.codigo}</td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { alteraAssunto(Assunto._id) } }>
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { deleteAssunto(Assunto._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>

          </tr>
      )
  })

  const classifica = (property, type) => {
    let xAssuntos = [...mAssuntos];
    if ( type === 'number') {
      if ( parseInt(xAssuntos[0][property]) > parseInt(xAssuntos[xAssuntos.length-1][property]) ) {
        xAssuntos.sort( (a,b) => parseInt(a[property]) > parseInt(b[property]) ? 1 : -1 )
      } else {
        xAssuntos.sort( (a,b) => parseInt(a[property]) < parseInt(b[property]) ? 1 : -1 )
      }
    } else {
      if ( xAssuntos[0][property].toLowerCase() > xAssuntos[xAssuntos.length-1][property].toLowerCase() ) {
        xAssuntos.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1 )
      } else {
        xAssuntos.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1 )
      }
    }
    setAssuntos(xAssuntos);
  }

  return (

    <div className="Assuntos">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            {/* Mostra, também, o botão de ADICIONAR um REGISTRO NOVO */}
            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ preparaFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar Assunto"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
            </Form>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar Assunto</p> }
                      { !statusAlt && <p>Novo Assunto</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Nome: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o nome completo do Município"
                                name="palavra_chave" value={form.palavra_chave} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Código: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o Código do Assunto"
                                name="codigo" value={form.codigo} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>

                        <div className="text-center">
                          <Button style={{width: "70%"}} variant="success" type="submit">GRAVAR</Button>
                        </div>

                    </Form>
                 </Modal.Body>

            </Modal>

            {/* Apresenta OU não o componente que indica "carregando dados..." */}
            {isLoading && <Spinner className="" animation="border" />}

            {/* Se não está carregando os DADOS então já mostra na tela (em formato de tabela) */}
            {/* A origem dos dados é a variável render????? construída acima */}
            {!isLoading &&
                <Table className="mt-4" bordered hover>
                    <thead>
                        <tr>
                            <th onClick={ () => classifica('palavra_chave','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Nome</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('codigo','number') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Codigo</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>

                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderAssuntos } 
                    </tbody>
                </Table>
            }

        </Container>
    
    </div>

  );

}

export default Assuntos;

// ---------------------------------------------------------------------//
