
const { GoogleSpreadsheet } = require('google-spreadsheet')
const moment = require('moment')
const creds = require('../../client_secret.json')
import controller from '../controllers/event/register'
import '../libs/mongo/getMongoConnect'

// const UserModel = user.model

// Create a document object using the ID of the spreadsheet - obtained from its URL.
const script = async () => {

  const doc = new GoogleSpreadsheet('13lUwZ5bxzTrQBozC8Az6oXZ5DtaCfqCNz5eA0xL9sCw')
  // getMongoConnect()
  const mapGenderDetail = {
    ชาย: {
      gender: 'male',
      photo: 'https://image.flaticon.com/icons/svg/921/921086.svg',
    },
    หญิง: {
      gender: 'female',
      photo: 'https://image.flaticon.com/icons/svg/921/921082.svg',
    },
  }
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[19]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);
  const rows = await sheet.getRows()
  rows.forEach((row, i) => {
    const params = {
      // eventID: '624b364df01eeb1a9aaaed25', //N
      // eventID: '624b367bf01eeb1a9aaaed26', //S
      // eventID: '624b36a7f01eeb1a9aaaed27', //P-
      // eventID: '624b36c3f01eeb1a9aaaed28', //P
      // eventID: '624b36ddf01eeb1a9aaaed29', //P+
      // eventID: '624becd9a5775ea1215a18a1', //BS 8
      // eventID: '624bed54a5775ea1215a18a3', //BS 10
      // eventID: '624bed88a5775ea1215a18a5', //BS 12
      // eventID: '624bee70a5775ea1215a18a7', //BS 14
      // eventID: '624bee96a5775ea1215a18a9', //BS 16
      // eventID: '624bed11a5775ea1215a18a2', //GS 8
      // eventID: '624bed6aa5775ea1215a18a4', //GS 10
      // eventID: '624beddea5775ea1215a18a6', //GS 12
      // eventID: '624bee83a5775ea1215a18a8', //GS 14
      // eventID: '624beeaba5775ea1215a18aa', //GS 16
      // eventID: '624beedca5775ea1215a18ab', //xd 8
      // eventID: '624bef06a5775ea1215a18ac', //xd 10
      // eventID: '624bef18a5775ea1215a18ad', //xd 12
      // eventID: '624bef2da5775ea1215a18ae', //xd 14
      eventID: '624bef44a5775ea1215a18af', //xd 16
      players: [
        {
          officialName: row.player1.trim(),
          // club: row.team.trim(),
          birthDate: moment(`1-1-${Number(row.player1Birth) - 543}`, "MM-DD-YYYY"),
          gender: mapGenderDetail[row.player1Gender].gender,
          displayName: row.player1Nick
        },
        {
          officialName: row.player2.trim(),
          // club: row.team.trim(),
          birthDate: moment(`1-1-${Number(row.player2Birth) - 543}`, "MM-DD-YYYY"),
          gender: mapGenderDetail[row.player2Gender].gender,
          displayName: row.player2Nick
        }
      ],
      contact: {
        _id: '624bc4f11221b1b35f37bf3f'
      }
    }
    controller({ body: params }, { send: () => { }, status: () => ({ send: () => { } }) })


  })
  return
}

script()