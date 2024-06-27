import { google } from 'googleapis';

// Initialize the Google Drive API client
const drive = google.drive({
  version: 'v3',
  auth: 'AIzaSyD1slcpgsZ952owjm4JAve4G8zOD40rFwI'
});

// ID of the file you want to fetch
const fileId = '19QFS3VTn-wtnXAjYMcXNhUsS4yAs2xCL';

// Fetch file content
drive.files.get(
  { fileId, alt: 'media' },
  { responseType: 'stream' },
  (err, res) => {
    if (err) {
      console.error('Error fetching file:', err);
      return;
    }
    const chunks = [];
    res.data
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        const data = Buffer.concat(chunks);
        console.log('File content:', data.toString('utf8'));
      })
      .on('error', (err) => {
        console.error('Error reading file stream:', err);
      });
  }
);
