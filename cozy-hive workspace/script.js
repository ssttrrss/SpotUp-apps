/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  COZY HIVE ENTERPRISE CMS ENGINE V4.0
 *  Production-Ready Dynamic Content Management System
 *  Built for Cozy Hive Coworking Space
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
//  DEFAULT CONFIGURATION - THE SEED DATA
// ═══════════════════════════════════════════════════════════════════════════════
const DEFAULT_CONFIG = {
    // Branding & Hero Section
    branding: {
        logoUrl: "https://tabexseriesmedia.s3.eu-north-1.amazonaws.com/storeinfo/6935c04816952/instlogo1765796108.png",
        heroTitleEn: "Your Space to",
        heroTitleAr: "مساحتك الـ",
        heroHighlightEn: "Create & Grow",
        heroHighlightAr: "تبدع وتنمو",
        sloganEn: "Experience the perfect balance of comfort and productivity in the heart of Cairo.",
        sloganAr: "جرب التوازن المثالي بين الراحة والإنتاجية في قلب القاهرة.",
        heroImage: "https://tabexseriesmedia.s3.eu-north-1.amazonaws.com/products/6935c04816952/693ffbcb9ddb5generalimage.png",
        since: "2021"
    },

    // Contact Information
    contact: {
        phone: "+20 108 036 4642",
        whatsapp: "201080364642",
        email: "hello@cozyhive.com",
        facebook: "https://www.facebook.com/cozyhivee",
        instagram: "https://www.instagram.com/cozyhive_/",
        twitter: "",
        linkedin: ""
    },

    // Pricing Plans (Dynamic with CRUD)
    pricingPlans: [
        {
            id: 1,
            nameEn: "Day Pass",
            nameAr: "يومي",
            price: 150,
            icon: "fas fa-sun",
            isPopular: false,
            featuresEn: ["Full day access", "High-speed WiFi", "Free coffee & tea", "Printing (10 pages)"],
            featuresAr: ["وصول ليوم كامل", "إنترنت فائق السرعة", "قهوة وشاي مجاني", "طباعة (10 صفحات)"]
        },
        {
            id: 2,
            nameEn: "Weekly Pass",
            nameAr: "أسبوعي",
            price: 750,
            icon: "fas fa-star",
            isPopular: true,
            featuresEn: ["7 days access", "High-speed WiFi", "Unlimited beverages", "Printing (50 pages)", "Meeting room (2 hrs)"],
            featuresAr: ["وصول لـ 7 أيام", "إنترنت فائق السرعة", "مشروبات غير محدودة", "طباعة (50 صفحة)", "غرفة اجتماعات (ساعتين)"]
        },
        {
            id: 3,
            nameEn: "Monthly Pass",
            nameAr: "شهري",
            price: 2500,
            icon: "fas fa-crown",
            isPopular: false,
            featuresEn: ["30 days access", "Dedicated desk", "All amenities included", "Unlimited printing", "Meeting room (8 hrs)", "Locker storage"],
            featuresAr: ["وصول لـ 30 يوم", "مكتب مخصص", "جميع المرافق", "طباعة غير محدودة", "غرفة اجتماعات (8 ساعات)", "خزانة تخزين"]
        }
    ],

    // Branches & Locations
    locations: [
        {
            id: 1,
            nameEn: "Zamalek Branch",
            nameAr: "فرع الزمالك",
            addressEn: "11 El-Kamel Mohamed St, Zamalek, Cairo",
            addressAr: "١١ شارع الكامل محمد، الزمالك، القاهرة",
            phone: "+20 108 036 4642",
            whatsapp: "201080364642",
            hoursEn: "Sat - Thu: 9AM - 10PM",
            hoursAr: "السبت - الخميس: ٩ص - ١٠م",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.283838407844!2d31.2181816!3d30.0605986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584118e59d7ebb%3A0x665cb2c5489f7bfe!2sCozy%20Hive!5e0!3m2!1sen!2seg!4v1703699999999",
            isPrimary: true
        }
    ],

    // Features & Amenities
    features: [
        { id: 1, icon: "fas fa-wifi", titleEn: "High Speed WiFi", titleAr: "إنترنت فائق السرعة", descEn: "100 Mbps fiber connection", descAr: "اتصال فايبر ١٠٠ ميجا" },
        { id: 2, icon: "fas fa-coffee", titleEn: "Free Beverages", titleAr: "مشروبات مجانية", descEn: "Coffee, tea, and more", descAr: "قهوة، شاي، والمزيد" },
        { id: 3, icon: "fas fa-print", titleEn: "Printing Service", titleAr: "خدمات الطباعة", descEn: "Scan, print, and copy", descAr: "مسح، طباعة، ونسخ" },
        { id: 4, icon: "fas fa-user-lock", titleEn: "Private Booths", titleAr: "كابينات خاصة", descEn: "For focused work", descAr: "للعمل المركز" },
        { id: 5, icon: "fas fa-snowflake", titleEn: "Air Conditioning", titleAr: "تكييف هواء", descEn: "Perfect temperature", descAr: "درجة حرارة مثالية" },
        { id: 6, icon: "fas fa-door-open", titleEn: "Meeting Rooms", titleAr: "غرف اجتماعات", descEn: "Fully equipped rooms", descAr: "غرف مجهزة بالكامل" }
    ],

    // Photo Gallery
    gallery: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80"
    ]
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CORE STATE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
const State = {
    // Deep merge defaults with saved config
    config: deepMerge(DEFAULT_CONFIG, JSON.parse(localStorage.getItem('cozy_config_v4') || '{}')),
    comments: JSON.parse(localStorage.getItem('cozy_comments') || '[]'),
    lang: localStorage.getItem('cozy_lang') || 'en',
    isAdmin: sessionStorage.getItem('cozy_admin') === 'true',

    // ─────────────────────────────────────────────────────────────────────────
    //  DATA PERSISTENCE
    // ─────────────────────────────────────────────────────────────────────────
    save() {
        localStorage.setItem('cozy_config_v4', JSON.stringify(this.config));
        this.notify('✓ Changes saved successfully!');
    },

    saveComments() {
        localStorage.setItem('cozy_comments', JSON.stringify(this.comments));
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  NOTIFICATION SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    notify(msg, type = 'success') {
        const colors = {
            success: 'bg-gradient-to-r from-green-500 to-emerald-600',
            error: 'bg-gradient-to-r from-red-500 to-rose-600',
            info: 'bg-gradient-to-r from-primary to-secondary'
        };
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `fixed bottom-6 right-6 ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl transform translate-y-20 opacity-0 transition-all duration-500 z-[9999] flex items-center gap-3 backdrop-blur-xl`;
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
        localStorage.setItem('cozy_lang', l);
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = l;

        // Update lang toggle button
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            langBtn.textContent = l === 'ar' ? 'EN' : 'AR';
        }

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
        this.renderComments();

        // 5. Trigger scroll animations
        this.initScrollAnimations();
    },

    renderBranding() {
        const cfg = this.config.branding;

        // Hero Image
        const heroImg = document.getElementById('heroImg');
        if (heroImg) heroImg.src = cfg.heroImage;

        // Hero Title
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) heroTitle.textContent = this.lang === 'ar' ? cfg.heroTitleAr : cfg.heroTitleEn;

        const heroHighlight = document.getElementById('heroHighlight');
        if (heroHighlight) heroHighlight.textContent = this.lang === 'ar' ? cfg.heroHighlightAr : cfg.heroHighlightEn;

        // Slogan
        const slogan = document.getElementById('heroSlogan');
        if (slogan) slogan.textContent = this.lang === 'ar' ? cfg.sloganAr : cfg.sloganEn;

        // Since Badge
        const sinceBadge = document.getElementById('sinceBadge');
        if (sinceBadge) sinceBadge.textContent = `Since ${cfg.since}`;
    },

    renderContactLinks() {
        const c = this.config.contact;

        // WhatsApp Links
        document.querySelectorAll('[data-link="whatsapp"]').forEach(a => {
            a.href = `https://wa.me/${c.whatsapp}`;
        });

        // Phone Links
        document.querySelectorAll('[data-link="phone"]').forEach(a => {
            a.href = `tel:${c.phone.replace(/\s/g, '')}`;
            if (a.dataset.showText) a.textContent = c.phone;
        });

        // Social Links
        document.querySelectorAll('[data-link="facebook"]').forEach(a => a.href = c.facebook);
        document.querySelectorAll('[data-link="instagram"]').forEach(a => a.href = c.instagram);
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  PRICING PLANS RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    renderPricingPlans() {
        const container = document.getElementById('pricing-container');
        if (!container) return;

        const plans = this.config.pricingPlans;

        container.innerHTML = plans.map((plan, idx) => {
            const isPopular = plan.isPopular;
            const features = this.lang === 'ar' ? plan.featuresAr : plan.featuresEn;
            const name = this.lang === 'ar' ? plan.nameAr : plan.nameEn;

            return `
                <div class="pricing-card ${isPopular ? 'popular' : ''} reveal-item" style="--delay: ${idx * 0.1}s">
                    ${isPopular ? '<div class="popular-badge">' + (this.lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular') + '</div>' : ''}
                    <div class="pricing-icon ${isPopular ? 'bg-white/20' : 'bg-gray-50'}">
                        <i class="${plan.icon} text-2xl ${isPopular ? 'text-white' : 'text-primary'}"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${name}</h3>
                    <div class="pricing-amount">
                        <span class="currency">EGP</span>
                        <span class="price">${plan.price.toLocaleString()}</span>
                    </div>
                    <ul class="features-list">
                        ${features.map(f => `<li><i class="fas fa-check"></i>${f}</li>`).join('')}
                    </ul>
                    <a href="https://wa.me/${this.config.contact.whatsapp}" target="_blank" class="pricing-btn ${isPopular ? 'popular' : ''}">
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

        container.innerHTML = this.config.locations.map((loc, idx) => `
            <div class="location-card reveal-item" style="--delay: ${idx * 0.15}s">
                ${loc.isPrimary ? '<div class="primary-badge">' + (this.lang === 'ar' ? 'الفرع الرئيسي' : 'Main Branch') + '</div>' : ''}
                <div class="location-header">
                    <div class="location-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-dark">${this.lang === 'ar' ? loc.nameAr : loc.nameEn}</h3>
                        <p class="text-sm text-gray-500">${this.lang === 'ar' ? loc.addressAr : loc.addressEn}</p>
                    </div>
                </div>
                
                <div class="location-details">
                    <div class="detail-item">
                        <i class="fas fa-clock text-primary"></i>
                        <span>${this.lang === 'ar' ? loc.hoursAr : loc.hoursEn}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone text-green-500"></i>
                        <a href="tel:${loc.phone.replace(/\s/g, '')}">${loc.phone}</a>
                    </div>
                </div>

                <div class="map-wrapper">
                    <iframe src="${loc.mapUrl}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>

                <div class="location-actions">
                    <a href="https://wa.me/${loc.whatsapp}" target="_blank" class="action-btn whatsapp">
                        <i class="fab fa-whatsapp"></i>${this.lang === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </a>
                    <a href="${loc.mapUrl.replace('/embed?', '/dir/')}" target="_blank" class="action-btn directions">
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

        container.innerHTML = this.config.features.map((feat, idx) => `
            <div class="feature-card reveal-item" style="--delay: ${idx * 0.08}s">
                <div class="feature-icon">
                    <i class="${feat.icon}"></i>
                </div>
                <div class="feature-content">
                    <h4 class="font-bold text-gray-800">${this.lang === 'ar' ? feat.titleAr : feat.titleEn}</h4>
                    <p class="text-sm text-gray-500">${this.lang === 'ar' ? feat.descAr : feat.descEn}</p>
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

        container.innerHTML = this.config.gallery.map((url, idx) => `
            <div class="gallery-item" style="--delay: ${idx * 0.1}s">
                <img src="${url}" alt="Cozy Hive Space ${idx + 1}" loading="lazy">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `).join('');

        // Initialize gallery navigation
        this.initGalleryNav();
    },

    initGalleryNav() {
        const container = document.getElementById('gallery-container');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');

        if (!container || !prevBtn || !nextBtn) return;

        const scrollAmount = 320;

        prevBtn.onclick = () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        };

        nextBtn.onclick = () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        };
    },

    // ─────────────────────────────────────────────────────────────────────────
    //  COMMENTS SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    renderComments() {
        const container = document.getElementById('comments-list');
        if (!container) return;

        // Show only approved comments (or all if no moderation field)
        const approvedComments = this.comments.filter(c => c.approved !== false).slice(0, 6);

        if (approvedComments.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-400">
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
                        <h4 class="font-bold text-gray-800">${comment.name}</h4>
                        <span class="text-xs text-gray-400">${this.formatDate(comment.date)}</span>
                    </div>
                </div>
                <p class="comment-text">${comment.text}</p>
                <div class="comment-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(5)}
                </div>
            </div>
        `).join('');
    },

    addComment(name, text) {
        const comment = {
            id: Date.now(),
            name: name.trim(),
            text: text.trim(),
            date: new Date().toISOString(),
            approved: true // Auto-approve for now, admin can delete
        };

        this.comments.unshift(comment);
        this.saveComments();
        this.renderComments();
        this.notify(this.lang === 'ar' ? 'شكراً لتعليقك!' : 'Thank you for your review!');
    },

    deleteComment(id) {
        this.comments = this.comments.filter(c => c.id !== id);
        this.saveComments();
        this.renderComments();
        if (typeof renderAdminComments === 'function') {
            renderAdminComments();
        }
        this.notify('Comment deleted', 'info');
    },

    getAvatarColor(name) {
        const colors = ['#0198b0', '#fd8f4e', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
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
    //  ADMIN CRUD OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────

    // PRICING PLANS
    addPlan() {
        this.config.pricingPlans.push({
            id: Date.now(),
            nameEn: "New Plan",
            nameAr: "خطة جديدة",
            price: 100,
            icon: "fas fa-tag",
            isPopular: false,
            featuresEn: ["New feature"],
            featuresAr: ["ميزة جديدة"]
        });
        this.save();
        if (typeof renderAdminPricing === 'function') renderAdminPricing();
    },

    removePlan(id) {
        if (confirm('Delete this pricing plan?')) {
            this.config.pricingPlans = this.config.pricingPlans.filter(p => p.id !== id);
            this.save();
            if (typeof renderAdminPricing === 'function') renderAdminPricing();
        }
    },

    updatePlan(id, field, value) {
        const plan = this.config.pricingPlans.find(p => p.id === id);
        if (plan) {
            if (field === 'price') {
                plan[field] = parseInt(value) || 0;
            } else if (field === 'isPopular') {
                // Only one can be popular
                this.config.pricingPlans.forEach(p => p.isPopular = false);
                plan.isPopular = value;
            } else if (field === 'featuresEn' || field === 'featuresAr') {
                plan[field] = value.split('\n').filter(f => f.trim());
            } else {
                plan[field] = value;
            }
        }
    },

    // LOCATIONS
    addLocation() {
        this.config.locations.push({
            id: Date.now(),
            nameEn: "New Branch",
            nameAr: "فرع جديد",
            addressEn: "Address Here",
            addressAr: "العنوان هنا",
            phone: "+20 1XX XXX XXXX",
            whatsapp: "201XXXXXXXXX",
            hoursEn: "Sat - Thu: 9AM - 10PM",
            hoursAr: "السبت - الخميس: ٩ص - ١٠م",
            mapUrl: "",
            isPrimary: false
        });
        this.save();
        if (typeof renderAdminLocations === 'function') renderAdminLocations();
    },

    removeLocation(id) {
        if (confirm('Delete this location?')) {
            this.config.locations = this.config.locations.filter(l => l.id !== id);
            this.save();
            if (typeof renderAdminLocations === 'function') renderAdminLocations();
        }
    },

    updateLocation(id, field, value) {
        const loc = this.config.locations.find(l => l.id === id);
        if (loc) {
            if (field === 'isPrimary') {
                this.config.locations.forEach(l => l.isPrimary = false);
                loc.isPrimary = value;
            } else {
                loc[field] = value;
            }
        }
    },

    // FEATURES
    addFeature() {
        this.config.features.push({
            id: Date.now(),
            icon: "fas fa-star",
            titleEn: "New Feature",
            titleAr: "ميزة جديدة",
            descEn: "Feature description",
            descAr: "وصف الميزة"
        });
        this.save();
        if (typeof renderAdminFeatures === 'function') renderAdminFeatures();
    },

    removeFeature(id) {
        this.config.features = this.config.features.filter(f => f.id !== id);
        this.save();
        if (typeof renderAdminFeatures === 'function') renderAdminFeatures();
    },

    updateFeature(id, field, value) {
        const feat = this.config.features.find(f => f.id === id);
        if (feat) feat[field] = value;
    },

    // GALLERY
    addGalleryImage() {
        const url = prompt("Enter Image URL:");
        if (url && url.trim()) {
            this.config.gallery.push(url.trim());
            this.save();
            if (typeof renderAdminGallery === 'function') renderAdminGallery();
        }
    },

    removeGalleryImage(index) {
        this.config.gallery.splice(index, 1);
        this.save();
        if (typeof renderAdminGallery === 'function') renderAdminGallery();
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Set initial language direction
    document.documentElement.dir = State.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = State.lang;

    // Render everything
    State.render();

    // Language Toggle
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = State.lang === 'ar' ? 'EN' : 'AR';
        langBtn.onclick = () => State.setLang(State.lang === 'en' ? 'ar' : 'en');
    }

    // Comment Form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('commentName').value;
            const text = document.getElementById('commentText').value;
            if (name && text) {
                State.addComment(name, text);
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

        // Close on link click
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
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Admin Panel Init
    if (document.body.id === 'adminPanel') {
        initAdminPanel();
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN PANEL LOGIC (Only runs on admin.html)
// ═══════════════════════════════════════════════════════════════════════════════

function initAdminPanel() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    if (!State.isAdmin) {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        return;
    }

    // Show Dashboard
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

    // Render all admin sections
    renderAdminBranding();
    renderAdminContact();
    renderAdminPricing();
    renderAdminLocations();
    renderAdminFeatures();
    renderAdminGallery();
    renderAdminComments();

    // Logout Handler
    document.getElementById('logoutBtn').onclick = () => {
        sessionStorage.removeItem('cozy_admin');
        location.reload();
    };

    // Save All Button
    document.getElementById('saveAllBtn').onclick = () => {
        // Collect all form data
        collectBrandingData();
        collectContactData();
        State.save();
        State.render();
    };
}

// ─────────────────────────────────────────────────────────────────────────
//  ADMIN RENDERERS
// ─────────────────────────────────────────────────────────────────────────

function renderAdminBranding() {
    const cfg = State.config.branding;
    document.getElementById('brandHeroTitleEn').value = cfg.heroTitleEn;
    document.getElementById('brandHeroTitleAr').value = cfg.heroTitleAr;
    document.getElementById('brandHeroHighlightEn').value = cfg.heroHighlightEn;
    document.getElementById('brandHeroHighlightAr').value = cfg.heroHighlightAr;
    document.getElementById('brandSloganEn').value = cfg.sloganEn;
    document.getElementById('brandSloganAr').value = cfg.sloganAr;
    document.getElementById('brandHeroImage').value = cfg.heroImage;
    document.getElementById('brandSince').value = cfg.since;
}

function collectBrandingData() {
    State.config.branding.heroTitleEn = document.getElementById('brandHeroTitleEn').value;
    State.config.branding.heroTitleAr = document.getElementById('brandHeroTitleAr').value;
    State.config.branding.heroHighlightEn = document.getElementById('brandHeroHighlightEn').value;
    State.config.branding.heroHighlightAr = document.getElementById('brandHeroHighlightAr').value;
    State.config.branding.sloganEn = document.getElementById('brandSloganEn').value;
    State.config.branding.sloganAr = document.getElementById('brandSloganAr').value;
    State.config.branding.heroImage = document.getElementById('brandHeroImage').value;
    State.config.branding.since = document.getElementById('brandSince').value;
}

function renderAdminContact() {
    const cfg = State.config.contact;
    document.getElementById('contactPhone').value = cfg.phone;
    document.getElementById('contactWhatsapp').value = cfg.whatsapp;
    document.getElementById('contactEmail').value = cfg.email || '';
    document.getElementById('contactFacebook').value = cfg.facebook;
    document.getElementById('contactInstagram').value = cfg.instagram;
}

function collectContactData() {
    State.config.contact.phone = document.getElementById('contactPhone').value;
    State.config.contact.whatsapp = document.getElementById('contactWhatsapp').value;
    State.config.contact.email = document.getElementById('contactEmail').value;
    State.config.contact.facebook = document.getElementById('contactFacebook').value;
    State.config.contact.instagram = document.getElementById('contactInstagram').value;
}

function renderAdminPricing() {
    const container = document.getElementById('admin-pricing-list');
    if (!container) return;

    container.innerHTML = State.config.pricingPlans.map(plan => `
        <div class="admin-card ${plan.isPopular ? 'popular-highlight' : ''}" data-plan-id="${plan.id}">
            <div class="admin-card-header">
                <div class="flex items-center gap-3">
                    <div class="admin-icon-preview">
                        <i class="${plan.icon}"></i>
                    </div>
                    <div>
                        <input type="text" value="${plan.nameEn}" onchange="State.updatePlan(${plan.id}, 'nameEn', this.value)" class="admin-input font-bold" placeholder="Name EN">
                        <input type="text" value="${plan.nameAr}" onchange="State.updatePlan(${plan.id}, 'nameAr', this.value)" class="admin-input text-right text-sm" placeholder="الاسم عربي" dir="rtl">
                    </div>
                </div>
                <button onclick="State.removePlan(${plan.id})" class="admin-delete-btn"><i class="fas fa-trash"></i></button>
            </div>
            
            <div class="admin-card-body">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="admin-label">Price (EGP)</label>
                        <input type="number" value="${plan.price}" onchange="State.updatePlan(${plan.id}, 'price', this.value)" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Icon Class</label>
                        <input type="text" value="${plan.icon}" onchange="State.updatePlan(${plan.id}, 'icon', this.value); this.closest('.admin-card').querySelector('.admin-icon-preview i').className = this.value" class="admin-input font-mono text-xs">
                    </div>
                </div>
                
                <div class="flex items-center gap-3 mb-4">
                    <label class="admin-toggle">
                        <input type="checkbox" ${plan.isPopular ? 'checked' : ''} onchange="State.updatePlan(${plan.id}, 'isPopular', this.checked); renderAdminPricing()">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="text-sm font-medium text-gray-600">Mark as Popular</span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="admin-label">Features (EN) - One per line</label>
                        <textarea onchange="State.updatePlan(${plan.id}, 'featuresEn', this.value)" class="admin-textarea" rows="4">${plan.featuresEn.join('\n')}</textarea>
                    </div>
                    <div>
                        <label class="admin-label">Features (AR) - One per line</label>
                        <textarea onchange="State.updatePlan(${plan.id}, 'featuresAr', this.value)" class="admin-textarea text-right" dir="rtl" rows="4">${plan.featuresAr.join('\n')}</textarea>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAdminLocations() {
    const container = document.getElementById('admin-locations-list');
    if (!container) return;

    container.innerHTML = State.config.locations.map(loc => `
        <div class="admin-card ${loc.isPrimary ? 'primary-highlight' : ''}" data-loc-id="${loc.id}">
            <div class="admin-card-header">
                <div class="flex items-center gap-3">
                    <div class="admin-icon-preview bg-primary/10 text-primary">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <input type="text" value="${loc.nameEn}" onchange="State.updateLocation(${loc.id}, 'nameEn', this.value)" class="admin-input font-bold" placeholder="Branch Name EN">
                        <input type="text" value="${loc.nameAr}" onchange="State.updateLocation(${loc.id}, 'nameAr', this.value)" class="admin-input text-right text-sm" placeholder="اسم الفرع" dir="rtl">
                    </div>
                </div>
                <button onclick="State.removeLocation(${loc.id})" class="admin-delete-btn"><i class="fas fa-trash"></i></button>
            </div>
            
            <div class="admin-card-body">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="admin-label">Address (EN)</label>
                        <input type="text" value="${loc.addressEn}" onchange="State.updateLocation(${loc.id}, 'addressEn', this.value)" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Address (AR)</label>
                        <input type="text" value="${loc.addressAr}" onchange="State.updateLocation(${loc.id}, 'addressAr', this.value)" class="admin-input text-right" dir="rtl">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="admin-label">Phone</label>
                        <input type="text" value="${loc.phone}" onchange="State.updateLocation(${loc.id}, 'phone', this.value)" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">WhatsApp (no +)</label>
                        <input type="text" value="${loc.whatsapp}" onchange="State.updateLocation(${loc.id}, 'whatsapp', this.value)" class="admin-input">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="admin-label">Hours (EN)</label>
                        <input type="text" value="${loc.hoursEn}" onchange="State.updateLocation(${loc.id}, 'hoursEn', this.value)" class="admin-input">
                    </div>
                    <div>
                        <label class="admin-label">Hours (AR)</label>
                        <input type="text" value="${loc.hoursAr}" onchange="State.updateLocation(${loc.id}, 'hoursAr', this.value)" class="admin-input text-right" dir="rtl">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="admin-label">Google Maps Embed URL</label>
                    <input type="text" value="${loc.mapUrl}" onchange="State.updateLocation(${loc.id}, 'mapUrl', this.value)" class="admin-input font-mono text-xs">
                    <p class="text-xs text-gray-400 mt-1">Get from Google Maps → Share → Embed a map → Copy URL from src=""</p>
                </div>

                <div class="flex items-center gap-3">
                    <label class="admin-toggle">
                        <input type="checkbox" ${loc.isPrimary ? 'checked' : ''} onchange="State.updateLocation(${loc.id}, 'isPrimary', this.checked); renderAdminLocations()">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="text-sm font-medium text-gray-600">Set as Primary Branch</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAdminFeatures() {
    const container = document.getElementById('admin-features-list');
    if (!container) return;

    container.innerHTML = State.config.features.map(feat => `
        <div class="admin-feature-row" data-feat-id="${feat.id}">
            <div class="admin-icon-preview small">
                <i class="${feat.icon}"></i>
            </div>
            <input type="text" value="${feat.icon}" onchange="State.updateFeature(${feat.id}, 'icon', this.value); this.closest('.admin-feature-row').querySelector('.admin-icon-preview i').className = this.value" class="admin-input-sm w-28 font-mono" placeholder="fas fa-...">
            <input type="text" value="${feat.titleEn}" onchange="State.updateFeature(${feat.id}, 'titleEn', this.value)" class="admin-input-sm flex-1" placeholder="Title EN">
            <input type="text" value="${feat.titleAr}" onchange="State.updateFeature(${feat.id}, 'titleAr', this.value)" class="admin-input-sm flex-1 text-right" placeholder="العنوان" dir="rtl">
            <input type="text" value="${feat.descEn}" onchange="State.updateFeature(${feat.id}, 'descEn', this.value)" class="admin-input-sm flex-1" placeholder="Description EN">
            <input type="text" value="${feat.descAr}" onchange="State.updateFeature(${feat.id}, 'descAr', this.value)" class="admin-input-sm flex-1 text-right" placeholder="الوصف" dir="rtl">
            <button onclick="State.removeFeature(${feat.id})" class="admin-delete-btn-sm"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function renderAdminGallery() {
    const container = document.getElementById('admin-gallery-grid');
    if (!container) return;

    container.innerHTML = State.config.gallery.map((url, idx) => `
        <div class="admin-gallery-item group">
            <img src="${url}" alt="Gallery ${idx + 1}">
            <div class="admin-gallery-overlay">
                <button onclick="State.removeGalleryImage(${idx})" class="admin-gallery-delete">
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
                <td colspan="4" class="text-center py-8 text-gray-400">
                    <i class="fas fa-inbox text-3xl mb-2"></i>
                    <p>No comments yet</p>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = State.comments.map(c => `
        <tr class="hover:bg-gray-50 transition">
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background: ${State.getAvatarColor(c.name)}">
                        ${c.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="font-medium">${c.name}</span>
                </div>
            </td>
            <td class="p-4 text-gray-600 max-w-md">${c.text}</td>
            <td class="p-4 text-gray-400 text-sm">${State.formatDate(c.date)}</td>
            <td class="p-4">
                <button onclick="State.deleteComment(${c.id})" class="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition text-sm">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// ─────────────────────────────────────────────────────────────────────────
//  TAB SWITCHING
// ─────────────────────────────────────────────────────────────────────────

window.switchTab = (tabId) => {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));

    // Show selected tab
    document.getElementById(tabId).classList.remove('hidden');

    // Update sidebar buttons
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-primary', 'text-white');
        el.classList.add('text-gray-600', 'hover:bg-gray-50');
    });

    event.currentTarget.classList.add('bg-primary', 'text-white');
    event.currentTarget.classList.remove('text-gray-600', 'hover:bg-gray-50');
};

// ─────────────────────────────────────────────────────────────────────────
//  ADMIN LOGIN
// ─────────────────────────────────────────────────────────────────────────

window.adminLogin = (e) => {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value;
    const p = document.getElementById('loginPassword').value;

    if (u === 'cozy' && p === 'cozy&&9900') {
        sessionStorage.setItem('cozy_admin', 'true');
        State.notify('Welcome back, Admin! 👋', 'success');
        setTimeout(() => location.reload(), 500);
    } else {
        State.notify('Invalid credentials. Please try again.', 'error');
        document.getElementById('loginPassword').value = '';
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ═══════════════════════════════════════════════════════════════════════════════
window.State = State;
