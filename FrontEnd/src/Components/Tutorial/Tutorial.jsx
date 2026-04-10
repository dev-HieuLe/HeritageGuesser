import { useLang } from "../../Context/languageContext";

const steps = {
  en: [
    {
      icon: "travel_explore",
      title: "You're dropped somewhere in Vietnam",
      desc: "Each round presents you with a street-level panorama of a real Vietnamese heritage site. Rotate, zoom, and look around to gather clues.",
    },
    {
      icon: "location_searching",
      title: "Pin your guess on the map",
      desc: "Once you have a sense of where you are, click the map in the corner to place your pin. You can move it as many times as you like before confirming.",
    },
    {
      icon: "bolt",
      title: "Confirm and score",
      desc: "Hit Confirm Guess. Your score is based on how close you were — the closer, the more XP you earn. Perfect guesses unlock bonus medals.",
    },
    {
      icon: "history_edu",
      title: "Learn from every location",
      desc: "After each round a heritage card reveals the site's name, province, and a short cultural fact. Build your knowledge round by round.",
    },
    {
      icon: "military_tech",
      title: "Climb the rankings",
      desc: "XP earned from each game adds to your total. Rise through Iron, Bronze, Silver and beyond to claim your place on the Imperial Scholars board.",
    },
    {
      icon: "school",
      title: "Study before you play",
      desc: "Visit the Academy to browse heritage cards and memorize sites before entering a game. Knowledge is your greatest weapon.",
    },
  ],
  vi: [
    {
      icon: "travel_explore",
      title: "Bạn được thả xuống đâu đó ở Việt Nam",
      desc: "Mỗi vòng sẽ hiển thị góc nhìn toàn cảnh thực địa của một địa điểm di sản Việt Nam thực tế. Xoay, thu phóng và quan sát để thu thập manh mối.",
    },
    {
      icon: "location_searching",
      title: "Ghim dự đoán của bạn lên bản đồ",
      desc: "Khi đã có cảm nhận về vị trí, hãy nhấp vào bản đồ ở góc màn hình để đặt ghim. Bạn có thể di chuyển ghim bao nhiêu lần tùy thích trước khi xác nhận.",
    },
    {
      icon: "bolt",
      title: "Xác nhận và tính điểm",
      desc: "Nhấn Xác Nhận Dự Đoán. Điểm của bạn dựa trên độ chính xác — càng gần thì càng nhiều XP. Dự đoán hoàn hảo sẽ mở khóa huy chương bonus.",
    },
    {
      icon: "history_edu",
      title: "Học từ mỗi địa điểm",
      desc: "Sau mỗi vòng, thẻ di sản sẽ tiết lộ tên địa điểm, tỉnh thành và một sự kiện văn hóa ngắn. Tích lũy kiến thức từng vòng một.",
    },
    {
      icon: "military_tech",
      title: "Leo bảng xếp hạng",
      desc: "XP kiếm được từ mỗi ván cộng vào tổng điểm của bạn. Tiến từ Sắt, Đồng, Bạc và cao hơn để giành vị trí trên bảng Học Giả Đế Vương.",
    },
    {
      icon: "school",
      title: "Học trước khi chơi",
      desc: "Vào Học Viện để duyệt thẻ di sản và ghi nhớ các địa điểm trước khi vào game. Kiến thức là vũ khí mạnh nhất của bạn.",
    },
  ],
};

const modes = {
  en: [
    { icon: "explore", name: "Classic", desc: "5 rounds, any site in Vietnam. Recommended for beginners.", color: "#a2d1bb" },
    { icon: "history_edu", name: "Chronicles", desc: "Ranked mode. Face tougher locations and compete for leaderboard points.", color: "#e9c349" },
    { icon: "groups", name: "Daily Quest", desc: "One shared location per day. Compare your score against everyone else.", color: "#ffb4a9" },
  ],
  vi: [
    { icon: "explore", name: "Cổ Điển", desc: "5 vòng, bất kỳ địa điểm nào ở Việt Nam. Khuyến nghị cho người mới.", color: "#a2d1bb" },
    { icon: "history_edu", name: "Biên Niên Sử", desc: "Chế độ xếp hạng. Đối mặt địa điểm khó hơn và tranh tài trên bảng xếp hạng.", color: "#e9c349" },
    { icon: "groups", name: "Nhiệm Vụ Hằng Ngày", desc: "Một địa điểm chung mỗi ngày. So sánh điểm của bạn với mọi người.", color: "#ffb4a9" },
  ],
};

const tips = {
  en: [
    "Look for architectural style — ancient temples differ from French colonial buildings.",
    "Vegetation and terrain reveal the region: limestone karsts = north, red soil = Central Highlands.",
    "Street signs and banners often contain province names — read them carefully.",
    "Coastal towns have distinctive fishing harbour layouts you'll recognise after a few rounds.",
    "The more you play, the faster your instincts become. Repetition builds pattern recognition.",
  ],
  vi: [
    "Chú ý phong cách kiến trúc — đền cổ khác với công trình thời Pháp thuộc.",
    "Thực vật và địa hình tiết lộ vùng: núi đá vôi = miền Bắc, đất đỏ = Tây Nguyên.",
    "Biển hiệu và băng rôn thường chứa tên tỉnh — hãy đọc kỹ.",
    "Các thị trấn ven biển có bố cục cảng cá đặc trưng mà bạn sẽ nhận ra sau vài vòng.",
    "Càng chơi nhiều, trực giác của bạn càng nhanh nhạy. Lặp lại giúp xây dựng nhận dạng hình mẫu.",
  ],
};

export default function Tutorial() {
  const { lang } = useLang();
  const stepList = steps[lang];
  const modeList = modes[lang];
  const tipList = tips[lang];

  const heading = lang === "en" ? "How to Play" : "Cách Chơi";
  const modesHeading = lang === "en" ? "Game Modes" : "Chế Độ Chơi";
  const tipsHeading = lang === "en" ? "Archivist Tips" : "Mẹo Từ Học Giả";
  const stepLabel = lang === "en" ? "Step" : "Bước";

  return (
    <div className="min-h-screen bg-[#0e1513] text-[#dde4e0] flex flex-col items-center px-4 sm:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="w-full max-w-3xl mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,61,46,0.3)] border border-[rgba(162,209,187,0.2)] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#e9c349] mr-2 inline-block" />
          <span className="text-[10px] font-bold text-[#a2d1bb] uppercase tracking-[0.2em]">
            {lang === "en" ? "The Archivist's Guide" : "Cẩm Nang Học Giả"}
          </span>
        </div>
        <h1
          className="font-black text-[#e3e3de] leading-none tracking-[-0.03em] mb-4"
          style={{ fontSize: "clamp(32px, 6vw, 64px)" }}
        >
          {heading}{" "}
          <span className="text-[#e9c349] italic">Heritage Guesser</span>
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#c0c8c3] leading-relaxed max-w-[560px]">
          {lang === "en"
            ? "You'll be placed somewhere in Vietnam. Your task: figure out exactly where. Here's everything you need to know."
            : "Bạn sẽ được đặt ở đâu đó tại Việt Nam. Nhiệm vụ của bạn: tìm ra chính xác vị trí đó. Đây là mọi thứ bạn cần biết."}
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
                  style={{ backgroundColor: "rgba(15,61,46,0.5)", border: "1px solid rgba(162,209,187,0.2)" }}
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
              <p className="text-[13px] text-[#c0c8c3] leading-relaxed">{mode.desc}</p>
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
                borderBottom: i < tipList.length - 1 ? "1px solid rgba(65,73,68,0.2)" : "none",
              }}
            >
              <span className="text-[#e9c349] font-black text-[12px] mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[13px] sm:text-[14px] text-[#c0c8c3] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
