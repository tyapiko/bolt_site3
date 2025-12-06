const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルの提供
app.use(express.static('public'));

// ルートパス
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// APIエンドポイント例
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Hostinger!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
