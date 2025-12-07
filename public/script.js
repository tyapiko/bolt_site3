// ===== ナビゲーションスクロール効果 =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== パララックス効果 =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const particles = document.querySelector('.particles');
    const gradientOverlay = document.querySelector('.gradient-overlay');

    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
    }

    if (particles) {
        particles.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    if (gradientOverlay) {
        gradientOverlay.style.transform = `translateY(${scrolled * 0.2}px) scale(${1 + scrolled * 0.0002})`;
    }
});

// ===== モバイルメニュー =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// メニューリンククリックでメニューを閉じる
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// ===== スムーススクロール =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== アクティブリンクハイライト =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== パーティクルアニメーション強化 =====
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== カードホバーエフェクト =====
const articleCards = document.querySelectorAll('.article-card');

articleCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== ニュースレターフォーム =====
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('.newsletter-input').value;
    const button = e.target.querySelector('.btn-primary');
    const originalText = button.textContent;

    button.textContent = '登録中...';
    button.disabled = true;

    // シミュレーション（実際にはAPIに送信）
    await new Promise(resolve => setTimeout(resolve, 1500));

    button.textContent = '登録完了！';
    button.style.background = '#10b981';

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = '';
        e.target.reset();
    }, 2000);
});

//===== スムーズスクロールアニメーション =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

// アニメーション対象要素
document.querySelectorAll('.article-card, .section-header, .newsletter').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ===== ロードアニメーション =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== ページビューカウンター（デモ） =====
const viewCount = localStorage.getItem('pageViews') || 0;
localStorage.setItem('pageViews', parseInt(viewCount) + 1);
console.log(`ページビュー: ${parseInt(viewCount) + 1}回`);

// ===== タイトルタイピングアニメーション =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text1 = 'テクノロジーの';
    const text2 = '未来を探求する';

    // 元のテキストをクリア
    heroTitle.innerHTML = '';

    // 2つのspan要素を作成
    const line1 = document.createElement('span');
    line1.className = 'title-line typing-line';
    const line2 = document.createElement('span');
    line2.className = 'title-line typing-line';

    heroTitle.appendChild(line1);
    heroTitle.appendChild(line2);

    // タイピング効果
    let i = 0;
    const typingSpeed = 100;

    function typeText1() {
        if (i < text1.length) {
            line1.textContent += text1.charAt(i);
            i++;
            setTimeout(typeText1, typingSpeed);
        } else {
            // 1行目が完了したら2行目を開始
            i = 0;
            setTimeout(typeText2, 200);
        }
    }

    function typeText2() {
        if (i < text2.length) {
            line2.textContent += text2.charAt(i);
            i++;
            setTimeout(typeText2, typingSpeed);
        } else {
            // カーソル点滅を追加
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            line2.appendChild(cursor);
        }
    }

    // 少し遅延してから開始
    setTimeout(typeText1, 500);
}

// ===== 記事の動的読み込み =====
async function loadArticles() {
    try {
        const response = await fetch('/api/articles');
        const data = await response.json();

        if (data.success && data.articles.length > 0) {
            const articlesGrid = document.getElementById('articlesGrid');
            articlesGrid.innerHTML = data.articles.map((article, index) => `
                <article class="article-card ${index === 0 ? 'featured-article' : ''}">
                    <div class="article-image">
                        <div class="article-category">${article.category}</div>
                        <div class="image-placeholder" style="background: ${article.image_gradient};"></div>
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-date">${new Date(article.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span class="article-read-time">${article.read_time}</span>
                        </div>
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <a href="#article-${article.id}" class="article-link">続きを読む →</a>
                    </div>
                </article>
            `).join('');

            // アニメーション再適用
            document.querySelectorAll('.article-card').forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                observer.observe(el);
            });
        }
    } catch (error) {
        console.error('記事読み込みエラー:', error);
        const articlesGrid = document.getElementById('articlesGrid');
        articlesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);">
                記事の読み込みに失敗しました
            </div>
        `;
    }
}

// ページ読み込み時に記事を取得
if (document.getElementById('articlesGrid')) {
    loadArticles();
}

// ===== デバッグ情報 =====
console.log('%c🚀 TechBlog v2.0 - Cyber Edition', 'color: #00f0ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(0,240,255,0.5);');
console.log('%cPowered by Node.js + Express + AI', 'color: #bf00ff; font-size: 12px;');
