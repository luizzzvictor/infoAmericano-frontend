import api from "../api/api.js";
import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'

function Municipios() {

  // Matriz de dados carregada da base de dados
  const [mMunicipios, setMunicipios] = useState([]);
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
    lerMunicipios()
  }, [])  

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerMunicipios = () => {
    try {
      const fetchMunicipios = async () => {
          const response = await api.get("/municipio/getall")
          //let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          let tempData = [...response.data]
          setMunicipios(tempData)
          setIsLoading(false)
      }
      fetchMunicipios()
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
        SEQ_ORGAO: "", 
        UF: "", 
    });
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo município
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraMunicipio = (id) => {
    try {
      setIsLoading(true)
      const fetchMunicipios = async () => {
          const response = await api.get(`/municipio/getid/${id}`)
          setForm({
            _id:    response.data._id,
            NOM_ORGAO:   response.data.NOM_ORGAO, 
            SEQ_ORGAO: response.data.SEQ_ORGAO, 
            UF:     response.data.UF, 
          });
          setStatusAlt(true)
          handleShow()
          setIsLoading(false)
      }
      fetchMunicipios()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo município
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteMunicipio = (id) => {
    try {
      setIsLoading(true)
      const fetchMunicipios = async () => {
          await api.delete(`/municipio/deleteid/${id}`)
          lerMunicipios()
      }
      fetchMunicipios()
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

  // dispara quando o município clica em "GRAVAR" no Formulário (alteração ou inclusão)
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
          await api.put(`/municipio/replaceid/${form._id}`, clone)
        } else {
          await api.post("/municipio/insert", form)
        }        
        lerMunicipios()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  // prepara na variável "renderMunicipios"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderMunicipios = mMunicipios
  .filter((Municipio) => Municipio.NOM_ORGAO.toLowerCase().includes(search.toLowerCase()))
  .map((Municipio) => {
      return (
          <tr key={Municipio._id}>
              
              <td className="p-1 text-start">{Municipio.NOM_ORGAO}</td>
              <td className="p-1 text-center">{Municipio.SEQ_ORGAO}</td>
              <td className="p-1">{Municipio.UF}</td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { alteraMunicipio(Municipio._id) } }>
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>

              <td className="p-1 text-start">
                <Button className="p-0" variant="" onClick={ (event) => { deleteMunicipio(Municipio._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>

          </tr>
      )
  })

  const classifica = (property, type) => {
    let xMunicipios = [...mMunicipios];
    if ( type === 'number') {
      if ( parseInt(xMunicipios[0][property]) > parseInt(xMunicipios[xMunicipios.length-1][property]) ) {
        xMunicipios.sort( (a,b) => parseInt(a[property]) > parseInt(b[property]) ? 1 : -1 )
      } else {
        xMunicipios.sort( (a,b) => parseInt(a[property]) < parseInt(b[property]) ? 1 : -1 )
      }
    } else {
      if ( xMunicipios[0][property].toLowerCase() > xMunicipios[xMunicipios.length-1][property].toLowerCase() ) {
        xMunicipios.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1 )
      } else {
        xMunicipios.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1 )
      }
    }
    setMunicipios(xMunicipios);
  }

  return (

    <div className="Municipios">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            {/* Mostra, também, o botão de ADICIONAR um REGISTRO NOVO */}
            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ preparaFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar Municipio"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
            </Form>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar Municipio</p> }
                      { !statusAlt && <p>Novo Municipio</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Nome: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o nome completo do Município"
                                name="NOM_ORGAO" value={form.NOM_ORGAO} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Código: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o Código do Municipio"
                                name="SEQ_ORGAO" value={form.SEQ_ORGAO} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>UF: </Form.Label>

                            <select className="form-control" name="UF" value={form.UF} 
                                        onChange={handleChange} onBlur={handleBlur}>
                                        <option value="AL">AL</option>
                                        <option value="AM">AM</option>
                                        <option value="AP">AP</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MG">MG</option>
                                        <option value="MS">MS</option>
                                        <option value="MT">MT</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="PR">PR</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="RS">RS</option>
                                        <option value="SC">SC</option>
                                        <option value="SE">SE</option>
                                        <option value="SP">SP</option>
                                        <option value="TO">TO</option>
                                    </select>

                            {/* <Form.Control type="text"
                                placeholder="Insira a UF do Municipio"
                                name="UF" value={form.UF} onChange={handleChange}
                                onBlur={handleBlur}
                            /> */}

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
                            <th onClick={ () => classifica('UF','text') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>UF</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>

                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderMunicipios } 
                    </tbody>
                </Table>
            }

        </Container>
    
    </div>

  );

}

export default Municipios;

// ---------------------------------------------------------------------//
