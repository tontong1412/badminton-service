
const { GoogleSpreadsheet } = require('google-spreadsheet')
const moment = require('moment')
const creds = require('../../client_secret.json')
import controller from '../controllers/event/register'
import '../libs/mongo/getMongoConnect'

// const UserModel = user.model

// Create a document object using the ID of the spreadsheet - obtained from its URL.
const script = async () => {

  const doc = new GoogleSpreadsheet('1Rn85rWWFnP6bz2uDNwdFhYAYrT9Z95S2HETGtkkhVzI')
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

  const MAP_EVENT_ID = {
    'จำกัดมือ N/S': '626d2557e06bba034e2a2aed',
    'จำกัดมือ P-/P': '626d2592e06bba034e2a2aee',
    'จำกัดมือ C': '626d25afe06bba034e2a2aef'
  }

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);
  const rows = await sheet.getRows()
  rows.forEach((row, i) => {
    const params = {
      eventID: MAP_EVENT_ID[row.event], //xd 16
      players: [
        {
          officialName: row.player1.trim(),
          club: row.team1.trim(),
          birthDate: isNaN(Number(row.player1Birth)) ? undefined : moment(`1-1-${Number(2022 - Number(row.player1Birth))}`, "MM-DD-YYYY"),
          // birthDate: moment(`1-1-${Number(row.player1Birth) - 543}`, "MM-DD-YYYY"),
          // gender: mapGenderDetail[row.player1Gender].gender,
          displayName: row.player1Nick
        },
        {
          officialName: row.player2.trim(),
          club: row.team1.trim(),
          birthDate: isNaN(Number(row.player2Birth)) ? undefined : moment(`1-1-${Number(2022 - Number(row.player2Birth))}`, "MM-DD-YYYY"),
          // birthDate: moment(`1-1-${Number(row.player2Birth) - 543}`, "MM-DD-YYYY"),
          // gender: mapGenderDetail[row.player2Gender].gender,
          displayName: row.player2Nick
        }
      ],
      contact: {
        _id: '624bc4f11221b1b35f37bf3f'
      }
    }
    controller({ body: params }, { send: () => { }, status: () => ({ send: () => { } }) })


  })
  console.log('done')
  return
}
script()
