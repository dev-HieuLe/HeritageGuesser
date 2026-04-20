const t = {
  en: {
    // Nav (Homepage top bar)
    nav: {
      home: "Home",
      about: "About",
      rank: "Play Rank",
      explore: "Atlas",
      leaderboard: "Global Ranks",
      study: "Academy",
      atlas: "Atlas",
      tutorial: "Tutorial",
      contribute: "Contribute",
      shop: "Shop",
      vrDiscovery: "VR Discovery",
      challenge: "Challenge",
      logout: "Logout",
      signIn: "Sign In",
      settings: "Settings",
    },

    // Sidebar nav items
    sidebar: {
      sanctuary: "Sanctuary",
      about: "About",
      PlayRank: "Play Rank",
      globalRanks: "Global Ranks",
      atlas: "Atlas",
      academy: "Academy",
      tutorial: "Tutorial",
      contribute: "Contribute",
      shop: "Shop",
      vrDiscovery: "VR Discovery",
      feedback: "Feedback",
      feedbackPlaceholder:
        "Share your thoughts, report a bug, or suggest a feature… (max 100 words)",
      feedbackSend: "Send Feedback",
      feedbackSending: "Sending…",
      feedbackSent: "Sent! Thank you.",
      feedbackContact: "For a faster response, contact us via",
      feedbackOr: "or",
      settings: "Settings",
      imperialScholar: "Imperial Scholar",
      rankLabel: (rankName) => `Rank · ${rankName} Scholar`,
    },

    // Hero
    hero: {
      badge: "VR Experience Enabled",
      headline1: "Discover the",
      headline2: "Unseen",
      headline3: "Vietnam.",
      body: "Step into an ethereal archive of heritage. Test your cultural intuition across thousands of years of history, from the mist of Ha Long to the imperial gates of Hue.",
      startGuessing: "Start Guessing",
      viewMap: "View Map",
      tutorial: "Learn How to Play",
    },

    // Bento
    bento: {
      liveNow: "Live Now",
      archivistsExploring: "Archivists exploring",
      todaysQuest: "Today's Quest",
      endsIn: "Ends in",
      questTitle: "The Sanctuary of My Son",
      questDesc:
        "Identify the hidden motifs within the ancient Hindu temple complex.",
      xpReward: "+500 XP Rewards",
      imperialScholars: "Imperial Scholars",
      fullRankings: "Full Rankings",
    },

    // Atlas section
    atlas: {
      eyebrow: "The Atlas of Identity",
      headline1: "Every coordinate tells",
      headline2: "a",
      headline3: "thousand-year",
      headline4: "story.",
      features: [
        {
          title: "Verified Oral Histories",
          desc: "AI-curated metadata from national archives ensures every location is historically accurate and culturally significant.",
        },
        {
          title: "Hyper-Local Exploration",
          desc: "Discover hidden alleyways and ancient shrines that larger maps overlook. Experience Vietnam at a human scale.",
        },
        {
          title: "Interactive Heritage Nodes",
          desc: "Click to reveal Dong Son patterns, traditional music recordings, and 3D scans of local artifacts.",
        },
      ],
    },

    // CTA section
    cta: {
      headline: "Become a Guardian of Culture.",
      body: "Join thousands of explorers preserving Vietnam's heritage through the lens of technology. The archive is waiting.",
      createProfile: "Create Profile",
      questLogin: "Daily Quest Login",
    },

    // Contact section
    contact: {
      eyebrow: "Reach the Archive",
      headline: "We'd love to",
      headlineAccent: "hear from you.",
      body: "Have a question, a bug report, or just want to talk heritage? Open a line — we're listening.",
      channels: [
        {
          icon: "mail",
          label: "Email",
          value: "heritageguesser@gmail.com",
          href: "mailto:heritageguesser@gmail.com",
          cta: "Send a message",
        },
        {
          icon: "youtube",
          label: "YouTube",
          value: "youtube.com/@HeritageGuessr",
          href: "https://www.youtube.com/@HeritageGuessr",
          cta: "Watch videos",
        },
        {
          icon: "facebook",
          label: "Facebook",
          value: "facebook.com/HeritageGuessr",
          href: "https://www.facebook.com/profile.php?id=61568386015819",
          cta: "Follow us",
        },
        {
          icon: "github",
          label: "GitHub",
          value: "github.com/dev-HieuLe/HeritageGuessr",
          href: "https://github.com/dev-HieuLe/HeritageGuesser/blob/main/README.md",
          cta: "View source",
        },
      ],
    },

    // Footer
    footer: {
      copyright: "© 2026 Heritage Guessr. All Rights Reserved.",
      links: [
        { label: "Chronicles", to: "/rank" },
        { label: "Global Ranks", to: "/leaderboard" },
        { label: "Atlas", to: "/explore" },
        { label: "Academy", to: "/study" },
      ],
    },

    // Login
    login: {
      subtitle: "Enter the Archive",
      emailLabel: "Email",
      passwordLabel: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      submit: "Enter Archive",
      orDivider: "Or continue with",
      googleSignIn: "Continue with Google",
      divider: "New to the Archive?",
      createAccount: "Create Curator Account",
      backHome: "Back to Home",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      invalidCredentials: "Invalid email or password",
      somethingWrong: "Something went wrong. Please try again.",
    },

    // Register
    register: {
      subtitle: "Join the Archive",
      fields: {
        name: { label: "Curator Name", placeholder: "Your archival alias" },
        email: { label: "Email", placeholder: "curator@archive.vn" },
        password: { label: "Password", placeholder: "••••••••" },
        confirmPassword: { label: "Confirm Password", placeholder: "••••••••" },
      },
      submit: "Register as Curator",
      orDivider: "Or register with",
      googleSignUp: "Continue with Google",
      divider: "Already enrolled?",
      loginLink: "Enter Archive",
      backHome: "Back to Home",
      errors: {
        nameRequired: "Name is required",
        nameTooShort: "Name must be at least 2 characters",
        nameTooLong: "Name must be less than 50 characters",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email address",
        passwordRequired: "Password is required",
        passwordTooShort: "Password must be at least 8 characters",
        confirmRequired: "Confirm your password",
        confirmMismatch: "Passwords do not match",
        nameInvalidChars: "Name must contain at least one letter or number",
        emailInUse: "This email is already registered. Try logging in instead.",
        usernameTaken: "This username is already taken. Please choose another.",
        registrationError: "Registration error. Please try again.",
        invalidData: "Invalid registration data. Please check your inputs.",
        passwordTooLong: "Password must be less than 128 characters",
        somethingWrong: "Something went wrong. Please try again.",
        serverError: "Server error. Please try again later.",
      },
    },

    // Ranking
    ranking: {
      progressToNextRank: "Progress to next rank",
      rankTier: "Rank Tier",
      level: "Level",
      stars: "Stars",
      rankLadder: "Rank Ladder",
      rankNames: [
        "Iron",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Emerald",
        "Diamond",
        "Master",
        "Grandmaster",
        "Challenger",
      ],
    },

    // Leaderboard
    leaderboard: {
      rank: "Rank",
      curator: "Curator",
      level: "Level",
      tier: "Tier",
      curatorsInArchive: (count) => `${count} Curators in the Archive`,
    },

    // Contribute
    contribute: {
      legacyHeading: ["Legacy", "Preservation"],
      heroDesc:
        "Your contributions weave the fabric of our collective memory. Use the sanctuary to register new findings and refine the archive's intelligence.",
      registerNewHeritage: "Register New Heritage",
      totalSubmitted: "Total Submitted",
      approved: "Approved",
      pending: "Pending",
      declined: "Declined",
      yourContributions: "Your Contributions",
      noContributions:
        "No contributions yet. Be the first to register a heritage site!",
      submitFirstSite: "Submit Your First Site",
      theArtOfArchiving: "The Art of Archiving",
      cards: [
        {
          icon: "location_on",
          title: "Spatial Accuracy",
          desc: "Open Google Maps, navigate to the exact heritage location, then copy the full URL from your browser's address bar.",
        },
        {
          icon: "auto_awesome",
          title: "AI-Powered Metadata",
          desc: "Our AI extracts coordinates from your URL and auto-generates cultural descriptions, era, and difficulty rating.",
        },
        {
          icon: "description",
          title: "Semantic Detail",
          desc: "Add an optional description to give the AI context and improve the quality of the generated archive entry.",
        },
        {
          icon: "pending_actions",
          title: "Review Process",
          desc: "Each submission is reviewed by our curators. Accepted sites are added to the Heritage Guessr game world.",
        },
      ],
      howToGetUrl: "How to get a valid Google Maps URL",
      steps: [
        "Go to google.com/maps and search for the heritage site by name.",
        "Click on the location pin to open its detail panel.",
        "Switch to Street View by dragging the yellow Pegman onto the map.",
        'Copy the full URL from your browser — it should contain "@lat,lng" coordinates.',
        'Paste the URL into the "Google Street View URL" field and submit.',
      ],
    },

    // FAQ
    faq: [
      {
        q: "What is Heritage Guessr?",
        a: "Heritage Guessr is a Vietnamese heritage knowledge game. Each round places you inside a real Street View panorama of a heritage site — your job is to identify its name and estimate how old it is. There is no map pin. It is a test of cultural knowledge, not geography.",
      },
      {
        q: "How does each round work?",
        a: "You are dropped into a 360° Street View of a real Vietnamese heritage site. Study the architecture, carvings, and surroundings, then type the site's name and your best estimate of its age in years. Hit Confirm before the 120-second timer runs out.",
      },
      {
        q: "How is my score calculated?",
        a: "Each round is scored out of 10: up to 5 points for the name (similarity matching — partial matches still score) and up to 5 points for the age (within 10 years = full marks, within 80 years = 1 point). A total of 8 or above is a win; 4 or below is a loss.",
      },
      {
        q: "How does the rank system work?",
        a: "There are 10 ranks from Iron to Challenger. Win enough rounds to fill your 5-star progress bar and you promote to the next rank. Lose enough and you demote. Your rank and progress are shown on the Global Leaderboard alongside all other players.",
      },
      {
        q: "How do I earn points?",
        a: "You earn +5 points for finishing any ranked game, +10 points for your first game of the day (daily check-in), +5 points for reading a Study article, and +10 points for submitting a heritage contribution. Points are visible in your profile and the navbar.",
      },
      {
        q: "What is The Archivist?",
        a: "The Archivist is an AI companion available during every round. You can ask it up to 10 questions per round for hints — it will nudge you toward the answer without giving it away. Start with broad questions like 'What dynasty built this?' before narrowing down.",
      },
      {
        q: "What is the Study (Academy) section?",
        a: "The Study section contains in-depth articles about real Vietnamese heritage sites — their history, architecture, and cultural significance. Reading them sharpens your ability to recognise sites in-game. Each article you finish awards +5 points.",
      },
      {
        q: "Can I contribute new heritage sites?",
        a: "Yes. On the Contribute page, paste a Google Maps Street View URL and give the site a name. Our system auto-generates the region, era, and description using AI. Approved submissions enter the game's location pool and earn you +10 points.",
      },
    ],

    // Shop
    shop: {
      eyebrow: "Heritage Archive Store",
      title: "Gift Shop",
      subtitle:
        "Redeem your hard-earned points for exclusive heritage rewards.",
      points: "pts",
      redeem: "Redeem",
      notEnough: "Not Enough Points",
      items: {
        keyboard: "Mechanical Keyboard",
        keyboardDesc:
          "A premium full-size mechanical keyboard — the archivist's weapon of choice.",
        mouse: "Gaming Mouse",
        mouseDesc:
          "High-precision gaming mouse, crafted for the dedicated scholar.",
        tshirt: "Heritage Tee (Classic)",
        tshirtDesc:
          "Soft premium cotton tee bearing the Heritage Guessr emblem.",
        tshirt2: "Heritage Tee (Alt)",
        tshirt2Desc:
          "Alternative colourway of the official Heritage Guessr tee.",
        starbucks: "Starbucks Gift Card",
        starbucksDesc:
          "A Starbucks gift card to fuel your next heritage session.",
        keychain: "Heritage Keychain",
        keychainDesc:
          "Handcrafted keychain — a small token of your archival devotion.",
      },
      modal: {
        notEnoughTitle: "Not Enough Points",
        notEnoughBody:
          "This item costs {need} pts. You have {have} pts. You need {diff} more pts to redeem this reward.",
        confirmTitle: "How to Redeem",
        contactIntro:
          "Contact us through any channel below to exchange your points for this item.",
        phone: "Phone",
        note: "Screenshot this page and send it along with your in-game username when reaching out.",
        close: "Close",
      },
    },

    // About Us page
    aboutUs: {
      // Hero
      badge: "Heritage Guessr",
      heroLine1: "Built to",
      heroLine2: "Preserve.",
      heroLine3: "Designed to",
      heroLine4: "Inspire.",
      heroDesc:
        "Heritage Guessr drops you into real Google Street View panoramas of Vietnamese heritage sites. Explore with your AI guide Savannah, guess the site's name and age, and climb a global leaderboard — all while learning about Vietnam's cultural treasures.",
      pills: {
        streetView: "Street View",
        aiGuide: "AI Guide",
        nlpScoring: "NLP Scoring",
        studyMode: "Study Mode",
        xpShop: "XP Shop",
        vrDiscovery: "VR Discovery",
      },

      // Stats
      statsLabels: [
        "Students Reached",
        "Heritage Sites",
        "AI Models",
        "Schools Piloting",
      ],

      // Mission
      missionLabel: "Our Mission",
      missionVi: "Lan tỏa, kết nối và gìn giữ.",
      missionEn: "Spread, connect, and preserve.",
      whyBuilt: "Why We Built This",
      missionHeadline1: "Vietnam has over",
      missionHeadline2: "40,000 heritage sites.",
      missionHeadline3: "Most go unnoticed.",
      missionBody1:
        "Heritage Guessr was conceived at Delta Global School, Hanoi as a technology-driven initiative to make Vietnamese cultural heritage accessible, engaging, and unforgettable — starting with students and expanding outward.",
      missionBody2:
        "We combine Google Street View, generative AI, and multilingual NLP to turn passive scrolling into active learning — while tracking your progress against players worldwide.",
      badgeDGS: "DGS Hanoi",
      badge600: "600+ Students",
      badgeUNESCO: "UNESCO Sites",
      badgeAI: "AI-Powered",

      // Technology
      underTheHood: "Under the Hood",
      techHeadline1: "Powered by Eight",
      techHeadline2: "Technologies",
      techDesc:
        "From real-time 3D Street View to multilingual neural networks — every layer is chosen to serve the experience.",
      techDescs: [
        "Lightning-fast frontend with HMR",
        "Immersive 360° heritage exploration",
        "AI guide & site personalization",
        "Natural bilingual voice synthesis",
        "Multilingual answer scoring",
        "3D animated AI companion Savannah",
        "Express 5 REST API + relational DB",
        "Fluid animations, utility-first UI",
      ],

      // Timeline
      ourJourney: "Our Journey",
      howItStarted: "How It All",
      howItStartedAccent: "Started",
      journeyDesc:
        "From a classroom idea to a full-stack platform serving hundreds of students — here's the Heritage Guessr story.",
      quote:
        '"We asked — what if rediscovering Vietnam\'s past could feel like playing a game? That question became Heritage Guessr."',
      quoteRole: "Innovation Leader",
      timeline: [
        {
          year: "Early 2025 · Genesis",
          title: "Born in Room B410",
          desc: "The idea took shape at DGS as a Capstone project — blending education and AI to preserve Vietnamese cultural identity. An early concept emerged for a game integrating VR interactions to explore the nation's heritage.",
        },
        {
          year: "Summer 2025 · Chapter One",
          title: "Beta 0.1 Takes Shape",
          desc: "The first Beta was built, laying the groundwork for an AI and NLP-integrated platform. Initial testing reached 10–20 players from a small in-class group, with early feedback from History and Geography teachers.",
        },
        {
          year: "Late 2025 · Pilot Launch",
          title: "Schools & Real Feedback",
          desc: "After feature upgrades, the project was piloted at DGS Adventure (The Dewey School) and Luong Van Can High School. Over 300 students and 10 teachers participated, providing valuable reviews and feedback.",
        },
        {
          year: "Mar 2026 · Beta 1.0",
          title: "Major Upgrade",
          desc: "The platform received a significant overhaul in UI, AI protocols, feature systems, and data processing pipelines — shaped by real teacher feedback and classroom needs — ready to reach the wider community.",
        },
        {
          year: "Now · Open Platform",
          title: "Community Contributions",
          desc: "Heritage Guessr is finalising its packaging to reach users. We are accelerating the movement by opening contributions not just to founders, but to the community itself.",
        },
        {
          year: "Future · Horizon",
          title: "The Sky's the Limit",
          desc: "Heritage Guessr aims to continue expanding its technical infrastructure to meet the growing needs of players and preserve even more of Vietnam's rich cultural landscape.",
        },
      ],

      // Savannah spotlight
      meetAIGuide: "Meet Your AI Guide",
      savannahTitle1: "Savannah — Your",
      savannahTitle2: "Heritage Expert",
      savannahDesc:
        "Powered by Gemma 4 26B via DeepInfra, Savannah gives you contextual hints without ever spoiling the answer. She speaks in natural language, reads her replies aloud via Gemini TTS (Despina voice), and comes to life as a 3D VRM avatar you can watch blink and animate in real-time.",
      online: "ONLINE",
      pillGemma: "Gemma 4 · 26B Chat",
      pillTTS: "Gemini TTS",
      pill3D: "3D VRM Avatar",
      pillLang: "EN + VI",

      // Hieu quote
      hieuQuote1: "I wrote every",
      hieuQuoteAccent: "line of code",
      hieuQuote2: "with one goal: make Vietnam's heritage",
      hieuQuoteAccent2: "impossible to forget.",
      hieuRole: "Lead Developer · Designer · Author",

      // Team / Contact
      craftedBy: "Crafted By",
      foundingTeam: "The Founding Team",
      teamDesc:
        "Three students at Delta Global School, Hanoi — united by one mission.",
      memberRoles: [
        "Innovation Leader",
        "Lead Developer · Designer · Author",
        "Creative Content Specialist",
      ],
      dgsTitle: "Delta Global School",
      dgsLocation: "Hanoi, Vietnam",
      dgsDesc:
        "Heritage Guessr was conceived and built at DGS as part of an initiative to preserve and promote Vietnamese cultural heritage through technology.",
      theTeamLabel: "The Team",
      meetFounders: "Meet the Founders",
      meetFoundersDesc:
        "See the full team behind Heritage Guessr on our homepage.",
      viewFounders: "View Founders",

      // Bottom strip
      openSource: "Open Source · Educational",
      bottomTitle: "Built with ❤️ for Vietnamese Cultural Heritage",
      copyright:
        "Copyright © 2025 Le Trung Hieu and the Heritage Guessr Team. All rights reserved.",
      followUs: "Follow Us",
      contributeASite: "Contribute a Site",
    },

    // Founders section
    founders: {
      eyebrow: "The People Behind the Platform",
      headline: "Our",
      headlineAccent: "Founders",
      subtitle:
        "A devoted team preserving and celebrating the soul of Vietnam — one landmark at a time.",
      founderBadge: "Founder",
      viewProfile: "View profile →",
      connect: "Connect",
      members: [
        {
          name: "Đặng Thái Hoà",
          role: "Innovation Leader",
          bio: "Shapes the strategic vision of Heritage Guessr, applying design thinking and creative direction to craft meaningful experiences that redefine how Vietnamese heritage is explored online.",
        },
        {
          name: "Lê Trung Hiếu",
          role: "Full-Stack Engineering Lead & Designer",
          bio: "Leads the end-to-end development of Heritage Guessr, from full-stack engineering and backend architecture to polished frontend design, creating a robust, scalable platform that transforms Vietnamese heritage into an immersive digital experience.",
        },
        {
          name: "Nguyễn Thái Sơn",
          role: "Creative Content Specialist",
          bio: "Breathes cultural soul into every corner of the platform — crafting stories, imagery, and experiences that make Vietnam's heritage unforgettable.",
        },
      ],
    },

    // Loading
    loading: "Loading…",
  },

  vi: {
    // Nav
    nav: {
      home: "Trang Chủ",
      about: "Giới Thiệu",
      rank: "Chơi Rank",
      explore: "Bản Đồ",
      leaderboard: "Xếp Hạng",
      study: "Học Viện",
      atlas: "Bản Đồ",
      tutorial: "Hướng Dẫn",
      contribute: "Đóng Góp",
      shop: "Cửa Hàng",
      vrDiscovery: "Khám Phá VR",
      challenge: "Thử Thách",
      logout: "Đăng Xuất",
      signIn: "Đăng Nhập",
      settings: "Cài Đặt",
    },

    // Sidebar
    sidebar: {
      sanctuary: "Thánh Địa",
      about: "Giới Thiệu",
      PlayRank: "Chơi Rank",
      globalRanks: "Xếp Hạng Toàn Cầu",
      atlas: "Bản Đồ",
      academy: "Học Viện",
      tutorial: "Hướng Dẫn",
      contribute: "Đóng Góp",
      shop: "Cửa Hàng",
      vrDiscovery: "Khám Phá VR",
      feedback: "Phản Hồi",
      feedbackPlaceholder:
        "Chia sẻ ý kiến, báo lỗi hoặc đề xuất tính năng… (tối đa 100 từ)",
      feedbackSend: "Gửi Phản Hồi",
      feedbackSending: "Đang gửi…",
      feedbackSent: "Đã gửi! Cảm ơn bạn.",
      feedbackContact: "Để được phản hồi nhanh hơn, liên hệ qua",
      feedbackOr: "hoặc",
      settings: "Cài Đặt",
      imperialScholar: "Học Giả Đế Vương",
      rankLabel: (rankName) => `Hạng · ${rankName} Học Giả`,
    },

    // Hero
    hero: {
      badge: "Đã Kích Hoạt Trải Nghiệm VR",
      headline1: "Khám Phá",
      headline2: "Ẩn Bí",
      headline3: "Việt Nam.",
      body: "Bước vào kho lưu trữ di sản huyền bí. Kiểm tra trực giác văn hóa của bạn qua hàng nghìn năm lịch sử, từ làn sương Hạ Long đến cổng thành Huế.",
      startGuessing: "Bắt Đầu Đoán",
      viewMap: "Xem Bản Đồ",
      tutorial: "Học Cách Chơi",
    },

    // Bento
    bento: {
      liveNow: "Đang Trực Tuyến",
      archivistsExploring: "Học giả đang khám phá",
      todaysQuest: "Nhiệm Vụ Hôm Nay",
      endsIn: "Kết thúc sau",
      questTitle: "Thánh Địa Mỹ Sơn",
      questDesc: "Xác định các họa tiết ẩn trong quần thể đền Hindu cổ đại.",
      xpReward: "+500 XP Phần Thưởng",
      imperialScholars: "Học Giả Đế Vương",
      fullRankings: "Xếp Hạng Đầy Đủ",
    },

    // Atlas section
    atlas: {
      eyebrow: "Bản Đồ Danh Tính",
      headline1: "Mỗi tọa độ kể",
      headline2: "một",
      headline3: "câu chuyện nghìn năm",
      headline4: "lịch sử.",
      features: [
        {
          title: "Lịch Sử Truyền Miệng Đã Kiểm Chứng",
          desc: "Dữ liệu được AI tuyển chọn từ kho lưu trữ quốc gia đảm bảo mỗi địa điểm đều chính xác về lịch sử và có ý nghĩa văn hóa.",
        },
        {
          title: "Khám Phá Siêu Cục Bộ",
          desc: "Khám phá những con hẻm ẩn và đền thờ cổ mà bản đồ lớn bỏ qua. Trải nghiệm Việt Nam ở tầm vóc con người.",
        },
        {
          title: "Điểm Di Sản Tương Tác",
          desc: "Nhấp để khám phá hoa văn Đông Sơn, bản nhạc dân gian và các mô hình 3D của hiện vật địa phương.",
        },
      ],
    },

    // CTA
    cta: {
      headline: "Trở Thành Người Bảo Vệ Văn Hóa.",
      body: "Cùng hàng nghìn nhà thám hiểm bảo tồn di sản Việt Nam qua lăng kính công nghệ. Kho lưu trữ đang chờ đợi bạn.",
      createProfile: "Tạo Hồ Sơ",
      questLogin: "Đăng Nhập Nhiệm Vụ",
    },

    // Contact section
    contact: {
      eyebrow: "Liên Hệ Kho Lưu Trữ",
      headline: "Chúng tôi muốn",
      headlineAccent: "lắng nghe bạn.",
      body: "Có câu hỏi, báo lỗi, hay chỉ muốn nói về di sản? Hãy liên hệ — chúng tôi luôn lắng nghe.",
      channels: [
        {
          icon: "mail",
          label: "Email",
          value: "heritageguesser@gmail.com",
          href: "mailto:heritageguesser@gmail.com",
          cta: "Gửi tin nhắn",
        },
        {
          icon: "youtube",
          label: "YouTube",
          value: "youtube.com/@HeritageGuessr",
          href: "https://www.youtube.com/@HeritageGuessr",
          cta: "Xem video",
        },
        {
          icon: "facebook",
          label: "Facebook",
          value: "facebook.com/HeritageGuessr",
          href: "https://www.facebook.com/share/1CQYKoHfu1/?mibextid=wwXIfr",
          cta: "Theo dõi",
        },
        {
          icon: "github",
          label: "GitHub",
          value: "github.com/dev-HieuLe/HeritageGuessr",
          href: "https://github.com/dev-HieuLe/HeritageGuesser/blob/main/README.md",
          cta: "Xem mã nguồn",
        },
      ],
    },

    // About Us page
    aboutUs: {
      // Hero
      badge: "Heritage Guessr",
      heroLine1: "Được tạo ra để",
      heroLine2: "Bảo Tồn.",
      heroLine3: "Được thiết kế để",
      heroLine4: "Truyền Cảm Hứng.",
      heroDesc:
        "Heritage Guessr đưa bạn vào những ảnh toàn cảnh Google Street View thực tế của các di sản Việt Nam. Khám phá cùng hướng dẫn viên AI Savannah, đoán tên và niên đại của địa danh, và leo lên bảng xếp hạng toàn cầu — tất cả trong khi tìm hiểu về kho tàng văn hóa Việt Nam.",
      pills: {
        streetView: "Street View",
        aiGuide: "Trợ Lý AI",
        nlpScoring: "Chấm Điểm NLP",
        studyMode: "Học Tập",
        xpShop: "Cửa Hàng XP",
        vrDiscovery: "Khám Phá VR",
      },

      // Stats
      statsLabels: [
        "Học Sinh Tiếp Cận",
        "Di Sản Văn Hóa",
        "Mô Hình AI",
        "Trường Thí Điểm",
      ],

      // Mission
      missionLabel: "Sứ Mệnh Của Chúng Tôi",
      missionVi: "Lan tỏa, kết nối và gìn giữ.",
      missionEn: "Spread, connect, and preserve.",
      whyBuilt: "Tại Sao Chúng Tôi Xây Dựng Điều Này",
      missionHeadline1: "Việt Nam có hơn",
      missionHeadline2: "40.000 di sản văn hóa.",
      missionHeadline3: "Hầu hết bị lãng quên.",
      missionBody1:
        "Heritage Guessr được thai nghén tại Trường Delta Global School, Hà Nội như một sáng kiến công nghệ nhằm làm cho di sản văn hóa Việt Nam trở nên dễ tiếp cận, hấp dẫn và khó quên — bắt đầu từ học sinh và lan rộng ra cộng đồng.",
      missionBody2:
        "Chúng tôi kết hợp Google Street View, AI tạo sinh và NLP đa ngôn ngữ để biến việc lướt mạng thụ động thành học tập chủ động — đồng thời theo dõi tiến trình của bạn so với người chơi trên toàn thế giới.",
      badgeDGS: "DGS Hà Nội",
      badge600: "600+ Học Sinh",
      badgeUNESCO: "Di Sản UNESCO",
      badgeAI: "Hỗ Trợ AI",

      // Technology
      underTheHood: "Công Nghệ Bên Trong",
      techHeadline1: "Được Hỗ Trợ Bởi Tám",
      techHeadline2: "Công Nghệ",
      techDesc:
        "Từ Street View 3D thời gian thực đến mạng nơ-ron đa ngôn ngữ — mỗi lớp đều được chọn để phục vụ trải nghiệm.",
      techDescs: [
        "Frontend siêu nhanh với HMR",
        "Khám phá di sản toàn cảnh 360°",
        "Hướng dẫn AI & cá nhân hóa địa điểm",
        "Tổng hợp giọng nói song ngữ tự nhiên",
        "Chấm điểm câu trả lời đa ngôn ngữ",
        "Nhân vật AI 3D đồng hành Savannah",
        "REST API Express 5 + cơ sở dữ liệu quan hệ",
        "Hoạt ảnh mượt mà, giao diện utility-first",
      ],

      // Timeline
      ourJourney: "Hành Trình Của Chúng Tôi",
      howItStarted: "Tất Cả Đã",
      howItStartedAccent: "Bắt Đầu",
      journeyDesc:
        "Từ ý tưởng trong lớp học đến nền tảng full-stack phục vụ hàng trăm học sinh — đây là câu chuyện của Heritage Guessr.",
      quote:
        '"Chúng tôi đã tự hỏi — điều gì sẽ xảy ra nếu việc khám phá lại quá khứ Việt Nam có thể cảm giác như chơi game? Câu hỏi đó đã trở thành Heritage Guessr."',
      quoteRole: "Lãnh Đạo Đổi Mới",
      timeline: [
        {
          year: "Đầu 2025 · Khởi Nguyên",
          title: "Ra Đời Trong Phòng B410",
          desc: "Ý tưởng được thai nghén tại DGS như một dự án Capstone — kết hợp giáo dục và AI nhằm bảo tồn bản sắc văn hóa Việt Nam. Ý tưởng ban đầu về một tựa game tích hợp tương tác VR để khám phá di sản đất nước được hình thành.",
        },
        {
          year: "Hè 2025 · Chương Đầu",
          title: "Beta 0.1 Được Hình Thành",
          desc: "Phiên bản Beta đầu tiên ra đời, đặt nền móng cho nền tảng tích hợp AI và NLP. Thử nghiệm ban đầu với 10–20 người chơi trong nhóm nhỏ trong lớp, cùng phản hồi từ giáo viên Sử và Địa.",
        },
        {
          year: "Cuối 2025 · Ra Mắt Thử Nghiệm",
          title: "Trường Học & Phản Hồi Thực Tế",
          desc: "Sau khi nâng cấp tính năng, dự án được thử nghiệm tại hệ DGS Adventure (The Dewey School) và Trường THPT Lương Văn Can. Hơn 300 học sinh và 10 giáo viên tham gia đưa ra nhận xét và phản hồi.",
        },
        {
          year: "T3 2026 · Beta 1.0",
          title: "Nâng Cấp Toàn Diện",
          desc: "Sản phẩm được nâng cấp mạnh mẽ về giao diện, giao thức AI, hệ thống tính năng và quy trình xử lý dữ liệu — dựa theo phản hồi thực tiễn của giáo viên — sẵn sàng đến với cộng đồng.",
        },
        {
          year: "Hiện Tại · Nền Tảng Mở",
          title: "Đóng Góp Từ Cộng Đồng",
          desc: "Heritage Guessr đang tiến đến giai đoạn đóng gói sản phẩm để đưa đến tay người dùng. Chúng tôi đẩy mạnh phong trào bằng việc cho phép không chỉ nhà sáng lập mà cả cộng đồng cùng đóng góp xây dựng nền tảng.",
        },
        {
          year: "Tương Lai · Biển Trời Rộng Mở",
          title: "Không Giới Hạn",
          desc: "Heritage Guessr hướng đến việc tiếp tục phát triển hạ tầng kỹ thuật nhằm đáp ứng nhu cầu ngày càng lớn của người chơi và bảo tồn thêm nhiều di sản văn hóa phong phú của Việt Nam.",
        },
      ],

      // Savannah spotlight
      meetAIGuide: "Gặp Gỡ Hướng Dẫn Viên AI",
      savannahTitle1: "Savannah — Chuyên Gia",
      savannahTitle2: "Di Sản Của Bạn",
      savannahDesc:
        "Được hỗ trợ bởi Gemma 4 26B qua DeepInfra, Savannah cung cấp gợi ý theo ngữ cảnh mà không bao giờ tiết lộ đáp án. Cô ấy nói bằng ngôn ngữ tự nhiên, đọc to câu trả lời qua Gemini TTS (giọng Despina), và hiện thân như một nhân vật VRM 3D mà bạn có thể xem nháy mắt và hoạt ảnh theo thời gian thực.",
      online: "TRỰC TUYẾN",
      pillGemma: "Gemma 4 · 26B Chat",
      pillTTS: "Gemini TTS",
      pill3D: "Nhân Vật VRM 3D",
      pillLang: "VI + EN",

      // Hieu quote
      hieuQuote1: "Tôi đã viết từng",
      hieuQuoteAccent: "dòng code",
      hieuQuote2: "với một mục tiêu: làm cho di sản Việt Nam",
      hieuQuoteAccent2: "không thể bị lãng quên.",
      hieuRole: "Trưởng Nhóm Phát Triển · Thiết Kế · Tác Giả",

      // Team / Contact
      craftedBy: "Được Tạo Bởi",
      foundingTeam: "Đội Sáng Lập",
      teamDesc:
        "Ba học sinh tại Delta Global School, Hà Nội — cùng chung một sứ mệnh.",
      memberRoles: [
        "Lãnh Đạo Đổi Mới",
        "Trưởng Nhóm Phát Triển · Thiết Kế · Tác Giả",
        "Chuyên Gia Nội Dung Sáng Tạo",
      ],
      dgsTitle: "Delta Global School",
      dgsLocation: "Hà Nội, Việt Nam",
      dgsDesc:
        "Heritage Guessr được thai nghén và xây dựng tại DGS như một phần của sáng kiến bảo tồn và quảng bá di sản văn hóa Việt Nam thông qua công nghệ.",
      theTeamLabel: "Đội Ngũ",
      meetFounders: "Gặp Gỡ Những Nhà Sáng Lập",
      meetFoundersDesc:
        "Xem toàn bộ đội ngũ đứng sau Heritage Guessr trên trang chủ của chúng tôi.",
      viewFounders: "Xem Nhà Sáng Lập",

      // Bottom strip
      openSource: "Mã Nguồn Mở · Giáo Dục",
      bottomTitle: "Được tạo ra với ❤️ cho Di Sản Văn Hóa Việt Nam",
      copyright:
        "Bản quyền © 2025 Lê Trung Hiếu và Đội Ngũ Heritage Guessr. Mọi quyền được bảo lưu.",
      followUs: "Theo Dõi",
      contributeASite: "Đóng Góp Địa Danh",
    },

    // Founders section
    founders: {
      eyebrow: "Những Người Đứng Sau Nền Tảng",
      headline: "Những",
      headlineAccent: "Nhà Sáng Lập",
      subtitle:
        "Một đội ngũ tận tâm bảo tồn và tôn vinh hồn Việt — từng di tích một.",
      founderBadge: "Nhà Sáng Lập",
      viewProfile: "Xem hồ sơ →",
      connect: "Kết Nối",
      members: [
        {
          name: "Đặng Thái Hoà",
          role: "Lãnh Đạo Đổi Mới",
          bio: "Dẫn dắt tầm nhìn đằng sau các tính năng đột phá của Heritage Guessr, không ngừng mở rộng giới hạn của một nền tảng edutainment.",
        },
        {
          name: "Lê Trung Hiếu",
          role: "Lãnh Đạo Kỹ Thuật & Design",
          bio: "Phụ trách toàn bộ quá trình phát triển Heritage Guessr, từ kỹ thuật full-stack và kiến trúc backend đến thiết kế frontend, tạo ra nền tảng vững chắc biến di sản Việt Nam thành trải nghiệm số sống động.",
        },
        {
          name: "Nguyễn Thái Sơn",
          role: "Chuyên Gia Nội Dung Sáng Tạo",
          bio: "Thổi hồn văn hóa vào từng ngóc ngách của nền tảng — tạo ra những câu chuyện, hình ảnh và trải nghiệm khiến di sản Việt Nam trở nên khó quên.",
        },
      ],
    },

    // Footer
    footer: {
      copyright: "© 2026 Heritage Guessr. Mọi Quyền Được Bảo Lưu.",
      links: [
        { label: "Biên Niên Sử", to: "/rank" },
        { label: "Xếp Hạng Toàn Cầu", to: "/leaderboard" },
        { label: "Bản Đồ", to: "/explore" },
        { label: "Học Viện", to: "/study" },
      ],
    },

    // Login
    login: {
      subtitle: "Vào Kho Lưu Trữ",
      emailLabel: "Email",
      passwordLabel: "Mật Khẩu",
      rememberMe: "Ghi nhớ đăng nhập",
      forgotPassword: "Quên mật khẩu?",
      submit: "Đăng Nhập",
      orDivider: "Hoặc tiếp tục với",
      googleSignIn: "Tiếp tục với Google",
      divider: "Chưa có tài khoản?",
      createAccount: "Tạo Tài Khoản",
      backHome: "Về Trang Chủ",
      emailRequired: "Email là bắt buộc",
      passwordRequired: "Mật khẩu là bắt buộc",
      invalidCredentials: "Email hoặc mật khẩu không đúng",
      somethingWrong: "Đã xảy ra lỗi. Vui lòng thử lại.",
    },

    // Register
    register: {
      subtitle: "Tham Gia Kho Lưu Trữ",
      fields: {
        name: {
          label: "Tên Người Dùng",
          placeholder: "Biệt danh lưu trữ của bạn",
        },
        email: { label: "Email", placeholder: "curator@archive.vn" },
        password: { label: "Mật Khẩu", placeholder: "••••••••" },
        confirmPassword: {
          label: "Xác Nhận Mật Khẩu",
          placeholder: "••••••••",
        },
      },
      submit: "Đăng Ký",
      orDivider: "Hoặc đăng ký với",
      googleSignUp: "Tiếp tục với Google",
      divider: "Đã có tài khoản?",
      loginLink: "Đăng Nhập",
      backHome: "Về Trang Chủ",
      errors: {
        nameRequired: "Tên là bắt buộc",
        nameTooShort: "Tên phải có ít nhất 2 ký tự",
        nameTooLong: "Tên không được quá 50 ký tự",
        emailRequired: "Email là bắt buộc",
        emailInvalid: "Địa chỉ email không hợp lệ",
        passwordRequired: "Mật khẩu là bắt buộc",
        passwordTooShort: "Mật khẩu phải có ít nhất 8 ký tự",
        confirmRequired: "Vui lòng xác nhận mật khẩu",
        confirmMismatch: "Mật khẩu không khớp",
        nameInvalidChars: "Tên phải chứa ít nhất một chữ cái hoặc chữ số",
        emailInUse:
          "Email này đã được đăng ký. Vui lòng đăng nhập thay vào đó.",
        usernameTaken: "Tên người dùng này đã tồn tại. Vui lòng chọn tên khác.",
        registrationError: "Lỗi đăng ký. Vui lòng thử lại.",
        invalidData: "Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại.",
        passwordTooLong: "Mật khẩu phải dưới 128 ký tự",
        somethingWrong: "Đã xảy ra lỗi. Vui lòng thử lại.",
        serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
      },
    },

    // Ranking
    ranking: {
      progressToNextRank: "Điểm tích lũy xếp hạng",
      rankTier: "Thứ hạng",
      level: "Cấp độ",
      stars: "Điểm tuyệt đối",
      rankLadder: "Thứ hạng rank",
      rankNames: [
        "Sắt",
        "Đồng",
        "Bạc",
        "Vàng",
        "Bạch Kim",
        "Lục Bảo",
        "Kim Cương",
        "Cao Thủ",
        "Đại Cao Thủ",
        "Thách Đấu",
      ],
    },

    // Leaderboard
    leaderboard: {
      rank: "Xếp hạng",
      curator: "Người chơi",
      level: "Cấp độ",
      tier: "Hạng",
      curatorsInArchive: (count) => `${count} nhà sử học đang chơi`,
    },

    // Contribute
    contribute: {
      legacyHeading: ["Bảo tồn", "di sản"],
      heroDesc:
        "Những đóng góp của bạn đang thêu dệt nên những mảnh ký ức đẹp của chúng ta. Hãy sử dụng không gian lưu trữ này để ghi nhận những phát hiện mới và tiếp tục hoàn thiện trí tuệ của kho lưu trữ.",
      registerNewHeritage: "Thêm địa danh",
      totalSubmitted: "Tổng đóng góp",
      approved: "Duyệt thành công",
      pending: "Đang xử lý",
      declined: "Từ chối",
      yourContributions: "Đóng góp của bạn",
      noContributions:
        "Chưa có đóng góp nào, hãy cùng tham gia đóng góp vào trò chơi nhé!",
      submitFirstSite: "Đóng góp lần đầu ngay",
      theArtOfArchiving: "Nghệ thuật lưu giữ",
      cards: [
        {
          icon: "location_on",
          title: "Độ chính xác không gian",
          desc: "Mở Google Maps, điều hướng đến đúng địa điểm di sản, sau đó sao chép toàn bộ URL từ thanh địa chỉ của trình duyệt.",
        },
        {
          icon: "auto_awesome",
          title: "Metadata được hỗ trợ bởi AI",
          desc: "AI của chúng tôi trích xuất tọa độ từ URL của bạn và tự động tạo mô tả văn hóa, niên đại và mức độ khó.",
        },
        {
          icon: "description",
          title: "Chi tiết ngữ nghĩa",
          desc: "Thêm phần mô tả tùy chọn để cung cấp thêm ngữ cảnh cho AI và nâng cao chất lượng của mục lưu trữ được tạo ra.",
        },
        {
          icon: "pending_actions",
          title: "Quy trình duyệt",
          desc: "Mỗi bài gửi đều được đội ngũ kiểm duyệt viên xem xét. Các địa điểm được chấp nhận sẽ được thêm vào thế giới trò chơi Heritage Guesser.",
        },
      ],
      howToGetUrl: "Cách lấy URL Google Maps hợp lệ",
      steps: [
        "Truy cập google.com/maps và tìm kiếm địa điểm di sản theo tên.",
        "Nhấp vào ghim vị trí để mở bảng thông tin chi tiết.",
        "Chuyển sang chế độ Street View bằng cách kéo biểu tượng Pegman màu vàng vào bản đồ.",
        'Sao chép toàn bộ URL từ trình duyệt — URL này nên chứa tọa độ "@lat,lng".',
        'Dán URL vào trường "Google Street View URL" và gửi đi.',
      ],
    },

    // FAQ
    faq: [
      {
        q: "Heritage Guesser là gì?",
        a: "Heritage Guesser là một trò chơi kiến thức về di sản Việt Nam. Mỗi vòng chơi đưa bạn vào ảnh toàn cảnh Street View thật của một địa điểm di sản — nhiệm vụ của bạn là xác định tên địa điểm đó và ước tính niên đại của nó. Sẽ không có ghim bản đồ. Đây là bài kiểm tra về hiểu biết văn hóa, không phải địa lý.",
      },
      {
        q: "Mỗi vòng chơi diễn ra như thế nào?",
        a: "Bạn sẽ được đưa vào chế độ xem Street View 360° của một địa điểm di sản có thật tại Việt Nam. Hãy quan sát kiến trúc, hoa văn chạm khắc và không gian xung quanh, sau đó nhập tên địa điểm và ước tính tốt nhất của bạn về số năm tuổi của nó. Nhấn Xác nhận trước khi đồng hồ đếm ngược 120 giây kết thúc.",
      },
      {
        q: "Điểm số của tôi được tính như thế nào?",
        a: "Mỗi vòng được chấm trên thang điểm 10: tối đa 5 điểm cho tên địa điểm (so khớp tương đồng — đáp án gần đúng vẫn có điểm) và tối đa 5 điểm cho niên đại (sai lệch trong 10 năm = điểm tối đa, sai lệch trong 80 năm = 1 điểm). Tổng điểm từ 8 trở lên là thắng; từ 4 trở xuống là thua.",
      },
      {
        q: "Hệ thống xếp hạng hoạt động như thế nào?",
        a: "Có 10 bậc xếp hạng từ Iron đến Challenger. Thắng đủ số vòng để lấp đầy thanh tiến trình 5 sao của bạn và bạn sẽ được thăng hạng. Thua đủ nhiều thì bạn sẽ bị tụt hạng. Xếp hạng và tiến trình của bạn được hiển thị trên Bảng xếp hạng toàn cầu cùng với những người chơi khác.",
      },
      {
        q: "Làm thế nào để tôi kiếm điểm?",
        a: "Bạn nhận được +5 điểm khi hoàn thành bất kỳ trận xếp hạng nào, +10 điểm cho trận đầu tiên trong ngày (điểm danh hằng ngày), +5 điểm khi đọc một bài viết ở mục Study, và +10 điểm khi gửi một đóng góp về di sản. Điểm sẽ hiển thị trong hồ sơ cá nhân và trên thanh điều hướng.",
      },
      {
        q: "The Archivist là gì?",
        a: 'The Archivist là một trợ lý AI đồng hành cùng bạn trong mỗi vòng chơi. Bạn có thể hỏi tối đa 10 câu hỏi mỗi vòng để nhận gợi ý — nó sẽ dẫn bạn đến gần đáp án hơn mà không tiết lộ trực tiếp. Hãy bắt đầu với những câu hỏi rộng như "Triều đại nào đã xây dựng nơi này?" rồi thu hẹp dần.',
      },
      {
        q: "Mục Study (Academy) là gì?",
        a: "Mục Study chứa các bài viết chuyên sâu về những địa điểm di sản có thật của Việt Nam — bao gồm lịch sử, kiến trúc và ý nghĩa văn hóa của chúng. Việc đọc các bài này sẽ giúp bạn nâng cao khả năng nhận diện địa điểm trong trò chơi. Mỗi bài bạn đọc xong sẽ được thưởng +5 điểm.",
      },
      {
        q: "Tôi có thể đóng góp thêm các địa điểm di sản mới không?",
        a: "Có. Tại trang Contribute, hãy dán một URL Google Maps Street View và nhập tên địa điểm. Hệ thống của chúng tôi sẽ tự động tạo khu vực, niên đại và mô tả bằng AI. Những bài gửi được duyệt sẽ được thêm vào kho địa điểm của trò chơi và bạn sẽ nhận được +10 điểm.",
      },
    ],

    // Shop
    shop: {
      eyebrow: "Cửa Hàng Kho Lưu Trữ Di Sản",
      title: "Cửa Hàng Quà Tặng",
      subtitle:
        "Đổi điểm tích lũy của bạn để nhận những phần thưởng di sản độc quyền.",
      points: "điểm",
      redeem: "Đổi Quà",
      notEnough: "Không Đủ Điểm",
      items: {
        keyboard: "Bàn Phím Cơ",
        keyboardDesc:
          "Bàn phím cơ full-size cao cấp — vũ khí lựa chọn của các học giả.",
        mouse: "Chuột Gaming",
        mouseDesc:
          "Chuột gaming độ chính xác cao, dành cho những học giả tận tụy.",
        tshirt: "Áo Heritage (Phiên Bản 1)",
        tshirtDesc: "Áo cotton cao cấp in biểu tượng Heritage Guessr.",
        tshirt2: "Áo Heritage (Phiên Bản 2)",
        tshirt2Desc:
          "Phiên bản màu thay thế của áo Heritage Guessr chính thức.",
        starbucks: "Thẻ Quà Starbucks",
        starbucksDesc:
          "Thẻ quà Starbucks để tiếp thêm năng lượng cho buổi học di sản tiếp theo.",
        keychain: "Móc Khóa Di Sản",
        keychainDesc:
          "Móc khóa thủ công — món quà nhỏ ghi nhận sự cống hiến của bạn.",
      },
      modal: {
        notEnoughTitle: "Không Đủ Điểm",
        notEnoughBody:
          "Vật phẩm này cần {need} điểm. Bạn đang có {have} điểm. Cần thêm {diff} điểm nữa để đổi quà.",
        confirmTitle: "Cách Đổi Quà",
        contactIntro:
          "Liên hệ với chúng tôi qua bất kỳ kênh nào dưới đây để đổi điểm lấy vật phẩm này.",
        phone: "Điện Thoại",
        note: "Chụp màn hình trang này và gửi kèm tên người dùng trong game khi liên hệ.",
        close: "Đóng",
      },
    },

    // Loading
    loading: "Đang tải…",
  },
};

export default t;
