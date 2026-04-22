import { useLang } from "../../Context/languageContext";

const steps = {
  en: [
    {
      icon: "travel_explore",
      title: "A mystery heritage site is revealed",
      desc: "Each round drops you into a street-level panorama of a real Vietnamese heritage site. Rotate and zoom to study the architecture, carvings, and surroundings.",
    },
    {
      icon: "history_edu",
      title: "Guess the name of the heritage",
      desc: "Type your best guess for the site's name. You earn up to 5 points — the closer your answer matches the real name, the higher your name score.",
    },
    {
      icon: "schedule",
      title: "Guess how old it is",
      desc: "Enter the age of the heritage in years. You earn up to 5 points based on accuracy: within 10 years scores full marks, within 80 years scores 1 point.",
    },
    {
      icon: "smart_toy",
      title: "Ask The Archivist for hints",
      desc: "Stuck? Chat with the AI Archivist avatar for up to 10 hints per round. Each hint nudges you closer without giving the answer away — use them wisely.",
    },
    {
      icon: "bolt",
      title: "Confirm before the timer runs out",
      desc: "You have 120 seconds per round. Hit Confirm to lock in your guesses. Your total score (name + age, max 10) determines your XP and rank outcome.",
    },
    {
      icon: "military_tech",
      title: "Rise through the ranks",
      desc: "Score 8 or above to rank up; 4 or below to rank down. Climb from Iron through Bronze, Silver, Gold and beyond to earn your place on the Imperial Scholars board.",
    },
  ],
  vi: [
    {
      icon: "travel_explore",
      title: "Một di sản bí ẩn được tiết lộ",
      desc: "Mỗi vòng đưa bạn vào góc nhìn toàn cảnh thực địa của một địa điểm di sản Việt Nam thực tế. Xoay và phóng to để nghiên cứu kiến trúc, hoa văn và môi trường xung quanh.",
    },
    {
      icon: "history_edu",
      title: "Đoán tên của di sản",
      desc: "Nhập tên di sản theo phỏng đoán tốt nhất của bạn. Bạn có thể đạt tối đa 5 điểm — câu trả lời càng gần với tên thật, điểm tên của bạn càng cao.",
    },
    {
      icon: "schedule",
      title: "Đoán độ tuổi của di sản",
      desc: "Nhập tuổi của di sản tính bằng năm. Bạn đạt tối đa 5 điểm dựa trên độ chính xác: trong vòng 10 năm được điểm tối đa, trong vòng 80 năm được 1 điểm.",
    },
    {
      icon: "smart_toy",
      title: "Hỏi Học Giả Lưu Trữ để lấy gợi ý",
      desc: "Bị bí? Trò chuyện với avatar AI Học Giả Lưu Trữ để lấy tối đa 10 gợi ý mỗi vòng. Mỗi gợi ý giúp bạn tiến gần hơn mà không tiết lộ đáp án — hãy dùng thật khôn ngoan.",
    },
    {
      icon: "bolt",
      title: "Xác nhận trước khi hết giờ",
      desc: "Bạn có 120 giây mỗi vòng. Nhấn Xác Nhận để chốt dự đoán. Tổng điểm của bạn (tên + tuổi, tối đa 10) quyết định XP và kết quả xếp hạng.",
    },
    {
      icon: "military_tech",
      title: "Leo qua các hạng",
      desc: "Đạt 8 điểm trở lên để thăng hạng; 4 điểm trở xuống để xuống hạng. Leo từ Sắt qua Đồng, Bạc, Vàng và cao hơn để giành vị trí trên bảng Học Giả Đế Vương.",
    },
  ],
  cn: [
    {
      icon: "travel_explore",
      title: "揭开神秘遗产地",
      desc: "每轮游戏将带你进入一处真实越南遗产地的街景全景。旋转缩放，仔细研究建筑、雕刻与周围环境。",
    },
    {
      icon: "history_edu",
      title: "猜出遗产名称",
      desc: "输入你对遗址名称的最佳猜测。最多可获得5分——你的答案越接近真实名称，名称得分就越高。",
    },
    {
      icon: "schedule",
      title: "猜测遗产年龄",
      desc: "以年为单位输入遗产的年龄。根据准确度最多可获得5分：误差在10年内得满分，误差在80年内得1分。",
    },
    {
      icon: "smart_toy",
      title: "向档案学者寻求提示",
      desc: "卡住了？与AI档案学者头像聊天，每轮最多可获得10个提示。每个提示引导你更接近答案而不直接告知——请善用它们。",
    },
    {
      icon: "bolt",
      title: "在倒计时结束前确认",
      desc: "每轮有120秒。点击确认以锁定猜测。你的总分（名称+年龄，最高10分）决定你的经验值和排名结果。",
    },
    {
      icon: "military_tech",
      title: "晋升排名",
      desc: "得8分或以上即可晋级；4分或以下则会降级。从铁牌一路攀升至铜、银、金及更高段位，在帝王学者榜上占据一席之地。",
    },
  ],
  fr: [
    {
      icon: "travel_explore",
      title: "Un site patrimonial mystérieux est révélé",
      desc: "Chaque manche vous plonge dans un panorama de rue d'un vrai site patrimonial vietnamien. Faites pivoter et zoomez pour étudier l'architecture, les sculptures et les alentours.",
    },
    {
      icon: "history_edu",
      title: "Devinez le nom du patrimoine",
      desc: "Tapez votre meilleure estimation du nom du site. Vous gagnez jusqu'à 5 points — plus votre réponse correspond au vrai nom, plus votre score de nom est élevé.",
    },
    {
      icon: "schedule",
      title: "Devinez son âge",
      desc: "Entrez l'âge du patrimoine en années. Vous gagnez jusqu'à 5 points selon la précision : dans les 10 ans = note maximale, dans les 80 ans = 1 point.",
    },
    {
      icon: "smart_toy",
      title: "Demandez des indices à l'Archiviste",
      desc: "Bloqué ? Discutez avec l'avatar IA Archiviste pour obtenir jusqu'à 10 indices par manche. Chaque indice vous rapproche sans révéler la réponse — utilisez-les judicieusement.",
    },
    {
      icon: "bolt",
      title: "Confirmez avant la fin du minuteur",
      desc: "Vous avez 120 secondes par manche. Appuyez sur Confirmer pour valider vos estimations. Votre score total (nom + âge, max 10) détermine votre XP et votre rang.",
    },
    {
      icon: "military_tech",
      title: "Grimpez dans les rangs",
      desc: "Obtenez 8 ou plus pour monter en rang ; 4 ou moins pour descendre. Grimpez du Fer au Bronze, Argent, Or et au-delà pour mériter votre place au classement des Érudits Impériaux.",
    },
  ],
};

const modes = {
  en: [
    {
      icon: "explore",
      name: "Classic",
      desc: "Practice rounds with no rank on the line. Identify the site's name and age freely — perfect for building your heritage knowledge.",
      color: "#a2d1bb",
    },
    {
      icon: "history_edu",
      name: "Ranked (Chronicles)",
      desc: "Competitive mode. Guess name and age under pressure — score ≥ 8 to rank up, ≤ 4 to rank down. Every point matters on the leaderboard.",
      color: "#e9c349",
    },
    {
      icon: "groups",
      name: "Daily Quest",
      desc: "One shared heritage site per day. Everyone sees the same location — compare your name and age accuracy against the whole community.",
      color: "#ffb4a9",
    },
  ],
  vi: [
    {
      icon: "explore",
      name: "Cổ Điển",
      desc: "Các vòng luyện tập không ảnh hưởng đến xếp hạng. Tự do nhận dạng tên và tuổi di sản — hoàn hảo để xây dựng kiến thức về di sản.",
      color: "#a2d1bb",
    },
    {
      icon: "history_edu",
      name: "Xếp Hạng (Biên Niên Sử)",
      desc: "Chế độ cạnh tranh. Đoán tên và tuổi dưới áp lực — đạt ≥ 8 điểm để thăng hạng, ≤ 4 điểm để xuống hạng. Mỗi điểm đều quan trọng trên bảng xếp hạng.",
      color: "#e9c349",
    },
    {
      icon: "groups",
      name: "Nhiệm Vụ Hằng Ngày",
      desc: "Một di sản chung mỗi ngày. Mọi người đều thấy cùng một địa điểm — so sánh độ chính xác về tên và tuổi của bạn với toàn bộ cộng đồng.",
      color: "#ffb4a9",
    },
  ],
  cn: [
    {
      icon: "explore",
      name: "经典模式",
      desc: "无排名压力的练习轮次。自由辨认遗址名称和年龄——是积累遗产知识的最佳方式。",
      color: "#a2d1bb",
    },
    {
      icon: "history_edu",
      name: "排名赛（编年史）",
      desc: "竞技模式。在压力下猜名称和年龄——得分≥8即可晋级，≤4则降级。排行榜上每分都至关重要。",
      color: "#e9c349",
    },
    {
      icon: "groups",
      name: "每日任务",
      desc: "每天一处共享遗产地。所有人看到相同地点——将你对名称和年龄的准确度与整个社区进行比较。",
      color: "#ffb4a9",
    },
  ],
  fr: [
    {
      icon: "explore",
      name: "Classique",
      desc: "Manches d'entraînement sans enjeu de rang. Identifiez librement le nom et l'âge du site — parfait pour développer votre connaissance du patrimoine.",
      color: "#a2d1bb",
    },
    {
      icon: "history_edu",
      name: "Classé (Chroniques)",
      desc: "Mode compétitif. Devinez nom et âge sous pression — score ≥ 8 pour monter, ≤ 4 pour descendre. Chaque point compte dans le classement.",
      color: "#e9c349",
    },
    {
      icon: "groups",
      name: "Quête Quotidienne",
      desc: "Un site patrimonial partagé par jour. Tout le monde voit le même endroit — comparez votre précision sur le nom et l'âge avec toute la communauté.",
      color: "#ffb4a9",
    },
  ],
};

const tips = {
  en: [
    "Study the Academy section before playing — memorizing heritage names is the single biggest score boost you can get.",
    "For age guesses, think in dynasties: Ly–Tran era = ~700–900 years old, Nguyen dynasty = ~150–200 years old, Cham kingdom = 500–1,500+ years old.",
    "Architectural carvings give away the era — lotus motifs often indicate Buddhist temples from the Ly or Tran period.",
    "French colonial buildings (symmetrical facades, arched windows, yellow plaster) are typically 100–130 years old.",
    "If you're unsure of the exact name, type the closest phonetic spelling — the scoring uses similarity matching, so partial matches still earn points.",
    "Use The Archivist chat wisely: ask broad questions first ('What dynasty built this?') before narrowing down ('What province is it in?').",
  ],
  vi: [
    "Học phần Học Viện trước khi chơi — ghi nhớ tên di sản là cách tăng điểm lớn nhất bạn có thể làm.",
    "Để đoán tuổi, hãy nghĩ theo triều đại: thời Lý–Trần ≈ 700–900 năm tuổi, triều Nguyễn ≈ 150–200 năm tuổi, vương quốc Chăm = 500–1.500+ năm tuổi.",
    "Hoa văn chạm khắc tiết lộ thời đại — họa tiết hoa sen thường gặp ở đền chùa Phật giáo thời Lý hoặc Trần.",
    "Các công trình thời Pháp thuộc (mặt đứng đối xứng, cửa sổ vòm, vữa vàng) thường khoảng 100–130 năm tuổi.",
    "Nếu không chắc tên chính xác, hãy gõ cách phát âm gần nhất — hệ thống tính điểm dùng khớp tương đồng, nên câu trả lời gần đúng vẫn ghi điểm.",
    "Dùng chat Học Giả Lưu Trữ thật khôn ngoan: hỏi câu rộng trước ('Triều đại nào xây công trình này?') rồi mới thu hẹp dần ('Nó ở tỉnh nào?').",
  ],
  cn: [
    "先学习学院部分再开始游戏——记住遗产名称是你能获得的最大加分方式。",
    "猜测年龄时，以朝代为参考：李-陈朝时期约700–900年，阮朝约150–200年，占婆王国约500–1500+年。",
    "建筑雕刻可以透露时代——莲花纹饰通常出现在李朝或陈朝的佛教庙宇中。",
    "法国殖民时期建筑（对称立面、拱形窗户、黄色灰泥）通常有100–130年历史。",
    "如果不确定确切名称，输入最接近的音译——评分系统使用相似度匹配，因此部分匹配仍可得分。",
    "善用档案学者聊天：先问宽泛问题（「这是哪个朝代建造的？」），再逐步缩小范围（「它在哪个省？」）。",
  ],
  fr: [
    "Étudiez la section Académie avant de jouer — mémoriser les noms des sites est le meilleur moyen d'augmenter votre score.",
    "Pour les estimations d'âge, pensez en dynasties : époque Ly–Tran = ~700–900 ans, dynastie Nguyen = ~150–200 ans, royaume Cham = 500–1 500+ ans.",
    "Les sculptures architecturales trahissent l'époque — les motifs de lotus indiquent souvent des temples bouddhistes de la période Ly ou Tran.",
    "Les bâtiments coloniaux français (façades symétriques, fenêtres cintrées, plâtre jaune) ont généralement 100–130 ans.",
    "Si vous n'êtes pas sûr du nom exact, tapez l'orthographe phonétique la plus proche — le système de notation utilise la correspondance de similarité, les correspondances partielles rapportent donc des points.",
    "Utilisez judicieusement le chat Archiviste : posez d'abord des questions larges ('Quelle dynastie a construit ceci ?') avant de préciser ('Dans quelle province est-il ?').",
  ],
};

export default function Tutorial() {
  const { lang } = useLang();
  const stepList = steps[lang];
  const modeList = modes[lang];
  const tipList = tips[lang];

  const heading = lang === "cn" ? "游戏规则" : lang === "fr" ? "Comment Jouer" : lang === "en" ? "How to Play" : "Cách Chơi";
  const modesHeading = lang === "cn" ? "游戏模式" : lang === "fr" ? "Modes de Jeu" : lang === "en" ? "Game Modes" : "Chế Độ Chơi";
  const tipsHeading = lang === "cn" ? "学者秘籍" : lang === "fr" ? "Conseils de l'Archiviste" : lang === "en" ? "Archivist Tips" : "Mẹo Từ Học Giả";
  const stepLabel = lang === "cn" ? "步骤" : lang === "fr" ? "Étape" : lang === "en" ? "Step" : "Bước";

  return (
    <div className="min-h-screen bg-[#0e1513] text-[#dde4e0] flex flex-col items-center px-4 sm:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="w-full max-w-3xl mb-12 mt-20">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,61,46,0.3)] border border-[rgba(162,209,187,0.2)] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#e9c349] mr-2 inline-block" />
          <span className="text-[10px] font-bold text-[#a2d1bb] uppercase tracking-[0.2em]">
            {lang === "cn" ? "档案学者指南" : lang === "fr" ? "Le Guide de l'Archiviste" : lang === "en" ? "The Archivist's Guide" : "Cẩm Nang Học Giả"}
          </span>
        </div>
        <h1
          className="font-black text-[#e3e3de] leading-none tracking-[-0.03em] mb-4"
          style={{ fontSize: "clamp(32px, 6vw, 64px)" }}
        >
          {heading}{" "}
          <span className="text-[#e9c349] italic">Heritage Guessr</span>
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#c0c8c3] leading-relaxed max-w-[560px]">
          {lang === "cn"
            ? "一处遗产地被揭晓。你的任务：说出它的名字，猜测它的年龄。以下是掌握档案馆所需了解的一切。"
            : lang === "fr"
            ? "Un site patrimonial est révélé. Votre mission : le nommer et deviner son âge. Voici tout ce que vous devez savoir pour maîtriser l'archive."
            : lang === "en"
            ? "A heritage site is revealed. Your task: name it and guess how old it is. Here's everything you need to know to master the archive."
            : "Một di sản được tiết lộ. Nhiệm vụ của bạn: đặt tên và đoán độ tuổi của nó. Đây là mọi thứ bạn cần biết để làm chủ kho lưu trữ."}
        </p>
      </div>

      {/* Steps */}
      <section className="w-full max-w-3xl mb-14">
        <div className="flex flex-col gap-4">
          {stepList.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 sm:gap-6 p-5 rounded-xl border border-[rgba(65,73,68,0.2)] bg-[#161d1b]"
            >
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(15,61,46,0.5)",
                    border: "1px solid rgba(162,209,187,0.2)",
                  }}
                >
                  <span className="material-symbols-outlined text-[#a2d1bb] text-[20px]">
                    {step.icon}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#e9c349] uppercase tracking-[0.12em]">
                  {stepLabel} {i + 1}
                </span>
              </div>
              <div>
                <h3 className="text-[15px] sm:text-[16px] font-bold text-[#e3e3de] mb-1">
                  {step.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#c0c8c3] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Modes */}
      <section className="w-full max-w-3xl mb-14">
        <h2 className="text-[11px] font-bold text-[#e9c349] uppercase tracking-[0.2em] mb-5">
          {modesHeading}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {modeList.map((mode) => (
            <div
              key={mode.name}
              className="flex-1 p-5 rounded-xl border bg-[#161d1b] flex flex-col gap-3"
              style={{ borderColor: "rgba(65,73,68,0.2)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: mode.color }}
                >
                  {mode.icon}
                </span>
                <span
                  className="text-[13px] font-black uppercase tracking-[0.12em]"
                  style={{ color: mode.color }}
                >
                  {mode.name}
                </span>
              </div>
              <p className="text-[13px] text-[#c0c8c3] leading-relaxed">
                {mode.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="w-full max-w-3xl mb-10">
        <h2 className="text-[11px] font-bold text-[#e9c349] uppercase tracking-[0.2em] mb-5">
          {tipsHeading}
        </h2>
        <div className="bg-[#161d1b] rounded-xl border border-[rgba(65,73,68,0.2)] overflow-hidden">
          {tipList.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-5 py-4"
              style={{
                borderBottom:
                  i < tipList.length - 1
                    ? "1px solid rgba(65,73,68,0.2)"
                    : "none",
              }}
            >
              <span className="text-[#e9c349] font-black text-[12px] mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[13px] sm:text-[14px] text-[#c0c8c3] leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
