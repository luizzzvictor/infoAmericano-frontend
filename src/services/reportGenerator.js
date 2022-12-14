// import ConvertApi from 'convertapi-js'
import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = reparacao => {
  // initialize jsPDF
  const doc = new jsPDF();
 
// doc.html( `<h1> ${reparacao.nome_caso}</h1>`, 15, 15, {
//     callback: function (doc) {
//       doc.save();
//     }
//  })

  //  title. and margin-top + margin-left
  doc.text(`InfoAmericano`, 14, 20);
  doc.text(`${reparacao.nome_caso}`, 14, 40);
  doc.setFont("Times", "Bold")
  doc.text(`${reparacao.reparacao}`, 14, 50,  {maxWidth:"180"});
  doc.setFont("courier", "italic");
  doc.text(`${reparacao.estado_cumprimento}`, 14, 70);
  doc.setFont("Times", "Roman")

  const arrayInfosPrestadas = reparacao.infos_cumprimento.map((info) => {
// //    console.log(info)
   
    const arrMenor = []

    arrMenor.push(info.infos_relevantes)
    arrMenor.push(info.usuario_informante.name)
    arrMenor.push(info.usuario_informante.orgao[0].NOM_ORGAO)

    return arrMenor
})
  
//   console.log(arrayInfosPrestadas)


  const arrRenderizadas = arrayInfosPrestadas.map((arrMenor) => {
    
    // const eixoX = 14 + arrayInfosPrestadas.indexOf(arrMenor)*60;
    const eixoY = 60 + (arrayInfosPrestadas.indexOf(arrMenor)+1)*40;

    // console.log(Number(eixoX), eixoY)

    return doc.text(arrMenor, 14, eixoY, {maxWidth:"180"});
  })

  console.log(arrRenderizadas)

//   doc.text(arrayInfosPrestadas, 14, 60, {maxWidth:"180", align:"justify"});

const date = Date().split(" ");
// // we use a date string to generate our filename.
const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
// // //   we define the name of our PDF file.
  doc.save(`relatorio_${reparacao.nome_caso}_${dateStr}.pdf`);

// let convertApi = ConvertApi.auth('DdlyHZfpRvxu7Oy7')
// let params = convertApi.createParams()
// params.add('File', new URL('http://localhost:3000/reparacoes/6399ea4296ea08d3f746548f'));
// async function treta() {
//     const result = await convertApi.convert('htm', 'pdf', params)  
// } 
// treta()

};

export default generatePDF;