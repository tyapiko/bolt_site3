// 認証チェックミドルウェア
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// ログイン済みユーザーのリダイレクト
function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    res.redirect('/admin/dashboard');
  } else {
    next();
  }
}

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};
