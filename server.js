const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PW = process.env.ADMIN_PW || '0099';
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// GET — qualquer um lê
app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(content));
    } else {
      res.json(null);
    }
  } catch (e) {
    res.json(null);
  }
});

// PUT — só árbitro com senha
app.put('/api/data', (req, res) => {
  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_PW) {
    return res.status(401).json('Unauthorized');
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
    res.json('ok');
  } catch (e) {
    res.status(500).json('error');
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));