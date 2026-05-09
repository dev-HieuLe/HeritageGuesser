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
      members: "Members",
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
      subscription: "Subscription / Plans",
      rankNow: "Rank Now",
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
      chronicles: "Chronicles",
      yourRank: "Your Rank",
      rankNow: "Rank Now",
      loading: "Loading rank data...",
      maintenance: "Under Maintenance",
      maintenanceDesc: "The Ranked Archive is temporarily closed for maintenance. Please check back later.",
      backHome: "Back to Home",
      starsOf: (s) => `${s} / 5 stars`,
      rankLabel: (rank, name) => `RANK ${rank} — ${name}`,
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
      showMore: (n) => `Show ${n} More`,
      showLess: "Show Less",
      scrollToBottom: "Jump to bottom",
      scrollToTop: "Back to top",
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

    // Progress Analysis
    progressAnalysis: {
      badge: "AI INSIGHTS",
      title: "Progress Analysis",
      subtitle: "AI will analyze your game history and deliver personalised insights — regions to focus on, missing historical periods, and skills to improve.",
      readyLabel: "Ready to analyze",
      readySub: "Based on your full game history",
      loginLabel: "Sign in to analyze",
      loginSub: "Login required to view personal analytics",
      analyzeBtn: "Analyze Now",
      notLoggedIn: "Not signed in",
      loadingLabel: "AI is analyzing your data…",
      needMoreData: "Need more data",
      needMoreDataSub: "Play at least 3 Rank rounds so AI can analyze your progress.",
      back: "Go back",
      errorMsg: "Unable to connect. Please try again.",
      retry: "Retry",
      totalGames: "Total Games",
      avgScore: "Average Score",
      nameRecog: "Name Recognition",
      ageGuess: "Age Estimation",
      recent: "Recent",
      summaryLabel: "Overall Summary",
      strengths: "Strengths",
      weaknesses: "Areas to Improve",
      regionDist: "Region Distribution",
      eraDist: "Historical Eras",
      suggestions: "Personalised Suggestions",
      reanalyze: "Re-analyze",
    },

    // Wrong Locations
    wrongLocations: {
      badge: "WRONG MANY TIMES",
      title: "Locations You Struggle With",
      subtitle: "Locations you've answered wrong multiple times. Click the AI button to get specific practice tips.",
      loadLabel: "View struggle locations",
      loadSub: "Based on play history — score < 5",
      loginLabel: "Sign in to view",
      loginSub: "Login required to see personal results",
      loadBtn: "View Now",
      notLoggedIn: "Not signed in",
      empty: "No struggle locations!",
      emptySub: "You haven't scored below 5 yet. Keep playing to track your progress.",
      errorMsg: "Failed to load data. Please try again.",
      retry: "Retry",
      back: "Go back",
      refresh: "Refresh",
      wrongCount: (n) => `✗ ${n}x wrong`,
      aiBtn: "How to practice?",
      aiLoading: "AI is analyzing…",
      nameLabel: "Name",
      yearLabel: "Year",
    },

    // VR Mode
    vrMode: {
      calibTitle: "VR Calibration",
      calibSubtitle: "Adjust to match your cardboard headset",
      eyeWindowWidth: "Eye Window Width",
      eyeWindowAuto: "Auto-computed from screen size · manual override disabled",
      eyeWindowManual: "Manual · set phone screen width below to auto-compute",
      verticalOffset: "Vertical Offset",
      verticalOffsetHint: "Shifts the image down (+) or up (−) inside the headset",
      streetViewZoom: "Street View Zoom",
      streetViewZoomHint: "0 = 180° FOV (very wide)  ·  1 = standard  ·  3 = max telephoto",
      precision: "Precision — Cardboard optics",
      interLens: "Inter-lens Distance",
      interLensHint: "Google Cardboard v2 standard: 63.9 mm",
      phoneScreenWidth: "Phone Screen Width",
      phoneScreenHint: "Measure the horizontal screen width in landscape (long side). Set to 0 to use manual eye width.",
      computedEye: "Computed eye window:",
      saveApply: "Save & Apply",
      resetDefaults: "Reset to Defaults",
      rotateLandscape: "Rotate to landscape",
      vrRequiresH: "VR requires horizontal orientation",
      loadingPano: "Loading panorama…",
      unknown: "Unknown",
    },

    // Rank Play
    rankPlay: {
      chamber: (n) => `Ranked · Chamber ${n}`,
      heritage: (region) => `${region} Heritage`,
      preparingArchive: "Prepare the Ranked Archive",
      sessionProgress: "Session Progress",
      sealedTitle: "Ranked Archive Sealed",
      sealedDesc: (n) => `Daily ranked limit of ${n} sessions reached. Come back tomorrow — or upgrade to play without limits.`,
      upgradeTitle: "Upgrade to Plus",
      upgradeDesc: "Unlimited Ranked sessions, advanced study content, and exclusive badges — from just 65,000₫/month.",
      viewSubscription: "View Subscription",
      backHome: "Back to Home",
      maintenanceTitle: "Under Maintenance",
      maintenanceDesc: "The Ranked Archive is temporarily closed for maintenance. Please check back later.",
      noImagery: "No Imagery Available",
      useClues: "Use the clues to make your best guess",
      enterHeritage: "Enter Heritage Identity",
      heritagePlaceholder: "Location, Dynasty, or Era...",
      yearsOldLabel: "Years Old (Est.)",
      yearPlaceholder: "e.g. 1802",
      guess: "GUESS",
      timesUp: "TIME'S UP",
      submitting: "Submitting your answer…",
      continue: "Continue",
      ptsEarned: "PTS EARNED",
      similarity: (n) => `Similarity: ${n}%`,
      timeline: (n) => `Timeline: ±${n} Years`,
      overallRating: "Overall Rating",
      yourRating: "Your Rating",
      rateThis: "Rate This",
      votes: (n) => `${n} vote${n !== 1 ? "s" : ""}`,
      sessionComplete: "Ranked Session Complete",
      allCatalogued: "All heritage sites have been catalogued.",
      viewRank: "View Rank",
      sanctuary: "Sanctuary",
      noRatings: "No ratings",
      yrsOld: "yrs old",
      playsLeft: (n) => `${n} left`,
      scoreName: "Name",
      scoreAge: "Age",
      navExplore: "Explore",
      navLeaderboard: "Leaderboard",
      navStudy: "Study",
      navChallenge: "Challenge",
      feedbacks: {
        perfect: "Perfect Curation",
        exceptional: "Exceptional Record",
        onTrack: "On the Right Track",
        partial: "Partial Archive",
        lost: "Record Lost",
      },
      howToPlay: "How to Play",
      howToPlayTitle: "How to Play Ranked",
      howToPlaySteps: [
        "Look around the Street View and gather visual clues — architecture, signs, surroundings.",
        "In the input box, type the heritage site's name. Even a partial answer counts: the city, the temple type, or the figure it honours all earn partial points.",
        "Estimate how old the site is (in years) — the closer to the real age, the higher your Age score.",
        "Score 7 or more out of 10 to rank up; score under 3 and you'll lose progress. Chat with The Archivist for live hints.",
      ],
      gotIt: "Got It",
      hintMessage:
        "Tip: even partial answers earn points! Naming the city, the temple type, or the historical figure the site honours all give partial credit. The more specific your guess, the more points you score.",
      ratingTitle: "Analysing",
      ratingSubtitle: "Grading how close your answer is to the real site.",
      rankUp: (name) => `Rank Up → ${name}`,
      rankDown: (name) => `Rank Down → ${name}`,
    },

    // Lesson Detail
    lessonDetail: {
      notFound: "Lesson not found.",
      back: "Back",
      backLabel: "BACK",
      categoryLabel: "CATEGORY",
      locationLabel: "LOCATION",
      eraLabel: "ERA",
      yearLabel: "YEAR",
      copied: "COPIED!",
      copyLink: "COPY LINK",
      prevLesson: "PREV",
      nextLesson: "NEXT",
      sources: "REFERENCES",
      readTimeLeft: (m, s) => `Please read ${m}:${s} more to complete`,
      markRead: "Mark as Read · +5 pts",
      completed: "Completed (+5 pts)",
    },

    // Study Page
    studyPage: {
      catAll: "ALL",
      catNatural: "NATURAL",
      catHistorical: "HISTORICAL",
      catScenic: "SCENIC",
      searchPlaceholder: "Search articles, landmarks...",
      noResults: "No matching lessons found.",
      readBadge: "READ",
      viewBtn: "VIEW >",
      newest: "NEWEST",
      readNow: "READ NOW",
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
      members: "Thành Viên",
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
      subscription: "Đăng ký / Gói dịch vụ",
      rankNow: "Chơi Rank Ngay",
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
      chronicles: "Biên Niên Sử",
      yourRank: "Hạng Của Bạn",
      rankNow: "Xếp Hạng Ngay",
      loading: "Đang tải dữ liệu xếp hạng...",
      maintenance: "Đang Bảo Trì",
      maintenanceDesc: "Khu vực Xếp Hạng tạm thời đóng cửa để bảo trì. Vui lòng quay lại sau.",
      backHome: "Về Trang Chủ",
      starsOf: (s) => `${s} / 5 sao`,
      rankLabel: (rank, name) => `HẠNG ${rank} — ${name}`,
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
      showMore: (n) => `Xem thêm ${n}`,
      showLess: "Thu gọn",
      scrollToBottom: "Xuống cuối danh sách",
      scrollToTop: "Lên đầu trang",
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

    // Progress Analysis
    progressAnalysis: {
      badge: "AI INSIGHTS",
      title: "Phân Tích Tiến Trình",
      subtitle: "AI sẽ phân tích lịch sử chơi của bạn và đưa ra gợi ý cá nhân hoá — vùng miền cần tập trung, giai đoạn lịch sử còn thiếu, và kỹ năng cần cải thiện.",
      readyLabel: "Sẵn sàng phân tích",
      readySub: "Dựa trên toàn bộ lịch sử chơi của bạn",
      loginLabel: "Đăng nhập để phân tích",
      loginSub: "Cần đăng nhập để xem phân tích cá nhân",
      analyzeBtn: "Phân Tích Ngay",
      notLoggedIn: "Chưa đăng nhập",
      loadingLabel: "AI đang phân tích dữ liệu của bạn…",
      needMoreData: "Cần thêm dữ liệu",
      needMoreDataSub: "Hãy chơi thêm ít nhất 3 ván trong chế độ Rank để AI có thể phân tích tiến trình của bạn.",
      back: "Quay lại",
      errorMsg: "Không thể kết nối. Vui lòng thử lại sau.",
      retry: "Thử lại",
      totalGames: "Tổng ván đã chơi",
      avgScore: "Điểm trung bình",
      nameRecog: "Nhận diện tên",
      ageGuess: "Đoán niên đại",
      recent: "Gần đây",
      summaryLabel: "Nhận xét tổng quan",
      strengths: "Điểm mạnh",
      weaknesses: "Điểm cần cải thiện",
      regionDist: "Phân bố vùng miền",
      eraDist: "Giai đoạn lịch sử",
      suggestions: "Gợi ý cá nhân hoá",
      reanalyze: "Phân tích lại",
    },

    // Wrong Locations
    wrongLocations: {
      badge: "SÁI NHIỀU LẦN",
      title: "Địa Danh Hay Mắc Lỗi",
      subtitle: "Những địa danh bạn đã trả lời sai nhiều lần. Bấm nút AI để nhận gợi ý luyện tập cụ thể.",
      loadLabel: "Xem địa danh hay sai",
      loadSub: "Dựa trên lịch sử chơi — điểm < 5",
      loginLabel: "Đăng nhập để xem",
      loginSub: "Cần đăng nhập để xem kết quả cá nhân",
      loadBtn: "Xem Ngay",
      notLoggedIn: "Chưa đăng nhập",
      empty: "Không có địa danh hay sai!",
      emptySub: "Bạn chưa có lần nào đạt dưới 5 điểm. Hãy thử chơi thêm để theo dõi tiến trình.",
      errorMsg: "Không thể tải dữ liệu. Vui lòng thử lại.",
      retry: "Thử lại",
      back: "Quay lại",
      refresh: "Làm mới",
      wrongCount: (n) => `✗ ${n}x sai`,
      aiBtn: "Luyện tập thế nào?",
      aiLoading: "AI đang phân tích...",
      nameLabel: "Tên",
      yearLabel: "Năm",
    },

    // VR Mode
    vrMode: {
      calibTitle: "Hiệu Chỉnh VR",
      calibSubtitle: "Điều chỉnh để phù hợp với kính cardboard của bạn",
      eyeWindowWidth: "Chiều Rộng Cửa Sổ Mắt",
      eyeWindowAuto: "Tự động tính từ kích thước màn hình · không thể chỉnh thủ công",
      eyeWindowManual: "Thủ công · nhập chiều rộng màn hình bên dưới để tự tính",
      verticalOffset: "Độ Lệch Dọc",
      verticalOffsetHint: "Dịch chuyển hình ảnh xuống (+) hoặc lên (−) bên trong kính",
      streetViewZoom: "Thu Phóng Street View",
      streetViewZoomHint: "0 = 180° FOV (rất rộng)  ·  1 = chuẩn  ·  3 = tele tối đa",
      precision: "Độ Chính Xác — Quang Học Cardboard",
      interLens: "Khoảng Cách Giữa Hai Thấu Kính",
      interLensHint: "Tiêu chuẩn Google Cardboard v2: 63,9 mm",
      phoneScreenWidth: "Chiều Rộng Màn Hình Điện Thoại",
      phoneScreenHint: "Đo chiều rộng màn hình theo chiều ngang (cạnh dài). Đặt 0 để dùng chiều rộng mắt thủ công.",
      computedEye: "Cửa sổ mắt đã tính:",
      saveApply: "Lưu & Áp Dụng",
      resetDefaults: "Đặt Lại Mặc Định",
      rotateLandscape: "Xoay ngang màn hình",
      vrRequiresH: "VR yêu cầu hướng nằm ngang",
      loadingPano: "Đang tải panorama…",
      unknown: "Không xác định",
    },

    // Rank Play
    rankPlay: {
      chamber: (n) => `Ranked · Phòng ${n}`,
      heritage: (region) => `Di Sản ${region}`,
      preparingArchive: "Chuẩn Bị Kho Rank",
      sessionProgress: "Tiến Trình Phiên",
      sealedTitle: "Kho Rank Đã Đóng",
      sealedDesc: (n) => `Đã đạt giới hạn ${n} phiên rank hôm nay. Quay lại ngày mai — hoặc nâng cấp để chơi không giới hạn.`,
      upgradeTitle: "Nâng cấp gói Plus",
      upgradeDesc: "Ván Ranked không giới hạn, nội dung học nâng cao và huy hiệu độc quyền — chỉ từ 65.000₫/tháng.",
      viewSubscription: "Xem gói đăng ký",
      backHome: "Quay về trang chủ",
      maintenanceTitle: "Đang Bảo Trì",
      maintenanceDesc: "Kho Rank tạm thời đóng cửa để bảo trì. Vui lòng quay lại sau.",
      noImagery: "Không Có Hình Ảnh",
      useClues: "Dùng các gợi ý để đưa ra câu trả lời tốt nhất",
      enterHeritage: "Nhập Tên Di Sản",
      heritagePlaceholder: "Địa điểm, Triều đại, hoặc Thời kỳ...",
      yearsOldLabel: "Tuổi Ước Tính (Năm)",
      yearPlaceholder: "vd. 1802",
      guess: "ĐỐN",
      timesUp: "HẾT GIỜ",
      submitting: "Đang gửi câu trả lời…",
      continue: "Tiếp Tục",
      ptsEarned: "ĐIỂM KIẾM ĐƯỢC",
      similarity: (n) => `Độ tương đồng: ${n}%`,
      timeline: (n) => `Sai lệch: ±${n} Năm`,
      overallRating: "Đánh Giá Chung",
      yourRating: "Đánh Giá Của Bạn",
      rateThis: "Đánh Giá",
      votes: (n) => `${n} phiếu`,
      sessionComplete: "Phiên Rank Hoàn Thành",
      allCatalogued: "Tất cả địa danh đã được ghi chép.",
      viewRank: "Xem Rank",
      sanctuary: "Thánh Địa",
      noRatings: "Chưa có đánh giá",
      yrsOld: "tuổi",
      playsLeft: (n) => `Còn ${n} lượt`,
      scoreName: "Tên",
      scoreAge: "Tuổi",
      navExplore: "Khám Phá",
      navLeaderboard: "Xếp Hạng",
      navStudy: "Học Viện",
      navChallenge: "Thử Thách",
      feedbacks: {
        perfect: "Hoàn Hảo",
        exceptional: "Xuất Sắc",
        onTrack: "Đúng Hướng",
        partial: "Nửa Vời",
        lost: "Thất Bại",
      },
      howToPlay: "Cách Chơi",
      howToPlayTitle: "Hướng Dẫn Chơi Xếp Hạng",
      howToPlaySteps: [
        "Quan sát Street View và thu thập manh mối — kiến trúc, biển hiệu, cảnh vật xung quanh.",
        "Nhập tên di sản vào ô. Đáp án chỉ một phần vẫn được điểm: tên thành phố, loại đền chùa, hay nhân vật được thờ đều được tính điểm phần.",
        "Ước tính tuổi của di tích (năm) — càng sát thực tế, điểm Tuổi càng cao.",
        "Đạt 7 điểm trở lên trên thang 10 để lên rank; dưới 3 sẽ tụt rank. Trò chuyện với The Archivist để xin gợi ý.",
      ],
      gotIt: "Đã Hiểu",
      hintMessage:
        "Mẹo: trả lời gần đúng vẫn có điểm! Nêu được thành phố, loại đền chùa, hay nhân vật mà di tích tôn vinh đều được điểm phần. Câu trả lời càng cụ thể, điểm càng cao.",
      ratingTitle: "Đang Phân Tích",
      ratingSubtitle: "Đang chấm xem câu trả lời của bạn sát di tích thật đến mức nào.",
      rankUp: (name) => `Lên Rank → ${name}`,
      rankDown: (name) => `Tụt Rank → ${name}`,
    },

    // Lesson Detail
    lessonDetail: {
      notFound: "Bài học không tồn tại.",
      back: "Quay lại",
      backLabel: "QUAY LẠI",
      categoryLabel: "CHUYÊN MỤC",
      locationLabel: "VỊ TRÍ",
      eraLabel: "GIAI ĐOẠN",
      yearLabel: "NĂM",
      copied: "ĐÃ SAO CHÉP!",
      copyLink: "SAO CHÉP LINK",
      prevLesson: "BÀI TRƯỚC",
      nextLesson: "BÀI TIẾP",
      sources: "NGUỒN THAM KHẢO",
      readTimeLeft: (m, s) => `Vui lòng đọc thêm ${m}:${s} để hoàn thành`,
      markRead: "Đánh dấu đã đọc · +5 pts",
      completed: "Đã hoàn thành (+5 pts)",
    },

    // Study Page
    studyPage: {
      catAll: "TẤT CẢ",
      catNatural: "THIÊN NHIÊN",
      catHistorical: "LỊCH SỬ",
      catScenic: "DANH THẮNG",
      searchPlaceholder: "Nhập tên bài viết, địa danh...",
      noResults: "Không tìm thấy bài học phù hợp.",
      readBadge: "Đã đọc",
      viewBtn: "XEM >",
      newest: "MỚI NHẤT",
      readNow: "ĐỌC NGAY",
    },

    // Loading
    loading: "Đang tải…",
  },

  cn: {
    // Nav
    nav: {
      home: "主页",
      about: "关于",
      rank: "排名赛",
      explore: "地图集",
      leaderboard: "全球排名",
      study: "学院",
      atlas: "地图集",
      tutorial: "教程",
      contribute: "贡献",
      shop: "商店",
      vrDiscovery: "VR探索",
      challenge: "挑战",
      members: "成员",
      logout: "退出登录",
      signIn: "登录",
      settings: "设置",
    },

    // Sidebar
    sidebar: {
      sanctuary: "圣地",
      about: "关于",
      PlayRank: "排名赛",
      globalRanks: "全球排名",
      atlas: "地图集",
      academy: "学院",
      tutorial: "教程",
      contribute: "贡献",
      shop: "商店",
      vrDiscovery: "VR探索",
      feedback: "反馈",
      feedbackPlaceholder: "分享您的想法、报告错误或建议功能……（最多100字）",
      feedbackSend: "发送反馈",
      feedbackSending: "发送中……",
      feedbackSent: "已发送！谢谢。",
      feedbackContact: "如需更快回复，请通过以下方式联系我们",
      feedbackOr: "或",
      settings: "设置",
      subscription: "订阅 / 套餐",
      rankNow: "立即排名",
      imperialScholar: "帝王学者",
      rankLabel: (rankName) => `段位 · ${rankName} 学者`,
    },

    // Hero
    hero: {
      badge: "VR体验已启用",
      headline1: "探索",
      headline2: "隐秘的",
      headline3: "越南。",
      body: "踏入神秘的遗产档案馆。穿越数千年历史，考验您的文化直觉——从下龙湾的迷雾到顺化的帝都城门。",
      startGuessing: "开始猜测",
      viewMap: "查看地图",
      tutorial: "学习玩法",
    },

    // Bento
    bento: {
      liveNow: "正在直播",
      archivistsExploring: "档案员正在探索",
      todaysQuest: "今日任务",
      endsIn: "结束于",
      questTitle: "美山圣地",
      questDesc: "识别古印度教神庙群中隐藏的图案。",
      xpReward: "+500 XP 奖励",
      imperialScholars: "帝王学者",
      fullRankings: "完整排名",
    },

    // Atlas section
    atlas: {
      eyebrow: "身份地图集",
      headline1: "每个坐标都讲述",
      headline2: "一个",
      headline3: "千年",
      headline4: "故事。",
      features: [
        {
          title: "经核实的口述历史",
          desc: "来自国家档案馆的AI策划元数据确保每个地点历史准确、具有文化意义。",
        },
        {
          title: "超本地探索",
          desc: "发现大型地图忽略的隐秘小巷和古老神祠。以人性化的尺度体验越南。",
        },
        {
          title: "互动遗产节点",
          desc: "点击揭示东山图案、传统音乐录音和本地文物的3D扫描。",
        },
      ],
    },

    // CTA
    cta: {
      headline: "成为文化守护者。",
      body: "与数千名探索者一起，通过科技镜头保护越南遗产。档案馆等待着您。",
      createProfile: "创建档案",
      questLogin: "每日任务登录",
    },

    // Contact section
    contact: {
      eyebrow: "联系档案馆",
      headline: "我们很乐意",
      headlineAccent: "倾听您的声音。",
      body: "有问题、错误报告，或只是想聊聊遗产？打开一条线——我们在倾听。",
      channels: [
        {
          icon: "mail",
          label: "邮件",
          value: "heritageguesser@gmail.com",
          href: "mailto:heritageguesser@gmail.com",
          cta: "发送消息",
        },
        {
          icon: "youtube",
          label: "YouTube",
          value: "youtube.com/@HeritageGuessr",
          href: "https://www.youtube.com/@HeritageGuessr",
          cta: "观看视频",
        },
        {
          icon: "facebook",
          label: "Facebook",
          value: "facebook.com/HeritageGuessr",
          href: "https://www.facebook.com/profile.php?id=61568386015819",
          cta: "关注我们",
        },
        {
          icon: "github",
          label: "GitHub",
          value: "github.com/dev-HieuLe/HeritageGuessr",
          href: "https://github.com/dev-HieuLe/HeritageGuesser/blob/main/README.md",
          cta: "查看源码",
        },
      ],
    },

    // Footer
    footer: {
      copyright: "© 2026 Heritage Guessr。保留所有权利。",
      links: [
        { label: "编年史", to: "/rank" },
        { label: "全球排名", to: "/leaderboard" },
        { label: "地图集", to: "/explore" },
        { label: "学院", to: "/study" },
      ],
    },

    // Login
    login: {
      subtitle: "进入档案馆",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      rememberMe: "记住我",
      forgotPassword: "忘记密码？",
      submit: "进入档案馆",
      orDivider: "或继续使用",
      googleSignIn: "使用Google继续",
      divider: "还没有账号？",
      createAccount: "创建策展人账号",
      backHome: "返回主页",
      emailRequired: "邮箱为必填项",
      passwordRequired: "密码为必填项",
      invalidCredentials: "邮箱或密码无效",
      somethingWrong: "出了点问题，请重试。",
    },

    // Register
    register: {
      subtitle: "加入档案馆",
      fields: {
        name: { label: "策展人名称", placeholder: "您的档案别名" },
        email: { label: "邮箱", placeholder: "curator@archive.vn" },
        password: { label: "密码", placeholder: "••••••••" },
        confirmPassword: { label: "确认密码", placeholder: "••••••••" },
      },
      submit: "注册为策展人",
      orDivider: "或使用以下方式注册",
      googleSignUp: "使用Google继续",
      divider: "已有账号？",
      loginLink: "进入档案馆",
      backHome: "返回主页",
      errors: {
        nameRequired: "名称为必填项",
        nameTooShort: "名称至少需要2个字符",
        nameTooLong: "名称不能超过50个字符",
        emailRequired: "邮箱为必填项",
        emailInvalid: "邮箱地址无效",
        passwordRequired: "密码为必填项",
        passwordTooShort: "密码至少需要8个字符",
        confirmRequired: "请确认您的密码",
        confirmMismatch: "密码不匹配",
        nameInvalidChars: "名称至少需要包含一个字母或数字",
        emailInUse: "该邮箱已注册，请尝试登录。",
        usernameTaken: "该用户名已被占用，请选择其他用户名。",
        registrationError: "注册错误，请重试。",
        invalidData: "注册数据无效，请检查您的输入。",
        passwordTooLong: "密码不能超过128个字符",
        somethingWrong: "出了点问题，请重试。",
        serverError: "服务器错误，请稍后重试。",
      },
    },

    // Ranking
    ranking: {
      progressToNextRank: "晋级进度",
      rankTier: "段位",
      level: "等级",
      stars: "星数",
      rankLadder: "段位阶梯",
      chronicles: "编年史",
      yourRank: "我的段位",
      rankNow: "开始排名",
      loading: "正在加载排名数据...",
      maintenance: "维护中",
      maintenanceDesc: "排名档案馆正在临时维护中，请稍后再试。",
      backHome: "返回主页",
      starsOf: (s) => `${s} / 5 星`,
      rankLabel: (rank, name) => `段位 ${rank} — ${name}`,
      rankNames: [
        "铁",
        "铜",
        "银",
        "金",
        "铂金",
        "翡翠",
        "钻石",
        "大师",
        "宗师",
        "挑战者",
      ],
    },

    // Leaderboard
    leaderboard: {
      rank: "排名",
      curator: "策展人",
      level: "等级",
      tier: "段位",
      curatorsInArchive: (count) => `档案馆中共 ${count} 位策展人`,
      showMore: (n) => `再显示 ${n} 位`,
      showLess: "收起",
      scrollToBottom: "跳到底部",
      scrollToTop: "回到顶部",
    },

    // Contribute
    contribute: {
      legacyHeading: ["遗产", "保护"],
      heroDesc:
        "您的贡献编织着我们集体记忆的织物。使用圣所登记新发现，完善档案馆的智慧。",
      registerNewHeritage: "登记新遗产",
      totalSubmitted: "总提交数",
      approved: "已通过",
      pending: "待审核",
      declined: "已拒绝",
      yourContributions: "您的贡献",
      noContributions: "暂无贡献，成为第一个登记遗产地的人吧！",
      submitFirstSite: "提交您的第一个地点",
      theArtOfArchiving: "档案艺术",
      cards: [
        {
          icon: "location_on",
          title: "空间精确度",
          desc: "打开Google地图，导航至确切的遗产位置，然后从浏览器地址栏复制完整URL。",
        },
        {
          icon: "auto_awesome",
          title: "AI驱动元数据",
          desc: "我们的AI从您的URL中提取坐标，并自动生成文化描述、年代和难度评级。",
        },
        {
          icon: "description",
          title: "语义细节",
          desc: "添加可选描述，为AI提供上下文，提高生成档案条目的质量。",
        },
        {
          icon: "pending_actions",
          title: "审核流程",
          desc: "每份提交都由我们的策展人审核。被接受的地点将被添加到Heritage Guessr游戏世界中。",
        },
      ],
      howToGetUrl: "如何获取有效的Google地图URL",
      steps: [
        "前往google.com/maps，按名称搜索遗产地点。",
        "点击位置标记打开其详情面板。",
        "将黄色小人拖到地图上切换到街景模式。",
        '从浏览器复制完整URL——它应包含"@lat,lng"坐标。',
        '将URL粘贴到"Google街景URL"字段并提交。',
      ],
    },

    // FAQ
    faq: [
      {
        q: "什么是Heritage Guessr？",
        a: "Heritage Guessr是一款越南遗产知识游戏。每轮将您置入真实遗产地的街景全景中——您的任务是识别其名称并估算其年代。没有地图标记，这是对文化知识的考验，而非地理知识。",
      },
      {
        q: "每轮游戏如何进行？",
        a: "您将被带入真实越南遗产地的360°街景中。研究建筑、雕刻和周边环境，然后输入地点名称和您对其年龄的最佳估算。在120秒计时器结束前点击确认。",
      },
      {
        q: "我的分数如何计算？",
        a: "每轮满分10分：名称最多5分（相似度匹配——部分匹配仍得分），年代最多5分（误差10年内=满分，误差80年内=1分）。总分8分及以上为胜，4分及以下为负。",
      },
      {
        q: "排名系统如何运作？",
        a: "共有10个段位，从铁到挑战者。赢得足够多的轮次填满5星进度条即可晋级。输掉足够多则会降级。您的段位和进度将与所有其他玩家一起显示在全球排行榜上。",
      },
      {
        q: "如何赚取积分？",
        a: "完成任意排名赛可获得+5积分，当日首局可获得+10积分（每日签到），阅读学习文章可获得+5积分，提交遗产贡献可获得+10积分。积分显示在您的个人资料和导航栏中。",
      },
      {
        q: "什么是档案员？",
        a: "档案员是每轮游戏中的AI助手。每轮最多可向其提问10次获取提示——它会引导您走向答案而不直接透露。从「这是哪个朝代建造的？」等宏观问题开始，再逐步缩小范围。",
      },
      {
        q: "学习（学院）部分是什么？",
        a: "学习部分包含关于真实越南遗产地的深度文章——包括其历史、建筑和文化意义。阅读这些文章有助于提升您在游戏中识别地点的能力。每篇完成的文章可获得+5积分。",
      },
      {
        q: "我可以贡献新的遗产地点吗？",
        a: "可以。在贡献页面，粘贴Google地图街景URL并填写地点名称。我们的系统将使用AI自动生成地区、年代和描述。被批准的提交将进入游戏地点库，并为您赚取+10积分。",
      },
    ],

    // Shop
    shop: {
      eyebrow: "遗产档案馆商店",
      title: "礼品店",
      subtitle: "用您辛苦赚取的积分兑换独家遗产奖励。",
      points: "积分",
      redeem: "兑换",
      notEnough: "积分不足",
      items: {
        keyboard: "机械键盘",
        keyboardDesc: "高级全尺寸机械键盘——档案员的首选武器。",
        mouse: "游戏鼠标",
        mouseDesc: "高精度游戏鼠标，专为专注的学者打造。",
        tshirt: "遗产T恤（经典款）",
        tshirtDesc: "印有Heritage Guessr徽章的优质棉质T恤。",
        tshirt2: "遗产T恤（替代款）",
        tshirt2Desc: "官方Heritage Guessr T恤的替代配色版本。",
        starbucks: "星巴克礼品卡",
        starbucksDesc: "星巴克礼品卡，为您下次遗产探索补充能量。",
        keychain: "遗产钥匙扣",
        keychainDesc: "手工制作的钥匙扣——您档案奉献精神的小小纪念。",
      },
      modal: {
        notEnoughTitle: "积分不足",
        notEnoughBody: "此物品需要 {need} 积分。您有 {have} 积分。还需 {diff} 积分才能兑换此奖励。",
        confirmTitle: "如何兑换",
        contactIntro: "通过以下任意渠道联系我们，用积分换取此物品。",
        phone: "电话",
        note: "截图此页面，联系时一并发送您的游戏内用户名。",
        close: "关闭",
      },
    },

    // About Us page
    aboutUs: {
      badge: "Heritage Guessr",
      heroLine1: "为",
      heroLine2: "保护而生。",
      heroLine3: "为",
      heroLine4: "启迪而设计。",
      heroDesc:
        "Heritage Guessr将您带入越南遗产地真实的Google街景全景中。与AI导游Savannah一起探索，猜测地点名称和年代，攀登全球排行榜——同时了解越南的文化瑰宝。",
      pills: {
        streetView: "街景",
        aiGuide: "AI导游",
        nlpScoring: "NLP评分",
        studyMode: "学习模式",
        xpShop: "XP商店",
        vrDiscovery: "VR探索",
      },

      statsLabels: ["学生受众", "遗产地点", "AI模型", "试点学校"],

      missionLabel: "我们的使命",
      missionVi: "Lan tỏa, kết nối và gìn giữ.",
      missionEn: "传播、连接与保护。",
      whyBuilt: "我们为何构建这个",
      missionHeadline1: "越南拥有超过",
      missionHeadline2: "40,000个遗产地点。",
      missionHeadline3: "大多数默默无闻。",
      missionBody1:
        "Heritage Guessr在河内Delta Global School构思，作为一项以技术驱动的举措，使越南文化遗产变得易于获取、引人入胜且令人难忘——从学生开始，向外扩展。",
      missionBody2:
        "我们将Google街景、生成式AI和多语言NLP相结合，将被动浏览转化为主动学习——同时追踪您与全球玩家的对比进度。",
      badgeDGS: "DGS 河内",
      badge600: "600+ 学生",
      badgeUNESCO: "UNESCO遗产地",
      badgeAI: "AI驱动",

      underTheHood: "技术引擎",
      techHeadline1: "由八项",
      techHeadline2: "技术驱动",
      techDesc: "从实时3D街景到多语言神经网络——每一层都为体验而选择。",
      techDescs: [
        "具有HMR的超快前端",
        "沉浸式360°遗产探索",
        "AI导游与地点个性化",
        "自然双语语音合成",
        "多语言答案评分",
        "3D动画AI伴侣Savannah",
        "Express 5 REST API + 关系数据库",
        "流畅动画，实用优先UI",
      ],

      ourJourney: "我们的旅程",
      howItStarted: "一切是如何",
      howItStartedAccent: "开始的",
      journeyDesc:
        "从课堂创意到服务数百名学生的全栈平台——这是Heritage Guessr的故事。",
      quote:
        '"我们问——如果重新发现越南的过去能像玩游戏一样感觉如何？这个问题成就了Heritage Guessr。"',
      quoteRole: "创新领导者",
      timeline: [
        {
          year: "2025年初 · 起源",
          title: "诞生于B410室",
          desc: "这个想法在DGS作为毕业设计项目成形——将教育与AI融合，以保护越南文化身份。早期构想了一款整合VR互动探索国家遗产的游戏。",
        },
        {
          year: "2025年夏 · 第一章",
          title: "Beta 0.1成型",
          desc: "第一个测试版构建完成，为AI和NLP集成平台奠定基础。初始测试覆盖课内小组10-20名玩家，并获得历史和地理老师的早期反馈。",
        },
        {
          year: "2025年底 · 试点发布",
          title: "学校与真实反馈",
          desc: "功能升级后，项目在DGS Adventure（The Dewey School）和梁文灿高中进行了试点。超过300名学生和10名教师参与，提供了宝贵的评价和反馈。",
        },
        {
          year: "2026年3月 · Beta 1.0",
          title: "重大升级",
          desc: "平台在UI、AI协议、功能系统和数据处理流程方面进行了重大改进——基于真实教师反馈和课堂需求——准备向更广泛的社区推广。",
        },
        {
          year: "现在 · 开放平台",
          title: "社区贡献",
          desc: "Heritage Guessr正在完善其打包，以触达用户。我们通过不仅向创始人、也向社区本身开放贡献来加速这一运动。",
        },
        {
          year: "未来 · 无限可能",
          title: "天空是极限",
          desc: "Heritage Guessr致力于继续扩展技术基础设施，以满足玩家不断增长的需求，并保护越南更多丰富的文化遗产。",
        },
      ],

      meetAIGuide: "认识您的AI导游",
      savannahTitle1: "Savannah——您的",
      savannahTitle2: "遗产专家",
      savannahDesc:
        "由DeepInfra的Gemma 4 26B驱动，Savannah提供情境提示而不透露答案。她用自然语言交流，通过Gemini TTS（Despina声音）朗读回复，并以3D VRM虚拟形象呈现，您可以实时看到她眨眼和动画效果。",
      online: "在线",
      pillGemma: "Gemma 4 · 26B 聊天",
      pillTTS: "Gemini TTS",
      pill3D: "3D VRM 虚拟形象",
      pillLang: "中文 + 英文",

      hieuQuote1: "我用一个目标写下每一",
      hieuQuoteAccent: "行代码",
      hieuQuote2: "：让越南遗产",
      hieuQuoteAccent2: "永远无法被遗忘。",
      hieuRole: "首席开发者 · 设计师 · 作者",

      craftedBy: "由以下人员打造",
      foundingTeam: "创始团队",
      teamDesc: "河内Delta Global School的三名学生——共同承担同一使命。",
      memberRoles: ["创新领导者", "首席开发者 · 设计师 · 作者", "创意内容专家"],
      dgsTitle: "Delta Global School",
      dgsLocation: "河内，越南",
      dgsDesc:
        "Heritage Guessr在DGS构思和构建，作为通过技术保护和推广越南文化遗产倡议的一部分。",
      theTeamLabel: "团队",
      meetFounders: "认识创始人",
      meetFoundersDesc: "在我们的主页上查看Heritage Guessr背后的完整团队。",
      viewFounders: "查看创始人",

      openSource: "开源 · 教育",
      bottomTitle: "为越南文化遗产用 ❤️ 构建",
      copyright:
        "版权所有 © 2025 Lê Trung Hiếu 和 Heritage Guessr 团队。保留所有权利。",
      followUs: "关注我们",
      contributeASite: "贡献地点",
    },

    // Founders section
    founders: {
      eyebrow: "平台背后的人",
      headline: "我们的",
      headlineAccent: "创始人",
      subtitle: "一支专注的团队，一个地标接一个地标地保护和颂扬越南的灵魂。",
      founderBadge: "创始人",
      viewProfile: "查看资料 →",
      connect: "联系",
      members: [
        {
          name: "Đặng Thái Hoà",
          role: "创新领导者",
          bio: "塑造Heritage Guessr的战略愿景，运用设计思维和创意指导打造有意义的体验，重新定义越南遗产的在线探索方式。",
        },
        {
          name: "Lê Trung Hiếu",
          role: "全栈工程主管兼设计师",
          bio: "领导Heritage Guessr的端到端开发，从全栈工程和后端架构到精致的前端设计，打造将越南遗产转化为沉浸式数字体验的强大可扩展平台。",
        },
        {
          name: "Nguyễn Thái Sơn",
          role: "创意内容专家",
          bio: "将文化灵魂注入平台的每个角落——打造让越南遗产令人难忘的故事、图像和体验。",
        },
      ],
    },

    // Progress Analysis
    progressAnalysis: {
      badge: "AI洞察",
      title: "进度分析",
      subtitle: "AI将分析您的游戏历史，提供个性化见解——需要关注的地区、缺失的历史时期以及需要提升的技能。",
      readyLabel: "准备分析",
      readySub: "基于您的完整游戏历史",
      loginLabel: "登录以分析",
      loginSub: "需要登录才能查看个人分析",
      analyzeBtn: "立即分析",
      notLoggedIn: "未登录",
      loadingLabel: "AI正在分析您的数据……",
      needMoreData: "需要更多数据",
      needMoreDataSub: "请至少进行3场排名赛，以便AI分析您的进度。",
      back: "返回",
      errorMsg: "无法连接，请重试。",
      retry: "重试",
      totalGames: "总局数",
      avgScore: "平均分",
      nameRecog: "名称识别",
      ageGuess: "年代估算",
      recent: "最近",
      summaryLabel: "总体摘要",
      strengths: "优势",
      weaknesses: "待改进项",
      regionDist: "地区分布",
      eraDist: "历史时期",
      suggestions: "个性化建议",
      reanalyze: "重新分析",
    },

    // Wrong Locations
    wrongLocations: {
      badge: "多次错误",
      title: "您常答错的地点",
      subtitle: "您多次答错的地点。点击AI按钮获取具体练习建议。",
      loadLabel: "查看常错地点",
      loadSub: "基于游戏历史——分数 < 5",
      loginLabel: "登录后查看",
      loginSub: "需要登录才能查看个人结果",
      loadBtn: "立即查看",
      notLoggedIn: "未登录",
      empty: "没有常错地点！",
      emptySub: "您还没有得过5分以下。继续游戏以追踪您的进度。",
      errorMsg: "加载数据失败，请重试。",
      retry: "重试",
      back: "返回",
      refresh: "刷新",
      wrongCount: (n) => `✗ 错误 ${n} 次`,
      aiBtn: "如何练习？",
      aiLoading: "AI正在分析……",
      nameLabel: "名称",
      yearLabel: "年份",
    },

    // VR Mode
    vrMode: {
      calibTitle: "VR校准",
      calibSubtitle: "调整以匹配您的纸板头显",
      eyeWindowWidth: "眼窗宽度",
      eyeWindowAuto: "从屏幕尺寸自动计算 · 手动覆盖已禁用",
      eyeWindowManual: "手动 · 在下方设置手机屏幕宽度以自动计算",
      verticalOffset: "垂直偏移",
      verticalOffsetHint: "在头显内向下(+)或向上(-)移动图像",
      streetViewZoom: "街景缩放",
      streetViewZoomHint: "0 = 180° FOV（非常宽）·  1 = 标准  ·  3 = 最大长焦",
      precision: "精度 — 纸板光学",
      interLens: "镜间距离",
      interLensHint: "Google Cardboard v2标准：63.9 mm",
      phoneScreenWidth: "手机屏幕宽度",
      phoneScreenHint: "测量横屏时的水平屏幕宽度（长边）。设为0则使用手动眼窗宽度。",
      computedEye: "计算的眼窗：",
      saveApply: "保存并应用",
      resetDefaults: "重置为默认值",
      rotateLandscape: "旋转为横屏",
      vrRequiresH: "VR需要水平方向",
      loadingPano: "正在加载全景……",
      unknown: "未知",
    },

    // Rank Play
    rankPlay: {
      chamber: (n) => `排名赛 · 第${n}关`,
      heritage: (region) => `${region}遗产`,
      preparingArchive: "准备排名档案馆",
      sessionProgress: "场次进度",
      sealedTitle: "排名档案馆已封闭",
      sealedDesc: (n) => `今日排名限额${n}场已达到。明天再来——或升级以无限次游玩。`,
      upgradeTitle: "升级至Plus",
      upgradeDesc: "无限排名场次、高级学习内容和专属徽章——每月仅需65,000₫。",
      viewSubscription: "查看订阅",
      backHome: "返回主页",
      maintenanceTitle: "维护中",
      maintenanceDesc: "排名档案馆正在临时维护中，请稍后再试。",
      noImagery: "无可用图像",
      useClues: "利用线索做出最佳猜测",
      enterHeritage: "输入遗产标识",
      heritagePlaceholder: "地点、朝代或时代……",
      yearsOldLabel: "估计年龄（年）",
      yearPlaceholder: "例如 1802",
      guess: "猜测",
      timesUp: "时间到",
      submitting: "正在提交答案……",
      continue: "继续",
      ptsEarned: "获得积分",
      similarity: (n) => `相似度：${n}%`,
      timeline: (n) => `时间差：±${n}年`,
      overallRating: "综合评分",
      yourRating: "您的评分",
      rateThis: "评分",
      votes: (n) => `${n}票`,
      sessionComplete: "排名场次完成",
      allCatalogued: "所有遗产地点已编目完毕。",
      viewRank: "查看排名",
      sanctuary: "圣地",
      noRatings: "暂无评分",
      yrsOld: "年历史",
      playsLeft: (n) => `剩余${n}次`,
      scoreName: "名称",
      scoreAge: "年龄",
      navExplore: "探索",
      navLeaderboard: "排行榜",
      navStudy: "学院",
      navChallenge: "挑战",
      feedbacks: {
        perfect: "完美归档",
        exceptional: "卓越记录",
        onTrack: "方向正确",
        partial: "部分归档",
        lost: "记录丢失",
      },
      howToPlay: "玩法说明",
      howToPlayTitle: "排名赛玩法",
      howToPlaySteps: [
        "环顾街景，收集线索——建筑、标识和周围环境。",
        "在输入框中填写遗产名称。只答出一部分也算分：城市名、寺庙类型、或被供奉的人物都能获得部分分数。",
        "估算遗址的年代（年）——越接近真实年龄，年代分越高。",
        "10 分中得 7 分及以上即可升级；低于 3 分会掉级。可与档案管理员对话获取实时提示。",
      ],
      gotIt: "明白了",
      hintMessage:
        "提示：答出一部分也得分！写出城市、寺庙类型、或遗址纪念的人物都能获得部分分。答得越具体，得分越高。",
      ratingTitle: "正在分析",
      ratingSubtitle: "正在评估您的答案与真实遗址的接近程度。",
      rankUp: (name) => `升级 → ${name}`,
      rankDown: (name) => `降级 → ${name}`,
    },

    // Lesson Detail
    lessonDetail: {
      notFound: "课程不存在。",
      back: "返回",
      backLabel: "返回",
      categoryLabel: "类别",
      locationLabel: "位置",
      eraLabel: "时期",
      yearLabel: "年份",
      copied: "已复制！",
      copyLink: "复制链接",
      prevLesson: "上一课",
      nextLesson: "下一课",
      sources: "参考文献",
      readTimeLeft: (m, s) => `请再读${m}:${s}以完成`,
      markRead: "标记为已读 · +5积分",
      completed: "已完成（+5积分）",
    },

    // Study Page
    studyPage: {
      catAll: "全部",
      catNatural: "自然遗产",
      catHistorical: "历史遗址",
      catScenic: "风景名胜",
      searchPlaceholder: "搜索文章、地标……",
      noResults: "未找到匹配的课程。",
      readBadge: "已读",
      viewBtn: "查看 >",
      newest: "最新",
      readNow: "立即阅读",
    },

    // Loading
    loading: "加载中……",
  },

  fr: {
    // Nav
    nav: {
      home: "Accueil",
      about: "À Propos",
      rank: "Jouer Classé",
      explore: "Atlas",
      leaderboard: "Classement",
      study: "Académie",
      atlas: "Atlas",
      tutorial: "Tutoriel",
      contribute: "Contribuer",
      shop: "Boutique",
      vrDiscovery: "Découverte VR",
      challenge: "Défi",
      members: "Membres",
      logout: "Déconnexion",
      signIn: "Connexion",
      settings: "Paramètres",
    },

    // Sidebar
    sidebar: {
      sanctuary: "Sanctuaire",
      about: "À Propos",
      PlayRank: "Jouer Classé",
      globalRanks: "Classement Mondial",
      atlas: "Atlas",
      academy: "Académie",
      tutorial: "Tutoriel",
      contribute: "Contribuer",
      shop: "Boutique",
      vrDiscovery: "Découverte VR",
      feedback: "Retours",
      feedbackPlaceholder:
        "Partagez vos idées, signalez un bug ou suggérez une fonctionnalité… (100 mots max)",
      feedbackSend: "Envoyer",
      feedbackSending: "Envoi…",
      feedbackSent: "Envoyé ! Merci.",
      feedbackContact: "Pour une réponse plus rapide, contactez-nous via",
      feedbackOr: "ou",
      settings: "Paramètres",
      subscription: "Abonnement / Forfaits",
      rankNow: "Jouer Maintenant",
      imperialScholar: "Érudit Impérial",
      rankLabel: (rankName) => `Rang · ${rankName} Érudit`,
    },

    // Hero
    hero: {
      badge: "Expérience VR Activée",
      headline1: "Découvrez le",
      headline2: "Vietnam",
      headline3: "Caché.",
      body: "Entrez dans une archive éthérée du patrimoine. Testez votre intuition culturelle à travers des millénaires d'histoire, des brumes de Ha Long aux portes impériales de Hué.",
      startGuessing: "Commencer",
      viewMap: "Voir la Carte",
      tutorial: "Apprendre à Jouer",
    },

    // Bento
    bento: {
      liveNow: "En Direct",
      archivistsExploring: "Archivistes en exploration",
      todaysQuest: "Quête du Jour",
      endsIn: "Se termine dans",
      questTitle: "Le Sanctuaire de My Son",
      questDesc:
        "Identifiez les motifs cachés dans l'ancien complexe de temples hindous.",
      xpReward: "+500 XP de Récompense",
      imperialScholars: "Érudits Impériaux",
      fullRankings: "Classement Complet",
    },

    // Atlas
    atlas: {
      eyebrow: "L'Atlas de l'Identité",
      headline1: "Chaque coordonnée raconte",
      headline2: "une",
      headline3: "histoire",
      headline4: "millénaire.",
      features: [
        {
          title: "Histoires Orales Vérifiées",
          desc: "Les métadonnées issues des archives nationales garantissent que chaque lieu est historiquement précis et culturellement significatif.",
        },
        {
          title: "Exploration Hyper-Locale",
          desc: "Découvrez des ruelles cachées et des sanctuaires anciens que les grandes cartes oublient. Vivez le Vietnam à échelle humaine.",
        },
        {
          title: "Nœuds Patrimoniaux Interactifs",
          desc: "Cliquez pour révéler les motifs Dong Son, les enregistrements musicaux traditionnels et les scans 3D d'artéfacts locaux.",
        },
      ],
    },

    // CTA
    cta: {
      headline: "Devenez Gardien de la Culture.",
      body: "Rejoignez des milliers d'explorateurs qui préservent le patrimoine vietnamien grâce à la technologie. L'archive vous attend.",
      createProfile: "Créer un Profil",
      questLogin: "Connexion Quête Quotidienne",
    },

    // Contact
    contact: {
      eyebrow: "Rejoindre l'Archive",
      headline: "Nous serions ravis",
      headlineAccent: "de vous entendre.",
      body: "Une question, un rapport de bug, ou juste envie de parler patrimoine ? Ouvrez une ligne — nous écoutons.",
      channels: [
        {
          icon: "mail",
          label: "E-mail",
          value: "heritageguesser@gmail.com",
          href: "mailto:heritageguesser@gmail.com",
          cta: "Envoyer un message",
        },
        {
          icon: "youtube",
          label: "YouTube",
          value: "youtube.com/@HeritageGuessr",
          href: "https://www.youtube.com/@HeritageGuessr",
          cta: "Voir les vidéos",
        },
        {
          icon: "facebook",
          label: "Facebook",
          value: "facebook.com/HeritageGuessr",
          href: "https://www.facebook.com/profile.php?id=61568386015819",
          cta: "Nous suivre",
        },
        {
          icon: "github",
          label: "GitHub",
          value: "github.com/dev-HieuLe/HeritageGuessr",
          href: "https://github.com/dev-HieuLe/HeritageGuesser/blob/main/README.md",
          cta: "Voir le code",
        },
      ],
    },

    // Footer
    footer: {
      copyright: "© 2026 Heritage Guessr. Tous droits réservés.",
      links: [
        { label: "Chroniques", to: "/rank" },
        { label: "Classement Mondial", to: "/leaderboard" },
        { label: "Atlas", to: "/explore" },
        { label: "Académie", to: "/study" },
      ],
    },

    // Login
    login: {
      subtitle: "Entrer dans l'Archive",
      emailLabel: "E-mail",
      passwordLabel: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié ?",
      submit: "Entrer dans l'Archive",
      orDivider: "Ou continuer avec",
      googleSignIn: "Continuer avec Google",
      divider: "Nouveau dans l'Archive ?",
      createAccount: "Créer un Compte Curateur",
      backHome: "Retour à l'Accueil",
      emailRequired: "L'e-mail est requis",
      passwordRequired: "Le mot de passe est requis",
      invalidCredentials: "E-mail ou mot de passe invalide",
      somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
    },

    // Register
    register: {
      subtitle: "Rejoindre l'Archive",
      fields: {
        name: { label: "Nom du Curateur", placeholder: "Votre alias archivistique" },
        email: { label: "E-mail", placeholder: "curateur@archive.vn" },
        password: { label: "Mot de passe", placeholder: "••••••••" },
        confirmPassword: { label: "Confirmer le mot de passe", placeholder: "••••••••" },
      },
      submit: "S'inscrire comme Curateur",
      orDivider: "Ou s'inscrire avec",
      googleSignUp: "Continuer avec Google",
      divider: "Déjà inscrit ?",
      loginLink: "Entrer dans l'Archive",
      backHome: "Retour à l'Accueil",
      errors: {
        nameRequired: "Le nom est requis",
        nameTooShort: "Le nom doit contenir au moins 2 caractères",
        nameTooLong: "Le nom doit contenir moins de 50 caractères",
        emailRequired: "L'e-mail est requis",
        emailInvalid: "Adresse e-mail invalide",
        passwordRequired: "Le mot de passe est requis",
        passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
        confirmRequired: "Confirmez votre mot de passe",
        confirmMismatch: "Les mots de passe ne correspondent pas",
        nameInvalidChars: "Le nom doit contenir au moins une lettre ou un chiffre",
        emailInUse: "Cet e-mail est déjà enregistré. Essayez de vous connecter.",
        usernameTaken: "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.",
        registrationError: "Erreur d'inscription. Veuillez réessayer.",
        invalidData: "Données d'inscription invalides. Vérifiez vos saisies.",
        passwordTooLong: "Le mot de passe doit contenir moins de 128 caractères",
        somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
        serverError: "Erreur serveur. Veuillez réessayer plus tard.",
      },
    },

    // Ranking
    ranking: {
      progressToNextRank: "Progression vers le rang suivant",
      rankTier: "Palier de Rang",
      level: "Niveau",
      stars: "Étoiles",
      rankLadder: "Échelle des Rangs",
      chronicles: "Chroniques",
      yourRank: "Votre Rang",
      rankNow: "Jouer Maintenant",
      loading: "Chargement des données de rang...",
      maintenance: "En Maintenance",
      maintenanceDesc: "L'Archive Classée est temporairement fermée pour maintenance. Revenez plus tard.",
      backHome: "Retour à l'Accueil",
      starsOf: (s) => `${s} / 5 étoiles`,
      rankLabel: (rank, name) => `RANG ${rank} — ${name}`,
      rankNames: [
        "Fer",
        "Bronze",
        "Argent",
        "Or",
        "Platine",
        "Émeraude",
        "Diamant",
        "Maître",
        "Grand Maître",
        "Challenger",
      ],
    },

    // Leaderboard
    leaderboard: {
      rank: "Rang",
      curator: "Curateur",
      level: "Niveau",
      tier: "Palier",
      curatorsInArchive: (count) => `${count} curateurs dans l'Archive`,
      showMore: (n) => `Afficher ${n} de plus`,
      showLess: "Réduire",
      scrollToBottom: "Aller en bas",
      scrollToTop: "Retour en haut",
    },

    // Contribute
    contribute: {
      legacyHeading: ["Préservation", "du Patrimoine"],
      heroDesc:
        "Vos contributions tissent le tissu de notre mémoire collective. Utilisez le sanctuaire pour enregistrer de nouvelles découvertes et affiner l'intelligence de l'archive.",
      registerNewHeritage: "Enregistrer un Nouveau Site",
      totalSubmitted: "Total Soumis",
      approved: "Approuvé",
      pending: "En attente",
      declined: "Refusé",
      yourContributions: "Vos Contributions",
      noContributions:
        "Aucune contribution pour l'instant. Soyez le premier à enregistrer un site patrimonial !",
      submitFirstSite: "Soumettre votre Premier Site",
      theArtOfArchiving: "L'Art de l'Archivage",
      cards: [
        {
          icon: "location_on",
          title: "Précision Spatiale",
          desc: "Ouvrez Google Maps, naviguez jusqu'à l'emplacement exact du site, puis copiez l'URL complète depuis la barre d'adresse de votre navigateur.",
        },
        {
          icon: "auto_awesome",
          title: "Métadonnées par IA",
          desc: "Notre IA extrait les coordonnées de votre URL et génère automatiquement des descriptions culturelles, l'époque et le niveau de difficulté.",
        },
        {
          icon: "description",
          title: "Détail Sémantique",
          desc: "Ajoutez une description facultative pour donner du contexte à l'IA et améliorer la qualité de l'entrée générée.",
        },
        {
          icon: "pending_actions",
          title: "Processus de Révision",
          desc: "Chaque soumission est examinée par nos curateurs. Les sites acceptés sont ajoutés au monde du jeu Heritage Guessr.",
        },
      ],
      howToGetUrl: "Comment obtenir une URL Google Maps valide",
      steps: [
        "Allez sur google.com/maps et recherchez le site patrimonial par son nom.",
        "Cliquez sur le repère de localisation pour ouvrir son panneau de détails.",
        "Passez en Street View en faisant glisser le bonhomme jaune sur la carte.",
        "Copiez l'URL complète de votre navigateur — elle doit contenir les coordonnées \"@lat,lng\".",
        "Collez l'URL dans le champ \"URL Google Street View\" et soumettez.",
      ],
    },

    // FAQ
    faq: [
      {
        q: "Qu'est-ce que Heritage Guessr ?",
        a: "Heritage Guessr est un jeu de connaissance sur le patrimoine vietnamien. Chaque manche vous plonge dans un panorama Street View réel d'un site patrimonial — votre mission est d'identifier son nom et d'estimer son âge. Pas de repère sur la carte : c'est un test de connaissance culturelle, pas de géographie.",
      },
      {
        q: "Comment se déroule chaque manche ?",
        a: "Vous êtes immergé dans une Street View 360° d'un vrai site patrimonial vietnamien. Étudiez l'architecture, les sculptures et l'environnement, puis saisissez le nom du site et votre meilleure estimation de son âge en années. Confirmez avant la fin du minuteur de 120 secondes.",
      },
      {
        q: "Comment mon score est-il calculé ?",
        a: "Chaque manche est notée sur 10 : jusqu'à 5 points pour le nom (correspondance de similarité — les réponses partielles comptent toujours) et jusqu'à 5 points pour l'âge (dans les 10 ans = note maximale, dans les 80 ans = 1 point). Un total de 8 ou plus est une victoire ; 4 ou moins est une défaite.",
      },
      {
        q: "Comment fonctionne le système de rang ?",
        a: "Il y a 10 rangs, du Fer au Challenger. Gagnez suffisamment de manches pour remplir votre barre de progression à 5 étoiles et vous montez en rang. Perdez suffisamment et vous descendez. Votre rang et votre progression sont affichés sur le Classement Mondial avec tous les autres joueurs.",
      },
      {
        q: "Comment gagner des points ?",
        a: "Vous gagnez +5 points en terminant une partie classée, +10 points pour votre première partie du jour (connexion quotidienne), +5 points en lisant un article Étude, et +10 points en soumettant une contribution patrimoniale. Les points sont visibles dans votre profil et la barre de navigation.",
      },
      {
        q: "Qu'est-ce que l'Archiviste ?",
        a: "L'Archiviste est un compagnon IA disponible à chaque manche. Vous pouvez lui poser jusqu'à 10 questions par manche pour des indices — il vous guidera vers la réponse sans la donner directement. Commencez par des questions larges comme 'Quelle dynastie a construit ceci ?' avant de préciser.",
      },
      {
        q: "Qu'est-ce que la section Étude (Académie) ?",
        a: "La section Étude contient des articles approfondis sur de vrais sites patrimoniaux vietnamiens — leur histoire, architecture et signification culturelle. Les lire affine votre capacité à reconnaître les sites en jeu. Chaque article terminé rapporte +5 points.",
      },
      {
        q: "Puis-je contribuer de nouveaux sites patrimoniaux ?",
        a: "Oui. Sur la page Contribuer, collez une URL Google Maps Street View et donnez un nom au site. Notre système génère automatiquement la région, l'époque et la description grâce à l'IA. Les soumissions approuvées entrent dans le pool de lieux du jeu et vous rapportent +10 points.",
      },
    ],

    // Shop
    shop: {
      eyebrow: "Boutique de l'Archive Patrimoniale",
      title: "Boutique Cadeaux",
      subtitle:
        "Échangez vos points durement gagnés contre des récompenses patrimoniales exclusives.",
      points: "pts",
      redeem: "Échanger",
      notEnough: "Pas Assez de Points",
      items: {
        keyboard: "Clavier Mécanique",
        keyboardDesc:
          "Un clavier mécanique full-size premium — l'arme de choix de l'archiviste.",
        mouse: "Souris Gaming",
        mouseDesc:
          "Souris gaming haute précision, conçue pour l'érudit dévoué.",
        tshirt: "T-shirt Heritage (Classique)",
        tshirtDesc:
          "T-shirt en coton premium portant l'emblème Heritage Guessr.",
        tshirt2: "T-shirt Heritage (Alt)",
        tshirt2Desc:
          "Coloris alternatif du t-shirt officiel Heritage Guessr.",
        starbucks: "Carte Cadeau Starbucks",
        starbucksDesc:
          "Une carte cadeau Starbucks pour alimenter votre prochaine session patrimoniale.",
        keychain: "Porte-clés Heritage",
        keychainDesc:
          "Porte-clés artisanal — un petit témoignage de votre dévotion archivistique.",
      },
      modal: {
        notEnoughTitle: "Pas Assez de Points",
        notEnoughBody:
          "Cet article coûte {need} pts. Vous avez {have} pts. Il vous manque {diff} pts pour échanger cette récompense.",
        confirmTitle: "Comment Échanger",
        contactIntro:
          "Contactez-nous via l'un des canaux ci-dessous pour échanger vos points contre cet article.",
        phone: "Téléphone",
        note: "Faites une capture d'écran de cette page et envoyez-la avec votre nom d'utilisateur en jeu.",
        close: "Fermer",
      },
    },

    // About Us
    aboutUs: {
      badge: "Heritage Guessr",
      heroLine1: "Construit pour",
      heroLine2: "Préserver.",
      heroLine3: "Conçu pour",
      heroLine4: "Inspirer.",
      heroDesc:
        "Heritage Guessr vous plonge dans de vrais panoramas Google Street View de sites patrimoniaux vietnamiens. Explorez avec votre guide IA Savannah, devinez le nom et l'âge du site, et grimpez dans un classement mondial — tout en apprenant les trésors culturels du Vietnam.",
      pills: {
        streetView: "Street View",
        aiGuide: "Guide IA",
        nlpScoring: "Notation NLP",
        studyMode: "Mode Étude",
        xpShop: "Boutique XP",
        vrDiscovery: "Découverte VR",
      },

      statsLabels: [
        "Étudiants Atteints",
        "Sites Patrimoniaux",
        "Modèles IA",
        "Écoles Pilotes",
      ],

      missionLabel: "Notre Mission",
      missionVi: "Lan tỏa, kết nối và gìn giữ.",
      missionEn: "Diffuser, connecter et préserver.",
      whyBuilt: "Pourquoi Nous l'Avons Construit",
      missionHeadline1: "Le Vietnam possède plus de",
      missionHeadline2: "40 000 sites patrimoniaux.",
      missionHeadline3: "La plupart passent inaperçus.",
      missionBody1:
        "Heritage Guessr a été conçu à Delta Global School, Hanoï, comme une initiative technologique pour rendre le patrimoine culturel vietnamien accessible, engageant et inoubliable — en commençant par les étudiants et en s'étendant vers l'extérieur.",
      missionBody2:
        "Nous combinons Google Street View, l'IA générative et le NLP multilingue pour transformer la navigation passive en apprentissage actif — tout en suivant votre progression par rapport aux joueurs du monde entier.",
      badgeDGS: "DGS Hanoï",
      badge600: "600+ Étudiants",
      badgeUNESCO: "Sites UNESCO",
      badgeAI: "Propulsé par l'IA",

      underTheHood: "Sous le Capot",
      techHeadline1: "Propulsé par Huit",
      techHeadline2: "Technologies",
      techDesc:
        "Du Street View 3D en temps réel aux réseaux de neurones multilingues — chaque couche est choisie pour servir l'expérience.",
      techDescs: [
        "Frontend ultra-rapide avec HMR",
        "Exploration patrimoniale 360° immersive",
        "Guide IA & personnalisation des sites",
        "Synthèse vocale bilingue naturelle",
        "Notation des réponses multilingue",
        "Compagnon IA 3D animé Savannah",
        "REST API Express 5 + base de données relationnelle",
        "Animations fluides, UI utility-first",
      ],

      ourJourney: "Notre Parcours",
      howItStarted: "Comment Tout",
      howItStartedAccent: "a Commencé",
      journeyDesc:
        "D'une idée de classe à une plateforme full-stack servant des centaines d'étudiants — voici l'histoire de Heritage Guessr.",
      quote:
        '"Nous nous sommes demandé — et si redécouvrir le passé du Vietnam pouvait ressembler à jouer à un jeu ? Cette question est devenue Heritage Guessr."',
      quoteRole: "Leader de l'Innovation",
      timeline: [
        {
          year: "Début 2025 · Genèse",
          title: "Né dans la Salle B410",
          desc: "L'idée a pris forme à DGS comme projet Capstone — mêlant éducation et IA pour préserver l'identité culturelle vietnamienne. Un concept précoce est apparu pour un jeu intégrant des interactions VR pour explorer le patrimoine national.",
        },
        {
          year: "Été 2025 · Chapitre Un",
          title: "Beta 0.1 Prend Forme",
          desc: "La première Beta a été construite, posant les bases d'une plateforme intégrant IA et NLP. Les tests initiaux ont atteint 10–20 joueurs d'un petit groupe en classe, avec des premiers retours de professeurs d'histoire et de géographie.",
        },
        {
          year: "Fin 2025 · Lancement Pilote",
          title: "Écoles & Retours Réels",
          desc: "Après des améliorations de fonctionnalités, le projet a été piloté à DGS Adventure (The Dewey School) et au lycée Luong Van Can. Plus de 300 étudiants et 10 enseignants y ont participé, fournissant des avis précieux.",
        },
        {
          year: "Mar 2026 · Beta 1.0",
          title: "Mise à Niveau Majeure",
          desc: "La plateforme a subi une refonte significative de l'UI, des protocoles IA, des systèmes de fonctionnalités et des pipelines de traitement de données — façonnée par les retours réels des enseignants — prête à atteindre la communauté élargie.",
        },
        {
          year: "Maintenant · Plateforme Ouverte",
          title: "Contributions Communautaires",
          desc: "Heritage Guessr finalise son déploiement pour atteindre les utilisateurs. Nous accélérons le mouvement en ouvrant les contributions non seulement aux fondateurs, mais à la communauté elle-même.",
        },
        {
          year: "Futur · L'Horizon",
          title: "Le Ciel est la Limite",
          desc: "Heritage Guessr vise à continuer d'élargir son infrastructure technique pour répondre aux besoins croissants des joueurs et préserver encore plus du riche paysage culturel du Vietnam.",
        },
      ],

      meetAIGuide: "Rencontrez votre Guide IA",
      savannahTitle1: "Savannah — Votre",
      savannahTitle2: "Experte en Patrimoine",
      savannahDesc:
        "Propulsée par Gemma 4 26B via DeepInfra, Savannah vous donne des indices contextuels sans jamais révéler la réponse. Elle parle en langage naturel, lit ses réponses à voix haute via Gemini TTS (voix Despina), et prend vie comme un avatar VRM 3D que vous pouvez voir cligner des yeux et s'animer en temps réel.",
      online: "EN LIGNE",
      pillGemma: "Gemma 4 · 26B Chat",
      pillTTS: "Gemini TTS",
      pill3D: "Avatar VRM 3D",
      pillLang: "FR + EN",

      hieuQuote1: "J'ai écrit chaque",
      hieuQuoteAccent: "ligne de code",
      hieuQuote2: "avec un seul objectif : rendre le patrimoine du Vietnam",
      hieuQuoteAccent2: "impossible à oublier.",
      hieuRole: "Développeur Principal · Designer · Auteur",

      craftedBy: "Créé Par",
      foundingTeam: "L'Équipe Fondatrice",
      teamDesc:
        "Trois étudiants à Delta Global School, Hanoï — unis par une seule mission.",
      memberRoles: [
        "Leader de l'Innovation",
        "Développeur Principal · Designer · Auteur",
        "Spécialiste Contenu Créatif",
      ],
      dgsTitle: "Delta Global School",
      dgsLocation: "Hanoï, Vietnam",
      dgsDesc:
        "Heritage Guessr a été conçu et construit à DGS dans le cadre d'une initiative de préservation et de promotion du patrimoine culturel vietnamien par la technologie.",
      theTeamLabel: "L'Équipe",
      meetFounders: "Rencontrer les Fondateurs",
      meetFoundersDesc:
        "Découvrez toute l'équipe derrière Heritage Guessr sur notre page d'accueil.",
      viewFounders: "Voir les Fondateurs",

      openSource: "Open Source · Éducatif",
      bottomTitle: "Construit avec ❤️ pour le Patrimoine Culturel Vietnamien",
      copyright:
        "Copyright © 2025 Le Trung Hieu et l'équipe Heritage Guessr. Tous droits réservés.",
      followUs: "Nous Suivre",
      contributeASite: "Contribuer un Site",
    },

    // Founders
    founders: {
      eyebrow: "Les Personnes Derrière la Plateforme",
      headline: "Nos",
      headlineAccent: "Fondateurs",
      subtitle:
        "Une équipe dévouée préservant et célébrant l'âme du Vietnam — un monument à la fois.",
      founderBadge: "Fondateur",
      viewProfile: "Voir le profil →",
      connect: "Connecter",
      members: [
        {
          name: "Đặng Thái Hoà",
          role: "Leader de l'Innovation",
          bio: "Façonne la vision stratégique de Heritage Guessr, appliquant la pensée design et la direction créative pour créer des expériences significatives qui redéfinissent la façon dont le patrimoine vietnamien est exploré en ligne.",
        },
        {
          name: "Lê Trung Hiếu",
          role: "Responsable Ingénierie Full-Stack & Designer",
          bio: "Dirige le développement end-to-end de Heritage Guessr, de l'ingénierie full-stack et l'architecture backend au design frontend soigné, créant une plateforme robuste et évolutive qui transforme le patrimoine vietnamien en expérience numérique immersive.",
        },
        {
          name: "Nguyễn Thái Sơn",
          role: "Spécialiste Contenu Créatif",
          bio: "Insuffle l'âme culturelle dans chaque recoin de la plateforme — créant des histoires, des images et des expériences qui rendent le patrimoine vietnamien inoubliable.",
        },
      ],
    },

    // Progress Analysis
    progressAnalysis: {
      badge: "APERÇUS IA",
      title: "Analyse de Progression",
      subtitle: "L'IA analysera votre historique de jeu et vous fournira des insights personnalisés — régions à cibler, périodes historiques manquantes et compétences à améliorer.",
      readyLabel: "Prêt à analyser",
      readySub: "Basé sur l'intégralité de votre historique de jeu",
      loginLabel: "Connectez-vous pour analyser",
      loginSub: "Connexion requise pour voir les analyses personnelles",
      analyzeBtn: "Analyser Maintenant",
      notLoggedIn: "Non connecté",
      loadingLabel: "L'IA analyse vos données…",
      needMoreData: "Plus de données nécessaires",
      needMoreDataSub: "Jouez au moins 3 manches Classées pour que l'IA puisse analyser votre progression.",
      back: "Retour",
      errorMsg: "Impossible de se connecter. Veuillez réessayer.",
      retry: "Réessayer",
      totalGames: "Total des Parties",
      avgScore: "Score Moyen",
      nameRecog: "Reconnaissance du Nom",
      ageGuess: "Estimation de l'Âge",
      recent: "Récent",
      summaryLabel: "Résumé Général",
      strengths: "Points Forts",
      weaknesses: "Points à Améliorer",
      regionDist: "Distribution des Régions",
      eraDist: "Époques Historiques",
      suggestions: "Suggestions Personnalisées",
      reanalyze: "Ré-analyser",
    },

    // Wrong Locations
    wrongLocations: {
      badge: "SOUVENT RATÉ",
      title: "Sites où Vous Échouez",
      subtitle: "Sites auxquels vous avez répondu incorrectement plusieurs fois. Cliquez sur le bouton IA pour obtenir des conseils de pratique spécifiques.",
      loadLabel: "Voir les sites difficiles",
      loadSub: "Basé sur l'historique de jeu — score < 5",
      loginLabel: "Connectez-vous pour voir",
      loginSub: "Connexion requise pour voir les résultats personnels",
      loadBtn: "Voir Maintenant",
      notLoggedIn: "Non connecté",
      empty: "Aucun site difficile !",
      emptySub: "Vous n'avez pas encore eu de score inférieur à 5. Continuez à jouer pour suivre votre progression.",
      errorMsg: "Impossible de charger les données. Veuillez réessayer.",
      retry: "Réessayer",
      back: "Retour",
      refresh: "Actualiser",
      wrongCount: (n) => `✗ ${n}x raté`,
      aiBtn: "Comment pratiquer ?",
      aiLoading: "L'IA analyse…",
      nameLabel: "Nom",
      yearLabel: "Année",
    },

    // VR Mode
    vrMode: {
      calibTitle: "Calibration VR",
      calibSubtitle: "Ajustez pour correspondre à votre casque cardboard",
      eyeWindowWidth: "Largeur de la Fenêtre Oculaire",
      eyeWindowAuto: "Calculé automatiquement depuis la taille de l'écran · remplacement manuel désactivé",
      eyeWindowManual: "Manuel · définissez la largeur de l'écran du téléphone ci-dessous pour calculer automatiquement",
      verticalOffset: "Décalage Vertical",
      verticalOffsetHint: "Déplace l'image vers le bas (+) ou vers le haut (−) dans le casque",
      streetViewZoom: "Zoom Street View",
      streetViewZoomHint: "0 = 180° FOV (très large)  ·  1 = standard  ·  3 = téléobjectif max",
      precision: "Précision — Optique Cardboard",
      interLens: "Distance Inter-Lentilles",
      interLensHint: "Standard Google Cardboard v2 : 63,9 mm",
      phoneScreenWidth: "Largeur Écran Téléphone",
      phoneScreenHint: "Mesurez la largeur horizontale de l'écran en paysage (côté long). Mettez 0 pour utiliser la largeur oculaire manuelle.",
      computedEye: "Fenêtre oculaire calculée :",
      saveApply: "Sauvegarder & Appliquer",
      resetDefaults: "Réinitialiser les Paramètres",
      rotateLandscape: "Passer en paysage",
      vrRequiresH: "La VR nécessite l'orientation horizontale",
      loadingPano: "Chargement du panorama…",
      unknown: "Inconnu",
    },

    // Rank Play
    rankPlay: {
      chamber: (n) => `Classé · Chambre ${n}`,
      heritage: (region) => `Patrimoine ${region}`,
      preparingArchive: "Préparer l'Archive Classée",
      sessionProgress: "Progression de Session",
      sealedTitle: "Archive Classée Scellée",
      sealedDesc: (n) => `Limite journalière de ${n} sessions atteinte. Revenez demain — ou passez à la formule supérieure pour jouer sans limite.`,
      upgradeTitle: "Passer à Plus",
      upgradeDesc: "Sessions Classées illimitées, contenu d'étude avancé et badges exclusifs — à partir de seulement 65 000₫/mois.",
      viewSubscription: "Voir l'Abonnement",
      backHome: "Retour à l'Accueil",
      maintenanceTitle: "En Maintenance",
      maintenanceDesc: "L'Archive Classée est temporairement fermée pour maintenance. Revenez plus tard.",
      noImagery: "Pas d'Imagerie Disponible",
      useClues: "Utilisez les indices pour faire votre meilleure estimation",
      enterHeritage: "Entrez l'Identité du Patrimoine",
      heritagePlaceholder: "Lieu, Dynastie ou Époque...",
      yearsOldLabel: "Âge en Années (Est.)",
      yearPlaceholder: "ex. 1802",
      guess: "DEVINER",
      timesUp: "TEMPS ÉCOULÉ",
      submitting: "Envoi de votre réponse…",
      continue: "Continuer",
      ptsEarned: "PTS GAGNÉS",
      similarity: (n) => `Similarité : ${n}%`,
      timeline: (n) => `Chronologie : ±${n} Ans`,
      overallRating: "Note Générale",
      yourRating: "Votre Note",
      rateThis: "Évaluer",
      votes: (n) => `${n} vote${n !== 1 ? "s" : ""}`,
      sessionComplete: "Session Classée Terminée",
      allCatalogued: "Tous les sites patrimoniaux ont été catalogués.",
      viewRank: "Voir le Rang",
      sanctuary: "Sanctuaire",
      noRatings: "Aucune évaluation",
      yrsOld: "ans",
      playsLeft: (n) => `${n} restant${n !== 1 ? "s" : ""}`,
      scoreName: "Nom",
      scoreAge: "Âge",
      navExplore: "Explorer",
      navLeaderboard: "Classement",
      navStudy: "Étude",
      navChallenge: "Défi",
      feedbacks: {
        perfect: "Archivage Parfait",
        exceptional: "Dossier Exceptionnel",
        onTrack: "Sur la Bonne Voie",
        partial: "Archive Partielle",
        lost: "Dossier Perdu",
      },
      howToPlay: "Comment Jouer",
      howToPlayTitle: "Comment Jouer en Classé",
      howToPlaySteps: [
        "Observez le Street View et collectez des indices — architecture, panneaux, environnement.",
        "Tapez le nom du site patrimonial. Une réponse partielle compte aussi : la ville, le type de temple ou la figure honorée donnent des points partiels.",
        "Estimez l'âge du site (en années) — plus vous êtes proche de l'âge réel, plus votre score d'Âge est élevé.",
        "Marquez 7 points ou plus sur 10 pour monter de rang ; en dessous de 3, vous perdez du progrès. Discutez avec L'Archiviste pour des indices en direct.",
      ],
      gotIt: "Compris",
      hintMessage:
        "Astuce : même les réponses partielles rapportent des points ! Nommer la ville, le type de temple ou le personnage historique honoré donne du crédit partiel. Plus votre réponse est précise, plus vous gagnez de points.",
      ratingTitle: "Analyse en Cours",
      ratingSubtitle: "Évaluation de la proximité de votre réponse avec le site réel.",
      rankUp: (name) => `Montée de Rang → ${name}`,
      rankDown: (name) => `Descente de Rang → ${name}`,
    },

    // Lesson Detail
    lessonDetail: {
      notFound: "Leçon introuvable.",
      back: "Retour",
      backLabel: "RETOUR",
      categoryLabel: "CATÉGORIE",
      locationLabel: "LOCALISATION",
      eraLabel: "ÉPOQUE",
      yearLabel: "ANNÉE",
      copied: "COPIÉ !",
      copyLink: "COPIER LE LIEN",
      prevLesson: "PRÉCÉDENT",
      nextLesson: "SUIVANT",
      sources: "RÉFÉRENCES",
      readTimeLeft: (m, s) => `Veuillez lire encore ${m}:${s} pour terminer`,
      markRead: "Marquer comme Lu · +5 pts",
      completed: "Terminé (+5 pts)",
    },

    // Study Page
    studyPage: {
      catAll: "TOUS",
      catNatural: "NATUREL",
      catHistorical: "HISTORIQUE",
      catScenic: "PITTORESQUE",
      searchPlaceholder: "Rechercher articles, sites...",
      noResults: "Aucune leçon correspondante trouvée.",
      readBadge: "LU",
      viewBtn: "VOIR >",
      newest: "RÉCENT",
      readNow: "LIRE",
    },

    // Loading
    loading: "Chargement…",
  },
};

export default t;
