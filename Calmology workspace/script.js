/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  CALMOLOGY WORKSPACE - FULL-STACK FRONTEND V2.0
 *  Connected to Node.js/Express Backend API
 *  Production-Ready Dynamic CMS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
//  API CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const API_BASE = '/api';

// API Helper Functions
const api = {
    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('calmology_token');
    },

    // Set auth token
    setToken(token) {
        localStorage.setItem('calmology_token', token);
    },

    // Remove auth token
    removeToken() {
        localStorage.removeItem('calmology_token');
    },

    // Get headers with optional auth
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    },

    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(options.auth),
                    ...options.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST request
    async post(endpoint, body, auth = false) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            auth
        });
    },

    // PUT request
    async put(endpoint, body, auth = true) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            auth
        });
    },

    // DELETE request
    async delete(endpoint, auth = true) {
        return this.request(endpoint, {
            method: 'DELETE',
            auth
        });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CORE STATE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
const State = {
    // Data cache
    config: {},
    pricingPlans: [],
    locations: [],
    features: [],
    gallery: [],
    testimonials: [],
    comments: [],

    // UI State
    lang: localStorage.getItem('calmology_lang') || 'ar',
    isAdmin: false,
    isLoading: false,

    // ─────────────────────────────────────────────────────────────────────────
    //  INITIALIZATION
    // ─────────────────────────────────────────────────────────────────────────
    async init() {
        // Set initial language direction
        document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.lang;
        document.body.style.fontFamily = this.lang === 'ar'
            ? "'Cairo', 'Inter', sans-serif"
            : "'Inter', 'Cairo', sans-serif";

        // Check if admin is logged in
        const token = api.getToken();
        if (token) {
            try {
                await api.request('/auth/verify', { method: 'GET', auth: true });
                this.isAdmin = true;
            } catch {
                api.removeToken();
                this.isAdmin = false;
            }
        }

        // Load all data
        await this.loadAllData();

        // Render everything
        this.render();

        // Setup event listeners
        this.setupEventListeners();
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  DATA LOADING
    // ─────────────────────────────────────────────────────────────────────────
    async loadAllData() {
        this.isLoading = true;

        try {
            // Load all data in parallel
            const [config, pricing, locations, features, gallery, testimonials, commentsRes] = await Promise.all([
                api.get('/config'),
                api.get('/pricing'),
                api.get('/locations'),
                api.get('/features'),
                api.get('/gallery'),
                api.get('/comments/testimonials'),
                api.get('/comments')
            ]);

            this.config = config;
            this.pricingPlans = pricing;
            this.locations = locations;
            this.features = features;
            this.gallery = gallery;
            this.testimonials = testimonials;
            this.comments = commentsRes.comments || [];

        } catch (error) {
            console.error('Failed to load data:', error);
            this.notify('فشل في تحميل البيانات', 'error');
        }

        this.isLoading = false;
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  NOTIFICATION SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    notify(msg, type = 'success') {
        const colors = {
            success: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            error: 'bg-gradient-to-r from-red-500 to-rose-600',
            info: 'bg-gradient-to-r from-blue-500 to-indigo-600'
        };
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `fixed bottom-6 ${this.lang === 'ar' ? 'left-6' : 'right-6'} ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl transform translate-y-20 opacity-0 transition-all duration-500 z-[9999] flex items-center gap-3 backdrop-blur-xl`;
        toast.innerHTML = `<i class="fas ${icons[type]} text-xl"></i><span class="font-medium">${msg}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-20', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  LANGUAGE MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────
    setLang(l) {
        this.lang = l;
        localStorage.setItem('calmology_lang', l);
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = l;

        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            langBtn.textContent = l === 'ar' ? 'EN' : 'عربي';
        }

        document.body.style.fontFamily = l === 'ar'
            ? "'Cairo', 'Inter', sans-serif"
            : "'Inter', 'Cairo', sans-serif";

        this.render();
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  MASTER RENDER ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    render() {
        // 1. Update all translatable text
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.dataset[this.lang];
        });

        // 2. Dynamic Branding
        this.renderBranding();

        // 3. Contact Links
        this.renderContactLinks();

        // 4. Complex Components
        this.renderPricingPlans();
        this.renderLocations();
        this.renderFeatures();
        this.renderGallery();
        this.renderTestimonials();
        this.renderComments();
        this.renderStats();

        // 5. Trigger scroll animations
        this.initScrollAnimations();
    },

    renderBranding() {
        const cfg = this.config;

        // Hero Image
        const heroImg = document.getElementById('heroImg');
        if (heroImg && cfg.hero_image) heroImg.src = cfg.hero_image;

        // Hero Title
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) heroTitle.textContent = this.lang === 'ar'
            ? (cfg.hero_title_ar || 'اعثر على')
            : (cfg.hero_title_en || 'Find Your');

        const heroHighlight = document.getElementById('heroHighlight');
        if (heroHighlight) heroHighlight.textContent = this.lang === 'ar'
            ? (cfg.hero_highlight_ar || 'منطقة هدوئك')
            : (cfg.hero_highlight_en || 'Calm Zone');

        // Slogan
        const slogan = document.getElementById('heroSlogan');
        if (slogan) slogan.textContent = this.lang === 'ar'
            ? (cfg.slogan_ar || '')
            : (cfg.slogan_en || '');
    },

    renderContactLinks() {
        const c = this.config;

        // WhatsApp Links
        document.querySelectorAll('[data-link="whatsapp"]').forEach(a => {
            a.href = `https://wa.me/${c.contact_whatsapp || '201110188600'}`;
        });

        // Phone Links
        document.querySelectorAll('[data-link="phone"]').forEach(a => {
            const phone = c.contact_phone || '011 10188600';
            a.href = `tel:${phone.replace(/\s/g, '')}`;
            if (a.dataset.showText) a.textContent = phone;
        });

        // Social Links
        document.querySelectorAll('[data-link="facebook"]').forEach(a => a.href = c.contact_facebook || '#');
        document.querySelectorAll('[data-link="instagram"]').forEach(a => a.href = c.contact_instagram || '#');
    },

    renderStats() {
        const cfg = this.config;
        const ratingEl = document.getElementById('statRating');
        const reviewsEl = document.getElementById('statReviews');
        const membersEl = document.getElementById('statMembers');

        if (ratingEl) ratingEl.textContent = cfg.stat_rating || '5.0';
        if (reviewsEl) reviewsEl.textContent = cfg.stat_reviews || '34';
        if (membersEl) membersEl.textContent = cfg.stat_members || '200+';
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  PRICING PLANS RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    renderPricingPlans() {
        const container = document.getElementById('pricing-container');
        if (!container) return;

        container.innerHTML = this.pricingPlans.map((plan, idx) => {
            const isPopular = plan.is_popular;
            const features = this.lang === 'ar' ? plan.features_ar : plan.features_en;
            const name = this.lang === 'ar' ? plan.name_ar : plan.name_en;

            return `
                <div class="pricing-card ${isPopular ? 'popular' : ''} reveal-item" style="--delay: ${idx * 0.1}s">
                    ${isPopular ? '<div class="popular-badge">' + (this.lang === 'ar' ? 'الأكثر طلباً' : 'Best Value') + '</div>' : ''}
                    <div class="pricing-icon ${isPopular ? 'bg-white/20' : 'bg-slate-100'}">
                        <i class="${plan.icon} text-2xl ${isPopular ? 'text-white' : 'text-teal-600'}"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${name}</h3>
                    <div class="pricing-amount">
                        <span class="price">${plan.price}</span>
                        <span class="currency">${plan.unit || 'EGP'}</span>
                    </div>
                    <ul class="features-list">
                        ${(features || []).map(f => `<li><i class="fas fa-check"></i>${f}</li>`).join('')}
                    </ul>
                    <a href="https://wa.me/${this.config.contact_whatsapp || '201110188600'}?text=${encodeURIComponent(this.lang === 'ar' ? 'مرحباً، أريد حجز ' + name : 'Hi, I want to book ' + name)}" target="_blank" class="pricing-btn ${isPopular ? 'popular' : ''}">
                        <i class="fab fa-whatsapp"></i>
                        ${this.lang === 'ar' ? 'احجز الآن' : 'Book Now'}
                    </a>
                </div>
            `;
        }).join('');
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  LOCATIONS RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    renderLocations() {
        const container = document.getElementById('locations-container');
        if (!container) return;

        container.innerHTML = this.locations.map((loc, idx) => `
            <div class="location-card reveal-item" style="--delay: ${idx * 0.15}s">
                ${loc.is_primary ? '<div class="primary-badge">' + (this.lang === 'ar' ? 'الفرع الرئيسي' : 'Main Branch') + '</div>' : ''}
                <div class="location-header">
                    <div class="location-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg">${this.lang === 'ar' ? loc.name_ar : loc.name_en}</h3>
                        <p class="text-sm text-slate-500">${this.lang === 'ar' ? loc.address_ar : loc.address_en}</p>
                    </div>
                </div>
                
                <div class="location-details">
                    <div class="detail-item highlight">
                        <i class="fas fa-clock text-teal-500"></i>
                        <span class="font-semibold text-teal-700">${this.lang === 'ar' ? loc.hours_ar : loc.hours_en}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone text-emerald-500"></i>
                        <a href="tel:${loc.phone.replace(/\s/g, '')}">${loc.phone}</a>
                    </div>
                </div>

                ${loc.map_url ? `
                <div class="map-wrapper">
                    <iframe src="${loc.map_url}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                ` : ''}

                <div class="location-actions">
                    <a href="https://wa.me/${loc.whatsapp}" target="_blank" class="action-btn whatsapp">
                        <i class="fab fa-whatsapp"></i>${this.lang === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=Calmology" target="_blank" class="action-btn directions">
                        <i class="fas fa-directions"></i>${this.lang === 'ar' ? 'الاتجاهات' : 'Directions'}
                    </a>
                </div>
            </div>
        `).join('');
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  FEATURES RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    renderFeatures() {
        const container = document.getElementById('features-container');
        if (!container) return;

        container.innerHTML = this.features.map((feat, idx) => `
            <div class="feature-card reveal-item" style="--delay: ${idx * 0.05}s">
                <div class="feature-icon">
                    <i class="${feat.icon}"></i>
                </div>
                <div class="feature-content">
                    <h4 class="font-bold">${this.lang === 'ar' ? feat.title_ar : feat.title_en}</h4>
                    <p class="text-sm text-slate-500">${this.lang === 'ar' ? feat.desc_ar : feat.desc_en}</p>
                </div>
            </div>
        `).join('');
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  GALLERY RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    renderGallery() {
        const container = document.getElementById('gallery-container');
        if (!container) return;

        container.innerHTML = this.gallery.map((img, idx) => `
            <div class="gallery-item" style="--delay: ${idx * 0.1}s">
                <img src="${img.image_url}" alt="${img.alt_text || 'Calmology Space ' + (idx + 1)}" loading="lazy">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `).join('');

        this.initGalleryNav();
    },

    initGalleryNav() {
        const container = document.getElementById('gallery-container');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');

        if (!container || !prevBtn || !nextBtn) return;

        const scrollAmount = 340;
        const isRTL = this.lang === 'ar';

        prevBtn.onclick = () => {
            container.scrollBy({ left: isRTL ? scrollAmount : -scrollAmount, behavior: 'smooth' });
        };

        nextBtn.onclick = () => {
            container.scrollBy({ left: isRTL ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        };
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  TESTIMONIALS RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    renderTestimonials() {
        const container = document.getElementById('testimonials-container');
        if (!container) return;

        container.innerHTML = this.testimonials.map((review, idx) => `
            <div class="testimonial-card reveal-item" style="--delay: ${idx * 0.1}s">
                <div class="testimonial-header">
                    <div class="testimonial-avatar" style="background: ${this.getAvatarColor(review.name_en)}">
                        ${(review.name_en || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-bold">${this.lang === 'ar' ? review.name_ar : review.name_en}</h4>
                        <div class="testimonial-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(review.rating || 5)}
                        </div>
                    </div>
                    <div class="google-badge">
                        <i class="fab fa-google"></i>
                    </div>
                </div>
                <p class="testimonial-text">${this.lang === 'ar' ? review.text_ar : review.text_en}</p>
            </div>
        `).join('');
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  USER COMMENTS SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    renderComments() {
        const container = document.getElementById('comments-list');
        if (!container) return;

        const approvedComments = this.comments.slice(0, 6);

        if (approvedComments.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 text-slate-400">
                    <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
                    <p>${this.lang === 'ar' ? 'كن أول من يترك تعليقاً!' : 'Be the first to leave a review!'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = approvedComments.map((comment, idx) => `
            <div class="comment-card reveal-item" style="--delay: ${idx * 0.1}s">
                <div class="comment-header">
                    <div class="comment-avatar" style="background: ${this.getAvatarColor(comment.name)}">
                        ${comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-bold">${comment.name}</h4>
                        <span class="text-xs text-slate-400">${this.formatDate(comment.created_at)}</span>
                    </div>
                </div>
                <p class="comment-text">${comment.text}</p>
            </div>
        `).join('');
    },

    async addComment(name, text) {
        try {
            await api.post('/comments', { name: name.trim(), text: text.trim() });
            await this.loadAllData();
            this.renderComments();
            this.notify(this.lang === 'ar' ? 'شكراً لتعليقك!' : 'Thank you for your review!');
        } catch (error) {
            this.notify(this.lang === 'ar' ? 'حدث خطأ' : 'An error occurred', 'error');
        }
    },

    async deleteComment(id) {
        try {
            await api.delete(`/comments/${id}`);
            await this.loadAllData();
            this.renderComments();
            if (typeof renderAdminComments === 'function') renderAdminComments();
            this.notify('Comment deleted', 'info');
        } catch (error) {
            this.notify('Failed to delete', 'error');
        }
    },

    getAvatarColor(name) {
        const colors = ['#0d9488', '#059669', '#0891b2', '#7c3aed', '#db2777', '#ea580c'];
        let hash = 0;
        for (let i = 0; i < (name || '').length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return this.lang === 'ar' ? 'اليوم' : 'Today';
        if (diffDays === 1) return this.lang === 'ar' ? 'أمس' : 'Yesterday';
        if (diffDays < 7) return this.lang === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;

        return date.toLocaleDateString(this.lang === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  SCROLL ANIMATIONS
    // ─────────────────────────────────────────────────────────────────────────
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  EVENT LISTENERS SETUP
    // ─────────────────────────────────────────────────────────────────────────
    setupEventListeners() {
        // Language Toggle
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            langBtn.textContent = this.lang === 'ar' ? 'EN' : 'عربي';
            langBtn.onclick = () => this.setLang(this.lang === 'en' ? 'ar' : 'en');
        }

        // Comment Form
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.onsubmit = async (e) => {
                e.preventDefault();
                const name = document.getElementById('commentName').value;
                const text = document.getElementById('commentText').value;
                if (name && text) {
                    await this.addComment(name, text);
                    commentForm.reset();
                }
            };
        }

        // Mobile Menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.onclick = () => {
                mobileMenu.classList.toggle('hidden');
                mobileMenu.classList.toggle('flex');
            };

            mobileMenu.querySelectorAll('a').forEach(a => {
                a.onclick = () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                };
            });
        }

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  ADMIN CRUD OPERATIONS (API-based)
    // ─────────────────────────────────────────────────────────────────────────

    // PRICING PLANS
    async addPlan() {
        try {
            await api.post('/pricing', {
                name_en: 'New Plan',
                name_ar: 'خطة جديدة',
                price: 50,
                unit: 'EGP',
                icon: 'fas fa-tag',
                is_popular: false,
                features_en: ['Feature 1'],
                features_ar: ['ميزة ١']
            }, true);
            await this.loadAllData();
            if (typeof renderAdminPricing === 'function') renderAdminPricing();
            this.notify('Plan added');
        } catch (error) {
            this.notify('Failed to add plan', 'error');
        }
    },

    async removePlan(id) {
        if (confirm('Delete this pricing plan?')) {
            try {
                await api.delete(`/pricing/${id}`);
                await this.loadAllData();
                if (typeof renderAdminPricing === 'function') renderAdminPricing();
                this.notify('Plan deleted');
            } catch (error) {
                this.notify('Failed to delete', 'error');
            }
        }
    },

    async updatePlan(id, data) {
        try {
            await api.put(`/pricing/${id}`, data);
            await this.loadAllData();
            this.notify('Plan updated');
        } catch (error) {
            this.notify('Failed to update', 'error');
        }
    },

    // LOCATIONS
    async addLocation() {
        try {
            await api.post('/locations', {
                name_en: 'New Branch',
                name_ar: 'فرع جديد',
                address_en: 'Address',
                address_ar: 'العنوان',
                phone: '011XXXXXXXX',
                whatsapp: '2011XXXXXXXX',
                hours_en: 'Open 24 Hours',
                hours_ar: 'مفتوح ٢٤ ساعة',
                map_url: '',
                is_primary: false
            }, true);
            await this.loadAllData();
            if (typeof renderAdminLocations === 'function') renderAdminLocations();
            this.notify('Location added');
        } catch (error) {
            this.notify('Failed to add location', 'error');
        }
    },

    async removeLocation(id) {
        if (confirm('Delete this location?')) {
            try {
                await api.delete(`/locations/${id}`);
                await this.loadAllData();
                if (typeof renderAdminLocations === 'function') renderAdminLocations();
                this.notify('Location deleted');
            } catch (error) {
                this.notify('Failed to delete', 'error');
            }
        }
    },

    async updateLocation(id, data) {
        try {
            await api.put(`/locations/${id}`, data);
            await this.loadAllData();
            this.notify('Location updated');
        } catch (error) {
            this.notify('Failed to update', 'error');
        }
    },

    // FEATURES
    async addFeature() {
        try {
            await api.post('/features', {
                icon: 'fas fa-star',
                title_en: 'New Feature',
                title_ar: 'ميزة جديدة',
                desc_en: 'Description',
                desc_ar: 'الوصف'
            }, true);
            await this.loadAllData();
            if (typeof renderAdminFeatures === 'function') renderAdminFeatures();
            this.notify('Feature added');
        } catch (error) {
            this.notify('Failed to add feature', 'error');
        }
    },

    async removeFeature(id) {
        try {
            await api.delete(`/features/${id}`);
            await this.loadAllData();
            if (typeof renderAdminFeatures === 'function') renderAdminFeatures();
            this.notify('Feature deleted');
        } catch (error) {
            this.notify('Failed to delete', 'error');
        }
    },

    async updateFeature(id, data) {
        try {
            await api.put(`/features/${id}`, data);
            await this.loadAllData();
        } catch (error) {
            this.notify('Failed to update', 'error');
        }
    },

    // GALLERY
    async addGalleryImage() {
        const url = prompt(this.lang === 'ar' ? 'أدخل رابط الصورة:' : 'Enter Image URL:');
        if (url && url.trim()) {
            try {
                await api.post('/gallery', { image_url: url.trim() }, true);
                await this.loadAllData();
                if (typeof renderAdminGallery === 'function') renderAdminGallery();
                this.notify('Image added');
            } catch (error) {
                this.notify('Failed to add image', 'error');
            }
        }
    },

    async removeGalleryImage(id) {
        try {
            await api.delete(`/gallery/${id}`);
            await this.loadAllData();
            if (typeof renderAdminGallery === 'function') renderAdminGallery();
            this.notify('Image deleted');
        } catch (error) {
            this.notify('Failed to delete', 'error');
        }
    },

    // CONFIG
    async updateConfig(data) {
        try {
            await api.put('/config', data, true);
            await this.loadAllData();
            this.render();
            this.notify('Configuration saved');
        } catch (error) {
            this.notify('Failed to save', 'error');
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Check if this is admin panel
    if (document.body.id === 'adminPanel') {
        initAdminPanel();
    } else {
        State.init();
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN PANEL LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

async function initAdminPanel() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    // Check if already logged in
    const token = api.getToken();
    if (token) {
        try {
            await api.request('/auth/verify', { method: 'GET', auth: true });
            State.isAdmin = true;
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            await State.loadAllData();
            setupAdminDashboard();
        } catch {
            api.removeToken();
            State.isAdmin = false;
        }
    }

    if (!State.isAdmin) {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
}

function setupAdminDashboard() {
    renderAdminBranding();
    renderAdminContact();
    renderAdminPricing();
    renderAdminLocations();
    renderAdminFeatures();
    renderAdminGallery();
    renderAdminComments();

    document.getElementById('logoutBtn').onclick = () => {
        api.removeToken();
        location.reload();
    };

    document.getElementById('saveAllBtn').onclick = async () => {
        await collectAndSaveAllData();
    };
}

function renderAdminBranding() {
    const cfg = State.config;
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    setVal('brandHeroTitleEn', cfg.hero_title_en);
    setVal('brandHeroTitleAr', cfg.hero_title_ar);
    setVal('brandHeroHighlightEn', cfg.hero_highlight_en);
    setVal('brandHeroHighlightAr', cfg.hero_highlight_ar);
    setVal('brandSloganEn', cfg.slogan_en);
    setVal('brandSloganAr', cfg.slogan_ar);
    setVal('brandHeroImage', cfg.hero_image);
}

function renderAdminContact() {
    const cfg = State.config;
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    setVal('contactPhone', cfg.contact_phone);
    setVal('contactWhatsapp', cfg.contact_whatsapp);
    setVal('contactFacebook', cfg.contact_facebook);
    setVal('contactInstagram', cfg.contact_instagram);
}

async function collectAndSaveAllData() {
    const getVal = (id) => document.getElementById(id)?.value || '';

    const configData = {
        hero_title_en: getVal('brandHeroTitleEn'),
        hero_title_ar: getVal('brandHeroTitleAr'),
        hero_highlight_en: getVal('brandHeroHighlightEn'),
        hero_highlight_ar: getVal('brandHeroHighlightAr'),
        slogan_en: getVal('brandSloganEn'),
        slogan_ar: getVal('brandSloganAr'),
        hero_image: getVal('brandHeroImage'),
        contact_phone: getVal('contactPhone'),
        contact_whatsapp: getVal('contactWhatsapp'),
        contact_facebook: getVal('contactFacebook'),
        contact_instagram: getVal('contactInstagram')
    };

    await State.updateConfig(configData);
}

function renderAdminPricing() {
    const container = document.getElementById('admin-pricing-list');
    if (!container) return;

    container.innerHTML = State.pricingPlans.map(plan => `
        <div class="admin-card ${plan.is_popular ? 'popular-highlight' : ''}" data-plan-id="${plan.id}">
            <div class="admin-card-header">
                <div class="flex items-center gap-3">
                    <div class="admin-icon-preview">
                        <i class="${plan.icon}"></i>
                    </div>
                    <div>
                        <input type="text" value="${plan.name_en}" data-field="name_en" class="admin-input font-bold" placeholder="Name EN">
                        <input type="text" value="${plan.name_ar}" data-field="name_ar" class="admin-input text-sm" placeholder="الاسم">
                    </div>
                </div>
                <button onclick="State.removePlan(${plan.id})" class="admin-delete-btn"><i class="fas fa-trash"></i></button>
            </div>
            <div class="admin-card-body">
                <div class="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="admin-label">Price</label>
                        <input type="number" value="${plan.price}" data-field="price" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Unit</label>
                        <input type="text" value="${plan.unit || 'EGP'}" data-field="unit" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Icon</label>
                        <input type="text" value="${plan.icon}" data-field="icon" class="admin-input font-mono text-xs">
                    </div>
                </div>
                <div class="flex items-center gap-3 mb-4">
                    <label class="admin-toggle">
                        <input type="checkbox" ${plan.is_popular ? 'checked' : ''} data-field="is_popular">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="text-sm font-medium text-slate-600">Most Popular</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="admin-label">Features (EN)</label>
                        <textarea data-field="features_en" class="admin-textarea" rows="3">${(plan.features_en || []).join('\n')}</textarea>
                    </div>
                    <div>
                        <label class="admin-label">Features (AR)</label>
                        <textarea data-field="features_ar" class="admin-textarea" rows="3">${(plan.features_ar || []).join('\n')}</textarea>
                    </div>
                </div>
                <button onclick="savePlan(${plan.id})" class="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition">
                    <i class="fas fa-save ml-1"></i> حفظ الخطة
                </button>
            </div>
        </div>
    `).join('');
}

window.savePlan = async (id) => {
    const card = document.querySelector(`[data-plan-id="${id}"]`);
    if (!card) return;

    const data = {
        name_en: card.querySelector('[data-field="name_en"]').value,
        name_ar: card.querySelector('[data-field="name_ar"]').value,
        price: parseInt(card.querySelector('[data-field="price"]').value),
        unit: card.querySelector('[data-field="unit"]').value,
        icon: card.querySelector('[data-field="icon"]').value,
        is_popular: card.querySelector('[data-field="is_popular"]').checked,
        features_en: card.querySelector('[data-field="features_en"]').value.split('\n').filter(f => f.trim()),
        features_ar: card.querySelector('[data-field="features_ar"]').value.split('\n').filter(f => f.trim())
    };

    await State.updatePlan(id, data);
    renderAdminPricing();
};

function renderAdminLocations() {
    const container = document.getElementById('admin-locations-list');
    if (!container) return;

    container.innerHTML = State.locations.map(loc => `
        <div class="admin-card ${loc.is_primary ? 'primary-highlight' : ''}" data-loc-id="${loc.id}">
            <div class="admin-card-header">
                <div class="flex items-center gap-3">
                    <div class="admin-icon-preview bg-teal-100 text-teal-600">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <input type="text" value="${loc.name_en}" data-field="name_en" class="admin-input font-bold" placeholder="Branch Name EN">
                        <input type="text" value="${loc.name_ar}" data-field="name_ar" class="admin-input text-sm" placeholder="اسم الفرع">
                    </div>
                </div>
                <button onclick="State.removeLocation(${loc.id})" class="admin-delete-btn"><i class="fas fa-trash"></i></button>
            </div>
            <div class="admin-card-body space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="admin-label">Address (EN)</label>
                        <input type="text" value="${loc.address_en}" data-field="address_en" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Address (AR)</label>
                        <input type="text" value="${loc.address_ar}" data-field="address_ar" class="admin-input">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="admin-label">Phone</label>
                        <input type="text" value="${loc.phone}" data-field="phone" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">WhatsApp</label>
                        <input type="text" value="${loc.whatsapp}" data-field="whatsapp" class="admin-input">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="admin-label">Hours (EN)</label>
                        <input type="text" value="${loc.hours_en}" data-field="hours_en" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Hours (AR)</label>
                        <input type="text" value="${loc.hours_ar}" data-field="hours_ar" class="admin-input">
                    </div>
                </div>
                <div>
                    <label class="admin-label">Google Maps Embed URL</label>
                    <input type="text" value="${loc.map_url || ''}" data-field="map_url" class="admin-input font-mono text-xs">
                </div>
                <div class="flex items-center gap-3">
                    <label class="admin-toggle">
                        <input type="checkbox" ${loc.is_primary ? 'checked' : ''} data-field="is_primary">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="text-sm font-medium text-slate-600">Primary Branch</span>
                </div>
                <button onclick="saveLocation(${loc.id})" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition">
                    <i class="fas fa-save ml-1"></i> حفظ الفرع
                </button>
            </div>
        </div>
    `).join('');
}

window.saveLocation = async (id) => {
    const card = document.querySelector(`[data-loc-id="${id}"]`);
    if (!card) return;

    const data = {
        name_en: card.querySelector('[data-field="name_en"]').value,
        name_ar: card.querySelector('[data-field="name_ar"]').value,
        address_en: card.querySelector('[data-field="address_en"]').value,
        address_ar: card.querySelector('[data-field="address_ar"]').value,
        phone: card.querySelector('[data-field="phone"]').value,
        whatsapp: card.querySelector('[data-field="whatsapp"]').value,
        hours_en: card.querySelector('[data-field="hours_en"]').value,
        hours_ar: card.querySelector('[data-field="hours_ar"]').value,
        map_url: card.querySelector('[data-field="map_url"]').value,
        is_primary: card.querySelector('[data-field="is_primary"]').checked
    };

    await State.updateLocation(id, data);
    renderAdminLocations();
};

function renderAdminFeatures() {
    const container = document.getElementById('admin-features-list');
    if (!container) return;

    container.innerHTML = State.features.map(feat => `
        <div class="admin-feature-row" data-feat-id="${feat.id}">
            <div class="admin-icon-preview small">
                <i class="${feat.icon}"></i>
            </div>
            <input type="text" value="${feat.icon}" data-field="icon" class="admin-input-sm w-28 font-mono" placeholder="fas fa-...">
            <input type="text" value="${feat.title_en}" data-field="title_en" class="admin-input-sm flex-1" placeholder="Title EN">
            <input type="text" value="${feat.title_ar}" data-field="title_ar" class="admin-input-sm flex-1" placeholder="العنوان">
            <button onclick="saveFeature(${feat.id})" class="admin-save-btn-sm"><i class="fas fa-check"></i></button>
            <button onclick="State.removeFeature(${feat.id})" class="admin-delete-btn-sm"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

window.saveFeature = async (id) => {
    const row = document.querySelector(`[data-feat-id="${id}"]`);
    if (!row) return;

    const data = {
        icon: row.querySelector('[data-field="icon"]').value,
        title_en: row.querySelector('[data-field="title_en"]').value,
        title_ar: row.querySelector('[data-field="title_ar"]').value
    };

    await State.updateFeature(id, data);
    renderAdminFeatures();
};

function renderAdminGallery() {
    const container = document.getElementById('admin-gallery-grid');
    if (!container) return;

    container.innerHTML = State.gallery.map((img) => `
        <div class="admin-gallery-item group">
            <img src="${img.image_url}" alt="Gallery ${img.id}">
            <div class="admin-gallery-overlay">
                <button onclick="State.removeGalleryImage(${img.id})" class="admin-gallery-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('') + `
        <button onclick="State.addGalleryImage()" class="admin-gallery-add">
            <i class="fas fa-plus text-2xl"></i>
            <span>Add Photo</span>
        </button>
    `;
}

function renderAdminComments() {
    const container = document.getElementById('admin-comments-list');
    if (!container) return;

    if (State.comments.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-8 text-slate-400">
                    <i class="fas fa-inbox text-3xl mb-2"></i>
                    <p>No comments yet</p>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = State.comments.map(c => `
        <tr class="hover:bg-slate-50 transition">
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background: ${State.getAvatarColor(c.name)}">
                        ${c.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="font-medium">${c.name}</span>
                </div>
            </td>
            <td class="p-4 text-slate-600 max-w-md">${c.text}</td>
            <td class="p-4 text-slate-400 text-sm">${State.formatDate(c.created_at)}</td>
            <td class="p-4">
                <button onclick="State.deleteComment(${c.id})" class="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition text-sm">
                    <i class="fas fa-trash ml-1"></i>Delete
                </button>
            </td>
        </tr>
    `).join('');
}

window.switchTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId)?.classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-teal-600', 'text-white');
        el.classList.add('text-slate-600', 'hover:bg-slate-50');
    });
    event.currentTarget.classList.add('bg-teal-600', 'text-white');
    event.currentTarget.classList.remove('text-slate-600', 'hover:bg-slate-50');
};

window.adminLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await api.post('/auth/login', { username, password });

        if (response.token) {
            api.setToken(response.token);
            State.isAdmin = true;
            State.notify('مرحباً بك في لوحة التحكم! 👋', 'success');
            setTimeout(() => location.reload(), 500);
        }
    } catch (error) {
        State.notify('بيانات الدخول غير صحيحة', 'error');
        document.getElementById('loginPassword').value = '';
    }
};

// Expose State globally
window.State = State;
window.api = api;
