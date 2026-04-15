import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locationIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="display:flex;justify-content:center;align-items:center;position:relative;">
      <div style="
        width:14px;height:14px;
        background:#bb0308;
        border-radius:50%;
        border:2px solid #ffb4a9;
        box-shadow:0 0 12px rgba(187,3,8,0.6);
        position:relative;
      ">
        <div style="
          position:absolute;inset:-4px;
          background:rgba(187,3,8,0.25);
          border-radius:50%;
          animation:pulse 2s infinite;
        "></div>
      </div>
    </div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const locations = [
  {
    name: "Vịnh Hạ Long",
    alternateNames: ["Hạ Long Bay", "Halong Bay"],
    yearLabel:
      "Danh thắng tự nhiên; không có năm xây dựng duy nhất (được xếp hạng danh lam cấp quốc gia năm 1962)",
    yearStart: 1962,
    yearEnd: null,
    description:
      "Vịnh Hạ Long là một trong những biểu tượng tự nhiên nổi bật nhất của Việt Nam, nổi tiếng với hàng nghìn đảo đá vôi, tháp karst và hang động hình thành qua quá trình địa chất kéo dài hàng trăm triệu năm. Không chỉ đẹp về cảnh quan, khu vực này còn chứa dấu tích cư trú của con người tiền sử qua các lớp văn hóa Soi Nhụ, Cái Bèo và Hạ Long, cho thấy mối liên hệ rất sớm giữa con người với vùng biển đảo Đông Bắc. Trong ký ức lịch sử Việt Nam, Hạ Long không chỉ là thắng cảnh mà còn là không gian gắn với tuyến giao thương cổ vùng Vân Đồn và nhiều dấu tích văn hóa ven biển. Tên gọi “Hạ Long” gắn với huyền thoại rồng mẹ hạ xuống giúp dân chống giặc, vì vậy nơi đây vừa có giá trị địa chất, vừa có chiều sâu huyền thoại và bản sắc dân tộc. Việc được UNESCO ghi danh và sau đó mở rộng hồ sơ khẳng định Hạ Long là một di sản tiêu biểu không chỉ của Việt Nam mà còn của thế giới.",
    region: "North",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=20.9,107.2",
    position: [20.9, 107.2],
    lat: 20.9,
    lng: 107.2,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Ha_Long_Bay_in_2019.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Văn Miếu – Quốc Tử Giám",
    alternateNames: ["Văn Miếu", "Temple of Literature", "Temple of Confucius"],
    yearLabel: "1070",
    yearStart: 1070,
    yearEnd: null,
    description:
      "Văn Miếu – Quốc Tử Giám là biểu tượng tập trung nhất của truyền thống hiếu học, tôn sư trọng đạo và tinh thần trọng dụng hiền tài của người Việt. Di tích được dựng năm 1070 dưới thời Lý Thánh Tông, sau đó Quốc Tử Giám được mở năm 1076, trở thành trung tâm giáo dục cao cấp sớm nhất của nhà nước Đại Việt. Giá trị lớn nhất của Văn Miếu không chỉ nằm ở kiến trúc hay bia đá tiến sĩ, mà còn ở vai trò của nơi này trong việc hình thành bộ máy quan lại, đời sống học thuật và tư tưởng Nho học trong nhiều thế kỷ. Các khoa thi, các bậc đại khoa và hệ thống bia tiến sĩ đã biến Văn Miếu thành ký ức vật chất của cả một nền khoa bảng. Trong lịch sử văn hóa Việt Nam, rất ít địa điểm vừa là không gian thờ tự, vừa là trường học, vừa là biểu tượng quốc gia rõ nét như Văn Miếu. Vì vậy, đây là một địa danh tiêu biểu để giới thiệu bản sắc trí tuệ và nền văn hiến lâu đời của Việt Nam.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=21.02861111,105.83555556",
    position: [21.028611, 105.835556],
    lat: 21.028611,
    lng: 105.835556,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Hanoi_Temple_of_Literature_%28cropped%29.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Hoàng thành Thăng Long",
    alternateNames: [
      "Imperial Citadel of Thăng Long",
      "Central Sector of the Imperial Citadel of Thăng Long – Hanoi",
      "Hoàng thành Thăng Long",
    ],
    yearLabel: "1010-1011",
    yearStart: 1010,
    yearEnd: 1011,
    description:
      "Hoàng thành Thăng Long là trung tâm quyền lực chính trị liên tục trong nhiều thế kỷ của quốc gia Đại Việt và Việt Nam phong kiến, bắt đầu từ khi Lý Thái Tổ dời đô ra Thăng Long năm 1010. Đây không chỉ là nơi ở và làm việc của triều đình mà còn là không gian kết tinh của các lớp lịch sử Lý, Trần, Lê và Nguyễn. Giá trị đặc biệt của di tích nằm ở tính liên tục hiếm có của một trung tâm quyền lực kéo dài suốt gần một thiên niên kỷ, đồng thời phản ánh rõ sự giao thoa giữa truyền thống bản địa với ảnh hưởng khu vực Đông Á trong quy hoạch đô thành, kiến trúc cung điện và đời sống cung đình. Nhiều phần kiến trúc xưa đã bị phá hủy, nhất là trong thời thuộc địa, nhưng các cuộc khai quật khảo cổ học hiện đại đã cho thấy chiều sâu lịch sử đặc biệt của khu vực này. Vì vậy, Hoàng thành Thăng Long không chỉ là di tích của Hà Nội mà là biểu tượng của tiến trình hình thành nhà nước và bản sắc chính trị Việt Nam.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=21.03944444,105.83722222",
    position: [21.039444, 105.837222],
    lat: 21.039444,
    lng: 105.837222,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Lichsuhanoimoi.png",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Quần thể danh thắng Tràng An",
    alternateNames: [
      "Tràng An Scenic Landscape Complex",
      "Trang An Landscape Complex",
      "Quần thể danh thắng Tràng An",
    ],
    yearLabel:
      "Quần thể tự nhiên-văn hóa; không có năm xây dựng duy nhất (UNESCO ghi danh năm 2014)",
    yearStart: 2014,
    yearEnd: null,
    description:
      "Tràng An là quần thể tiêu biểu cho kiểu di sản hỗn hợp, nơi cảnh quan karst ngập nước, hệ thống hang xuyên thủy, di tích khảo cổ và không gian lịch sử cố đô cùng hội tụ trong một chỉnh thể hiếm có. Giá trị nổi bật của Tràng An nằm ở việc nó không phải một điểm đơn lẻ, mà là mạng lưới gồm núi đá vôi, sông ngòi, hang động, đền phủ và các dấu tích cư trú cổ của con người. Nằm gần Hoa Lư, khu vực này còn gắn với thời kỳ đầu của nhà nước phong kiến tập quyền Việt Nam, khi Hoa Lư giữ vai trò kinh đô thế kỷ X. Vì vậy, Tràng An mang đồng thời hai tầng ý nghĩa: một mặt là thắng cảnh tự nhiên đặc sắc của vùng châu thổ Bắc Bộ, mặt khác là không gian lịch sử của giai đoạn dựng nước và định hình quốc gia độc lập. Việc UNESCO ghi danh Tràng An như di sản hỗn hợp đầu tiên của Việt Nam nhấn mạnh rằng nơi đây không chỉ đẹp về cảnh quan, mà còn kể một câu chuyện dài về con người, môi trường và quyền lực lịch sử.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.25667,105.89639",
    position: [20.25667, 105.89639],
    lat: 20.25667,
    lng: 105.89639,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Muaxuantamcoc.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Hồ Hoàn Kiếm – Đền Ngọc Sơn",
    alternateNames: ["Hoàn Kiếm Lake", "Sword Lake", "Hồ Gươm", "Tả Vọng Lake"],
    yearLabel:
      "Hồ là thắng cảnh tự nhiên; đền Ngọc Sơn có gốc thế kỷ 18, tu sửa lớn năm 1864",
    yearStart: 1864,
    yearEnd: null,
    description:
      "Hồ Hoàn Kiếm là địa danh mang sức biểu tượng đặc biệt của Hà Nội và của cả trí nhớ lịch sử – huyền thoại Việt Nam. Giá trị nổi bật của địa danh này không nằm ở quy mô lớn, mà ở mật độ biểu tượng dày đặc: hồ nước, Tháp Rùa, cầu Thê Húc, đền Ngọc Sơn và câu chuyện vua Lê Lợi trả gươm cho thần Kim Quy sau khi đánh thắng quân Minh. Chính truyền thuyết ấy đã làm cho hồ trở thành nơi giao nhau giữa lịch sử chống ngoại xâm và tưởng tượng văn hóa dân gian. Đền Ngọc Sơn trên đảo Ngọc thờ Trần Hưng Đạo, Văn Xương và gắn với lần tu sửa của Nguyễn Văn Siêu vào thế kỷ XIX, nhờ đó bổ sung thêm tầng nghĩa về học thuật, khí phách và tinh thần giữ nước. Ở bình diện đô thị, Hồ Hoàn Kiếm là trái tim của Hà Nội hiện đại; ở bình diện văn hóa, đây là một “biểu tượng nén” của thủ đô: nhỏ về diện tích nhưng lớn về ký ức, truyền thuyết và ý nghĩa quốc gia.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=21.02889,105.85250",
    position: [21.02889, 105.8525],
    lat: 21.02889,
    lng: 105.8525,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Thap_Rua.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Hoàng thành Huế (Đại Nội Huế)",
    alternateNames: ["Imperial City of Huế", "Imperial Palace", "Đại Nội"],
    yearLabel: "1804 (mở rộng lớn năm 1833)",
    yearStart: 1804,
    yearEnd: 1833,
    description:
      "Hoàng thành Huế là trung tâm quyền lực của triều Nguyễn và là biểu tượng vật chất rõ nét nhất của nhà nước quân chủ Việt Nam ở thế kỷ XIX – nửa đầu thế kỷ XX. Công trình được Gia Long khởi dựng sau khi thống nhất đất nước, rồi tiếp tục được mở rộng, hoàn thiện dưới các đời vua sau. Không gian này không chỉ bao gồm tường thành, cổng Ngọ Môn hay điện Thái Hòa, mà còn đại diện cho trật tự chính trị, nghi lễ cung đình, quan chế và mỹ thuật triều Nguyễn. Từ đây, Huế đã trở thành kinh đô của Việt Nam cho đến năm 1945. Di tích cũng gắn với những biến động lớn: thời Pháp thuộc, sự suy tàn của chế độ quân chủ, và đặc biệt là những hư hại nặng nề trong các cuộc chiến tranh hiện đại. Chính vì vậy, Đại Nội Huế vừa thể hiện đỉnh cao của kiến trúc cung đình Việt Nam, vừa mang dấu ấn rõ rệt của mất mát lịch sử. Đây là địa danh đặc biệt quan trọng nếu muốn hiểu Việt Nam từ góc nhìn vương triều, nghi lễ và ký ức quốc gia.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16.46972222,107.57777778",
    position: [16.469722, 107.577778],
    lat: 16.469722,
    lng: 107.577778,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Hu%E1%BA%BF_%282024%29_-_Meridian_Gate_-_Ng%E1%BB%8D_M%C3%B4n_%28Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF%29_-_img_02.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Phố cổ Hội An",
    alternateNames: ["Hội An Old Town", "Hoi An Ancient Town", "Phố cổ Hội An"],
    yearLabel: "Thế kỷ 16",
    yearStart: null,
    yearEnd: null,
    description:
      "Phố cổ Hội An là một trong những đô thị cổ được bảo tồn tốt nhất ở Đông Nam Á, và cũng là nơi cho thấy rõ nhất vai trò của Việt Nam trên các mạng lưới giao thương biển khu vực từ thế kỷ XV đến XIX. Tại đây, các cộng đồng Việt, Hoa, Nhật và sau này là phương Tây cùng để lại dấu ấn trong cấu trúc phố, hội quán, nhà ở, chùa cầu, tín ngưỡng và lối sống thương cảng. Chính sự giao thoa đó làm cho Hội An vừa rất Việt Nam, vừa mang tính quốc tế sớm. Lịch sử của phố cổ gắn với sự thịnh đạt của thương mại trên sông Thu Bồn và con đường hàng hải châu Á; sau đó, khi vai trò cảng suy giảm vào thế kỷ XIX, đô thị này lại được “đóng băng” một cách may mắn, giúp nhiều lớp kiến trúc và không gian sống cổ truyền còn tồn tại đến nay. Hội An vì thế không chỉ là nơi đẹp để du lịch, mà còn là một tư liệu sống về kinh tế biển, giao lưu văn hóa và lịch sử đô thị của Việt Nam.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=15.88333,108.33333",
    position: [15.88333, 108.33333],
    lat: 15.88333,
    lng: 108.33333,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/27/10549-Hoi-An_%2837621348460%29.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Thánh địa Mỹ Sơn",
    alternateNames: ["Mỹ Sơn", "My Son Sanctuary", "Thánh địa Mỹ Sơn"],
    yearLabel: "Từ thế kỷ 4 đến thế kỷ 13",
    yearStart: null,
    yearEnd: null,
    description:
      "Thánh địa Mỹ Sơn là quần thể đền tháp Chăm đặc sắc nhất còn lại ở Việt Nam, đồng thời là chứng tích quan trọng của vương quốc Champa và ảnh hưởng của Ấn Độ giáo trong khu vực. Các đền tháp được xây dựng và bổ sung qua nhiều thế kỷ, chủ yếu để thờ Shiva, phản ánh tôn giáo, quyền lực vương triều và nghệ thuật kiến trúc của người Chăm. Mỹ Sơn đặc biệt ở chỗ đây không phải một công trình đơn lẻ, mà là một quần thể nghi lễ nằm trong thung lũng được bao bọc bởi núi, tạo ra một cảnh quan thiêng có chủ đích. Trong lịch sử Việt Nam hiện đại, Mỹ Sơn còn gắn với chiến tranh, khi nhiều công trình bị hư hại nặng bởi bom đạn. Chính điều này làm cho di tích mang hai lớp ý nghĩa song song: một mặt là ký ức rực rỡ của nền văn minh Champa, mặt khác là chứng nhân cho mất mát văn hóa trong chiến tranh thế kỷ XX. Vì vậy, Mỹ Sơn là địa danh không thể thiếu nếu muốn giới thiệu chiều sâu đa văn hóa của lịch sử Việt Nam.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=15.76666667,108.11666667",
    position: [15.766667, 108.116667],
    lat: 15.766667,
    lng: 108.116667,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/07/2024_-_M%E1%BB%B9_S%C6%A1n_Group_B%2C_C_and_D_-_img_23.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Vườn quốc gia Phong Nha – Kẻ Bàng",
    alternateNames: [
      "Phong Nha–Kẻ Bàng National Park",
      "Vườn quốc gia Phong Nha – Kẻ Bàng",
    ],
    yearLabel: "2001 (thành lập vườn quốc gia)",
    yearStart: 2001,
    yearEnd: null,
    description:
      "Phong Nha – Kẻ Bàng là một trong những vùng karst và hang động quan trọng nhất châu Á, nổi bật bởi hệ thống địa mạo đá vôi, sông ngầm, hang động và tính đa dạng sinh học cao. Giá trị của khu vực này không chỉ nằm ở vẻ đẹp kỳ vĩ mà còn ở ý nghĩa khoa học: nó giúp nghiên cứu quá trình hình thành karst, sự tiến hóa của hang động và mối quan hệ giữa địa chất với hệ sinh thái. Nơi đây cũng gắn với lịch sử chiến tranh hiện đại của Việt Nam, đặc biệt trên các tuyến giao thông chiến lược dọc miền Trung, nên ngoài giá trị thiên nhiên còn có dấu ấn ký ức thời chiến. Việc được thành lập thành vườn quốc gia rồi được UNESCO công nhận cho thấy Phong Nha – Kẻ Bàng là một trong những không gian thiên nhiên tiêu biểu nhất của Việt Nam ở tầm quốc tế. Khi nhắc đến địa danh này, người ta nghĩ đồng thời đến cảnh quan, khoa học, mạo hiểm và bảo tồn. Đây là một đại diện rất mạnh cho hình ảnh Việt Nam như một đất nước có thiên nhiên sâu, rộng và chưa bị khai thác cạn kiệt về mặt giá trị khám phá.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=17.53722,106.15139",
    position: [17.53722, 106.15139],
    lat: 17.53722,
    lng: 106.15139,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/Phongnhakebang6.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Hang Sơn Đoòng",
    alternateNames: ["Hang Sơn Đoòng", "Sơn Đoòng Cave", "Son Doong Cave"],
    yearLabel: "1990 (Hồ Khanh phát hiện; khảo sát khoa học 2009)",
    yearStart: 1990,
    yearEnd: 2009,
    description:
      "Hang Sơn Đoòng là một trong những địa danh khiến hình ảnh thiên nhiên Việt Nam bứt lên mạnh mẽ trên bản đồ thế giới, bởi đây được xem là hang động tự nhiên lớn nhất từng được biết đến. Điều làm Sơn Đoòng trở nên đặc biệt không chỉ là kích thước khổng lồ mà còn là cấu trúc gần như một thế giới riêng: sông ngầm, các doline sụt trần tạo ánh sáng, thảm thực vật phát triển ngay trong lòng hang và những khối thạch nhũ – măng đá có kích thước ngoại lệ. Câu chuyện phát hiện hang cũng rất giàu tính biểu tượng: một người dân địa phương tìm ra cửa hang năm 1990, rồi sau đó đoàn thám hiểm Anh – Việt khảo sát năm 2009 mới công bố đầy đủ giá trị của nó. Từ đó, Sơn Đoòng trở thành biểu tượng của khám phá, bảo tồn và du lịch giới hạn tác động. Trong bộ nhận diện các địa danh Việt Nam, Sơn Đoòng đại diện cho sức mạnh của thiên nhiên nguyên sơ và cho thấy Việt Nam vẫn còn những không gian có thể làm kinh ngạc cả cộng đồng khoa học lẫn công chúng quốc tế.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=17.45694,106.28750",
    position: [17.45694, 106.2875],
    lat: 17.45694,
    lng: 106.2875,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Son_Doong_Cave_5.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Dinh Độc Lập",
    alternateNames: [
      "Independence Palace",
      "Reunification Hall",
      "Hội trường Thống Nhất",
    ],
    yearLabel:
      "1962-1966 (tòa nhà hiện nay; tiền thân Norodom Palace 1868-1871)",
    yearStart: 1962,
    yearEnd: 1966,
    description:
      "Dinh Độc Lập là một trong những di tích có ý nghĩa chính trị – lịch sử mạnh nhất của Việt Nam hiện đại. Tòa nhà hiện nay được xây sau vụ ném bom năm 1962, do kiến trúc sư Ngô Viết Thụ thiết kế, vừa mang tinh thần hiện đại vừa cố gắng đưa yếu tố biểu tượng phương Đông vào kiến trúc. Tuy nhiên, giá trị lớn nhất của Dinh không chỉ nằm ở thiết kế mà ở vai trò của nó như một sân khấu trung tâm của lịch sử miền Nam Việt Nam trước 1975. Đây từng là nơi ở và làm việc của chính quyền Việt Nam Cộng hòa, và cũng chính là nơi đánh dấu sự kiện 30/4/1975 khi xe tăng của lực lượng giải phóng tiến vào, trở thành hình ảnh kết thúc chiến tranh và mở đầu cho thời kỳ thống nhất đất nước. Dinh Độc Lập vì vậy là di tích hiếm hoi mà gần như mọi người Việt đều gắn với một mốc lịch sử quốc gia rất cụ thể. Nó vừa là kiến trúc, vừa là bảo tàng chính trị sống của thế kỷ XX Việt Nam.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.77694444,106.69527778",
    position: [10.776944, 106.695278],
    lat: 10.776944,
    lng: 106.695278,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/20190923_Independence_Palace-10.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Địa đạo Củ Chi",
    alternateNames: ["Củ Chi tunnels", "Địa đạo Củ Chi"],
    yearLabel: "1946-1968",
    yearStart: 1946,
    yearEnd: 1968,
    description:
      "Địa đạo Củ Chi là biểu tượng đặc biệt của chiến tranh nhân dân và sức chịu đựng phi thường trong lịch sử kháng chiến hiện đại của Việt Nam. Hệ thống đường hầm này được người dân và lực lượng kháng chiến đào, mở rộng và sử dụng trong thời gian dài, đặc biệt từ kháng chiến chống Pháp đến chiến tranh Việt Nam. Điều khiến Củ Chi trở thành địa danh “đặc biệt” không chỉ là quy mô mạng lưới hầm ngầm, mà là cách nó phản ánh chiến lược chiến tranh bất đối xứng: sống, cơ động, liên lạc, cất giấu lương thực, bệnh xá, kho vũ khí và chỉ huy đều có thể diễn ra dưới lòng đất. Nơi đây cũng gắn trực tiếp với các chiến dịch quân sự lớn và đặc biệt là vai trò căn cứ của lực lượng cách mạng trong dịp Tết Mậu Thân 1968. Khi nhìn về Củ Chi, người ta không chỉ thấy một di tích chiến tranh, mà còn thấy khả năng thích nghi và tổ chức của con người Việt Nam trong hoàn cảnh cực hạn. Đó là lý do địa đạo Củ Chi luôn được xem là một trong những biểu tượng lịch sử mạnh nhất của miền Nam Việt Nam.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=11.06083333,106.52861111",
    position: [11.060833, 106.528611],
    lat: 11.060833,
    lng: 106.528611,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/14/C%E1%BB%A7_Chi_tunnels_entrance.JPG",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Chợ Bến Thành",
    alternateNames: [
      "Bến Thành Market",
      "Chợ Bến Thành",
      "Chợ Mới",
      "New Market",
    ],
    yearLabel: "1912-1914",
    yearStart: 1912,
    yearEnd: 1914,
    description:
      "Chợ Bến Thành là một trong những hình ảnh đô thị nhận diện rõ nhất của Thành phố Hồ Chí Minh và của miền Nam Việt Nam. Tháp đồng hồ ở cổng chính gần như đã trở thành biểu tượng thị giác của Sài Gòn trong suốt hơn một thế kỷ. Tuy nhiên, chợ không chỉ là biểu tượng du lịch; nó còn là nơi phản ánh lịch sử phát triển của đô thị thương mại lớn nhất nước, nơi giao cắt giữa buôn bán truyền thống, tiêu dùng hiện đại và giao lưu văn hóa hàng ngày. Là một trong những công trình còn tồn tại sớm của thành phố, Bến Thành gợi nhớ rõ nét thời kỳ quy hoạch đô thị dưới ảnh hưởng Pháp, rồi tiếp tục sống qua nhiều biến động của Sài Gòn – TP.HCM. Ở khía cạnh văn hóa, chợ là không gian rất “Việt Nam”: đông đúc, đa dạng hàng hóa, đậm chất thương hồ và gắn liền với nhịp sống thường nhật. Nếu cần một địa danh vừa có sức nhận diện cao, vừa đại diện cho tinh thần giao thương sôi động của miền Nam, chợ Bến Thành là lựa chọn rất tiêu biểu.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.77252069,106.69801918",
    position: [10.772521, 106.698019],
    lat: 10.772521,
    lng: 106.698019,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Bến Nhà Rồng",
    alternateNames: [
      "Dragon House",
      "Dragon House Wharf",
      "Dragon House Harbor",
      "Bảo tàng Hồ Chí Minh – Chi nhánh TP.HCM",
    ],
    yearLabel: "1862-1863 (khánh thành 1864)",
    yearStart: 1862,
    yearEnd: 1863,
    description:
      "Bến Nhà Rồng có ý nghĩa lịch sử đặc biệt bởi đây là địa điểm gắn với sự kiện Nguyễn Tất Thành rời Việt Nam năm 1911 để bắt đầu hành trình tìm đường cứu nước. Chính mốc này khiến địa danh vượt ra ngoài ý nghĩa một công trình cảng vụ hay kiến trúc thuộc địa đơn thuần, để trở thành một biểu tượng chính trị – lịch sử của Việt Nam hiện đại. Về mặt kiến trúc, công trình mang dấu ấn xây dựng thời Pháp ở khu bến cảng Sài Gòn; về mặt ký ức quốc gia, nó gắn với bước khởi đầu của hành trình Hồ Chí Minh trên trường quốc tế. Hiện nay nơi đây là một bảo tàng, nhưng giá trị lớn nhất của Bến Nhà Rồng vẫn nằm ở sức gợi nhớ: từ một bến cảng thương mại đã trở thành “mốc xuất phát” trong câu chuyện cách mạng Việt Nam thế kỷ XX. Vì vậy, nếu cần chọn một địa danh ở miền Nam vừa có tính nhận diện, vừa gắn trực tiếp với một bước ngoặt quốc gia, Bến Nhà Rồng là lựa chọn rất nổi bật.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.7682,106.7068",
    position: [10.7682, 106.7068],
    lat: 10.7682,
    lng: 106.7068,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Ho_Chi_Minh_Museum%2C_Saigon_%281%29.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Nhà thờ Đức Bà Sài Gòn",
    alternateNames: [
      "Notre-Dame Cathedral Basilica of Saigon",
      "Nhà thờ Đức Bà Sài Gòn",
      "Cathedral Basilica of Our Lady of the Immaculate Conception",
    ],
    yearLabel: "1877-1880",
    yearStart: 1877,
    yearEnd: 1880,
    description:
      "Nhà thờ Đức Bà Sài Gòn là một trong những công trình kiến trúc thuộc địa nổi bật nhất còn lại ở Việt Nam, đồng thời là biểu tượng quen thuộc của trung tâm Sài Gòn – TP.HCM. Công trình được xây cuối thế kỷ XIX bằng vật liệu nhập từ Pháp, thể hiện rõ phong cách Romanesque và dấu ấn quy hoạch đô thị thuộc địa. Tuy nhiên, nhà thờ không chỉ có giá trị kiến trúc. Trong lịch sử thành phố, nơi đây là điểm mốc quan trọng của khu trung tâm hành chính – văn hóa, đứng cạnh các công trình khác như Bưu điện Trung tâm và tạo thành một không gian ký ức đô thị rất đặc trưng. Từ sau năm 1959, tên gọi “Notre-Dame” gắn với việc đặt tượng Đức Mẹ Hòa Bình trước quảng trường, làm công trình càng có vị trí nổi bật trong đời sống tôn giáo lẫn hình ảnh thành phố. Nếu Dinh Độc Lập đại diện cho lịch sử chính trị hiện đại, thì Nhà thờ Đức Bà đại diện cho lớp ký ức đô thị và kiến trúc quốc tế đã trở thành một phần của bản sắc Sài Gòn.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.77972222,106.69916667",
    position: [10.779722, 106.699167],
    lat: 10.779722,
    lng: 106.699167,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_03.JPG",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Cố đô Hoa Lư",
    alternateNames: ["Hoa Lư Ancient Capital", "Cố đô Hoa Lư"],
    yearLabel: "968",
    yearStart: 968,
    yearEnd: null,
    description:
      "Hoa Lư là kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam thời Đinh – Tiền Lê, giữ vai trò trung tâm chính trị từ năm 968 đến 1009. Nơi đây gắn trực tiếp với Đinh Bộ Lĩnh, quá trình dẹp loạn 12 sứ quân, thống nhất đất nước và đặt nền móng cho quốc gia Đại Cồ Việt độc lập. Sau đó, dưới thời Tiền Lê, Hoa Lư tiếp tục là trung tâm quyền lực trước khi Lý Thái Tổ dời đô ra Thăng Long năm 1010. Giá trị của Hoa Lư nằm ở chỗ đây không chỉ là một di tích kiến trúc hay lễ hội, mà là ký ức vật chất của giai đoạn dựng quốc gia độc lập đầu tiên sau nhiều thế kỷ Bắc thuộc. Cảnh quan núi đá vôi, đền vua Đinh, đền vua Lê và không gian lịch sử bao quanh khiến Hoa Lư trở thành một địa danh rất Việt Nam: vừa hùng cường về chính trị, vừa gắn chặt với địa thế tự nhiên đặc sắc của vùng Ninh Bình.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.28611111,105.90666667",
    position: [20.286111, 105.906667],
    lat: 20.286111,
    lng: 105.906667,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Codohoalu2010k5.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Chùa Bái Đính",
    alternateNames: [
      "Bái Đính Pagoda",
      "Bái Đính Temple",
      "Bái Đính Pagoda Spiritual and Cultural Complex",
    ],
    yearLabel: "2003 (quần thể mới; trên nền chùa cổ)",
    yearStart: 2003,
    yearEnd: null,
    description:
      "Chùa Bái Đính là một trong những quần thể Phật giáo lớn và có sức nhận diện mạnh nhất ở miền Bắc Việt Nam hiện nay. Giá trị đặc biệt của địa danh này nằm ở sự kết hợp giữa chùa cổ gắn với truyền thống tín ngưỡng lâu đời và quần thể mới được xây dựng quy mô lớn từ đầu thế kỷ XXI, biến nơi đây thành trung tâm hành hương quan trọng. Bái Đính nằm gần Hoa Lư và Tràng An nên không gian văn hóa của nó không tách rời vùng đất cố đô. Khi nhìn vào Bái Đính, có thể thấy rõ cách Việt Nam đương đại tiếp nối truyền thống tôn giáo – văn hóa trong một quy mô mới, vừa phục vụ hành hương, vừa tạo điểm nhấn du lịch tâm linh. Đây là một trong những địa danh tiêu biểu cho xu hướng di sản sống, nơi tín ngưỡng, cảnh quan và du lịch giao thoa rất rõ nét.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.27694444,105.86277778",
    position: [20.276944, 105.862778],
    lat: 20.276944,
    lng: 105.862778,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/M%E1%BB%98T_G%C3%93C_CH%C3%99A_B%C3%81I_%C4%90%C3%8CNH_-_panoramio.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Yên Tử",
    alternateNames: [
      "Yên Tử Mountain",
      "Núi Yên Tử",
      "Khu di tích danh thắng Yên Tử",
    ],
    yearLabel:
      "1299 (mốc gắn với việc Trần Nhân Tông sáng lập Thiền phái Trúc Lâm tại Yên Tử)",
    yearStart: 1299,
    yearEnd: null,
    description:
      "Yên Tử là một trong những không gian thiêng quan trọng nhất của Phật giáo Việt Nam, gắn liền với vua Trần Nhân Tông sau khi lãnh đạo Đại Việt chiến thắng quân Nguyên – Mông rồi xuất gia tu hành. Năm 1299, ông sáng lập Thiền phái Trúc Lâm Yên Tử, được xem là dòng thiền bản địa tiêu biểu nhất của Việt Nam. Vì vậy, Yên Tử không chỉ là núi non hay quần thể chùa tháp, mà là biểu tượng của sự kết hợp giữa trí tuệ, tinh thần dân tộc và đời sống tu hành. Các chùa, am, tháp, đường hành hương và đỉnh núi tạo nên một cảnh quan đặc biệt, nơi lịch sử vương triều và lịch sử tôn giáo giao nhau. Trong danh sách các địa danh tiêu biểu của Việt Nam, Yên Tử rất đặc sắc vì nó phản ánh một khía cạnh rất riêng của văn hóa Việt: chiến thắng, buông bỏ quyền lực, rồi chuyển hóa thành tư tưởng và di sản tinh thần.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=21.1617,106.7171",
    position: [21.1617, 106.7171],
    lat: 21.1617,
    lng: 106.7171,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/31/N%C3%BAi_Y%C3%AAn_T%E1%BB%AD.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Chùa Hương",
    alternateNames: ["Hương Temple", "Perfume Pagoda", "Hương Sơn"],
    yearLabel: "Cuối thế kỷ 17",
    yearStart: null,
    yearEnd: null,
    description:
      "Chùa Hương là quần thể tín ngưỡng – cảnh quan nổi tiếng bậc nhất miền Bắc, nơi yếu tố hành hương, lễ hội, sông nước và hang động hòa làm một. Trung tâm của quần thể là khu Hương Tích, nơi du khách vừa đi đò, vừa leo núi, vừa bước dần vào không gian linh thiêng. Chùa Hương nổi bật không chỉ vì đẹp mà còn vì sức sống lễ hội rất mạnh: đây là một trong những mùa hành hương lớn nhất Việt Nam, thu hút đông đảo người dân nhiều thế hệ. Về lịch sử, quần thể chính được hình thành từ cuối thế kỷ XVII, bị tàn phá trong chiến tranh rồi được phục dựng về sau. Chùa Hương vì vậy là ví dụ rất rõ cho một dạng địa danh sống của Việt Nam: không chỉ là di tích tĩnh, mà là nơi tín ngưỡng dân gian, Phật giáo và văn hóa lễ hội vẫn tiếp tục vận động trong hiện tại.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.62,105.75",
    position: [20.62, 105.75],
    lat: 20.62,
    lng: 105.75,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/de/Thi%C3%AAn_Tr%C3%B9_Pagoda.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Cột cờ Lũng Cú",
    alternateNames: ["Lũng Cú Flag Tower", "Lung Cu Flag Tower"],
    yearLabel:
      "1887 (mốc trùng tu lớn; công trình hiện nay được hoàn thiện lại vào 2010)",
    yearStart: 1887,
    yearEnd: 2010,
    description:
      "Cột cờ Lũng Cú là một trong những biểu tượng mạnh nhất về chủ quyền lãnh thổ Việt Nam ở vùng cực Bắc. Công trình nằm trên đỉnh núi Rồng, gắn với ý niệm địa đầu Tổ quốc, nên giá trị của nó vượt xa bản thân kiến trúc. Lũng Cú không chỉ là nơi để ngắm cảnh hay check-in, mà còn là mốc ký ức quốc gia, nơi lá cờ Việt Nam được đặt vào một vị trí biểu tượng đặc biệt. Theo các tư liệu phổ biến, cột cờ đã trải qua nhiều lần xây dựng, trùng tu và mở rộng, trong đó mốc 1887 và công trình hiện đại năm 2010 thường được nhắc tới nhiều nhất. Đây là địa danh tiêu biểu cho nhóm biểu tượng chủ quyền của Việt Nam, rất khác với các di tích vương triều hay thắng cảnh tự nhiên, nhưng vẫn đặc biệt và rất đặc trưng.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=23.36361111,105.31611111",
    position: [23.363611, 105.316111],
    lat: 23.363611,
    lng: 105.316111,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lung_Cu_Flag_Tower.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Ruộng bậc thang Mù Cang Chải",
    alternateNames: [
      "Mù Cang Chải terraced fields",
      "Ruộng bậc thang Mù Cang Chải",
    ],
    yearLabel:
      "Cảnh quan canh tác hình thành qua nhiều thế hệ; được công nhận danh thắng quốc gia năm 2007",
    yearStart: 2007,
    yearEnd: null,
    description:
      "Ruộng bậc thang Mù Cang Chải là một trong những cảnh quan nông nghiệp đặc sắc nhất của Việt Nam, được tạo nên bởi bàn tay lao động của đồng bào H’Mông qua nhiều thế hệ trên sườn núi cao Tây Bắc. Điều làm địa danh này nổi bật không chỉ là vẻ đẹp mùa nước đổ hay mùa lúa chín, mà là cách con người thích nghi với địa hình hiểm trở để tạo nên một kiến trúc canh tác ngoạn mục. Đây là một địa danh rất đặc trưng cho Việt Nam vì nó vừa là thắng cảnh, vừa là di sản văn hóa lao động. Những thửa ruộng xếp lớp không chỉ tạo ra giá trị thẩm mỹ mà còn phản ánh tri thức bản địa về nước, đất và mùa vụ. Khi được công nhận là danh thắng quốc gia rồi sau đó nâng hạng di tích quốc gia đặc biệt, Mù Cang Chải đã được nhìn nhận đúng như một kiệt tác kết hợp giữa thiên nhiên và con người.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=21.850915,104.089222",
    position: [21.850915, 104.089222],
    lat: 21.850915,
    lng: 104.089222,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Mu_Cang_Chai_01.JPG",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Thành nhà Hồ",
    alternateNames: ["Citadel of the Hồ Dynasty", "Tây Đô"],
    yearLabel: "1397",
    yearStart: 1397,
    yearEnd: null,
    description:
      "Thành nhà Hồ là một công trình quân sự – chính trị đặc biệt trong lịch sử Việt Nam, nổi bật bởi kỹ thuật xây thành bằng những khối đá lớn ghép khít với nhau ở quy mô rất ấn tượng. Công trình được xây cuối thế kỷ XIV dưới thời Hồ Quý Ly và từng giữ vai trò kinh đô Tây Đô. Thành có ý nghĩa vượt ra ngoài một vết tích triều đại ngắn ngủi, vì nó phản ánh tư duy cải cách mạnh mẽ và tham vọng tổ chức lại quốc gia trong bối cảnh lịch sử biến động cuối Trần – đầu Hồ. Dù triều Hồ tồn tại không dài, thành vẫn còn đó như một dấu mốc hiếm hoi về kỹ thuật xây dựng và quy hoạch đô thành của Việt Nam thời trung đại. Đây là một trong những di tích thể hiện rất rõ năng lực kiến trúc bản địa và vị trí chiến lược của một kinh đô chuyển tiếp trong lịch sử dân tộc.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.07805556,105.60472222",
    position: [20.078056, 105.604722],
    lat: 20.078056,
    lng: 105.604722,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Tay_Do_castle_South_gate.JPG",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Chùa Thiên Mụ",
    alternateNames: ["Thiên Mụ Temple", "Linh Mụ Pagoda"],
    yearLabel: "1601",
    yearStart: 1601,
    yearEnd: null,
    description:
      "Chùa Thiên Mụ là một trong những biểu tượng văn hóa nổi bật nhất của Huế và cũng là một trong những ngôi chùa nổi tiếng nhất Việt Nam. Được Nguyễn Hoàng cho dựng năm 1601, chùa gắn với truyền thuyết về bà tiên báo mộng và từ đó trở thành điểm tựa tinh thần của vùng đất Thuận Hóa – Phú Xuân. Tháp Phước Duyên bảy tầng về sau trở thành hình ảnh nhận diện quen thuộc của Huế. Nhưng Thiên Mụ không chỉ là biểu tượng cảnh quan; chùa còn gắn với lịch sử triều Nguyễn, đời sống Phật giáo miền Trung và nhiều biến động xã hội – chính trị của thế kỷ XX. Vị trí trên đồi Hà Khê bên sông Hương khiến nơi đây có thêm chiều sâu thẩm mỹ rất riêng, làm cho Thiên Mụ vừa là di tích tôn giáo, vừa là một biểu tượng đô thị văn hóa của cố đô Huế.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16.453599,107.544812",
    position: [16.453599, 107.544812],
    lat: 16.453599,
    lng: 107.544812,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/88/ThienMuPagoda.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Hải Vân Quan – Đèo Hải Vân",
    alternateNames: [
      "Hải Vân Pass",
      "Đèo Hải Vân",
      "Ải Vân",
      "Ocean Cloud Pass",
    ],
    yearLabel:
      "Đèo là thắng cảnh tự nhiên; Hải Vân Quan được xây quy mô lớn năm 1826",
    yearStart: 1826,
    yearEnd: null,
    description:
      "Hải Vân là một trong những cung đèo nổi tiếng nhất Việt Nam, nơi cảnh quan biển – núi đạt đến mức gần như biểu tượng. Về địa lý và lịch sử, khu vực này từng là ranh giới tự nhiên quan trọng giữa Đại Việt và Champa trong nhiều thế kỷ. Trên đỉnh đèo, Hải Vân Quan giữ vai trò cửa ải chiến lược, kiểm soát trục giao thông Bắc – Nam và không gian ven biển miền Trung. Vì thế, Hải Vân không chỉ đẹp mà còn có ý nghĩa lịch sử – quân sự sâu sắc. Trong trí nhớ hiện đại, cung đèo này còn nổi tiếng như một trong những con đường ven biển đẹp nhất châu Á. Đây là địa danh rất tiêu biểu cho miền Trung Việt Nam: hiểm trở, hùng vĩ, giàu chiều sâu lịch sử và có sức gợi hình ảnh cực mạnh.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16.2,108.13333333",
    position: [16.2, 108.133333],
    lat: 16.2,
    lng: 108.133333,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hai_Van_Pass_ocean_view.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Gành Đá Đĩa",
    alternateNames: ["Ghềnh Đá Đĩa", "Ganh Da Dia"],
    yearLabel:
      "Danh thắng tự nhiên; được xếp hạng danh thắng quốc gia năm 1997",
    yearStart: 1997,
    yearEnd: null,
    description:
      "Gành Đá Đĩa là một trong những thắng cảnh địa chất độc đáo nhất Việt Nam, nổi bật bởi các cột đá bazan xếp khít nhau như những chồng đĩa khổng lồ bên bờ biển. Đây là dạng địa hình hiếm, có giá trị khoa học và thẩm mỹ cao, khiến địa danh này luôn nằm trong nhóm cảnh quan tự nhiên đặc sắc nhất miền Trung. Điều đặc biệt ở Gành Đá Đĩa là nó có sức nhận diện thị giác rất mạnh: chỉ cần nhìn hình ảnh là người ta gần như có thể nhận ra ngay. Dù không gắn với một chiến công hay triều đại lớn như nhiều di tích lịch sử khác, Gành Đá Đĩa vẫn rất đặc trưng Việt Nam ở bình diện du lịch và hình ảnh đất nước, nhất là khi nói về vẻ đẹp bờ biển miền Trung kết hợp với hiện tượng địa chất hiếm gặp.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=13.335,109.29805556",
    position: [13.335, 109.298056],
    lat: 13.335,
    lng: 109.298056,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/00/G%C3%A0nh_%C4%90%C3%A1_%C4%90%C4%A9a_-_Ph%C3%BA_Y%C3%AAn.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Tháp Bà Po Nagar",
    alternateNames: ["Po Nagar", "Tháp Bà Ponagar", "Po Ina Nagar"],
    yearLabel: "Trước năm 781 (các tháp hiện còn chủ yếu từ thế kỷ 10-13)",
    yearStart: 781,
    yearEnd: null,
    description:
      "Po Nagar là một trong những cụm đền tháp Chăm quan trọng nhất còn lại ở Việt Nam, thờ nữ thần Yan Po Nagar – vị thần bảo hộ xứ sở trong truyền thống Champa. Nơi đây thể hiện rõ chiều sâu đa văn hóa của lịch sử Việt Nam, bởi trước khi trở thành một phần của không gian văn hóa Việt hiện đại, khu vực miền Trung từng là địa bàn phát triển rực rỡ của Champa. Các tháp còn lại ngày nay mang dấu ấn kiến trúc Chăm rất rõ, đồng thời cho thấy sự tiếp biến lâu dài khi người Việt về sau tiếp nhận nữ thần này dưới tên Thiên Y Thánh Mẫu. Po Nagar vì vậy không chỉ là di tích tôn giáo, mà còn là biểu hiện sinh động của giao thoa văn hóa, tín ngưỡng và lịch sử giữa các cộng đồng cư dân trên dải đất miền Trung.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=12.26527778,109.19555556",
    position: [12.265278, 109.195556],
    lat: 12.265278,
    lng: 109.195556,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Ganesh_Tempel_Po_Nagar_Nha_Trang.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Mũi Điện",
    alternateNames: ["Mũi Đại Lãnh", "Dien Cape", "Cape Varella"],
    yearLabel: "Mũi đất tự nhiên; hải đăng được người Pháp xây năm 1890",
    yearStart: 1890,
    yearEnd: null,
    description:
      "Mũi Điện là một trong những địa danh ven biển nổi bật nhất của miền Trung, nổi tiếng với mũi đất vươn ra biển, ngọn hải đăng cổ và cảnh bình minh rất được yêu thích. Trong nhiều năm, địa danh này thường được nhắc đến như một trong những nơi đón ánh mặt trời sớm nhất trên đất liền Việt Nam, dù đã có tranh luận học thuật giữa Mũi Điện và Mũi Đôi về điểm cực Đông chính xác. Dù theo cách hiểu nào, Mũi Điện vẫn là một địa danh rất tiêu biểu của Việt Nam ven biển: gió lớn, núi đâm ra biển, bãi Môn phía dưới và hải đăng mang dấu ấn hàng hải thời Pháp. Nó đại diện cho lớp địa danh vừa có vẻ đẹp tự nhiên, vừa gắn với lịch sử hàng hải và tưởng tượng du lịch hiện đại.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=12.88555556,109.45055556",
    position: [12.885556, 109.450556],
    lat: 12.885556,
    lng: 109.450556,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/M%C5%A9i_%C4%90i%E1%BB%87n_%2841910099355%29.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Thành cổ Quảng Trị",
    alternateNames: ["Citadel of Quảng Trị", "Cổ thành Quảng Trị"],
    yearLabel: "Đầu thế kỷ 19",
    yearStart: null,
    yearEnd: null,
    description:
      "Thành cổ Quảng Trị là một trong những di tích mang cảm xúc lịch sử mạnh nhất của Việt Nam hiện đại. Ban đầu đây là một thành lũy – trung tâm hành chính thời Nguyễn, nhưng trong ký ức quốc gia, địa danh này gắn đặc biệt với trận chiến 81 ngày đêm năm 1972, một trong những chương khốc liệt nhất của chiến tranh Việt Nam. Vì vậy, Thành cổ Quảng Trị có hai lớp ý nghĩa chồng lên nhau: lớp kiến trúc – hành chính thời phong kiến và lớp ký ức chiến tranh hiện đại. Ngày nay, nơi đây không chỉ là điểm tham quan mà còn là không gian tưởng niệm, nơi nhiều người đến để tri ân những người đã ngã xuống. Trong số các địa danh lịch sử của miền Trung, Quảng Trị nổi bật ở chiều sâu bi tráng và khả năng gợi nhớ về cái giá của chiến tranh.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16.7539,107.1895",
    position: [16.7539, 107.1895],
    lat: 16.7539,
    lng: 107.1895,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Th%C3%A0nh_c%E1%BB%95_Qu%E1%BA%A3ng_Tr%E1%BB%8B.JPG",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Mũi Cà Mau",
    alternateNames: ["Cape Cà Mau", "Mũi Cà Mau"],
    yearLabel:
      "Địa danh tự nhiên ở cực Nam đất liền Việt Nam; không có năm xây dựng duy nhất",
    yearStart: null,
    yearEnd: null,
    description:
      "Mũi Cà Mau là biểu tượng địa lý cực Nam của đất liền Việt Nam, tương ứng với vị thế của Lũng Cú ở cực Bắc. Sự đặc biệt của địa danh này nằm ở tính biểu tượng: nơi đất nước vươn ra biển, nơi phù sa và rừng ngập mặn tiếp tục định hình hình hài lãnh thổ. Trong trí tưởng tượng tập thể của người Việt, đất Mũi không chỉ là một điểm trên bản đồ mà là hình ảnh của tận cùng phương Nam, của khai phá, bồi tụ và biển rừng. So với các địa danh đô thị hay cung đình, Mũi Cà Mau đại diện cho một loại biểu tượng khác: biểu tượng biên giới tự nhiên của quốc gia. Đây là một trong những địa danh đặc trưng nhất nếu muốn giới thiệu Việt Nam như một đất nước trải dài, đa dạng cảnh quan và có những điểm cực rất rõ trong ý thức không gian dân tộc.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=8.62305556,104.71",
    position: [8.623056, 104.71],
    lat: 8.623056,
    lng: 104.71,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Muicamau.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Rừng ngập mặn Cần Giờ",
    alternateNames: [
      "Cần Giờ Mangrove Forest",
      "Cần Giờ Biosphere Reserve",
      "Rừng Sác",
    ],
    yearLabel: "Khu dự trữ sinh quyển; được UNESCO công nhận năm 2000",
    yearStart: 2000,
    yearEnd: null,
    description:
      "Rừng ngập mặn Cần Giờ là một địa danh đặc biệt bởi nó đại diện cho hệ sinh thái ngập mặn ven biển điển hình của Nam Bộ, đồng thời gắn với câu chuyện phục hồi môi trường rất đáng chú ý sau chiến tranh. Đây là vùng đất của sông ngòi, bãi bồi, đước, mắm và đa dạng sinh học, cách trung tâm TP.HCM không quá xa nhưng mang cảm giác hoàn toàn khác biệt. Cần Giờ cho thấy một khía cạnh rất đặc trưng của Việt Nam phía Nam: đất – nước đan xen, sinh thái ven biển phong phú và sự gắn bó giữa đời sống con người với rừng ngập mặn. Việc UNESCO công nhận khu dự trữ sinh quyển càng làm nổi bật giá trị quốc tế của nơi này. Nếu cần một địa danh tiêu biểu cho Việt Nam ở góc nhìn sinh thái và phục hồi tự nhiên, Cần Giờ là lựa chọn rất mạnh.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.31,106.74",
    position: [10.31, 106.74],
    lat: 10.31,
    lng: 106.74,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Mangrove_in_Can_Gio_forest.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Côn Đảo",
    alternateNames: ["Con Dao", "Côn Sơn", "Côn Lôn"],
    yearLabel:
      "Quần đảo tự nhiên; mốc lịch sử hiện đại nổi bật là hệ thống nhà tù được lập từ 1862",
    yearStart: 1862,
    yearEnd: null,
    description:
      "Côn Đảo là một trong những địa danh đặc biệt nhất của Việt Nam vì nó đồng thời mang hai bản sắc rất mạnh: thiên nhiên biển đảo nguyên sơ và ký ức nhà tù chính trị khắc nghiệt thời thuộc địa – chiến tranh. Ở bình diện cảnh quan, Côn Đảo có biển đẹp, rừng, san hô và hệ sinh thái quý. Nhưng trong lịch sử hiện đại Việt Nam, nơi đây còn gắn với hệ thống nhà tù khét tiếng, nơi giam giữ nhiều chiến sĩ cách mạng và trở thành biểu tượng của đau thương, ý chí và lòng yêu nước. Chính sự chồng lớp giữa vẻ đẹp thiên nhiên và chiều sâu lịch sử ấy khiến Côn Đảo có vị trí rất riêng trong bản đồ địa danh Việt Nam. Đây không chỉ là nơi để nghỉ dưỡng hay tham quan, mà còn là không gian của tưởng niệm, giáo dục lịch sử và ý thức quốc gia.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=8.69305556,106.57666667",
    position: [8.693056, 106.576667],
    lat: 8.693056,
    lng: 106.576667,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/ConDao_park_dam.jpg",
    type: "Natural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Bưu điện Trung tâm Sài Gòn",
    alternateNames: ["Saigon Central Post Office", "Bưu điện Sài Gòn"],
    yearLabel: "1886-1891 (tòa nhà hiện nay)",
    yearStart: 1886,
    yearEnd: 1891,
    description:
      "Bưu điện Trung tâm Sài Gòn là một trong những công trình kiến trúc thuộc địa nổi bật nhất còn lại ở TP.HCM. Nằm ngay cạnh Nhà thờ Đức Bà, công trình này góp phần tạo nên một cụm không gian đô thị có sức nhận diện cực cao đối với Sài Gòn. Giá trị của Bưu điện không chỉ ở mặt tiền, mái vòm, kết cấu thép hay nét thẩm mỹ châu Âu cuối thế kỷ XIX, mà còn ở chỗ nó là một công trình công cộng vẫn tiếp tục sống trong lòng thành phố hiện đại. Điều đó khiến nơi đây không giống một bảo tàng tĩnh, mà là một mảnh đô thị lịch sử còn đang hoạt động. Trong bộ địa danh đặc trưng của Việt Nam, Bưu điện Sài Gòn đại diện rất rõ cho ký ức đô thị Nam Bộ và lớp giao thoa giữa thuộc địa, hiện đại hóa và bản sắc Sài Gòn.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.78,106.7",
    position: [10.78, 106.7],
    lat: 10.78,
    lng: 106.7,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Saigon_Central_Post_Office_%2852681461470%29.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Chùa Bà Thiên Hậu (Chợ Lớn)",
    alternateNames: [
      "Thien Hau Temple of Cholon",
      "Chùa Bà Thiên Hậu",
      "Hội quán Tuệ Thành",
    ],
    yearLabel: "Khoảng 1760",
    yearStart: 1760,
    yearEnd: null,
    description:
      "Chùa Bà Thiên Hậu là một trong những di tích tiêu biểu nhất của cộng đồng người Hoa ở Chợ Lớn và của lịch sử đa văn hóa tại Sài Gòn. Ngôi chùa thờ Thiên Hậu Thánh Mẫu – vị nữ thần biển được cộng đồng Hoa kiều tôn kính – phản ánh rõ mối liên hệ giữa thương mại, di cư, tín ngưỡng và đời sống đô thị miền Nam. Nơi đây đặc sắc không chỉ ở mặt kiến trúc với mái ngói, lư hương, phù điêu và không gian hội quán, mà còn ở sức sống văn hóa rất mạnh cho đến ngày nay. Trong bản đồ địa danh Việt Nam, chùa Bà Thiên Hậu đại diện cho chiều sâu giao thoa dân tộc – tôn giáo – thương mại ở Nam Bộ, nhắc rằng bản sắc Việt Nam không chỉ đơn nhất mà còn được hình thành từ nhiều cộng đồng cùng chung sống và để lại dấu ấn.",
    region: "South",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=10.75291111,106.66117222",
    position: [10.752911, 106.661172],
    lat: 10.752911,
    lng: 106.661172,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/20190923_Thien_Hau_Temple_front.jpg",
    type: "Cultural",
    updatedAt: "2026-04-08",
  },
  {
    name: "Nhà thờ Gỗ Kon Tum",
    alternateNames: [
      "Nhà thờ Chính tòa Kon Tum",
      "Kon Tum Cathedral",
      "Kon Tum Wooden Church",
    ],
    yearLabel: "1913-1918",
    yearStart: 1913,
    yearEnd: 1918,
    description:
      "Nhà thờ Gỗ Kon Tum là một công trình hiếm ở Tây Nguyên vì nó kết hợp rõ nét kiến trúc Roman của châu Âu với hình thức nhà sàn và hoa văn bản địa Ba Na. Khởi công năm 1913 và hoàn thành năm 1918, công trình không chỉ là trung tâm tôn giáo mà còn là một dấu mốc giao thoa văn hóa rất sớm giữa truyền giáo, thủ công mộc và đời sống bản địa vùng cao. Chất liệu gỗ cà chít, tường đất trộn rơm và không gian nhà rông trong khuôn viên khiến nơi này trở thành một biểu tượng âm thầm nhưng giàu bản sắc của Kon Tum.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=14.34505,108.013223",
    position: [14.34505, 108.013223],
    lat: 14.34505,
    lng: 108.013223,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nh%C3%A0%20th%E1%BB%9D%20g%E1%BB%97%20Kon%20Tum.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Nhà rông Kon Klor",
    alternateNames: [
      "Nhà rông KonK'lor",
      "Kon Klor Rong House",
      "Kon Klor Communal House",
    ],
    yearLabel:
      "2011 (nhà rông hiện tại; kế thừa không gian cộng đồng truyền thống Ba Na)",
    yearStart: 2011,
    yearEnd: 2011,
    description:
      "Nhà rông Kon Klor là một biểu tượng cộng đồng tiêu biểu của người Ba Na giữa lòng Kon Tum. Dù công trình hiện nay được khánh thành lại năm 2011, giá trị của nó không nằm ở tuổi đời vật chất mà ở chức năng văn hóa: đây là nơi gắn với lễ hội, cồng chiêng, sinh hoạt làng và tinh thần cố kết cộng đồng của cư dân Tây Nguyên. Mái cao vút, vật liệu gỗ tre nứa và vị trí gần sông Đắk Bla khiến công trình vừa nổi bật về hình khối vừa giữ được hồn làng truyền thống. Đây là một địa điểm lowkey nhưng có ý nghĩa biểu tượng rất lớn với văn hóa Ba Na.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=14.3480813,108.0341535",
    position: [14.3480813, 108.0341535],
    lat: 14.3480813,
    lng: 108.0341535,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nh%C3%A0%20r%C3%B4ng%20Kon%20Klor%20Kon%20Tum.png",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Chùa Sắc tứ Khải Đoan",
    alternateNames: [
      "Chùa Khải Đoan",
      "Sắc tứ Khải Đoan tự",
      "Khai Doan Pagoda",
    ],
    yearLabel: "1951-1953",
    yearStart: 1951,
    yearEnd: 1953,
    description:
      "Chùa Sắc tứ Khải Đoan là ngôi chùa lớn và quan trọng nhất của Buôn Ma Thuột, đồng thời là ngôi chùa cuối cùng ở Việt Nam được ban sắc dưới chế độ quân chủ. Chùa được xây từ năm 1951, đến năm 1953 được sắc phong, nên ngoài giá trị tôn giáo còn mang ý nghĩa lịch sử ở giai đoạn giao thời rất đặc biệt của đất nước. Kiến trúc chùa hòa trộn ảnh hưởng cung đình Huế với vật liệu và không gian cao nguyên, tạo ra một bản sắc rất riêng. Đây là địa điểm không ồn ào như các danh thắng lớn nhưng có chiều sâu văn hóa đặc biệt của Phật giáo Tây Nguyên.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=12.6823396,108.0384264",
    position: [12.6823396, 108.0384264],
    lat: 12.6823396,
    lng: 108.0384264,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Khai%20doan%20pagoda.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Nhà đày Buôn Ma Thuột",
    alternateNames: [
      "Buôn Ma Thuột Exile House",
      "Nhà lao Buôn Ma Thuột",
      "Buon Ma Thuot Prison",
    ],
    yearLabel: "1930-1931",
    yearStart: 1930,
    yearEnd: 1931,
    description:
      "Nhà đày Buôn Ma Thuột là một trong những “địa chỉ đỏ” ít được nói tới rộng rãi hơn Côn Đảo hay Hỏa Lò, nhưng có ý nghĩa rất lớn trong lịch sử cách mạng Việt Nam. Công trình do thực dân Pháp xây dựng trong giai đoạn 1930-1931 để lưu đày tù chính trị Trung Kỳ lên vùng cao nguyên xa xôi. Chính trong không gian khắc nghiệt đó, nhiều hoạt động tổ chức, học tập và đấu tranh đã diễn ra, biến nơi giam giữ thành một điểm kết nối tư tưởng cách mạng. Đây là một di tích lowkey, giàu chiều sâu lịch sử và đặc biệt quan trọng với ký ức chính trị của Tây Nguyên.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=12.6768332,108.0471762",
    position: [12.6768332, 108.0471762],
    lat: 12.6768332,
    lng: 108.0471762,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bu%C3%B4n%20Ma%20Thu%E1%BB%99t%20-%20buildings%20at%20Exile%20House%20former%20prison%20Apr%202024%2001.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Hồ T'Nưng",
    alternateNames: [
      "Biển Hồ Pleiku",
      "Hồ Ea Nueng",
      "Hồ Tơ Nuêng",
      "Pleiku Lake",
    ],
    yearLabel:
      "Hồ miệng núi lửa tự nhiên; được xếp hạng danh lam thắng cảnh năm 1988",
    yearStart: 1988,
    yearEnd: null,
    description:
      "Hồ T'Nưng, thường gọi là Biển Hồ Pleiku, là hồ miệng núi lửa nổi tiếng của Gia Lai nhưng vẫn giữ được cảm giác trầm và kín hơn nhiều điểm du lịch đại chúng khác. Giá trị của nơi này không chỉ nằm ở cảnh quan mà còn ở lớp truyền thuyết Gia Rai gắn với “biển trên núi”, với ký ức về một buôn làng chìm xuống lòng hồ. Chính vì vậy, T'Nưng vừa là thắng cảnh tự nhiên vừa là không gian văn hóa của cư dân bản địa quanh Pleiku. Đây là một điểm lowkey nhưng rất giàu biểu tượng, phù hợp tiêu chí cảnh quan mang chiều sâu văn hóa.",
    region: "Central",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=14.0403219,108.0000308",
    position: [14.0403219, 108.0000308],
    lat: 14.0403219,
    lng: 108.0000308,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ho%20T%27Nung%20%282%29.jpg",
    type: "Natural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Dinh thự họ Vương",
    alternateNames: [
      "Nhà Vương",
      "Dinh vua Mèo",
      "Hmong King's Palace",
      "Vuong Family Mansion",
    ],
    yearLabel: "1898-1903",
    yearStart: 1898,
    yearEnd: 1903,
    description:
      "Dinh thự họ Vương ở Sà Phìn là một di tích đặc biệt của vùng cực Bắc vì nó gắn với quyền lực của dòng họ Vương, một thế lực người H’Mông từng có ảnh hưởng rất lớn trên cao nguyên đá Đồng Văn. Công trình được khởi công năm 1898 và hoàn thành năm 1903, kết hợp kỹ thuật bản địa H’Mông, bố cục tứ hợp viện kiểu Hoa và một số yếu tố phòng thủ mang màu sắc Pháp. Dù thường được du khách gọi là “dinh vua Mèo”, giá trị sâu hơn của nơi này là nó lưu giữ ký ức về cấu trúc quyền lực biên viễn, về bản sắc H’Mông và lịch sử giao thoa vùng biên.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=23.2563055,105.262111",
    position: [23.2563055, 105.262111],
    lat: 23.2563055,
    lng: 105.262111,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dinh%20th%E1%BB%B1%20vua%20M%C3%A8o%20h%E1%BB%8D%20V%C6%B0%C6%A1ng%20-%20Vuong%E2%80%99s%20Palace%2C%20%C4%90%E1%BB%93ng%20V%C4%83n.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Phố cổ Đồng Văn",
    alternateNames: [
      "Dong Van Old Town",
      "Dong Van Ancient Quarter",
      "Phố cổ Đồng Văn",
    ],
    yearLabel: "Đầu thế kỷ 20 (hạt nhân kiến trúc hiện còn)",
    yearStart: 1900,
    yearEnd: null,
    description:
      "Phố cổ Đồng Văn là một khu phố nhỏ nhưng rất giàu sức gợi, phản ánh quá trình cộng cư lâu dài của người Mông, Tày, Hoa và các nhóm cư dân miền núi đá Hà Giang. Phần lõi hiện còn chủ yếu hình thành từ đầu thế kỷ 20, với chợ đá thập niên 1920 và nhiều nếp nhà trình tường, ngói âm dương tồn tại qua hơn một thế kỷ. Điều đáng quý ở đây là phố cổ vẫn gắn với nhịp sống thật của cư dân vùng cao, không hoàn toàn bị “bảo tàng hóa”. Vì thế, đây là một địa điểm lowkey nhưng có giá trị cao về kiến trúc, đời sống và giao lưu văn hóa biên viễn.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=23.27967,105.36078",
    position: [23.27967, 105.36078],
    lat: 23.27967,
    lng: 105.36078,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dong%20Van%20old%20town.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Khu di tích Pác Bó",
    alternateNames: [
      "Khu di tích Chủ tịch Hồ Chí Minh tại Cao Bằng",
      "Pac Bo Historical Site",
      "Hang Cốc Bó - Suối Lê Nin",
    ],
    yearLabel:
      "1941 (gắn với thời điểm Hồ Chí Minh trở về hoạt động cách mạng)",
    yearStart: 1941,
    yearEnd: null,
    description:
      "Pác Bó là một trong những địa điểm có ý nghĩa chính trị - lịch sử rất lớn nhưng lại thường được cảm nhận như một không gian núi rừng lặng lẽ ở Cao Bằng. Nơi đây gắn với thời điểm đầu năm 1941, khi Hồ Chí Minh trở về nước sau nhiều năm hoạt động ở nước ngoài và sống, làm việc tại hang Cốc Bó bên suối Lê Nin. Chính sự giản dị của cảnh quan khiến ý nghĩa lịch sử ở đây càng rõ hơn: một bước ngoặt lớn của cách mạng Việt Nam bắt đầu từ một điểm rất nhỏ, rất kín. Đây là địa danh lowkey nhưng mang giá trị biểu tượng quốc gia mạnh mẽ.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=22.97786,106.050356",
    position: [22.97786, 106.050356],
    lat: 22.97786,
    lng: 106.050356,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%A1c%20B%C3%B3.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Bãi đá cổ Sa Pa",
    alternateNames: [
      "Sapa Ancient Rock Field",
      "Mường Hoa Ancient Rock Field",
      "Bãi đá cổ Mường Hoa",
    ],
    yearLabel:
      "Di tích khắc đá cổ; được phát hiện khoa học năm 1925, xếp hạng quốc gia năm 1994",
    yearStart: 1925,
    yearEnd: null,
    description:
      "Bãi đá cổ Sa Pa ở thung lũng Mường Hoa là một trong những di tích khảo cổ bí ẩn nhất của miền núi phía Bắc. Trên hàng trăm khối đá phân bố giữa ruộng bậc thang và bản làng có những ký hiệu, sơ đồ và hình khắc mà đến nay vẫn chưa được giải mã trọn vẹn. Dù được phát hiện khoa học từ năm 1925, giá trị của bãi đá nằm ở việc nó mở ra một lớp lịch sử sâu hơn nhiều so với hình ảnh du lịch quen thuộc của Sa Pa hiện đại. Đây là địa điểm lowkey theo nghĩa rất thật: ít ồn ào, nhưng chứa đựng chiều sâu khảo cổ và trí tưởng tượng văn hóa rất lớn.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=22.30083,103.90222",
    position: [22.30083, 103.90222],
    lat: 22.30083,
    lng: 103.90222,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Da%20co%20Sa%20Pa.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
  {
    name: "Ruộng bậc thang Hoàng Su Phì",
    alternateNames: [
      "Hoang Su Phi Terraced Fields",
      "Ruộng bậc thang Bản Phùng - Bản Luốc - Thông Nguyên",
      "Ruộng bậc thang Hoàng Su Phì",
    ],
    yearLabel:
      "Cảnh quan canh tác hàng trăm năm; được công nhận danh thắng quốc gia năm 2012",
    yearStart: 2012,
    yearEnd: null,
    description:
      "Ruộng bậc thang Hoàng Su Phì là một cảnh quan canh tác được tạo dựng qua nhiều thế hệ của các cộng đồng Dao, La Chí, Nùng, Tày, H’Mông và nhiều nhóm cư dân khác ở vùng núi cao Hà Giang. Dù chỉ được công nhận danh thắng quốc gia từ năm 2012, bản thân hệ thống ruộng có lịch sử lâu hơn nhiều, phản ánh kỹ năng trị thủy, phân tầng đất dốc và tổ chức đời sống nông nghiệp bền bỉ trên sườn núi. So với Mù Cang Chải, Hoàng Su Phì vẫn lowkey hơn, nhưng về chiều sâu văn hóa lao động và bản sắc cộng đồng thì đây là một trong những cảnh quan giàu ý nghĩa nhất miền núi phía Bắc.",
    region: "North",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=22.6994125,104.6556406",
    position: [22.6994125, 104.6556406],
    lat: 22.6994125,
    lng: 104.6556406,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ru%E1%BB%99ng%20b%E1%BA%ADc%20thang%20%E1%BB%9F%20Ho%C3%A0ng%20Su%20Ph%C3%AC.jpg",
    type: "Cultural",
    updatedAt: "2026-04-11",
  },
];

const regions = ["All", "North", "Central", "South"];

const regionStats = {
  All: { indexed: "1,248", world: "8" },
  North: { indexed: "412", world: "3" },
  Central: { indexed: "601", world: "4" },
  South: { indexed: "235", world: "1" },
};

export default function Discover() {
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState(locations[0] ?? null);

  const filteredLocations =
    region === "All"
      ? locations
      : locations.filter((loc) => loc.region === region);

  const stats = regionStats[region];
  const activeLocation =
    selected ?? filteredLocations[0] ?? locations[0] ?? null;

  return (
    <div
      className="min-h-screen dot-grid"
      style={{ backgroundColor: "#12140e", color: "#e3e3d9" }}
    >
      <header
        className="flex justify-between items-center px-4 sm:px-10 py-3 sm:py-5 sticky  z-30"
        style={{
          backgroundColor: "#12140e",
          borderBottom: "1px solid rgba(65,73,68,0.4)",
        }}
      >
        <div>
          <p
            className="uppercase tracking-widest font-bold"
            style={{ fontSize: "10px", color: "#a2d1bb" }}
          >
            Atlas
          </p>
          <h2
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{ color: "#a2d1bb" }}
          >
            Heritage Atlas
          </h2>
          <p
            className="hidden sm:block"
            style={{
              color: "rgba(192,200,195,0.6)",
              fontSize: "13px",
              marginTop: "2px",
            }}
          >
            Explore the sacred sites and cultural relics of the S-shaped land.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: "#1e201a",
            border: "1px solid rgba(187,3,8,0.3)",
          }}
        >
          <div
            className="w-6 h-4 rounded-sm flex items-center justify-center font-black"
            style={{
              backgroundColor: "#bb0308",
              color: "#ffc8c0",
              fontSize: "9px",
            }}
          >
            VN
          </div>
          <span
            style={{ color: "#e3e3d9", fontSize: "12px", fontWeight: "700" }}
          >
            Việt Nam
          </span>
        </div>
      </header>

      <div
        className="discover-grid grid grid-cols-3 gap-0 mt-20"
        style={{ minHeight: "calc(100vh - 153px)", paddingTop: "8px" }}
      >
        <div className="discover-map-col col-span-2 p-3 sm:p-6">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRegion(r);
                  const nextLocations =
                    r === "All"
                      ? locations
                      : locations.filter((loc) => loc.region === r);
                  if (nextLocations.length > 0) setSelected(nextLocations[0]);
                }}
                className="px-3 sm:px-4 py-1 sm:py-1.5 font-bold uppercase tracking-widest transition-all"
                style={{
                  fontSize: "10px",
                  borderRadius: "3px",
                  backgroundColor: region === r ? "#bb0308" : "#1e201a",
                  color: region === r ? "#ffc8c0" : "rgba(162,209,187,0.6)",
                  border:
                    region === r
                      ? "1px solid #bb0308"
                      : "1px solid rgba(65,73,68,0.4)",
                }}
              >
                {r}
              </button>
            ))}
            <span
              style={{
                marginLeft: "4px",
                color: "rgba(192,200,195,0.4)",
                fontSize: "11px",
              }}
            >
              {filteredLocations.length} sites
            </span>
          </div>

          <div
            className="discover-map-height rounded-xl overflow-hidden"
            style={{
              height: "calc(100vh - 220px)",
              border: "1px solid rgba(65,73,68,0.4)",
            }}
          >
            <MapContainer
              center={[16.0471, 108.2062]}
              zoom={6}
              scrollWheelZoom
              className="w-full h-full"
            >
              <TileLayer
                attribution="&copy; CartoDB"
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {filteredLocations.map((loc, i) => (
                <Marker
                  key={i}
                  position={loc.position}
                  icon={locationIcon}
                  eventHandlers={{ click: () => setSelected(loc) }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div
                      style={{
                        background: "#1e201a",
                        color: "#a2d1bb",
                        border: "1px solid rgba(65,73,68,0.6)",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {loc.name}
                    </div>
                  </Tooltip>

                  <Popup>
                    <div
                      style={{
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        minWidth: "160px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "800",
                          fontSize: "13px",
                          color: "#e3e3d9",
                          margin: "0 0 8px",
                        }}
                      >
                        {loc.name}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: "700",
                            padding: "2px 6px",
                            borderRadius: "2px",
                            backgroundColor: "rgba(162,209,187,0.15)",
                            color: "#a2d1bb",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {loc.region}
                        </span>

                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: "700",
                            padding: "2px 6px",
                            borderRadius: "2px",
                            backgroundColor: "rgba(233,195,73,0.15)",
                            color: "#e9c349",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {loc.type}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div
          className="discover-sidebar-col flex flex-col p-3 sm:p-6 gap-4"
          style={{ borderLeft: "1px solid rgba(65,73,68,0.4)" }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <p
                className="uppercase tracking-widest font-black"
                style={{ fontSize: "10px", color: "#a2d1bb" }}
              >
                {selected ? "Selected Site" : "Recent Discovery"}
              </p>
              <span
                className="px-2 py-0.5 rounded font-black uppercase"
                style={{
                  fontSize: "9px",
                  backgroundColor: "rgba(187,3,8,0.2)",
                  color: "#ffb4a9",
                  letterSpacing: "0.1em",
                }}
              >
                Curated Live
              </span>
            </div>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(65,73,68,0.4)" }}
            >
              <div
                className="h-36 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${activeLocation?.imageUrl || "/NhaThoLon.png"}')`,
                  filter: "brightness(0.7)",
                  backgroundColor: "#1e201a",
                }}
              />
              <div className="p-4" style={{ backgroundColor: "#1e201a" }}>
                <h3
                  className="font-black"
                  style={{ color: "#e3e3d9", fontSize: "14px" }}
                >
                  {activeLocation ? activeLocation.name : "Hội An Ancient Town"}
                </h3>
                <p
                  style={{
                    color: "rgba(192,200,195,0.6)",
                    fontSize: "11px",
                    marginTop: "4px",
                    lineHeight: "1.4",
                  }}
                >
                  {activeLocation
                    ? activeLocation.description
                    : "A perfectly preserved example of a Southeast Asian trading port from t..."}
                </p>

                {activeLocation && (
                  <>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "2px",
                          backgroundColor: "rgba(162,209,187,0.15)",
                          color: "#a2d1bb",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {activeLocation.region}
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "2px",
                          backgroundColor: "rgba(233,195,73,0.15)",
                          color: "#e9c349",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {activeLocation.type}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p
                          style={{
                            color: "rgba(162,209,187,0.85)",
                            fontSize: "9px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            marginBottom: "4px",
                          }}
                        >
                          Year
                        </p>
                        <p
                          style={{
                            color: "rgba(227,227,217,0.9)",
                            fontSize: "11px",
                            lineHeight: "1.5",
                            margin: 0,
                          }}
                        >
                          {activeLocation.yearLabel || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color: "rgba(162,209,187,0.85)",
                            fontSize: "9px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            marginBottom: "4px",
                          }}
                        >
                          Other names
                        </p>
                        <p
                          style={{
                            color: "rgba(227,227,217,0.9)",
                            fontSize: "11px",
                            lineHeight: "1.5",
                            margin: 0,
                          }}
                        >
                          {activeLocation.alternateNames?.length
                            ? activeLocation.alternateNames.join(", ")
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color: "rgba(162,209,187,0.85)",
                            fontSize: "9px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            marginBottom: "4px",
                          }}
                        >
                          Map link
                        </p>
                        <a
                          href={activeLocation.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#e9c349",
                            fontSize: "11px",
                            lineHeight: "1.5",
                            textDecoration: "underline",
                          }}
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {filteredLocations.map((loc, i) => (
              <button
                key={i}
                onClick={() => setSelected(loc)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                style={{
                  backgroundColor:
                    selected?.name === loc.name ? "#292b24" : "#1a1c16",
                  border:
                    selected?.name === loc.name
                      ? "1px solid rgba(162,209,187,0.3)"
                      : "1px solid rgba(65,73,68,0.3)",
                }}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{
                    color: "#bb0308",
                    fontSize: "14px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  location_on
                </span>
                <div className="min-w-0">
                  <p
                    className="font-bold truncate"
                    style={{ color: "#a2d1bb", fontSize: "12px" }}
                  >
                    {loc.name}
                  </p>
                  <p
                    style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}
                  >
                    {loc.region} · {loc.type}
                  </p>
                </div>
                <span
                  className="material-symbols-outlined ml-auto flex-shrink-0"
                  style={{ color: "rgba(65,73,68,0.6)", fontSize: "14px" }}
                >
                  chevron_right
                </span>
              </button>
            ))}
          </div>

          <div
            className="grid grid-cols-2 gap-3 pt-4"
            style={{ borderTop: "1px solid rgba(65,73,68,0.4)" }}
          >
            <div className="text-center">
              <p className="font-black text-xl" style={{ color: "#a2d1bb" }}>
                {stats.indexed}
              </p>
              <p
                className="uppercase tracking-widest"
                style={{ color: "rgba(192,200,195,0.5)", fontSize: "9px" }}
              >
                Relics Indexed
              </p>
            </div>
            <div className="text-center">
              <p className="font-black text-xl" style={{ color: "#e9c349" }}>
                {stats.world}
              </p>
              <p
                className="uppercase tracking-widest"
                style={{ color: "rgba(192,200,195,0.5)", fontSize: "9px" }}
              >
                World Heritage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
