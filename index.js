// HLS streaming server with Express
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HLS files (.m3u8 and .ts files)
app.get('/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'videos', filename);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File ${filePath} does not exist`);
      return res.status(404).send('File not found');
    }
    
    // Set appropriate content type
    if (filename.endsWith('.m3u8')) {
      res.setHeader('Content-Type', 'application/x-mpegURL');
    } else if (filename.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/MP2T');
    }
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// Simple HTML page with video player
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`HLS server running at http://localhost:${port}`);
});