import { Page, Text, View, Image, Font, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import React from 'react';

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

  const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    header: {
        fontSize: 10,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
        fontFamily: 'Oswald'
      },
      title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Oswald'
      },
      subtitle: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 2,
        marginLeft: 16,
        fontSize: 16,
        textAlign: 'justify',
        fontFamily: 'Oswald'
      },
    text: {
        marginTop: 16,
        marginBottom: 5,
        fontSize: 12,
        textAlign: 'justify'
    },
    textStatus: {
      marginTop: 5,
      marginBottom: 16,
      fontSize: 12,
      textAlign: 'center'
    }, 
    textUsers: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 12,
      textAlign: 'justify'
    }, 
    divider: {
      display: "table",
      width: "auto",
      marginLeft: 16,
      marginRight: 16,
      borderStyle: "solid",
      borderColor: "grey",
      borderBottom: 1
    },
    card: {
      marginTop: 8,
      borderStyle: "solid",
      border: 1,
      borderColor: "grey",
      width: "auto",
      padding: 5
    },
    timestamp: {    
      marginTop: 1,
      marginLeft: 1,          
      fontSize: 8,
      textAlign: 'justify',
      fontFamily: 'Oswald'
    }
  })



function relatoriogerencial({reparacao}) {
    return (
        <Document>
            <Page size="A4" style={styles.body}>
            <Text style={styles.header} fixed>
                InfoAmericano
            </Text>
            <Text style={styles.title}>{reparacao.nome_caso}</Text>
            <Text style={styles.text}>Medida de reparação: {reparacao.reparacao}</Text>
            <Text style={styles.textStatus}>Status de Cumprimento: {reparacao.estado_cumprimento}</Text>

            <Text style={styles.subtitle}> Histórico de Informações sobre o cumprimento</Text>
            <View style={styles.divider}></View>

            {reparacao.infos_cumprimento.map((info) => (
              <View style={styles.card}>
              <Text style={styles.timestamp}>Informação prestada em {moment(info.createdAt).format("LLL")}</Text>
              <Text style={styles.text}>{info.infos_relevantes}</Text>
              <Text style={styles.textUsers}>{info.usuario_informante.name}</Text>
              <Text style={styles.textUsers}>{info.usuario_informante.orgao[0].NOM_ORGAO}</Text>
              </View>
              ))}

            </Page>
        </Document>
    );
}

export default relatoriogerencial;