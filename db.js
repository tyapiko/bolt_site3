const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const db = new Database(path.join(__dirname, 'blog.db'));

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    read_time TEXT DEFAULT '5分で読める',
    image_gradient TEXT DEFAULT 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// デフォルト管理者アカウントを作成（初回のみ）
function createDefaultAdmin() {
  const checkAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');

  if (!checkAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('✅ デフォルト管理者アカウントを作成しました');
    console.log('   ユーザー名: admin');
    console.log('   パスワード: admin123');
    console.log('   ⚠️  セキュリティのため、初回ログイン後にパスワードを変更してください');
  }
}

// サンプル記事を作成（初回のみ）
function createSampleArticles() {
  const count = db.prepare('SELECT COUNT(*) as count FROM articles').get();

  if (count.count === 0) {
    const sampleArticles = [
      {
        title: 'AIが変える未来のWeb開発：2025年のトレンド',
        excerpt: '人工知能がWeb開発の世界をどのように革新しているか、最新のAIツールとフレームワークを深掘りします。',
        content: `# AIが変える未来のWeb開発：2025年のトレンド

人工知能（AI）はWeb開発の世界を急速に変革しています。2025年、AIツールとフレームワークは開発者の生産性を飛躍的に向上させ、新しい可能性を切り開いています。

## AIコーディングアシスタント

GitHub Copilot、ChatGPT、Claude Codeなどのツールは、コード補完から複雑なアルゴリズムの実装まで、開発者をサポートします。

## 自動テストとデバッグ

AIは自動テスト生成とバグ検出を革新し、品質保証プロセスを効率化します。

## パーソナライゼーション

機械学習を活用したユーザー体験のカスタマイズが標準となりつつあります。

## まとめ

AIツールを適切に活用することで、開発者はより創造的な作業に集中できるようになります。`,
        category: 'AI & Machine Learning',
        read_time: '8分で読める',
        image_gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        published: 1
      },
      {
        title: 'Node.jsパフォーマンス最適化の完全ガイド',
        excerpt: 'アプリケーションの速度を劇的に向上させるための実践的なテクニックとベストプラクティス。',
        content: `# Node.jsパフォーマンス最適化の完全ガイド

Node.jsアプリケーションのパフォーマンスを最適化することは、ユーザー体験とサーバーコストの両方に大きな影響を与えます。

## 非同期処理の最適化

- async/awaitの適切な使用
- Promise.allでの並列処理
- イベントループの理解

## メモリ管理

- メモリリークの検出と修正
- ガベージコレクションの理解
- キャッシング戦略

## データベース最適化

- インデックスの適切な使用
- コネクションプーリング
- クエリの最適化

## まとめ

これらのテクニックを実践することで、アプリケーションのパフォーマンスを大幅に改善できます。`,
        category: 'Web Development',
        read_time: '6分で読める',
        image_gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        published: 1
      },
      {
        title: 'Dockerで始めるモダンなCI/CD環境構築',
        excerpt: 'コンテナ技術を活用した効率的な開発ワークフローの構築方法を解説します。',
        content: `# Dockerで始めるモダンなCI/CD環境構築

コンテナ技術は現代の開発ワークフローに欠かせない要素となっています。DockerとCI/CDを組み合わせることで、効率的で信頼性の高い開発環境を構築できます。

## Dockerの基礎

- コンテナとイメージの理解
- Dockerfileのベストプラクティス
- マルチステージビルド

## CI/CDパイプライン

- GitHub Actionsの設定
- 自動テストとデプロイ
- セキュリティスキャン

## 本番環境への展開

- Kubernetes入門
- Docker Composeでのオーケストレーション
- モニタリングとログ管理

## まとめ

Dockerを活用することで、開発から本番環境まで一貫した環境を構築できます。`,
        category: 'Cloud & DevOps',
        read_time: '10分で読める',
        image_gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        published: 1
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO articles (title, excerpt, content, category, read_time, image_gradient, published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const article of sampleArticles) {
      insertStmt.run(
        article.title,
        article.excerpt,
        article.content,
        article.category,
        article.read_time,
        article.image_gradient,
        article.published
      );
    }

    console.log('✅ サンプル記事を作成しました');
  }
}

// 初期化
createDefaultAdmin();
createSampleArticles();

module.exports = db;
