import api from "../api/api.js";
import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'

function Orgaos() {

  // Matriz de dados carregada da base de dados
  const [mOrgaos, setOrgaos] = useState([]);
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
    lerOrgaos()
  }, [])  

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerOrgaos = () => {
    try {
      const fetchOrgaos = async () => {
          const response = await api.get("/orgao/getall")
          //let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          let tempData = [...response.data]
          setOrgaos(tempData)
          setIsLoading(false)
      }
      fetchOrgaos()
    } catch (error) {
      console.log(error)
    }
  }

  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const preparaFormNova = () => {
    handleShow();
    setForm({ 
        NOM_ORGAO: "", 
        SEQ_ORGAO: 0, 
        SEQ_MUNICIPIO: 0, 
    });
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo orgão
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraOrgao = (id) => {
    try {
      setIsLoading(true)
      const fetchOrgaos = async () => {
          const response = await api.get(`/orgao/getid/${id}`)
          setForm({
            _id:       response.data._id,
            NOM_ORGAO:      response.data.NOM_ORGAO, 
            SEQ_ORGAO:    response.data.SEQ_ORGAO, 
            SEQ_MUNICIPIO: response.data.SEQ_MUNICIPIO, 
          });
          setStatusAlt(true)
          handleShow()
          setIsLoading(false)
      }
      fetchOrgaos()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo orgão
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteOrgao = (id) => {
    try {
      setIsLoading(true)
      const fetchOrgaos = async () => {
          await api.delete(`/orgao/deleteid/${id}`)
          lerOrgaos()
      }
      fetchOrgaos()
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

  // dispara quando o orgão clica em "GRAVAR" no Formulário (alteração ou inclusão)
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
          await api.put(`/orgao/replaceid/${form._id}`, clone)
        } else {
          console.log(form)
          await api.post("/orgao/insert", form)
        }        
        lerOrgaos()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  // prepara na variável "renderOrgaos"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderOrgaos = mOrgaos
  .filter((Orgao) => Orgao.NOM_ORGAO.toLowerCase().includes(search.toLowerCase()))
  .map((Orgao) => {
      return (
          <tr key={Orgao._id}>
              
              <td className="p-1 text-start">{Orgao.NOM_ORGAO}</td>
              <td className="p-1 text-center">{Orgao.SEQ_ORGAO}</td>
              <td className="p-1">{Orgao.SEQ_MUNICIPIO}</td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { alteraOrgao(Orgao._id) } }>
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { deleteOrgao(Orgao._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>

          </tr>
      )
  })

  const classifica = (property, type) => {
    let xOrgaos = [...mOrgaos];
    if ( type === 'number') {
      if ( parseInt(xOrgaos[0][property]) > parseInt(xOrgaos[xOrgaos.length-1][property]) ) {
        xOrgaos.sort( (a,b) => parseInt(a[property]) > parseInt(b[property]) ? 1 : -1 )
      } else {
        xOrgaos.sort( (a,b) => parseInt(a[property]) < parseInt(b[property]) ? 1 : -1 )
      }
    } else {
      if ( xOrgaos[0][property].toLowerCase() > xOrgaos[xOrgaos.length-1][property].toLowerCase() ) {
        xOrgaos.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1 )
      } else {
        xOrgaos.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1 )
      }
    }
    setOrgaos(xOrgaos);
  }

  return (

    <div className="Orgaos">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            {/* Mostra, também, o botão de ADICIONAR um REGISTRO NOVO */}
            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ preparaFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar Órgão"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
            </Form>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar Órgão</p> }
                      { !statusAlt && <p>Novo Órgão</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Nome: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o nome do Órgão"
                                name="NOM_ORGAO" value={form.NOM_ORGAO} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Código: </Form.Label>
                            <Form.Control type="number"
                                placeholder="Insira o Código do Órgão"
                                name="SEQ_ORGAO" value={form.SEQ_ORGAO} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Código do Município: </Form.Label>
                            <Form.Control type="number"
                                placeholder="Insira o Código do município do Órgão"
                                name="SEQ_MUNICIPIO" value={form.SEQ_MUNICIPIO} onChange={handleChange}
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
                            <th onClick={ () => classifica('NOM_ORGAO','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Nome</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('SEQ_ORGAO','number') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Codigo</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('SEQ_MUNICIPIO','number') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>Código Município</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>

                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderOrgaos } 
                    </tbody>
                </Table>
            }

        </Container>
    
    </div>

  );

}

export default Orgaos;

// ---------------------------------------------------------------------//
