import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: '.credentials/smooth-league-454604-d1-5fb85804352b.json', // Set your key file path here
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
