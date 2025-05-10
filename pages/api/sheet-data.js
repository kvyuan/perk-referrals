import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const key = process.env.PRIVATE_KEY?.replace(/"/g, '')
    console.log(key)
    const auth = new google.auth.GoogleAuth({
      //keyFile: '.credentials/smooth-league-454604-d1-5fb85804352b.json', // Set your key file path here
      credentials: {
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: key,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.CLIENT_CERT,
        universe_domain: "googleapis.com"},
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Replace with your Google Sheet ID and range
    const sheetId = '12-hzLTxE0NdJbZ65Luim3NI66nfYzfI-L15195-_Gos';
    const range = 'Sheet1!A:D'; // Assuming columns A, B, C, D are Username, Category, Title, Content

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values;

    if (rows.length) {
      // Extract the header (first row)
      const header = rows[0];
      // Extract the data (excluding the header)
      const body = rows.slice(1).map((row) => ({
        username: row[0],
        category: row[1],
        title: row[2],
        content: row[3], // Adding content column
      }));

      res.status(200).json({ header, body });
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
