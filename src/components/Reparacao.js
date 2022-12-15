import api from "../api/api.js";
import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'

function Reparacoes() {

  // Matriz de dados carregada da base de dados
  const [mReparacoes, setReparacoes] = useState([]);
  // Está carregando dados da Internet?
  const [isLoading, setIsLoading] = useState(true);
  // Variável que guarda a string de busca "pesquisa"
  const [search, setSearch] = useState("");
  // Matriz que guarda os dados do Form (pega os dados INCLUSÃO e ALTERAÇÃO)
  const [form, setForm] = useState([]);
  // Variável que guarda o Status do FORM ativo (se é INCLUSÃO ou ALTERAÇÃO)
  const [statusAlt, setStatusAlt] = useState(false);
  
  const [mCasos, setCasos] = useState([]);
  const [mFiltroProcessos, setFiltroProcesso] = useState("Todos");

  // Variável que guarda o Status da JANELA MODAL (se está visível ou não)
  const [show, setShow] = useState(false);
  // Função que Fecha a JANELA MODAL e desativa STATUS de eventual FORM de Alteração
  const handleClose = () => { setShow(false); setStatusAlt(false); };
  // Função que Abre a JANELA MODAL
  const handleShow  = () => setShow(true);

  // Faz com que a função de Leitura dos dados só aconteça na primeira vez que o código for executado
  useEffect( () => {
    lerBDbasico()
    // depois de chamar lerBDbasico continua a execução (sem esperar retorno da função acima)
  })

  async function lerBDbasico () {
    const retReparacoes = await lerReparacoes()
    console.log(mReparacoes)
    const retCasos = await lerCasos()
    setIsLoading(false)
    setReparacoes(retReparacoes)
    setCasos(retCasos)
  }

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerReparacoes = async () => {
    try {
      const fetchReparacoes = async () => {
          const response = await api.get("/reparacao")
          const tempData = [...response.data]
          return tempData
      }
      return await fetchReparacoes()
    } catch (error) {
      console.log(error)
    }
  }

  const lerCasos = async () => {
    try {
      const fetchCasos = async () => {
          const response = await api.get("/casosCorteIDH")
          const tempData = [...response.data]
          return tempData
      }
      return await fetchCasos()
    } catch (error) {
      console.log(error)
    }
  }

  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const preparaFormNova = () => {
    handleShow();
    setForm({ 
        caso: "",
        nome_caso: "",
        reparacao: "",
        estado_cumprimento: "Descumprida",
        resolucao_sup_declaratoria: "",
        infos_cumprimento: [],
    });
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo reparacao
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraReparacao = async (id) => {
    try {
      setIsLoading(true)
      const fetchReparacoes = async () => {
          const response = await api.get(`/reparacao/${id}`)
          setForm({
            _id: response.data._id,
            caso: response.data.caso,
            nome_caso: response.data.nome_caso,
            reparacao: response.data.reparacao,
            estado_cumprimento: response.data.cumrpimento,
            resolucao_sup_declaratoria: response.data.resolucao_sup_declaratoria,
            infos_cumprimento: response.data.infos_cumprimento,
          });
          setStatusAlt(true)
      }
      await fetchReparacoes()
      setIsLoading(false)      
      handleShow()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo reparacao
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteReparacao = async (id) => {
    try {
      setIsLoading(true)
      const fetchReparacoes = async () => {
          await api.delete(`/reparacao/delete/${id}`)
      }
      await fetchReparacoes()
      await lerBDbasico()
    } catch (error) {
      console.log(error)
    }
  }

  // executa cada vez que uma tecla é pressionada em um formulário (alteração ou inclusão)
  // copia o novo conteúdo do campo respectivo (já com essa nova tecla) para o respectivo
  // campo na matriz "form"
  const handleChange = (e) => {
    console.log("----------------------------")
    setForm({...form, [e.target.name]: e.target.value})
    if ( e.target.name === "caso" ) {
      // console.log("--e.target.name : ",e.target.name)
      // console.log("--e.target.value: ",e.target.value)
      // console.log("--opcao selecionada valor: ",e.target.options[e.target.selectedIndex].value)
      // console.log("--opcao selecionada texto: ",e.target.options[e.target.selectedIndex].text)
      const obj = { "nome_caso": e.target.options[e.target.selectedIndex].text, 
        "caso": e.target.options[e.target.selectedIndex].value 
      }
      setForm({...form, ...obj } )
    }
  }

  // executa a cada vez que um campo do formulário perder o foco
  // objetivos: verificar a validade, ajustar o campo
  const handleBlur = (e) => {
  }

  // dispara quando o reparacao clica em "GRAVAR" no Formulário (alteração ou inclusão)
  // grava o conteúdo ma matriz "form" na base de dados da internet
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  // Fecha a JANELA MODAL do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()
    handleClose()
    //console.log("estou em handleSubmit")
    setIsLoading(true)
    try {
        if ( statusAlt ) {
          const clone = { ...form }
          delete clone._id
          //console.log(clone);
          await api.put(`/reparacao/edit/${form._id}`, clone)
          await lerBDbasico()
        } else {
          //const clone = {...form, nome_caso: "xxxx" }

          //console.log("======================")
          //console.log("versão antes gravar:",form)
          await api.post(`/reparacao/create/${form.caso}`, form)
          await lerBDbasico()
        }        
    } catch (error) {
        console.log(error)
    }
  }

  // prepara na variável "renderReparacoes"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR 
  const renderReparacoes = mReparacoes
  .filter((Reparacao) => Reparacao.nome_caso.toLowerCase().includes(search.toLowerCase()))
  .filter((Reparacao) => mFiltroProcessos === Reparacao.caso._id || mFiltroProcessos === "Todos" ) 
  .map((Reparacao) => {
      return (
          <tr key={Reparacao._id}>
              
              <td className="p-1 text-start">{Reparacao.nome_caso}</td> 
              <td className="p-1 text-start">{Reparacao.reparacao}</td>
              <td className="p-1 text-start">{Reparacao.estado_cumprimento}</td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { alteraReparacao(Reparacao._id) } }>
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { deleteReparacao(Reparacao._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>

          </tr>
      )
  })

  const classifica = (property, type) => {
    let xReparacoes = [...mReparacoes];
    if ( type === 'number') {
      if ( parseInt(xReparacoes[0][property]) > parseInt(xReparacoes[xReparacoes.length-1][property]) ) {
        xReparacoes.sort( (a,b) => parseInt(a[property]) > parseInt(b[property]) ? 1 : -1 )
      } else {
        xReparacoes.sort( (a,b) => parseInt(a[property]) < parseInt(b[property]) ? 1 : -1 )
      }
    } else {
      if ( xReparacoes[0][property].toLowerCase() > xReparacoes[xReparacoes.length-1][property].toLowerCase() ) {
        xReparacoes.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1 )
      } else {
        xReparacoes.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1 )
      }
    }
    setReparacoes(xReparacoes);
  }

  const renderizarOptionsCasos = Array.from(mCasos).map((o) => {
    return <option key={o._id} value={o._id}>{o.caso}</option>;
  });

  return (

    <div className="Reparacoes">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            {/* Mostra, também, o botão de ADICIONAR um REGISTRO NOVO */}
            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ preparaFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar (na coluna Caso)"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
              <FontAwesomeIcon style={{color: "white"}} icon={faPlus}/> 
              <select className="form-control" name="filtro_processo" value={mFiltroProcessos} onChange={ (e) => setFiltroProcesso(e.target.value) }>
                      <option value="Todos">Todos</option>
                      { renderizarOptionsCasos }
              </select>

            </Form>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true} className="modal-lg" >

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar Reparacao</p> }
                      { !statusAlt && <p>Novo Reparacao</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Caso: </Form.Label>
                            <select className="form-control" name="caso" value={form.caso} onChange={handleChange}>
                              { renderizarOptionsCasos }
                            </select>
                        </Form.Group>

                        <Form.Group controlId="reparacao" className="mb-3 lh-1 fw-bold">
                            <Form.Label>Reparação: </Form.Label>
                            <Form.Control as="textarea" rows={3}
                              value={form.reparacao}
                              name="reparacao" 
                              onChange={handleChange}
                              //placeholder="Insira o texto da Reparacao"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Status do cumprimento:</Form.Label>
                            <select className="form-control" name="estado_cumprimento" value={form.estado_cumprimento} onChange={handleChange}>
                                    <option value="Cumprida">Cumprida</option>
                                    <option value="Parcialmente cumprida">Parcialmente cumprida</option>
                                    <option value="Pendente de cumprimento">Pendente de cumprimento</option>
                                    <option value="Descumprida">Descumprida</option>
                                </select>
                        </Form.Group>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Resolução Sup Declaratória: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o texto da Resolução"
                                name="resolucao_sup_declaratoria" value={form.resolucao_sup_declaratoria} onChange={handleChange}
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
                            <th onClick={ () => classifica('nome_caso','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Caso:</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('reparacao','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Reparação:</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('estado_cumprimento','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Status:</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>

                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderReparacoes } 
                    </tbody>
                </Table>
            }

        </Container>
    
    </div>

  );

}

export default Reparacoes;

// ---------------------------------------------------------------------//
