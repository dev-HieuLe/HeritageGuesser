"""
Seed knowledge base for Vietnamese heritage sites.
All content derived from publicly available government and UNESCO sources.
Source: dsvh.gov.vn, whc.unesco.org, baotanglichsu.vn
"""

SEED_DOCUMENTS = [
    # ── UNESCO World Heritage Sites ────────────────────────────────────────────
    {
        "name": "Vịnh Hạ Long",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Vịnh Hạ Long (Hạ Long Bay) là Di sản Thiên nhiên Thế giới UNESCO được công nhận năm 1994 và mở rộng năm 2000. "
            "Tọa lạc tại tỉnh Quảng Ninh, đông bắc Việt Nam, vịnh rộng khoảng 1.553 km² với hơn 1.600 hòn đảo và đảo nhỏ "
            "hình thành từ đá vôi karst qua hàng triệu năm. "
            "Vịnh nổi tiếng với các đảo đá vôi dựng đứng phủ cây xanh, hang động kỳ vĩ như Hang Đầu Gỗ, Động Thiên Cung, "
            "Hang Sửng Sốt và các làng chài nổi truyền thống. "
            "Tên 'Hạ Long' có nghĩa là 'rồng đáp xuống biển', theo truyền thuyết rồng thiêng đã phun ngọc tạo thành các đảo đá "
            "để bảo vệ người Việt khỏi kẻ xâm lược. "
            "Khu vực được UNESCO công nhận vì giá trị địa chất địa mạo nổi bật, đa dạng sinh học phong phú và cảnh quan thiên nhiên tuyệt đẹp. "
            "Vịnh Hạ Long thuộc vùng khí hậu nhiệt đới, là điểm du lịch hàng đầu Việt Nam với hàng triệu lượt khách mỗi năm. "
            "Khu vực: Quảng Ninh. Loại: Di sản thiên nhiên. Năm công nhận: 1994."
        ),
    },
    {
        "name": "Quần thể di tích Cố đô Huế",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Quần thể di tích Cố đô Huế là Di sản Văn hóa Thế giới UNESCO được công nhận năm 1993. "
            "Huế từng là kinh đô của triều đại nhà Nguyễn (1802–1945), vương triều phong kiến cuối cùng của Việt Nam. "
            "Quần thể bao gồm: Hoàng thành Huế (Đại Nội) với hệ thống cung điện, lầu gác, đền thờ; "
            "các lăng tẩm của các vua Nguyễn như Lăng Gia Long, Lăng Minh Mạng, Lăng Thiệu Trị, Lăng Tự Đức, Lăng Khải Định; "
            "Chùa Thiên Mụ; Đàn Nam Giao; Văn Miếu Huế; và hệ thống thành lũy kiên cố. "
            "Hoàng thành Huế xây dựng từ 1804 đến 1833 theo phong cách kiến trúc cung đình Á Đông kết hợp ảnh hưởng phương Tây. "
            "Hoàng thành có diện tích 520 ha, được bao quanh bởi hệ thống tường thành và hào nước rộng. "
            "Khu vực: Thừa Thiên Huế. Triều đại: Nhà Nguyễn (1802–1945). Loại: Di sản văn hóa."
        ),
    },
    {
        "name": "Phố cổ Hội An",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Phố cổ Hội An là Di sản Văn hóa Thế giới UNESCO được công nhận năm 1999. "
            "Hội An từng là một trong những thương cảng quốc tế sầm uất nhất Đông Nam Á từ thế kỷ 15 đến 19, "
            "nơi giao thoa văn hóa giữa thương nhân Nhật Bản, Trung Hoa, Việt Nam và châu Âu. "
            "Phố cổ bảo tồn hơn 1.360 di tích kiến trúc bao gồm nhà ở, hội quán, chùa chiền, miếu mạo, giếng cổ và bến thuyền. "
            "Điểm nhấn nổi bật: Chùa Cầu Nhật Bản (Lai Viễn Kiều) xây năm 1593; Hội quán Phúc Kiến, Hội quán Quảng Đông; "
            "Nhà cổ Tấn Ký, Nhà cổ Phùng Hưng; Làng gốm Thanh Hà; Làng rau Trà Quế. "
            "Kiến trúc Hội An pha trộn đặc sắc giữa phong cách Việt, Hoa, Nhật và Tây phương, "
            "với mái ngói âm dương, tường vàng đặc trưng và cửa gỗ chạm khắc tinh xảo. "
            "Khu vực: Quảng Nam. Loại: Di sản văn hóa. Còn gọi: Faifo (thời thuộc địa Pháp)."
        ),
    },
    {
        "name": "Thánh địa Mỹ Sơn",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Thánh địa Mỹ Sơn là Di sản Văn hóa Thế giới UNESCO được công nhận năm 1999. "
            "Đây là quần thể đền tháp Chăm Pa được xây dựng từ thế kỷ 4 đến thế kỷ 13, "
            "nằm trong thung lũng hẹp tại huyện Duy Xuyên, tỉnh Quảng Nam. "
            "Mỹ Sơn từng là trung tâm tôn giáo và chính trị quan trọng của vương quốc Chăm Pa, "
            "nơi thờ phụng thần Shiva và các vị thần Hindu giáo. "
            "Khu di tích có khoảng 70 công trình kiến trúc bằng gạch nung đỏ, trong đó còn khoảng 20 tháp còn tương đối nguyên vẹn. "
            "Nghệ thuật điêu khắc Chăm Pa tại Mỹ Sơn thể hiện ảnh hưởng của văn hóa Ấn Độ qua các phù điêu vũ nữ Apsara, "
            "tượng thần Shiva, Ganesha và Brahma. "
            "Khu vực: Quảng Nam. Triều đại: Chăm Pa (thế kỷ 4–13). Loại: Di sản văn hóa, đền tháp Hindu."
        ),
    },
    {
        "name": "Vườn quốc gia Phong Nha - Kẻ Bàng",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Vườn quốc gia Phong Nha – Kẻ Bàng là Di sản Thiên nhiên Thế giới UNESCO được công nhận năm 2003 và mở rộng năm 2015. "
            "Tọa lạc tại tỉnh Quảng Bình, miền Trung Việt Nam, vườn quốc gia rộng hơn 123.000 ha. "
            "Phong Nha – Kẻ Bàng sở hữu hệ thống hang động karst vĩ đại nhất thế giới, "
            "trong đó Hang Sơn Đoòng (phát hiện năm 1991, khảo sát năm 2009) là hang động lớn nhất thế giới "
            "với chiều dài 9 km, chiều cao 200 m và chiều rộng 150 m. "
            "Các hang động nổi tiếng khác: Hang Phong Nha, Hang En, Hang Tiên Sơn, Hang Va, Hang Tối. "
            "Rừng nguyên sinh tại đây là nơi sinh sống của nhiều loài động thực vật quý hiếm. "
            "Khu vực: Quảng Bình. Loại: Di sản thiên nhiên, hệ thống hang động karst."
        ),
    },
    {
        "name": "Quần thể danh thắng Tràng An",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Quần thể danh thắng Tràng An là Di sản Hỗn hợp Văn hóa và Thiên nhiên Thế giới UNESCO được công nhận năm 2014, "
            "là di sản hỗn hợp đầu tiên của Việt Nam. "
            "Nằm tại tỉnh Ninh Bình, khu di sản rộng 6.172 ha bao gồm ba khu vực: "
            "Khu du lịch sinh thái Tràng An, Khu bảo tồn thiên nhiên Hoa Lư và Khu du lịch Tam Cốc – Bích Động. "
            "Giá trị địa chất: địa hình karst nhiệt đới ngập nước với hàng chục ngọn núi đá vôi dựng đứng và hệ thống hang động "
            "liên thông, trong đó có di tích người tiền sử sinh sống từ 30.000 năm trước. "
            "Giá trị văn hóa: Cố đô Hoa Lư – kinh đô đầu tiên của nhà nước phong kiến Việt Nam thống nhất (968–1010), "
            "nơi phát tích của ba triều đại Đinh, Tiền Lê, và khởi nguồn triều Lý. "
            "Cố đô Hoa Lư có Đền Vua Đinh Tiên Hoàng và Đền Vua Lê Đại Hành xây từ thế kỷ 10–17. "
            "Khu vực: Ninh Bình. Loại: Di sản hỗn hợp văn hóa và thiên nhiên. Năm công nhận: 2014."
        ),
    },
    {
        "name": "Hoàng thành Thăng Long",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Hoàng thành Thăng Long là Di sản Văn hóa Thế giới UNESCO được công nhận năm 2010. "
            "Tọa lạc tại trung tâm Hà Nội, đây là khu di tích lịch sử quan trọng bậc nhất của Việt Nam, "
            "phản ánh lịch sử gần 1.300 năm của kinh đô Thăng Long – Hà Nội. "
            "Được xây dựng từ năm 1010 dưới triều vua Lý Thái Tổ, Hoàng thành trải qua nhiều triều đại: Lý, Trần, Lê Sơ, Mạc, Lê Trung Hưng, Nguyễn. "
            "Khu di tích bao gồm: Cột cờ Hà Nội (xây năm 1812), Đoan Môn, Điện Kính Thiên, Hậu Lâu, Cửa Bắc, "
            "và khu khảo cổ 18 Hoàng Diệu với hàng triệu hiện vật từ thế kỷ 7 đến 20. "
            "Đây là trung tâm quyền lực chính trị liên tục suốt lịch sử các triều đại phong kiến Việt Nam. "
            "Khu vực: Hà Nội. Triều đại: Lý – Trần – Lê – Nguyễn (1010–1945). Loại: Di sản văn hóa."
        ),
    },
    {
        "name": "Thành Nhà Hồ",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Thành Nhà Hồ (Tây Đô) là Di sản Văn hóa Thế giới UNESCO được công nhận năm 2011. "
            "Tọa lạc tại huyện Vĩnh Lộc, tỉnh Thanh Hóa, Thành Nhà Hồ được xây dựng năm 1397 dưới thời Hồ Quý Ly. "
            "Đây là công trình kiến trúc quân sự bằng đá khổng lồ, được xây hoàn toàn bằng đá xanh khối lớn (mỗi phiến nặng tới 24 tấn) "
            "không dùng chất kết dính, theo kỹ thuật tiên tiến nhất châu Á thế kỷ 14. "
            "Tường thành hình chữ nhật dài 870 m (Bắc–Nam) và 883 m (Đông–Tây), cao trung bình 8 m. "
            "Thành là kinh đô của nhà Hồ (1400–1407) và chứng kiến cuộc kháng chiến chống quân Minh. "
            "Khu vực: Thanh Hóa. Triều đại: Nhà Hồ (1400–1407). Năm xây: 1397."
        ),
    },

    # ── Hà Nội Heritage Sites ────────────────────────────────────────────────
    {
        "name": "Văn Miếu - Quốc Tử Giám",
        "source": "dsvh.gov.vn / baotanglichsu.vn",
        "content": (
            "Văn Miếu – Quốc Tử Giám là di tích lịch sử văn hóa quốc gia đặc biệt tại Hà Nội, "
            "được xây dựng năm 1070 dưới triều vua Lý Thánh Tông để thờ Khổng Tử và các bậc hiền triết Nho giáo. "
            "Năm 1076, Quốc Tử Giám được thành lập trong khuôn viên Văn Miếu, trở thành trường đại học đầu tiên của Việt Nam, "
            "đào tạo nhân tài cho đất nước suốt 700 năm. "
            "Khu di tích nổi tiếng với 82 tấm bia đá Tiến sĩ (Văn bia tiến sĩ) được khắc từ năm 1484 đến 1780, "
            "ghi danh 1.307 vị tiến sĩ đỗ đạt qua 82 khoa thi Hội thời Lê. "
            "Năm 2010, bia đá tiến sĩ được UNESCO công nhận là Di sản Tư liệu thế giới. "
            "Khu vực: Hà Nội. Triều đại: Nhà Lý (1070). Chức năng: Đền thờ Nho giáo và trường đại học."
        ),
    },
    {
        "name": "Chùa Một Cột",
        "source": "dsvh.gov.vn",
        "content": (
            "Chùa Một Cột (Diên Hựu Tự hoặc Liên Hoa Đài) là di tích lịch sử nằm tại Ba Đình, Hà Nội. "
            "Được xây dựng năm 1049 dưới triều vua Lý Thái Tông theo giấc mơ Phật Quan Âm tọa trên đài hoa sen, "
            "chùa có kiến trúc độc đáo: một ngôi chùa nhỏ đặt trên cột đá duy nhất giữa hồ nước, "
            "mô phỏng hình ảnh hoa sen nở trong đầm. "
            "Chùa đã trải qua nhiều lần trùng tu, đặc biệt năm 1954 sau khi quân Pháp phá hủy trước khi rút khỏi Hà Nội. "
            "Đây là một trong những biểu tượng kiến trúc Phật giáo đặc sắc và được in trên tiền đồng cổ Việt Nam. "
            "Khu vực: Hà Nội. Triều đại: Nhà Lý (1049). Loại: Chùa Phật giáo, kiến trúc độc trụ."
        ),
    },
    {
        "name": "Hồ Hoàn Kiếm và Đền Ngọc Sơn",
        "source": "dsvh.gov.vn",
        "content": (
            "Hồ Hoàn Kiếm (Hồ Gươm) và Đền Ngọc Sơn là di tích lịch sử văn hóa cấp quốc gia tại trung tâm Hà Nội. "
            "Huyền thoại gươm thần: Vua Lê Lợi được Long Quân cho mượn gươm thần đánh đuổi giặc Minh (1418–1428), "
            "sau khi thắng, vua hoàn trả gươm cho rùa thần tại hồ này, từ đó hồ mang tên Hoàn Kiếm (trả gươm). "
            "Tháp Rùa (thế kỷ 19) nằm trên đảo nhỏ giữa hồ, là biểu tượng của Hà Nội. "
            "Đền Ngọc Sơn được xây dựng từ thế kỷ 19 trên đảo Ngọc, thờ Hưng Đạo Vương Trần Quốc Tuấn và Văn Xương đế quân. "
            "Cầu Thê Húc màu đỏ son bắc qua hồ nối vào đền là một trong những hình ảnh đặc trưng nhất của Hà Nội. "
            "Khu vực: Hà Nội. Loại: Thắng cảnh lịch sử, đền thờ. Xây: thế kỷ 19."
        ),
    },
    {
        "name": "Đền Hùng",
        "source": "dsvh.gov.vn",
        "content": (
            "Đền Hùng là khu di tích quốc gia đặc biệt tọa lạc trên núi Nghĩa Lĩnh (núi Hùng), huyện Phú Thọ, tỉnh Phú Thọ. "
            "Đây là nơi thờ phụng các Vua Hùng – tổ tiên của người Việt Nam, người đã lập nên nhà nước Văn Lang cổ đại. "
            "Khu di tích gồm bốn đền chính: Đền Hạ, Đền Trung, Đền Thượng và Đền Giếng, cùng Lăng Vua Hùng. "
            "Hằng năm, vào ngày 10 tháng 3 âm lịch, Giỗ Tổ Hùng Vương được tổ chức trọng thể, "
            "thu hút hàng triệu người dân từ khắp cả nước về hành hương. "
            "Năm 2012, 'Tín ngưỡng thờ cúng Hùng Vương ở Phú Thọ' được UNESCO công nhận là Di sản Văn hóa Phi vật thể của nhân loại. "
            "Khu vực: Phú Thọ. Loại: Đền thờ tổ tiên, di tích lịch sử quốc gia đặc biệt."
        ),
    },

    # ── Hồ Chí Minh City & South ────────────────────────────────────────────
    {
        "name": "Địa đạo Củ Chi",
        "source": "dsvh.gov.vn",
        "content": (
            "Địa đạo Củ Chi là di tích lịch sử cách mạng quốc gia tọa lạc tại huyện Củ Chi, TP. Hồ Chí Minh. "
            "Đây là hệ thống đường hầm ngầm dài hơn 250 km, được quân dân Củ Chi đào từ những năm 1940–1960 "
            "để phục vụ chiến đấu chống thực dân Pháp và đế quốc Mỹ. "
            "Địa đạo có nhiều tầng sâu, bao gồm các phòng ở, kho lương thực, bệnh xá, nhà bếp, và các vị trí chiến đấu. "
            "Trong chiến tranh chống Mỹ, địa đạo là 'căn cứ lòng đất' giúp hàng nghìn chiến sĩ và nhân dân sống sót "
            "trước các cuộc ném bom và càn quét của Mỹ. Hai điểm tham quan chính: Bến Dược và Bến Đình. "
            "Khu vực: TP. Hồ Chí Minh. Loại: Di tích lịch sử kháng chiến. Niên đại: 1940s–1975."
        ),
    },
    {
        "name": "Nhà thờ Đức Bà Sài Gòn",
        "source": "dsvh.gov.vn",
        "content": (
            "Nhà thờ Đức Bà Sài Gòn (Vương cung Thánh đường Chính tòa Đức Mẹ Vô Nhiễm Nguyên Tội) là công trình kiến trúc Công giáo "
            "tiêu biểu tại TP. Hồ Chí Minh, được xây dựng từ năm 1877 đến 1880 dưới thời Pháp thuộc. "
            "Thiết kế theo phong cách Roman phục hưng, toàn bộ vật liệu xây dựng được nhập từ Pháp, "
            "bao gồm gạch đỏ Marseille đặc trưng chưa từng bị bạc màu sau hơn 140 năm. "
            "Hai tháp chuông cao 57,6 m là điểm nhấn nổi bật của công trình. "
            "Trước nhà thờ có tượng Đức Mẹ Hòa Bình bằng đá cẩm thạch Carrara của Ý, dựng năm 1959. "
            "Năm 2016, Tòa Thánh Vatican nâng cấp lên hàng Vương cung Thánh đường (Basilica). "
            "Khu vực: TP. Hồ Chí Minh. Loại: Công trình kiến trúc Công giáo thời Pháp thuộc. Xây: 1877–1880."
        ),
    },
    {
        "name": "Dinh Độc Lập",
        "source": "dsvh.gov.vn",
        "content": (
            "Dinh Độc Lập (còn gọi là Dinh Thống Nhất) là di tích lịch sử quốc gia đặc biệt tại TP. Hồ Chí Minh. "
            "Tòa nhà hiện tại được xây dựng từ năm 1962 đến 1966, thiết kế bởi kiến trúc sư Ngô Viết Thụ, "
            "người Việt Nam đầu tiên đoạt giải thưởng Rome về kiến trúc. "
            "Dinh từng là nơi ở và làm việc của Tổng thống Việt Nam Cộng hòa. "
            "Ngày 30/4/1975, xe tăng quân Giải phóng húc đổ cổng Dinh Độc Lập – khoảnh khắc lịch sử đánh dấu sự kết thúc "
            "của chiến tranh Việt Nam và ngày thống nhất đất nước. "
            "Dinh hiện là bảo tàng với các phòng làm việc, hầm chỉ huy và hệ thống thông tin liên lạc được giữ nguyên. "
            "Khu vực: TP. Hồ Chí Minh. Loại: Dinh thự lịch sử chính trị. Xây: 1962–1966."
        ),
    },
    {
        "name": "Côn Đảo",
        "source": "dsvh.gov.vn",
        "content": (
            "Côn Đảo là quần đảo thuộc tỉnh Bà Rịa – Vũng Tàu, cách TP. Hồ Chí Minh khoảng 230 km. "
            "Hệ thống nhà tù Côn Đảo là di tích lịch sử quốc gia đặc biệt, "
            "được thực dân Pháp xây dựng từ năm 1862, sau đó tiếp tục sử dụng bởi chính quyền Việt Nam Cộng hòa và quân Mỹ. "
            "Nhà tù nổi tiếng với 'chuồng cọp' – những phòng giam chật hẹp, thiếu ánh sáng và không khí, nơi tra tấn tù nhân. "
            "Nghĩa trang Hàng Dương là nơi yên nghỉ của hàng nghìn liệt sĩ, trong đó có nữ anh hùng Võ Thị Sáu. "
            "Hiện nay Côn Đảo còn là vườn quốc gia với hệ sinh thái biển phong phú, rùa biển đẻ trứng và rạn san hô đa dạng. "
            "Khu vực: Bà Rịa – Vũng Tàu. Loại: Di tích lịch sử kháng chiến, nhà tù thực dân."
        ),
    },

    # ── Miền Trung ──────────────────────────────────────────────────────────
    {
        "name": "Chùa Thiên Mụ",
        "source": "dsvh.gov.vn",
        "content": (
            "Chùa Thiên Mụ là ngôi chùa cổ nhất và nổi tiếng nhất tại Huế, tọa lạc trên đồi Hà Khê bên dòng sông Hương. "
            "Được xây dựng năm 1601 dưới thời chúa Nguyễn Hoàng, chùa gắn liền với câu chuyện bà tiên áo đỏ báo mộng về vùng đất thiêng. "
            "Tháp Phước Duyên 7 tầng cao 21 m xây năm 1844 dưới triều vua Thiệu Trị là biểu tượng của Huế và Việt Nam. "
            "Chùa còn lưu giữ nhiều cổ vật quý: đại hồng chung đúc năm 1710, bia đá khắc từ thế kỷ 17, "
            "và chiếc xe Austin Austin Westminster – chiếc xe của Hòa thượng Thích Quảng Đức trước khi tự thiêu năm 1963. "
            "Khu vực: Thừa Thiên Huế. Triều đại: Chúa Nguyễn – Nhà Nguyễn. Xây: 1601. Loại: Chùa Phật giáo."
        ),
    },
    {
        "name": "Khu di tích Mỹ Lai",
        "source": "dsvh.gov.vn",
        "content": (
            "Khu chứng tích Sơn Mỹ (Mỹ Lai) là di tích lịch sử quốc gia tại xã Tịnh Khê, huyện Sơn Tịnh, tỉnh Quảng Ngãi. "
            "Nơi đây ghi dấu vụ thảm sát Mỹ Lai ngày 16/3/1968, khi quân đội Mỹ giết hại 504 thường dân Việt Nam vô tội "
            "tại các thôn Mỹ Lai, Mỹ Khê và Cổ Lũy. "
            "Khu chứng tích bao gồm bảo tàng với ảnh tư liệu, hiện vật; khu tưởng niệm với tượng đài bi tráng "
            "và các dấu tích gốc của ngôi làng bị thiêu hủy: nền nhà, giếng cũ, hố chôn tập thể. "
            "Vụ thảm sát được phóng viên Seymour Hersh điều tra và công bố năm 1969, gây chấn động lương tâm thế giới "
            "và ảnh hưởng mạnh mẽ đến phong trào phản chiến tại Mỹ. "
            "Khu vực: Quảng Ngãi. Loại: Di tích lịch sử kháng chiến, chứng tích chiến tranh."
        ),
    },
    {
        "name": "Ngũ Hành Sơn (Marble Mountains)",
        "source": "dsvh.gov.vn",
        "content": (
            "Ngũ Hành Sơn (Marble Mountains) là cụm năm ngọn núi đá vôi và đá cẩm thạch tại quận Ngũ Hành Sơn, Đà Nẵng. "
            "Năm ngọn núi mang tên năm yếu tố trong ngũ hành: Kim, Mộc, Thủy, Hỏa, Thổ. "
            "Núi Thủy Sơn là lớn nhất và có nhiều hang động, chùa chiền, tháp cổ nhất, "
            "trong đó nổi tiếng là động Huyền Không (hang tự nhiên với ánh sáng thiên đường), chùa Tam Thai và chùa Linh Ứng. "
            "Ngũ Hành Sơn là trung tâm nghề điêu khắc đá cẩm thạch truyền thống của Đà Nẵng từ thế kỷ 17. "
            "Trong lịch sử, đây là căn cứ cách mạng quan trọng trong kháng chiến chống Pháp và Mỹ. "
            "Khu vực: Đà Nẵng. Loại: Thắng cảnh thiên nhiên, di tích lịch sử văn hóa."
        ),
    },
    {
        "name": "Tháp Bà Ponagar",
        "source": "dsvh.gov.vn",
        "content": (
            "Tháp Bà Ponagar (Tháp Bà – Po Nagar) là cụm đền tháp Chăm Pa tại thành phố Nha Trang, tỉnh Khánh Hòa. "
            "Được xây dựng từ thế kỷ 7 đến thế kỷ 12, khu di tích thờ thần mẹ xứ sở Ponagar (Yang Po Inư Nagar) "
            "– vị nữ thần tối cao của người Chăm, theo tín ngưỡng bản địa là người đã tạo ra đất, cây gỗ và lúa gạo. "
            "Khu tháp gồm bốn tháp chính trên đỉnh đồi nhìn ra cửa sông Cái, "
            "trong đó tháp chính cao 23 m bảo tồn tương đối nguyên vẹn với nghệ thuật điêu khắc Chăm Pa tinh xảo. "
            "Hàng năm lễ hội Tháp Bà Ponagar (từ 20–23 tháng 3 âm lịch) thu hút hàng nghìn tín đồ Chăm và người Kinh. "
            "Khu vực: Khánh Hòa (Nha Trang). Triều đại: Chăm Pa (thế kỷ 7–12). Loại: Đền tháp Hindu–Chăm."
        ),
    },
    {
        "name": "Thành cổ Quảng Trị",
        "source": "dsvh.gov.vn",
        "content": (
            "Thành cổ Quảng Trị là di tích lịch sử quốc gia đặc biệt tại thị xã Quảng Trị, tỉnh Quảng Trị. "
            "Thành được xây dựng thời nhà Nguyễn (đầu thế kỷ 19), theo kiến trúc Vauban của Pháp, hình vuông với bốn cổng thành. "
            "Thành cổ gắn liền với '81 ngày đêm chiến đấu bảo vệ Thành cổ Quảng Trị' (28/6–16/9/1972), "
            "một trong những trận chiến khốc liệt nhất trong lịch sử chiến tranh Việt Nam, "
            "khi hàng nghìn chiến sĩ và nhân dân hy sinh để bảo vệ từng tấc đất thành cổ. "
            "Ngày nay, bên trong thành là bãi cỏ xanh với đài tưởng niệm và chứng tích chiến tranh. "
            "Khu vực: Quảng Trị. Triều đại: Nhà Nguyễn (đầu thế kỷ 19). Loại: Di tích lịch sử kháng chiến."
        ),
    },

    # ── Miền Bắc ──────────────────────────────────────────────────────────────
    {
        "name": "Cố đô Hoa Lư",
        "source": "dsvh.gov.vn",
        "content": (
            "Cố đô Hoa Lư là di tích lịch sử quốc gia đặc biệt tại tỉnh Ninh Bình, "
            "kinh đô của nhà nước Đại Cồ Việt từ năm 968 đến 1010, dưới ba triều đại Đinh, Tiền Lê và đầu triều Lý. "
            "Đinh Bộ Lĩnh (Đinh Tiên Hoàng) thống nhất 12 sứ quân năm 968, lập nước Đại Cồ Việt và đóng đô tại Hoa Lư. "
            "Hoa Lư được chọn làm kinh đô vì địa thế hiểm yếu: núi đá bao bọc bốn phía như bức tường thành thiên nhiên. "
            "Khu di tích gồm: Đền vua Đinh Tiên Hoàng (thờ Đinh Bộ Lĩnh và các con) và Đền vua Lê Đại Hành, "
            "được xây dựng từ thế kỷ 10, trùng tu qua nhiều triều đại. "
            "Năm 1010, vua Lý Thái Tổ dời đô từ Hoa Lư ra Thăng Long (Hà Nội ngày nay). "
            "Khu vực: Ninh Bình. Triều đại: Đinh (968–980), Tiền Lê (980–1009). Loại: Cố đô, di tích lịch sử."
        ),
    },
    {
        "name": "Nhà thờ Đá Phát Diệm",
        "source": "dsvh.gov.vn",
        "content": (
            "Quần thể Nhà thờ Phát Diệm là di tích kiến trúc Công giáo đặc sắc tại huyện Kim Sơn, tỉnh Ninh Bình. "
            "Được xây dựng từ năm 1875 đến 1898 dưới sự chỉ đạo của Linh mục Trần Lục (Cụ Sáu), "
            "quần thể gồm nhà thờ chính (dài 74 m, rộng 21 m, cao 15 m), bốn nhà thờ phụ, hồ nước, hang đá nhân tạo. "
            "Điểm đặc biệt: kiến trúc kết hợp hoàn hảo giữa phong cách Công giáo châu Âu và kiến trúc đình chùa Việt Nam, "
            "toàn bộ xây bằng đá xanh nguyên khối và gỗ lim không dùng xi măng. "
            "Nhà thờ Phát Diệm là ví dụ tiêu biểu của nghệ thuật kiến trúc Á–Âu giao thoa độc nhất vô nhị ở Việt Nam. "
            "Khu vực: Ninh Bình. Loại: Công trình kiến trúc Công giáo. Xây: 1875–1898."
        ),
    },
    {
        "name": "Đền Kiếp Bạc",
        "source": "dsvh.gov.vn",
        "content": (
            "Đền Kiếp Bạc là di tích lịch sử quốc gia đặc biệt tại xã Hưng Đạo, huyện Chí Linh, tỉnh Hải Dương. "
            "Đây là nơi thờ Hưng Đạo Đại Vương Trần Quốc Tuấn (1228–1300) – vị tướng thiên tài, Quốc công Tiết chế, "
            "người ba lần chỉ huy quân dân Đại Việt đánh bại quân Mông – Nguyên (1258, 1285, 1288). "
            "Đền nằm trong thung lũng Kiếp Bạc, nơi ông từng đặt đại bản doanh trước các trận chiến. "
            "Hội đền Kiếp Bạc (18–20 tháng 8 âm lịch) là lễ hội lớn với nghi lễ đặc biệt 'đua thuyền rồng' trên sông Lục Đầu. "
            "Khu vực: Hải Dương. Triều đại: Nhà Trần (thế kỷ 13). Loại: Đền thờ danh nhân lịch sử."
        ),
    },
    {
        "name": "Núi Yên Tử",
        "source": "dsvh.gov.vn",
        "content": (
            "Khu di tích danh thắng Yên Tử là di tích lịch sử quốc gia đặc biệt tại thành phố Uông Bí, tỉnh Quảng Ninh. "
            "Yên Tử là trung tâm Phật giáo thiêng liêng nhất Việt Nam, nơi vua Trần Nhân Tông (1258–1308) "
            "từ bỏ ngai vàng, xuất gia tu hành và sáng lập Thiền phái Trúc Lâm Yên Tử – dòng Phật giáo mang bản sắc Việt Nam. "
            "Hệ thống di tích trải dài theo đường núi cao 1.068 m gồm: Chùa Đồng (trên đỉnh núi), "
            "Chùa Giải Oan, Tháp Huệ Quang thờ vua Trần Nhân Tông, Chùa Một Mái, rừng trúc huyền bí. "
            "Hàng năm, lễ hội mùa xuân Yên Tử (từ mùng 10 tháng Giêng âm lịch) thu hút hàng triệu khách hành hương. "
            "Khu vực: Quảng Ninh. Triều đại: Nhà Trần (thế kỷ 13–14). Loại: Khu di tích Phật giáo."
        ),
    },

    # ── Tây Nguyên & Miền Nam ─────────────────────────────────────────────────
    {
        "name": "Khu di tích Điện Biên Phủ",
        "source": "dsvh.gov.vn",
        "content": (
            "Khu di tích lịch sử Chiến trường Điện Biên Phủ là di tích quốc gia đặc biệt tại thành phố Điện Biên Phủ, tỉnh Điện Biên. "
            "Trận Điện Biên Phủ (13/3 – 7/5/1954) là chiến thắng lịch sử của quân dân Việt Nam "
            "dưới sự chỉ huy của Đại tướng Võ Nguyên Giáp, đánh bại tập đoàn cứ điểm kiên cố của thực dân Pháp "
            "sau 56 ngày đêm chiến đấu gian khổ, kết thúc chiến tranh Đông Dương lần thứ nhất. "
            "Khu di tích bao gồm: Đồi A1 (đỉnh cao quyết định trận chiến), Hầm Đờ Cát (sở chỉ huy Pháp), "
            "Nghĩa trang liệt sĩ Điện Biên Phủ, Bảo tàng Chiến thắng Điện Biên Phủ, "
            "và các cứ điểm: Him Lam, Độc Lập, Bản Kéo. "
            "Khu vực: Điện Biên. Loại: Di tích lịch sử cách mạng. Niên đại: 1954."
        ),
    },
    {
        "name": "Không gian văn hóa Cồng chiêng Tây Nguyên",
        "source": "dsvh.gov.vn / whc.unesco.org",
        "content": (
            "Không gian văn hóa cồng chiêng Tây Nguyên được UNESCO công nhận là Di sản Văn hóa Phi vật thể đại diện của nhân loại năm 2005. "
            "Cồng chiêng là nhạc cụ thiêng liêng của các dân tộc thiểu số Tây Nguyên: Ba Na, Gia Rai, Ê Đê, Cơ Ho, Mạ, Xơ Đăng, Mnông. "
            "Mỗi bộ cồng chiêng gồm 2–12 cái (có bộ đến 20 cái) được chế tác từ hợp kim đồng, "
            "mỗi chiếc có âm thanh và ký hiệu riêng, sử dụng trong các lễ nghi: mừng lúa mới, bỏ mả, cúng bến nước. "
            "Văn hóa cồng chiêng trải rộng trên năm tỉnh Tây Nguyên: Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông, Lâm Đồng. "
            "Khu vực: Tây Nguyên. Loại: Di sản văn hóa phi vật thể UNESCO."
        ),
    },

    # ── Thiên nhiên & Vùng ─────────────────────────────────────────────────────
    {
        "name": "Đèo Hải Vân",
        "source": "dsvh.gov.vn",
        "content": (
            "Đèo Hải Vân (Hải Vân Quan) là đèo núi nổi tiếng vượt qua dãy núi Bạch Mã, "
            "nằm trên ranh giới giữa tỉnh Thừa Thiên Huế và thành phố Đà Nẵng, cao 496 m so với mực nước biển. "
            "Đèo dài khoảng 21 km trên Quốc lộ 1A, từng được CNN bình chọn là một trong những cung đường ven biển đẹp nhất thế giới. "
            "Hải Vân Quan là cổng thành cổ xây từ thế kỷ 15 dưới triều Lê Thánh Tông, "
            "từng là ranh giới địa lý và khí hậu phân chia bắc nam Việt Nam (ranh giới khí hậu nhiệt đới và cận nhiệt đới). "
            "Trong chiến tranh, đèo Hải Vân là điểm chiến lược quan trọng được nhiều phe kiểm soát. "
            "Khu vực: Thừa Thiên Huế / Đà Nẵng. Loại: Đèo thiên nhiên, di tích lịch sử."
        ),
    },
    {
        "name": "Sa Pa",
        "source": "dsvh.gov.vn",
        "content": (
            "Sa Pa là thị xã vùng cao thuộc tỉnh Lào Cai, miền núi phía Bắc Việt Nam, cao khoảng 1.500–1.600 m so với mực nước biển. "
            "Nổi tiếng với phong cảnh núi non hùng vĩ, ruộng bậc thang và văn hóa đặc sắc của các dân tộc thiểu số: "
            "H'Mông, Dao Đỏ, Tày, Giáy. Đỉnh Fansipan (3.143 m) – 'Nóc nhà Đông Dương' nằm trong dãy Hoàng Liên Sơn gần Sa Pa. "
            "Vườn quốc gia Hoàng Liên rộng 29.845 ha là khu bảo tồn thiên nhiên với hệ thực vật phong phú. "
            "Sa Pa được người Pháp xây dựng làm khu nghỉ dưỡng từ năm 1903, còn sót lại nhiều công trình kiến trúc Pháp. "
            "Ruộng bậc thang Mù Cang Chải gần Sa Pa được công nhận là danh lam thắng cảnh quốc gia đặc biệt. "
            "Khu vực: Lào Cai. Loại: Khu du lịch văn hóa, thiên nhiên và cộng đồng dân tộc."
        ),
    },
    {
        "name": "Vịnh Lan Hạ - Cát Bà",
        "source": "whc.unesco.org / dsvh.gov.vn",
        "content": (
            "Vịnh Hạ Long – Quần đảo Cát Bà được mở rộng công nhận Di sản Thiên nhiên Thế giới UNESCO năm 2023. "
            "Quần đảo Cát Bà gồm 367 đảo, trong đó đảo Cát Bà là đảo lớn nhất, thuộc thành phố Hải Phòng. "
            "Vườn quốc gia Cát Bà rộng 16.196 ha, là nơi sinh sống của voọc Cát Bà (Trachypithecus poliocephalus) – "
            "loài linh trưởng đặc hữu cực kỳ nguy cấp chỉ còn khoảng 60–70 con. "
            "Vịnh Lan Hạ (Lan Ha Bay) nằm phía đông nam đảo Cát Bà, được coi là viên ngọc ẩn với vẻ đẹp hoang sơ hơn Hạ Long. "
            "Hệ sinh thái rừng nhiệt đới, rừng ngập mặn, hệ thống hang động và bãi biển tạo nên cảnh quan đa dạng. "
            "Khu vực: Hải Phòng. Loại: Di sản thiên nhiên UNESCO, vườn quốc gia."
        ),
    },
    {
        "name": "Lăng Chủ tịch Hồ Chí Minh",
        "source": "dsvh.gov.vn",
        "content": (
            "Lăng Chủ tịch Hồ Chí Minh là công trình kiến trúc tại Quảng trường Ba Đình, Hà Nội, "
            "nơi lưu giữ thi hài của Chủ tịch Hồ Chí Minh (1890–1969) – lãnh tụ và anh hùng giải phóng dân tộc Việt Nam. "
            "Lăng được xây dựng từ năm 1973 đến 1975 theo phong cách kiến trúc kết hợp giữa hiện đại và truyền thống Việt Nam, "
            "bằng các vật liệu quý từ khắp mọi miền đất nước. "
            "Công trình nằm trên nền đài nguyên tắc Ba Đình lịch sử – nơi Bác Hồ đọc Tuyên ngôn Độc lập ngày 2/9/1945. "
            "Khuôn viên rộng lớn còn có Bảo tàng Hồ Chí Minh, Nhà sàn Bác Hồ và Khu di tích Phủ Chủ tịch. "
            "Khu vực: Hà Nội. Loại: Lăng mộ và khu tưởng niệm lãnh tụ. Xây: 1973–1975."
        ),
    },
    {
        "name": "Đình làng Đình Bảng",
        "source": "dsvh.gov.vn",
        "content": (
            "Đình làng Đình Bảng là di tích kiến trúc nghệ thuật quốc gia đặc biệt tại thị xã Từ Sơn, tỉnh Bắc Ninh. "
            "Được xây dựng năm 1700–1736 dưới triều Lê Trung Hưng, đây là một trong những ngôi đình làng lớn và đẹp nhất Việt Nam. "
            "Đình thờ thần Cao Sơn Đại Vương – vị thần che chở dân làng. "
            "Kiến trúc đình gồm 7 gian 2 chái, mái đình cong vút theo phong cách đình làng Bắc Bộ, "
            "với hệ thống chạm khắc gỗ tinh xảo mô tả cảnh sinh hoạt dân dã và hoa lá thiên nhiên. "
            "Đình Bảng nằm gần di tích Đền Đô (Cổ Pháp) – nơi thờ 8 vị vua đầu triều Lý. "
            "Khu vực: Bắc Ninh. Triều đại: Lê Trung Hưng (1700–1736). Loại: Đình làng, kiến trúc dân gian."
        ),
    },
    {
        "name": "Phố cổ Đồng Văn",
        "source": "dsvh.gov.vn",
        "content": (
            "Phố cổ Đồng Văn là di tích lịch sử văn hóa quốc gia tại huyện Đồng Văn, tỉnh Hà Giang, "
            "tọa lạc trên Cao nguyên đá Đồng Văn – di sản địa chất đầu tiên của Việt Nam được Mạng lưới Công viên Địa chất Toàn cầu UNESCO công nhận năm 2010. "
            "Phố cổ hình thành cuối thế kỷ 19 đầu thế kỷ 20, kiến trúc nhà cổ pha trộn phong cách dân tộc Mông, Hoa và Pháp "
            "với tường đá phiến, mái ngói cổ và cổng vòm đặc trưng. "
            "Dinh thự họ Vương (Vua Mèo) tại Đồng Văn, xây năm 1919, là công trình kiến trúc độc đáo kết hợp Á–Âu của thủ lĩnh người H'Mông. "
            "Cao nguyên đá Đồng Văn có địa hình karst đá vôi hùng vĩ, là nơi sinh sống của đồng bào H'Mông, Lô Lô, Pu Péo, Giáy. "
            "Khu vực: Hà Giang. Loại: Di sản địa chất, phố cổ, kiến trúc dân tộc thiểu số."
        ),
    },
    {
        "name": "Khu sinh thái rừng ngập mặn Cần Giờ",
        "source": "dsvh.gov.vn",
        "content": (
            "Rừng ngập mặn Cần Giờ là Khu Dự trữ Sinh quyển Thế giới UNESCO được công nhận năm 2000, "
            "tọa lạc tại huyện Cần Giờ, TP. Hồ Chí Minh. "
            "Được mệnh danh là 'lá phổi xanh của TP. Hồ Chí Minh', khu rừng rộng 75.740 ha "
            "là hệ sinh thái rừng ngập mặn khôi phục từ sau chiến tranh (bị chất độc hóa học Agent Orange tàn phá). "
            "Rừng là nơi sinh sống của đàn khỉ đuôi dài hoang dã (khoảng 1.000 con), cá sấu nước lợ, nhiều loài chim di cư và thú quý hiếm. "
            "Khu căn cứ cách mạng Rừng Sác (trong rừng Cần Giờ) là di tích lịch sử ghi dấu những trận đánh của Đặc công Rừng Sác. "
            "Khu vực: TP. Hồ Chí Minh. Loại: Khu dự trữ sinh quyển UNESCO, rừng ngập mặn."
        ),
    },
]
