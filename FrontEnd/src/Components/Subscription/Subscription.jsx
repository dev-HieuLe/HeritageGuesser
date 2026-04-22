import { useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";

const CONTENT = {
  en: {
    badge: "Subscription Plans",
    heading1: "Unlock the full",
    heading2: "Heritage Guessr",
    subtitle:
      "From beginner to expert researcher — choose the plan that fits your heritage discovery journey.",
    currentPlanLabel: "Your Plan",
    vrTitle: "Pro Plan — VR Headset Delivered to Your Door",
    vrSubtitle:
      "When you subscribe to Pro, we ship a VR headset and setup guide to your address — no need to travel or go anywhere.",
    faqTitle: "Frequently Asked Questions",
    contactText: "Other questions?",
    contactLink: "Contact us",
    plans: [
      {
        key: "basic",
        name: "Basic",
        price: null,
        priceLabel: "Free",
        period: null,
        badge: null,
        cta: "Current Plan",
        ctaDisabled: true,
        features: [
          { icon: "military_tech", text: "15 Ranked games / day" },
          { icon: "explore", text: "Heritage map exploration" },
          { icon: "school", text: "All basic lessons" },
          { icon: "leaderboard", text: "Global leaderboard" },
          { icon: "add_location_alt", text: "Contribute locations" },
        ],
        missing: [
          "Unlimited games",
          "Advanced learning content",
          "VR headset + VR classes",
          "Exclusive badges",
        ],
      },
      {
        key: "plus",
        name: "Plus",
        price: "66.000",
        priceLabel: "65.000₫",
        period: "/ month",
        badge: "Popular",
        badgeColor: "#a2d1bb",
        cta: "Upgrade to Plus",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "Unlimited Ranked games" },
          { icon: "explore", text: "Heritage map exploration" },
          { icon: "school", text: "All lessons + advanced content" },
          { icon: "leaderboard", text: "Global leaderboard" },
          { icon: "add_location_alt", text: "Contribute locations" },
          { icon: "workspace_premium", text: "Exclusive Plus badge" },
          { icon: "bolt", text: "Early access to new features" },
        ],
        missing: ["VR headset + home VR classes"],
      },
      {
        key: "pro",
        name: "Pro",
        price: "267.000",
        priceLabel: "267.000₫",
        period: "/ month",
        badge: "Includes VR headset",
        badgeColor: "#e9c349",
        cta: "Upgrade to Pro",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "Unlimited Ranked games" },
          { icon: "explore", text: "Heritage map exploration" },
          { icon: "school", text: "All lessons + advanced content" },
          { icon: "leaderboard", text: "Global leaderboard" },
          { icon: "add_location_alt", text: "Contribute locations" },
          { icon: "workspace_premium", text: "Exclusive Pro badge" },
          { icon: "bolt", text: "Early access to new features" },
          { icon: "view_in_ar", text: "VR headset delivered to your door" },
          { icon: "live_tv", text: "Weekly live VR classes" },
          { icon: "headset", text: "360° immersive heritage experience" },
        ],
        missing: [],
      },
      {
        key: "business",
        name: "Business / School",
        price: null,
        priceLabel: "Contact us",
        period: null,
        badge: "Enterprise & Education",
        badgeColor: "#c9a0ff",
        cta: "Contact Us",
        ctaDisabled: false,
        isContact: true,
        features: [
          { icon: "all_inclusive", text: "All Pro features" },
          { icon: "group", text: "Multiple accounts / classrooms" },
          { icon: "admin_panel_settings", text: "Admin dashboard" },
          { icon: "view_in_ar", text: "Bulk VR headsets" },
          { icon: "support_agent", text: "Priority 24/7 support" },
          { icon: "receipt_long", text: "Business VAT invoicing" },
          { icon: "school", text: "Custom education programs" },
        ],
        missing: [],
      },
    ],
    vrFeatures: [
      {
        icon: "view_in_ar",
        title: "VR headset delivered",
        desc: "We ship the VR headset to your address within 3–5 business days.",
      },
      {
        icon: "live_tv",
        title: "Weekly VR classes",
        desc: "Join live weekly classes, exploring Vietnamese heritage in 360° space.",
      },
      {
        icon: "headset",
        title: "Fully immersive experience",
        desc: "Stand inside Hội An, Phong Nha, or Mỹ Sơn — fully immersed through VR technology.",
      },
    ],
    faq: [
      {
        q: "Can I cancel at any time?",
        a: "Yes. You can cancel your subscription at any time and retain access until the end of the billing period.",
      },
      {
        q: "How long does the VR headset delivery take?",
        a: "After confirming the Pro plan, we process the order in 1–2 business days and ship within 3–5 days depending on your area.",
      },
      {
        q: "How does the Business/School plan work?",
        a: "Contact us for a custom quote based on number of accounts, VR devices, and teaching programs.",
      },
      {
        q: "Which payment methods are supported?",
        a: "We support local cards, international cards, e-wallets (MoMo, ZaloPay), and bank transfers.",
      },
    ],
  },
  vi: {
    badge: "Gói đăng ký",
    heading1: "Mở khóa toàn bộ",
    heading2: "Heritage Guessr",
    subtitle:
      "Từ người mới bắt đầu đến nhà nghiên cứu chuyên sâu — chọn gói phù hợp với hành trình khám phá di sản của bạn.",
    currentPlanLabel: "Gói của bạn",
    vrTitle: "Gói Pro — Kính VR giao tận nhà",
    vrSubtitle:
      "Khi đăng ký gói Pro, chúng tôi sẽ giao bộ kính VR cùng hướng dẫn sử dụng đến tận địa chỉ của bạn — không cần đến trường, không cần ra ngoài.",
    faqTitle: "Câu hỏi thường gặp",
    contactText: "Câu hỏi khác?",
    contactLink: "Liên hệ chúng tôi",
    plans: [
      {
        key: "basic",
        name: "Basic",
        price: null,
        priceLabel: "Miễn phí",
        period: null,
        badge: null,
        cta: "Gói hiện tại",
        ctaDisabled: true,
        features: [
          { icon: "military_tech", text: "15 ván Ranked / ngày" },
          { icon: "explore", text: "Khám phá bản đồ di sản" },
          { icon: "school", text: "Toàn bộ bài học cơ bản" },
          { icon: "leaderboard", text: "Bảng xếp hạng toàn cầu" },
          { icon: "add_location_alt", text: "Đóng góp địa điểm" },
        ],
        missing: [
          "Ván không giới hạn",
          "Nội dung học nâng cao",
          "Kính VR + lớp học VR",
          "Huy hiệu độc quyền",
        ],
      },
      {
        key: "plus",
        name: "Plus",
        price: "66.000",
        priceLabel: "65.000₫",
        period: "/ tháng",
        badge: "Phổ biến",
        badgeColor: "#a2d1bb",
        cta: "Nâng cấp lên Plus",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "Ván Ranked không giới hạn" },
          { icon: "explore", text: "Khám phá bản đồ di sản" },
          { icon: "school", text: "Toàn bộ bài học + nội dung nâng cao" },
          { icon: "leaderboard", text: "Bảng xếp hạng toàn cầu" },
          { icon: "add_location_alt", text: "Đóng góp địa điểm" },
          { icon: "workspace_premium", text: "Huy hiệu Plus độc quyền" },
          { icon: "bolt", text: "Ưu tiên truy cập tính năng mới" },
        ],
        missing: ["Kính VR + lớp học VR tại nhà"],
      },
      {
        key: "pro",
        name: "Pro",
        price: "267.000",
        priceLabel: "267.000₫",
        period: "/ tháng",
        badge: "Bao gồm kính VR",
        badgeColor: "#e9c349",
        cta: "Nâng cấp lên Pro",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "Ván Ranked không giới hạn" },
          { icon: "explore", text: "Khám phá bản đồ di sản" },
          { icon: "school", text: "Toàn bộ bài học + nội dung nâng cao" },
          { icon: "leaderboard", text: "Bảng xếp hạng toàn cầu" },
          { icon: "add_location_alt", text: "Đóng góp địa điểm" },
          { icon: "workspace_premium", text: "Huy hiệu Pro độc quyền" },
          { icon: "bolt", text: "Ưu tiên truy cập tính năng mới" },
          { icon: "view_in_ar", text: "Kính VR giao tận nhà" },
          { icon: "live_tv", text: "Lớp học VR trực tiếp hàng tuần" },
          { icon: "headset", text: "Trải nghiệm di sản toàn cảnh 360°" },
        ],
        missing: [],
      },
      {
        key: "business",
        name: "Business / Trường học",
        price: null,
        priceLabel: "Liên hệ",
        period: null,
        badge: "Doanh nghiệp & Trường học",
        badgeColor: "#c9a0ff",
        cta: "Liên hệ với chúng tôi",
        ctaDisabled: false,
        isContact: true,
        features: [
          { icon: "all_inclusive", text: "Tất cả tính năng Pro" },
          { icon: "group", text: "Nhiều tài khoản / lớp học" },
          { icon: "admin_panel_settings", text: "Bảng quản trị" },
          { icon: "view_in_ar", text: "Kính VR số lượng lớn" },
          { icon: "support_agent", text: "Hỗ trợ ưu tiên 24/7" },
          { icon: "receipt_long", text: "Hóa đơn VAT doanh nghiệp" },
          { icon: "school", text: "Chương trình giáo dục tùy chỉnh" },
        ],
        missing: [],
      },
    ],
    vrFeatures: [
      {
        icon: "view_in_ar",
        title: "Kính VR tận nơi",
        desc: "Chúng tôi giao kính VR đến tận địa chỉ của bạn trong vòng 3–5 ngày làm việc.",
      },
      {
        icon: "live_tv",
        title: "Lớp học VR hàng tuần",
        desc: "Tham gia lớp học trực tiếp mỗi tuần, khám phá di sản Việt Nam trong không gian 360°.",
      },
      {
        icon: "headset",
        title: "Trải nghiệm toàn cảnh",
        desc: "Đứng giữa Hội An, Phong Nha, hay Mỹ Sơn — hoàn toàn nhập vai qua công nghệ VR.",
      },
    ],
    faq: [
      {
        q: "Tôi có thể hủy bất cứ lúc nào không?",
        a: "Có. Bạn có thể hủy gói đăng ký bất kỳ lúc nào và vẫn giữ quyền truy cập đến hết kỳ thanh toán.",
      },
      {
        q: "Kính VR giao trong bao lâu?",
        a: "Sau khi xác nhận gói Pro, chúng tôi xử lý đơn trong 1–2 ngày làm việc và giao trong 3–5 ngày tùy khu vực.",
      },
      {
        q: "Gói Business/Trường học hoạt động thế nào?",
        a: "Liên hệ với chúng tôi để nhận báo giá tùy chỉnh theo số lượng tài khoản, thiết bị VR và chương trình giảng dạy.",
      },
      {
        q: "Phương thức thanh toán nào được hỗ trợ?",
        a: "Chúng tôi hỗ trợ thẻ nội địa, thẻ quốc tế, ví điện tử (MoMo, ZaloPay) và chuyển khoản ngân hàng.",
      },
    ],
  },
  cn: {
    badge: "订阅方案",
    heading1: "解锁完整",
    heading2: "Heritage Guessr",
    subtitle:
      "从初学者到深度研究者——选择适合你遗产探索旅程的方案。",
    currentPlanLabel: "当前方案",
    vrTitle: "Pro方案 — VR头显送货上门",
    vrSubtitle:
      "订阅Pro方案后，我们将把VR头显和使用指南寄送到您的地址——无需出门，无需到校。",
    faqTitle: "常见问题",
    contactText: "还有其他问题？",
    contactLink: "联系我们",
    plans: [
      {
        key: "basic",
        name: "基础版",
        price: null,
        priceLabel: "免费",
        period: null,
        badge: null,
        cta: "当前方案",
        ctaDisabled: true,
        features: [
          { icon: "military_tech", text: "每日15局排名赛" },
          { icon: "explore", text: "遗产地图探索" },
          { icon: "school", text: "全部基础课程" },
          { icon: "leaderboard", text: "全球排行榜" },
          { icon: "add_location_alt", text: "贡献地点" },
        ],
        missing: [
          "无限局次",
          "进阶学习内容",
          "VR头显 + VR课程",
          "专属徽章",
        ],
      },
      {
        key: "plus",
        name: "Plus版",
        price: "66.000",
        priceLabel: "65.000₫",
        period: "/ 月",
        badge: "热门",
        badgeColor: "#a2d1bb",
        cta: "升级至Plus",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "无限排名赛局次" },
          { icon: "explore", text: "遗产地图探索" },
          { icon: "school", text: "全部课程 + 进阶内容" },
          { icon: "leaderboard", text: "全球排行榜" },
          { icon: "add_location_alt", text: "贡献地点" },
          { icon: "workspace_premium", text: "专属Plus徽章" },
          { icon: "bolt", text: "新功能优先体验" },
        ],
        missing: ["VR头显 + 家庭VR课程"],
      },
      {
        key: "pro",
        name: "Pro版",
        price: "267.000",
        priceLabel: "267.000₫",
        period: "/ 月",
        badge: "含VR头显",
        badgeColor: "#e9c349",
        cta: "升级至Pro",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "无限排名赛局次" },
          { icon: "explore", text: "遗产地图探索" },
          { icon: "school", text: "全部课程 + 进阶内容" },
          { icon: "leaderboard", text: "全球排行榜" },
          { icon: "add_location_alt", text: "贡献地点" },
          { icon: "workspace_premium", text: "专属Pro徽章" },
          { icon: "bolt", text: "新功能优先体验" },
          { icon: "view_in_ar", text: "VR头显送货上门" },
          { icon: "live_tv", text: "每周VR直播课程" },
          { icon: "headset", text: "360°沉浸式遗产体验" },
        ],
        missing: [],
      },
      {
        key: "business",
        name: "企业 / 学校版",
        price: null,
        priceLabel: "联系咨询",
        period: null,
        badge: "企业 & 教育机构",
        badgeColor: "#c9a0ff",
        cta: "联系我们",
        ctaDisabled: false,
        isContact: true,
        features: [
          { icon: "all_inclusive", text: "所有Pro版功能" },
          { icon: "group", text: "多账号 / 班级管理" },
          { icon: "admin_panel_settings", text: "管理员控制台" },
          { icon: "view_in_ar", text: "批量VR头显" },
          { icon: "support_agent", text: "24/7优先支持" },
          { icon: "receipt_long", text: "企业增值税发票" },
          { icon: "school", text: "定制化教育方案" },
        ],
        missing: [],
      },
    ],
    vrFeatures: [
      {
        icon: "view_in_ar",
        title: "VR头显送货上门",
        desc: "我们将在3–5个工作日内将VR头显送达您的地址。",
      },
      {
        icon: "live_tv",
        title: "每周VR课程",
        desc: "每周参加一次直播课程，在360°空间中探索越南遗产。",
      },
      {
        icon: "headset",
        title: "全沉浸式体验",
        desc: "身临其境于会安、丰芽或美山——通过VR技术完全沉浸其中。",
      },
    ],
    faq: [
      {
        q: "我可以随时取消吗？",
        a: "是的。您可以随时取消订阅，并保留访问权限直至当前计费周期结束。",
      },
      {
        q: "VR头显需要多久送达？",
        a: "确认Pro方案后，我们在1–2个工作日内处理订单，并在3–5天内发货（视地区而定）。",
      },
      {
        q: "企业/学校方案如何运作？",
        a: "请联系我们，根据账号数量、VR设备和教学方案获取定制报价。",
      },
      {
        q: "支持哪些支付方式？",
        a: "我们支持国内银行卡、国际信用卡、电子钱包（MoMo、ZaloPay）以及银行转账。",
      },
    ],
  },
  fr: {
    badge: "Formules d'Abonnement",
    heading1: "Débloquez l'intégralité de",
    heading2: "Heritage Guessr",
    subtitle:
      "Du débutant au chercheur expert — choisissez la formule adaptée à votre voyage de découverte patrimoniale.",
    currentPlanLabel: "Votre Formule",
    vrTitle: "Formule Pro — Casque VR Livré à Domicile",
    vrSubtitle:
      "En souscrivant à la formule Pro, nous expédions un casque VR et un guide d'installation à votre adresse — sans besoin de vous déplacer.",
    faqTitle: "Questions Fréquentes",
    contactText: "D'autres questions ?",
    contactLink: "Contactez-nous",
    plans: [
      {
        key: "basic",
        name: "Basique",
        price: null,
        priceLabel: "Gratuit",
        period: null,
        badge: null,
        cta: "Formule Actuelle",
        ctaDisabled: true,
        features: [
          { icon: "military_tech", text: "15 parties Classées / jour" },
          { icon: "explore", text: "Exploration de la carte patrimoniale" },
          { icon: "school", text: "Toutes les leçons de base" },
          { icon: "leaderboard", text: "Classement mondial" },
          { icon: "add_location_alt", text: "Contribuer des lieux" },
        ],
        missing: [
          "Parties illimitées",
          "Contenu d'apprentissage avancé",
          "Casque VR + cours VR",
          "Badges exclusifs",
        ],
      },
      {
        key: "plus",
        name: "Plus",
        price: "66.000",
        priceLabel: "65 000₫",
        period: "/ mois",
        badge: "Populaire",
        badgeColor: "#a2d1bb",
        cta: "Passer à Plus",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "Parties Classées illimitées" },
          { icon: "explore", text: "Exploration de la carte patrimoniale" },
          { icon: "school", text: "Toutes les leçons + contenu avancé" },
          { icon: "leaderboard", text: "Classement mondial" },
          { icon: "add_location_alt", text: "Contribuer des lieux" },
          { icon: "workspace_premium", text: "Badge Plus exclusif" },
          { icon: "bolt", text: "Accès anticipé aux nouvelles fonctionnalités" },
        ],
        missing: ["Casque VR + cours VR à domicile"],
      },
      {
        key: "pro",
        name: "Pro",
        price: "267.000",
        priceLabel: "267 000₫",
        period: "/ mois",
        badge: "Inclut casque VR",
        badgeColor: "#e9c349",
        cta: "Passer à Pro",
        ctaDisabled: false,
        features: [
          { icon: "all_inclusive", text: "Parties Classées illimitées" },
          { icon: "explore", text: "Exploration de la carte patrimoniale" },
          { icon: "school", text: "Toutes les leçons + contenu avancé" },
          { icon: "leaderboard", text: "Classement mondial" },
          { icon: "add_location_alt", text: "Contribuer des lieux" },
          { icon: "workspace_premium", text: "Badge Pro exclusif" },
          { icon: "bolt", text: "Accès anticipé aux nouvelles fonctionnalités" },
          { icon: "view_in_ar", text: "Casque VR livré à domicile" },
          { icon: "live_tv", text: "Cours VR hebdomadaires en direct" },
          { icon: "headset", text: "Expérience patrimoniale immersive 360°" },
        ],
        missing: [],
      },
      {
        key: "business",
        name: "Entreprise / École",
        price: null,
        priceLabel: "Nous contacter",
        period: null,
        badge: "Entreprise & Éducation",
        badgeColor: "#c9a0ff",
        cta: "Nous Contacter",
        ctaDisabled: false,
        isContact: true,
        features: [
          { icon: "all_inclusive", text: "Toutes les fonctionnalités Pro" },
          { icon: "group", text: "Comptes multiples / salles de classe" },
          { icon: "admin_panel_settings", text: "Tableau de bord administrateur" },
          { icon: "view_in_ar", text: "Casques VR en grande quantité" },
          { icon: "support_agent", text: "Support prioritaire 24/7" },
          { icon: "receipt_long", text: "Facturation TVA entreprise" },
          { icon: "school", text: "Programmes éducatifs personnalisés" },
        ],
        missing: [],
      },
    ],
    vrFeatures: [
      {
        icon: "view_in_ar",
        title: "Casque VR livré",
        desc: "Nous expédions le casque VR à votre adresse en 3 à 5 jours ouvrables.",
      },
      {
        icon: "live_tv",
        title: "Cours VR hebdomadaires",
        desc: "Rejoignez des cours en direct chaque semaine, explorant le patrimoine vietnamien en espace 360°.",
      },
      {
        icon: "headset",
        title: "Expérience totalement immersive",
        desc: "Plongez dans Hội An, Phong Nha ou Mỹ Sơn — complètement immergé grâce à la technologie VR.",
      },
    ],
    faq: [
      {
        q: "Puis-je annuler à tout moment ?",
        a: "Oui. Vous pouvez annuler votre abonnement à tout moment et conserver l'accès jusqu'à la fin de la période de facturation.",
      },
      {
        q: "Combien de temps prend la livraison du casque VR ?",
        a: "Après confirmation de la formule Pro, nous traitons la commande en 1 à 2 jours ouvrables et expédions sous 3 à 5 jours selon votre zone.",
      },
      {
        q: "Comment fonctionne la formule Entreprise/École ?",
        a: "Contactez-nous pour un devis personnalisé basé sur le nombre de comptes, d'appareils VR et de programmes d'enseignement.",
      },
      {
        q: "Quels modes de paiement sont acceptés ?",
        a: "Nous acceptons les cartes locales, les cartes internationales, les portefeuilles électroniques (MoMo, ZaloPay) et les virements bancaires.",
      },
    ],
  },
};

const PLAN_COLORS = {
  basic: { color: "#8a9e96", accentBg: "rgba(138,158,150,0.08)", border: "rgba(138,158,150,0.25)" },
  plus:  { color: "#a2d1bb", accentBg: "rgba(162,209,187,0.08)", border: "rgba(162,209,187,0.35)" },
  pro:   { color: "#e9c349", accentBg: "rgba(233,195,73,0.08)",  border: "rgba(233,195,73,0.4)" },
  business: { color: "#c9a0ff", accentBg: "rgba(201,160,255,0.07)", border: "rgba(201,160,255,0.3)" },
};

export default function Subscription() {
  const { user } = useContext(AuthContext);
  const { lang } = useLang();
  const c = CONTENT[lang] ?? CONTENT.vi;
  const currentPlan = user?.subscription_plan ?? "basic";

  return (
    <div style={{ backgroundColor: "#0e1513", minHeight: "100vh", color: "#e3e3d9" }}>

      {/* ── HERO ── */}
      <div style={{ textAlign: "center", padding: "64px 24px 48px", maxWidth: 720, margin: "0 auto" }}>
        <span style={{
          display: "inline-block", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em",
          color: "#a2d1bb", textTransform: "uppercase", marginBottom: 16,
          padding: "4px 14px", borderRadius: 20,
          background: "rgba(162,209,187,0.08)", border: "1px solid rgba(162,209,187,0.2)",
        }}>
          {c.badge}
        </span>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: "#e3e3d9", lineHeight: 1.15, margin: "0 0 16px" }}>
          {c.heading1}<br />
          <span style={{ color: "#e9c349" }}>{c.heading2}</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(192,200,195,0.6)", lineHeight: 1.7, margin: 0 }}>
          {c.subtitle}
        </p>
      </div>

      {/* ── PLAN CARDS ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20, maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px",
      }}>
        {c.plans.map((plan) => {
          const isCurrent = currentPlan === plan.key;
          const isHighlighted = plan.key === "pro";
          const pc = PLAN_COLORS[plan.key];

          return (
            <div key={plan.key} style={{
              borderRadius: 16,
              border: `1px solid ${isCurrent ? pc.color : pc.border}`,
              background: isHighlighted
                ? "linear-gradient(160deg, rgba(233,195,73,0.07) 0%, rgba(14,21,19,0.9) 60%)"
                : "#12140e",
              padding: "28px 24px",
              display: "flex", flexDirection: "column", gap: 0,
              position: "relative",
              boxShadow: isHighlighted ? "0 0 40px rgba(233,195,73,0.08)" : "none",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "#12140e", border: `1px solid ${pc.border}`,
                  padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap",
                  fontSize: 9, fontWeight: 900, letterSpacing: "0.12em",
                  color: plan.badgeColor, textTransform: "uppercase",
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Current plan indicator */}
              {isCurrent && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(162,209,187,0.1)", border: "1px solid rgba(162,209,187,0.25)",
                  borderRadius: 6, padding: "2px 8px",
                  fontSize: 8, fontWeight: 900, letterSpacing: "0.12em",
                  color: "#a2d1bb", textTransform: "uppercase",
                }}>
                  {c.currentPlanLabel}
                </div>
              )}

              {/* Header */}
              <div style={{ marginBottom: 20, marginTop: plan.badge ? 8 : 0 }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: pc.color, margin: "0 0 12px" }}>
                  {plan.name}
                </h2>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  {plan.price ? (
                    <>
                      <span style={{ fontSize: 34, fontWeight: 900, color: "#e3e3d9" }}>{plan.price}₫</span>
                      <span style={{ fontSize: 12, color: "rgba(192,200,195,0.45)", fontWeight: 600 }}>{plan.period}</span>
                    </>
                  ) : (
                    <span style={{
                      fontSize: 28, fontWeight: 900,
                      color: plan.key === "basic" ? "rgba(192,200,195,0.4)" : pc.color,
                    }}>
                      {plan.priceLabel}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ height: 1, background: "rgba(65,73,68,0.4)", marginBottom: 20 }} />

              {/* Features */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: pc.color, fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ fontSize: 12, color: "rgba(192,200,195,0.8)", lineHeight: 1.4 }}>{f.text}</span>
                  </div>
                ))}
                {plan.missing.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.35 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(192,200,195,0.4)", flexShrink: 0 }}>remove</span>
                    <span style={{ fontSize: 12, color: "rgba(192,200,195,0.5)", lineHeight: 1.4, textDecoration: "line-through" }}>{m}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {plan.isContact ? (
                <a href="mailto:contact@heritageguessr.com" style={{
                  display: "block", width: "100%", boxSizing: "border-box",
                  padding: "12px 0", borderRadius: 10, textAlign: "center",
                  fontWeight: 900, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "transparent", border: `1px solid ${pc.border}`,
                  color: pc.color, textDecoration: "none", cursor: "pointer",
                }}>
                  {plan.cta}
                </a>
              ) : (
                <button disabled={plan.ctaDisabled || isCurrent} style={{
                  width: "100%", padding: "12px 0", borderRadius: 10,
                  fontWeight: 900, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                  border: "none",
                  background: plan.ctaDisabled || isCurrent
                    ? "rgba(162,209,187,0.06)"
                    : plan.key === "pro"
                      ? "linear-gradient(135deg, #7a5c00, #e9c349)"
                      : "linear-gradient(135deg, #0f3d2e, #a2d1bb)",
                  color: plan.ctaDisabled || isCurrent
                    ? "rgba(162,209,187,0.3)"
                    : plan.key === "pro" ? "#3a2a00" : "#073829",
                  cursor: plan.ctaDisabled || isCurrent ? "default" : "pointer",
                  opacity: plan.ctaDisabled || isCurrent ? 0.7 : 1,
                }}>
                  {isCurrent ? c.currentPlanLabel : plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── VR HIGHLIGHT ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{
          borderRadius: 20, border: "1px solid rgba(233,195,73,0.2)",
          background: "linear-gradient(135deg, rgba(233,195,73,0.05) 0%, rgba(14,21,19,0.8) 100%)",
          padding: "40px 40px 36px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#e9c349", margin: 0 }}>{c.vrTitle}</h2>
          </div>
          <p style={{ fontSize: 13, color: "rgba(192,200,195,0.55)", marginBottom: 36, lineHeight: 1.6 }}>
            {c.vrSubtitle}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {c.vrFeatures.map((f, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(233,195,73,0.1)", border: "1px solid rgba(233,195,73,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#e3e3d9", marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(192,200,195,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: "#e3e3d9", textAlign: "center", marginBottom: 28 }}>
          {c.faqTitle}
        </h3>
        {c.faq.map((item, i) => (
          <details key={i} style={{ borderBottom: "1px solid rgba(65,73,68,0.35)", padding: "18px 4px" }}>
            <summary style={{
              fontSize: 13, fontWeight: 700, color: "#e3e3d9", cursor: "pointer",
              listStyle: "none", display: "flex", justifyContent: "space-between",
              alignItems: "center", userSelect: "none",
            }}>
              {item.q}
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(162,209,187,0.5)" }}>expand_more</span>
            </summary>
            <p style={{ fontSize: 12, color: "rgba(192,200,195,0.55)", lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={{ textAlign: "center", padding: "0 24px 80px" }}>
        <p style={{ fontSize: 13, color: "rgba(192,200,195,0.35)" }}>
          {c.contactText}{" "}
          <a href="mailto:contact@heritageguessr.com" style={{ color: "#a2d1bb", textDecoration: "none", fontWeight: 700 }}>
            {c.contactLink}
          </a>
        </p>
      </div>
    </div>
  );
}
