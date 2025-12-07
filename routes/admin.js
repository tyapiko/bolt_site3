const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

const router = express.Router();

// ログインページ
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.sendFile('login.html', { root: './public/admin' });
});

// ログイン処理
router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'ユーザー名とパスワードを入力してください' });
  }

  const { username, password } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'ユーザー名またはパスワードが正しくありません' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ success: true, message: 'ログインに成功しました' });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// ログアウト
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'ログアウトに失敗しました' });
    }
    res.json({ success: true, message: 'ログアウトしました' });
  });
});

// ダッシュボード
router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile('dashboard.html', { root: './public/admin' });
});

// 記事エディタ
router.get('/editor', requireAuth, (req, res) => {
  res.sendFile('editor.html', { root: './public/admin' });
});

router.get('/editor/:id', requireAuth, (req, res) => {
  res.sendFile('editor.html', { root: './public/admin' });
});

module.exports = router;
