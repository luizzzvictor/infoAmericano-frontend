import api from "../api/api.js";
import { useState, useEffect } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'

function Casos() {

  const [mCasos, setCasos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState([]);
  const [statusAlt, setStatusAlt] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => { setShow(false); setStatusAlt(false); };
  const handleShow  = () => setShow(true);

  const [mMunicipios, setMunicipios] = useState([]);
  const [mPalavrasChaves, setPalavrasChaves] = useState([]);

  useEffect(() => {
    lerCasos()
  }, [])  

  const lerCasos = () => {
    try {
      const fetchCasos = async () => {
          let response = await api.get("/casosCorteIDH")
          setCasos(response.data)
          response = await api.get("/municipio/getall")
          setMunicipios(response.data)
          response = await api.get("/assunto/getall")
          setPalavrasChaves(response.data)
          setIsLoading(false)
      }
      fetchCasos()
    } catch (error) {
      console.log(error)
    }
  }

  const renderizarMunicipios = Array.from(mMunicipios).map((o) => {
    return <option value={o._id}>{o.NOM_ORGAO}</option>;
  });

  const renderizarPalavrasChaves = Array.from(mPalavrasChaves).map((o) => {
    return <option value={o._id}>{o.palavra_chave}</option>;
  });

  const preparaFormNova = () => {
    handleShow();
    setForm({ 
        tipo_de_decisao: "",
        caso: "",
        estado: "",
        cidade: "",
        latitude: 0,
        longitude: 0,
        imagem: "",
        resumo_caso: "",
        vitimas: "",
        representantes: "",
        //palavras_chave: [],
        sentenca_link: "",
        link_portugues: "",
        ordem_sentencas: 0,
        cidh_peticao: "",
        cidh_admissibilidade: "",
        cidh_merito: "",
        cidh_submissao: "",
        corte_sentenca: "",
        em_supervisao: "",
        em_tramitacao: "",
        n_medidas_reparacao: 0,
        // medidas_reparacao: [],
    });
  }

  const alteraCaso = (id) => {
    try {
      setIsLoading(true)
      const fetchCasos = async () => {
          const response = await api.get(`/casosCorteIDH/${id}`)
          setForm({
            _id: response.data._id,
            tipo_de_decisao: response.data.tipo_de_decisao,
            caso: response.data.caso,
            estado: response.data.localidade.estado,
            cidade: response.data.localidade.cidade,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            imagem: response.data.imagem,
            resumo_caso: response.data.resumo_caso,
            vitimas: response.data.vitimas,
            representantes: response.data.representantes,
            //palavras_chave: [],
            sentenca_link: response.data.sentenca_link,
            link_portugues: response.data.link_portugues,
            ordem_sentencas: response.data.ordem_sentencas,
            
            cidh_peticao: ( response.data.cidh_peticao ? response.data.cidh_peticao.slice(0,10) : "" ),
            cidh_admissibilidade: ( response.data.cidh_admissibilidade ? response.data.cidh_admissibilidade.slice(0,10) : "" ),
            cidh_merito: ( response.data.cidh_merito ? response.data.cidh_merito.slice(0,10) : "" ),
            cidh_submissao: ( response.data.cidh_submissao ? response.data.cidh_submissao.slice(0,10) : "" ),
            corte_sentenca: ( response.data.corte_sentenca ? response.data.corte_sentenca.slice(0,10) : "" ),
            
            em_supervisao: ( response.data.em_supervisao === true ? "SIM" : "NAO" ),
            em_tramitacao: ( response.data.em_tramitacao === true ? "SIM" : "NAO" ),
            n_medidas_reparacao: response.data.n_medidas_reparacao,
            // medidas_reparacao: [],
          });
          
          console.log("-1-:",response.data.cidh_peticao,typeof response.data.cidh_peticao)
          console.log("-2-:",response.data.cidh_admissibilidade, typeof response.data.cidh_admissibilidade)
          console.log("-3-:",form.cidh_peticao, typeof form.cidh_peticao)

          setStatusAlt(true)
          handleShow()
          setIsLoading(false)
      }
      fetchCasos()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCaso = (id) => {
    try {
      setIsLoading(true)
      const fetchCasos = async () => {
          await api.delete(`/casosCorteIDH/delete/${id}`)
          lerCasos()
      }
      fetchCasos()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleBlur = (e) => {
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        if ( statusAlt ) {
          const clone = { ...form }
          clone.localidade = { estado: clone.estado, cidade: clone.cidade }
          delete clone._id          
          delete clone.estado
          delete clone.cidade
          clone.em_supervisao = ( clone.em_supervisao === "SIM" ? true : false )
          clone.em_tramitacao = ( clone.em_tramitacao === "SIM" ? true : false )
          console.log(clone);
          await api.put(`/casosCorteIDH/edit/${form._id}`, clone)
        } else {
          const clone = { ...form }
          clone.localidade = { estado: clone.estado, cidade: clone.cidade }
          delete clone.estado
          delete clone.cidade
          clone.em_supervisao = ( clone.em_supervisao === "SIM" ? true : false )
          clone.em_tramitacao = ( clone.em_tramitacao === "SIM" ? true : false )
          console.log(clone);
          await api.post("/casosCorteIDH/create", clone)
        }        
        lerCasos()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  const renderCasos = mCasos
  .filter((Caso) => Caso.caso.toLowerCase().includes(search.toLowerCase()))
  .map((Caso) => {
      return (
          <tr key={Caso._id}>
              
              <td className="p-1 text-start">{Caso.tipo_de_decisao}</td>
              <td className="p-1 text-start">{Caso.caso}</td>

              <td className="p-1 text-center">
                <Button className="p-0" variant="" onClick={ (event) => { alteraCaso(Caso._id) } }>
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>

              <td className="p-1 text-center">
                <Button className="p-0" variant="" onClick={ (event) => { deleteCaso(Caso._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>

          </tr>
      )
  })

  const classifica = (property, type) => {
    let xCasos = [...mCasos];
    if ( type === 'number') {
      if ( parseInt(xCasos[0][property]) > parseInt(xCasos[xCasos.length-1][property]) ) {
        xCasos.sort( (a,b) => parseInt(a[property]) > parseInt(b[property]) ? 1 : -1 )
      } else {
        xCasos.sort( (a,b) => parseInt(a[property]) < parseInt(b[property]) ? 1 : -1 )
      }
    } else {
      if ( xCasos[0][property].toLowerCase() > xCasos[xCasos.length-1][property].toLowerCase() ) {
        xCasos.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1 )
      } else {
        xCasos.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1 )
      }
    }
    setCasos(xCasos);
  }

  return (

    <div className="Casos">

        <Container>

            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ preparaFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar Caso"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
            </Form>

            <Modal className="modal-lg" show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      { statusAlt && <p>Alterar Caso:</p> }
                      { !statusAlt && <p>Novo Caso:</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <div className="row">
                            <div className="col-3 text-end mt-1">Tipo de Decisão:</div>
                            <div className="col-9">                                
                                <select className="form-control" name="tipo_de_decisao" value={form.tipo_de_decisao} 
                                    onChange={handleChange} onBlur={handleBlur}>
                                    <option value="Caso Contencioso">Caso Contencioso</option>
                                    <option value="Medidas Provisórias">Medidas Provisórias</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Caso:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                    placeholder="Descrição"
                                    name="caso" value={form.caso} onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Imagem:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Imagem"
                                name="imagem" value={form.imagem} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Resumo Caso:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Resumo do caso"
                                name="resumo_caso" value={form.resumo_caso} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Vítimas:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Vítimas"
                                name="vitimas" value={form.vitimas} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Representantes:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Representantes"
                                name="representantes" value={form.representantes} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Link da Sentença:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Link da Sentença"
                                name="sentenca_link" value={form.sentenca_link} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Link Português:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Link Português"
                                name="link_portugues" value={form.link_portugues} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-3 text-end mt-1">Ordem Sentenças:</div>
                            <div className="col-9">                            
                                <input className="form-control" type="text"
                                placeholder="Ordem Sentenças"
                                name="ordem_sentencas" value={form.ordem_sentencas} onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-2">
                                <Form.Group className="mb-2 lh-1">
                                    <Form.Label>UF: </Form.Label>
                                    <select className="form-control" name="estado" value={form.estado} 
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
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group className="lh-1">
                                    <Form.Label>Cidade: </Form.Label>
                                    <select className="form-control" name="cidade" value={form.cidade} 
                                        onChange={handleChange} onBlur={handleBlur}>
                                        { renderizarMunicipios }
                                    </select>
                                </Form.Group>
                            </div>
                            <div className="col-2">
                                <Form.Group className="lh-1">
                                    <Form.Label>Lat: </Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Latitude"
                                        name="latitude" value={form.latitude} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-2">
                                <Form.Group className="lh-1">
                                    <Form.Label>Long: </Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Longitude"
                                        name="longitude" value={form.longitude} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-4">
                                <Form.Group className="mb-3 lh-1">
                                    <Form.Label>CIDH Petição: </Form.Label>
                                    <Form.Control type="date"
                                        placeholder="CIDH Petição"
                                        name="cidh_peticao" value={form.cidh_peticao} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group className="mb-3 lh-1">
                                    <Form.Label>CIDH Admissibilidade: </Form.Label>
                                    <Form.Control type="date"
                                        placeholder="CIDH Admissibilidade"
                                        name="cidh_admissibilidade" value={form.cidh_admissibilidade} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group className="mb-3 lh-1">
                                    <Form.Label>CIDH Mérito: </Form.Label>
                                    <Form.Control type="date"
                                        placeholder="CIDH Mérito"
                                        name="cidh_merito" value={form.cidh_merito} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-4">
                                <Form.Group className="mb-2 lh-1">
                                    <Form.Label>CIDH Submissão: </Form.Label>
                                    <Form.Control type="date"
                                        placeholder="CIDH Submissão"
                                        name="cidh_submissao" value={form.cidh_submissao} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group className="mb-2 lh-1">
                                    <Form.Label>CIDH Sentença: </Form.Label>
                                    <Form.Control type="date"
                                        placeholder="CIDH Sentença"
                                        name="corte_sentenca" value={form.corte_sentenca} onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-2 mt-1">Em Supervisão:</div>
                            <div className="col-4">
                                <select className="form-control" name="em_supervisao" value={form.em_supervisao} 
                                    onChange={handleChange} onBlur={handleBlur}>
                                    <option value="SIM">SIM</option>
                                    <option value="NAO">NÃO</option>
                                </select>
                            </div>
                            <div className="col-2 mt-1">Em Tramitação:</div>
                            <div className="col-4">
                                <select className="form-control" name="em_tramitacao" value={form.em_tramitacao} 
                                    onChange={handleChange} onBlur={handleBlur}>
                                    <option value="SIM">SIM</option>
                                    <option value="NAO">NÃO</option>
                                </select>
                            </div>
                        </div>

                        <div className="multiplicar row mt-1">
                            <div className="col-2 mt-1">Palavra-Chave:</div>
                            <div className="col-8">
                               <select className="form-control" name="pke0" value={form.pkey0} 
                                   onChange={handleChange} onBlur={handleBlur}>
                                   { renderizarPalavrasChaves }
                               </select>
                            </div>
                        </div>

                        <div className="text-center mt-3">
                          <Button style={{width: "70%"}} variant="success" type="submit">GRAVAR</Button>
                        </div>

                    </Form>
                 </Modal.Body>

            </Modal>

            {isLoading && <Spinner className="" animation="border" />}

            {!isLoading &&
                <Table className="mt-4" bordered hover>
                    <thead>
                        <tr>
                            <th onClick={ () => classifica('tipo_de_decisao','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Tipo Decisão</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('caso','text') } className="text-center">
                              <div className="d-flex">
                                <div className='col-11'>Caso</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderCasos } 
                    </tbody>
                </Table>
            }

        </Container>
    
    </div>

  );

}

export default Casos;

// ---------------------------------------------------------------------//
