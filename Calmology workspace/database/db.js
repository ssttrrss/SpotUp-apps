/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  CALMOLOGY WORKSPACE - DATABASE (JSON File Based)
 *  Using lowdb for simple JSON storage - no native compilation required
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'data.json');

// ═══════════════════════════════════════════════════════════════════════════════
//  DEFAULT DATA STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

const defaultData = {
    users: [],
    config: {
        brand_name: 'Calmology',
        brand_tagline: 'Find Your Calm',
        hero_title_en: 'Find Your',
        hero_title_ar: 'اعثر على',
        hero_highlight_en: 'Calm Zone',
        hero_highlight_ar: 'منطقة هدوئك',
        slogan_en: 'A peaceful workspace designed for deep focus and productivity. Open 24 hours, every day. Your calm awaits.',
        slogan_ar: 'مساحة عمل هادئة مصممة للتركيز العميق والإنتاجية. مفتوح ٢٤ ساعة، كل يوم. هدوؤك ينتظرك.',
        hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        since_year: '2024',
        contact_phone: '011 10188600',
        contact_whatsapp: '201110188600',
        contact_email: 'hello@calmology.eg',
        contact_facebook: 'https://www.facebook.com/calmology',
        contact_instagram: 'https://www.instagram.com/calmology_eg',
        stat_rating: '5.0',
        stat_reviews: '34',
        stat_members: '200+'
    },
    pricing_plans: [
        {
            id: 1,
            name_en: 'Hourly', name_ar: 'بالساعة', price: 25, unit: 'EGP/hr',
            icon: 'fas fa-clock', is_popular: false,
            features_en: ['Flexible timing', 'High-speed WiFi', 'Power outlet', 'AC comfort'],
            features_ar: ['وقت مرن', 'واي فاي سريع', 'منفذ كهرباء', 'تكييف مريح'],
            sort_order: 0
        },
        {
            id: 2,
            name_en: 'Full Day', name_ar: 'يوم كامل', price: 100, unit: 'EGP',
            icon: 'fas fa-sun', is_popular: true,
            features_en: ['Unlimited hours', 'High-speed WiFi', 'Free beverages', 'All amenities', 'Both zones access'],
            features_ar: ['ساعات غير محدودة', 'واي فاي سريع', 'مشروبات مجانية', 'جميع المرافق', 'وصول للمنطقتين'],
            sort_order: 1
        },
        {
            id: 3,
            name_en: 'Weekly Pass', name_ar: 'أسبوعي', price: 500, unit: 'EGP',
            icon: 'fas fa-calendar-week', is_popular: false,
            features_en: ['7 days access', 'Priority seating', 'Free beverages', 'All amenities', '24/7 access'],
            features_ar: ['٧ أيام وصول', 'أولوية الجلوس', 'مشروبات مجانية', 'جميع المرافق', 'وصول ٢٤ ساعة'],
            sort_order: 2
        },
        {
            id: 4,
            name_en: 'Monthly', name_ar: 'شهري', price: 1500, unit: 'EGP',
            icon: 'fas fa-crown', is_popular: false,
            features_en: ['30 days access', 'Dedicated spot', 'All inclusive', 'Locker storage', 'Meeting room hours'],
            features_ar: ['٣٠ يوم وصول', 'مكان مخصص', 'شامل كل شيء', 'خزانة تخزين', 'ساعات غرفة اجتماعات'],
            sort_order: 3
        }
    ],
    locations: [
        {
            id: 1,
            name_en: 'Manial Branch - Main',
            name_ar: 'فرع المنيل - الرئيسي',
            address_en: '1 Abdel Aal Helmy Pasha St, Eastern Manial, Old Cairo',
            address_ar: '١ عبد العال حلمي باشا، المنيل الشرقي، قسم مصر القديمة، القاهرة',
            phone: '011 10188600',
            whatsapp: '201110188600',
            hours_en: 'Open 24 Hours - Every Day',
            hours_ar: 'مفتوح ٢٤ ساعة - كل يوم',
            map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d863.5974!2d31.2287101!3d30.0258755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145847795c45e94b%3A0xdb3c6af89815abfb!2sCalmology!5e0!3m2!1sen!2seg!4v1735321200000',
            is_primary: true
        }
    ],
    features: [
        { id: 1, icon: 'fas fa-wifi', title_en: 'High Speed WiFi', title_ar: 'واي فاي فائق السرعة', desc_en: 'Fast fiber connection', desc_ar: 'اتصال فايبر سريع', sort_order: 0 },
        { id: 2, icon: 'fas fa-plug', title_en: 'Charging Ports', title_ar: 'منافذ شحن', desc_en: 'At every desk', desc_ar: 'بجانب كل مكتب', sort_order: 1 },
        { id: 3, icon: 'fas fa-snowflake', title_en: 'Air Conditioned', title_ar: 'تكييف هواء', desc_en: 'Perfectly cool', desc_ar: 'برودة مثالية', sort_order: 2 },
        { id: 4, icon: 'fas fa-smoking', title_en: 'Smoking Zone', title_ar: 'منطقة تدخين', desc_en: 'Separate area', desc_ar: 'منطقة منفصلة', sort_order: 3 },
        { id: 5, icon: 'fas fa-smoking-ban', title_en: 'Non-Smoking Zone', title_ar: 'منطقة بدون تدخين', desc_en: 'Fresh air space', desc_ar: 'مساحة هواء نقي', sort_order: 4 },
        { id: 6, icon: 'fas fa-clock', title_en: 'Open 24/7', title_ar: 'مفتوح ٢٤ ساعة', desc_en: 'Work anytime', desc_ar: 'اعمل في أي وقت', sort_order: 5 },
        { id: 7, icon: 'fas fa-mug-hot', title_en: 'Beverages', title_ar: 'مشروبات', desc_en: 'Quality drinks', desc_ar: 'مشروبات عالية الجودة', sort_order: 6 },
        { id: 8, icon: 'fas fa-broom', title_en: 'Clean & Organized', title_ar: 'نظيف ومنظم', desc_en: 'Always spotless', desc_ar: 'دائماً نظيف', sort_order: 7 }
    ],
    gallery: [
        { id: 1, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt_text: '', sort_order: 0 },
        { id: 2, image_url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80', alt_text: '', sort_order: 1 },
        { id: 3, image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', alt_text: '', sort_order: 2 },
        { id: 4, image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80', alt_text: '', sort_order: 3 },
        { id: 5, image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', alt_text: '', sort_order: 4 }
    ],
    testimonials: [
        {
            id: 1,
            name_en: 'Abdullah Fadel', name_ar: 'عبد الله فاضل',
            text_en: 'A lovely place for studying and the beverages are at a beautiful and high level. Thanks to the wonderful management! ❤️',
            text_ar: 'مكان لطيف للمذاكرة والمشروبات على مستوى جميل وعالي شكرا للادراة الجملية ❤️',
            rating: 5
        },
        {
            id: 2,
            name_en: 'Amr Tagen', name_ar: 'عمرو تاجن',
            text_en: 'The PERFECT place for studying. Smoking and non-smoking area, awesome services. Perfectly conditioned with charging ports beside every desk! 👌🏻',
            text_ar: 'المكان المثالي للمذاكرة. منطقة تدخين وغير تدخين، خدمات رائعة. تكييف مثالي مع منافذ شحن بجانب كل مكتب! 👌🏻',
            rating: 5
        },
        {
            id: 3,
            name_en: 'Doaa', name_ar: 'دعاء',
            text_en: 'Nice place, clean & well organised. Located in nice calm area and open 24h. Great value for your work!',
            text_ar: 'مكان جميل، نظيف ومنظم جيداً. يقع في منطقة هادئة ومفتوح ٢٤ ساعة. قيمة رائعة لعملك!',
            rating: 5
        }
    ],
    comments: []
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DATABASE INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

const adapter = new JSONFile(dbPath);
const db = new Low(adapter, defaultData);

// ═══════════════════════════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initDatabase() {
    // Read existing data or use defaults
    await db.read();

    // If data is empty, populate with defaults
    if (!db.data || Object.keys(db.data).length === 0) {
        db.data = defaultData;
    }

    // Ensure admin user exists
    if (!db.data.users || db.data.users.length === 0) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'calm&&2024', 10);
        db.data.users = [{
            id: 1,
            username: process.env.ADMIN_USERNAME || 'calm',
            password: hashedPassword,
            role: 'admin',
            created_at: new Date().toISOString()
        }];
    }

    await db.write();
    console.log('✓ Database initialized');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateId(collection) {
    const items = db.data[collection] || [];
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
    return maxId + 1;
}

function getNextSortOrder(collection) {
    const items = db.data[collection] || [];
    const maxOrder = items.reduce((max, item) => Math.max(max, item.sort_order || 0), -1);
    return maxOrder + 1;
}

// Export everything
export { db, initDatabase, generateId, getNextSortOrder };
