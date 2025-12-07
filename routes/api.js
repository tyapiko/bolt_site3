const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// 公開記事一覧取得
router.get('/articles', (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT id, title, excerpt, category, read_time, image_gradient,
             datetime(created_at, 'localtime') as created_at
      FROM articles
      WHERE published = 1
      ORDER BY created_at DESC
    `).all();

    res.json({ success: true, articles });
  } catch (error) {
    console.error('記事一覧取得エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// 公開記事詳細取得
router.get('/articles/:id', (req, res) => {
  try {
    const article = db.prepare(`
      SELECT id, title, excerpt, content, category, read_time, image_gradient,
             datetime(created_at, 'localtime') as created_at,
             datetime(updated_at, 'localtime') as updated_at
      FROM articles
      WHERE id = ? AND published = 1
    `).get(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: '記事が見つかりません' });
    }

    res.json({ success: true, article });
  } catch (error) {
    console.error('記事詳細取得エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// 管理者用：全記事一覧取得
router.get('/admin/articles', requireAuth, (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT id, title, excerpt, category, published,
             datetime(created_at, 'localtime') as created_at,
             datetime(updated_at, 'localtime') as updated_at
      FROM articles
      ORDER BY created_at DESC
    `).all();

    res.json({ success: true, articles });
  } catch (error) {
    console.error('記事一覧取得エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// 管理者用：記事詳細取得
router.get('/admin/articles/:id', requireAuth, (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: '記事が見つかりません' });
    }

    res.json({ success: true, article });
  } catch (error) {
    console.error('記事詳細取得エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// 記事作成
router.post('/admin/articles', requireAuth, [
  body('title').trim().notEmpty().withMessage('タイトルは必須です'),
  body('excerpt').trim().notEmpty().withMessage('要約は必須です'),
  body('content').trim().notEmpty().withMessage('本文は必須です'),
  body('category').trim().notEmpty().withMessage('カテゴリーは必須です')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, excerpt, content, category, read_time, image_gradient, published } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO articles (title, excerpt, content, category, read_time, image_gradient, published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      excerpt,
      content,
      category,
      read_time || '5分で読める',
      image_gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      published ? 1 : 0
    );

    res.json({
      success: true,
      message: '記事を作成しました',
      articleId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('記事作成エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// 記事更新
router.put('/admin/articles/:id', requireAuth, [
  body('title').trim().notEmpty().withMessage('タイトルは必須です'),
  body('excerpt').trim().notEmpty().withMessage('要約は必須です'),
  body('content').trim().notEmpty().withMessage('本文は必須です'),
  body('category').trim().notEmpty().withMessage('カテゴリーは必須です')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, excerpt, content, category, read_time, image_gradient, published } = req.body;

  try {
    db.prepare(`
      UPDATE articles
      SET title = ?, excerpt = ?, content = ?, category = ?,
          read_time = ?, image_gradient = ?, published = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      excerpt,
      content,
      category,
      read_time || '5分で読める',
      image_gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      published ? 1 : 0,
      req.params.id
    );

    res.json({ success: true, message: '記事を更新しました' });
  } catch (error) {
    console.error('記事更新エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// 記事削除
router.delete('/admin/articles/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: '記事を削除しました' });
  } catch (error) {
    console.error('記事削除エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
