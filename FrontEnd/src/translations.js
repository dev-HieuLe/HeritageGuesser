const t = {
  en: {
    // Nav (Homepage top bar)
    nav: {
      home: "Home",
      explore: "Explore",
      leaderboard: "Leaderboard",
      study: "Study",
      rank: "Rank",
      atlas: "Atlas",
      tutorial: "Tutorial",
      contribute: "Contribute",
      challenge: "Challenge",
      logout: "Logout",
      signIn: "Sign In",
    },

    // Sidebar nav items
    sidebar: {
      sanctuary: "Sanctuary",
      PlayRank: "Play Rank",
      globalRanks: "Global Ranks",
      atlas: "Atlas",
      academy: "Academy",
      tutorial: "Tutorial",
      contribute: "Contribute",
      dailyQuest: "Daily Quest",
      support: "Support",
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
          icon: "forum",
          label: "Discord",
          value: "discord.gg/heritageguesser",
          href: "https://discord.gg/heritageguesser",
          cta: "Join the community",
        },
        {
          icon: "code",
          label: "GitHub",
          value: "github.com/HeritageGuesser",
          href: "https://github.com/HeritageGuesser",
          cta: "View source",
        },
      ],
    },

    // Footer
    footer: {
      copyright: "© 2024 The Ethereal Archivist Project. All Rights Reserved.",
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
        emailInUse: "Email already in use",
        usernameTaken: "Username already taken",
        registrationError: "Registration error",
        invalidData: "Invalid registration data",
        somethingWrong: "Something went wrong. Please try again.",
      },
    },

    // Loading
    loading: "Loading…",
  },

  vi: {
    // Nav
    nav: {
      home: "Trang Chủ",
      explore: "Khám Phá",
      leaderboard: "Bảng Xếp Hạng",
      study: "Học Tập",
      rank: "Xếp Hạng",
      atlas: "Bản Đồ",
      tutorial: "Hướng Dẫn",
      contribute: "Đóng Góp",
      challenge: "Thử Thách",
      logout: "Đăng Xuất",
      signIn: "Đăng Nhập",
    },

    // Sidebar
    sidebar: {
      sanctuary: "Thánh Địa",
      PlayRank: "Chơi Rank",
      globalRanks: "Xếp Hạng Toàn Cầu",
      atlas: "Bản Đồ",
      academy: "Học Viện",
      tutorial: "Hướng Dẫn",
      contribute: "Đóng Góp",
      dailyQuest: "Nhiệm Vụ Hằng Ngày",
      support: "Hỗ Trợ",
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
          icon: "forum",
          label: "Discord",
          value: "discord.gg/heritageguesser",
          href: "https://discord.gg/heritageguesser",
          cta: "Tham gia cộng đồng",
        },
        {
          icon: "code",
          label: "GitHub",
          value: "github.com/HeritageGuesser",
          href: "https://github.com/HeritageGuesser",
          cta: "Xem mã nguồn",
        },
      ],
    },

    // Footer
    footer: {
      copyright: "© 2024 Dự Án Kho Lưu Trữ Huyền Bí. Mọi Quyền Được Bảo Lưu.",
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
        emailInUse: "Email đã được sử dụng",
        usernameTaken: "Tên người dùng đã tồn tại",
        registrationError: "Lỗi đăng ký",
        invalidData: "Dữ liệu đăng ký không hợp lệ",
        somethingWrong: "Đã xảy ra lỗi. Vui lòng thử lại.",
      },
    },

    // Loading
    loading: "Đang tải…",
  },
};

export default t;
