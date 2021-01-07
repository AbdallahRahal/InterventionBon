import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native'
import pdfclean from './pdf.js'
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import PDFView from 'react-native-view-pdf';

export async function ExportPDFfunction(pdfData) {

  const dataUri = pdfclean.uri
  const pdfDoc = await PDFDocument.load(dataUri)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize() //max w = 595 et h = 842
  console.log("w = " + width + " et h = " + height + " et info =" + pdfData.Responsable.toString())
  console.log("lenght = " + pdfData.Responsable.toString().length)
  firstPage.drawText(pdfData.id.toString(), {
    x: 296,
    y: 802,
    size: 12,
  });
  firstPage.drawText(pdfData.Responsable ? pdfData.Responsable : "", {
    x: 460 - (2.45 * pdfData.Responsable.toString().length),//460 de base R a b de resposable
    y: 802,
    size: 12,
  });
  firstPage.drawText(pdfData.TypeBon ? pdfData.TypeBon : "", {
    x: 280,
    y: 780,
    size: 18,
  });
  firstPage.drawText(pdfData.Date ? pdfData.Date : "", {
    x: 290,
    y: 744,
    size: 12,
  });
  firstPage.drawText(pdfData.Correspondant ? pdfData.Correspondant : "", {
    x: 470,
    y: 744,
    size: 12,
  });
  if (pdfData.Client && pdfData.Telephone) {
    clientReturn = pdfData.Client + " (" + pdfData.Telephone + ")"
  } else if (pdfData.Client) {
    clientReturn = pdfData.Client
  } else if (pdfData.Telephone) {
    clientReturn = pdfData.Telephone
  } else {
    clientReturn = ""
  }
  firstPage.drawText(clientReturn, {
    x: 60,
    y: 724,
    size: 12,
    lineHeight: 200,
  });
  firstPage.drawText(pdfData.Adresse ? pdfData.Adresse : "", {
    x: 64,
    y: 702,
    size: 12,
  });
  firstPage.drawText(pdfData.NomIntervention ? pdfData.NomIntervention : "", {
    x: 152,
    y: 670,
    size: 12,
  });

  let textCommande = ""
  if (pdfData.Commande) {
    textCommande = pdfData.Commande
    const reg = /\r?\n|\r/g
    textCommande = textCommande.replace(reg, ' ')

    textCommandeMod = textCommande.split('')
    //console.log("textCommande = "+textCommande)
    let y = 0
    let x = 0
    let lastSpaceHit
    for (x = 0; x < textCommande.length; x++) {
      if (textCommande[x] == " ") {
        lastSpaceHit = x
        //console.log("lastSpaceHit "+x)
      }
      y++;
      if (y == 80) {
        //console.log("y=66 atteind a x= "+x+" donc changement a "+lastSpaceHit)
        textCommandeMod[lastSpaceHit] = "\n"
        x = lastSpaceHit
        y = 0
      }
    }
    //console.log("textCommandeMod = "+textCommandeMod.join(''))
    textCommande = textCommandeMod.join('')
    //console.log("x = "+x+' et y = '+y)
  }

  firstPage.drawText(textCommande, {
    x: 23,
    y: 607,
    size: 12,
  });

  let textExecute = ""
  if (pdfData.Execute) {
    textExecute = pdfData.Execute
    const reg = /\r?\n|\r/g
    textExecute = textExecute.replace(reg, ' ')

    textExecuteMod = textExecute.split('')
    //console.log("textExecute = "+textExecute)
    let y = 0
    let x = 0
    let lastSpaceHit
    for (x = 0; x < textExecute.length; x++) {
      if (textExecute[x] == " ") {
        lastSpaceHit = x
        //console.log("lastSpaceHit "+x)
      }
      y++;
      if (y == 80) {
        //console.log("y=66 atteind a x= "+x+" donc changement a "+lastSpaceHit)
        textExecuteMod[lastSpaceHit] = "\n"
        x = lastSpaceHit
        y = 0
      }
    }
    //console.log("textExecuteMod = "+textExecuteMod.join(''))
    textExecute = textExecuteMod.join('')
    //console.log("x = "+x+' et y = '+y)
  }

  firstPage.drawText(textExecute, {
    x: 23,
    y: 485,
    size: 12,
  });
  firstPage.drawText(pdfData.Jointe ? pdfData.Jointe : "", {
    x: 93,
    y: 149,
    size: 12,
  });
  firstPage.drawText(pdfData.Controle ? "X" : "", {
    x: 152,
    y: 126,
    size: 12,
  });
  firstPage.drawText(pdfData.Ras ? "X" : "", {
    x: 205,
    y: 126,
    size: 12,
  });
  firstPage.drawText(pdfData.Travaux ? pdfData.Travaux : "", {
    x: 318,
    y: 126,
    size: 12,
  });
  firstPage.drawText(pdfData.Frais ? pdfData.Frais.toString() : "", {
    x: 493,
    y: 145,
    size: 12,
  });
  firstPage.drawText(pdfData.Main ? pdfData.Main.toString() : "", {
    x: 493,
    y: 121,
    size: 12,
  });
  firstPage.drawText(pdfData.Deplacement ? pdfData.Deplacement.toString() : "", {
    x: 493,
    y: 98,
    size: 12,
  });
  firstPage.drawText(pdfData.HTTotal ? pdfData.HTTotal.toString() : "", {
    x: 493,
    y: 75,
    size: 12,
  });
  firstPage.drawText(pdfData.Tva ? pdfData.Tva.toString() : "", {
    x: 493,
    y: 52,
    size: 12,
  });
  firstPage.drawText(pdfData.TTCTotal ? pdfData.TTCTotal.toString() : "", {
    x: 493,
    y: 29,
    size: 12,
  });



  const pdfBytes = await pdfDoc.saveAsBase64()

  const resourceType = 'base64';
  return pdfBytes;

}

class ExportPDF extends React.Component {

  render() {
    const b64 = this.props.resources
    return (

      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={b64}
        resourceType={'base64'}
        onLoad={() => console.log(`PDF rendered`)}
        onError={(error) => console.log('Cannot render PDF', error)}
      />


    )
  }

} export default ExportPDF
