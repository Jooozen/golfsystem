// ========================================
// Sample Data for Golf CRM Prototype
// ========================================

const CUSTOMERS = [
  { id: 1, memberNo: "M-0001", name: "田中 太郎", nameKana: "タナカ タロウ", type: "正会員", gender: "男性", birthDate: "1965-03-15", phone: "090-1234-5678", email: "tanaka@example.com", address: "東京都港区赤坂1-2-3", joinDate: "2015-04-01", visits: 156, lastVisit: "2026-02-10", handicap: 12, notes: "VIP対応" },
  { id: 2, memberNo: "M-0002", name: "鈴木 花子", nameKana: "スズキ ハナコ", type: "正会員", gender: "女性", birthDate: "1972-08-20", phone: "090-2345-6789", email: "suzuki@example.com", address: "東京都世田谷区成城4-5-6", joinDate: "2018-06-15", visits: 89, lastVisit: "2026-02-14", handicap: 18, notes: "" },
  { id: 3, memberNo: "M-0003", name: "佐藤 健一", nameKana: "サトウ ケンイチ", type: "平日会員", gender: "男性", birthDate: "1958-12-01", phone: "080-3456-7890", email: "sato.k@example.com", address: "神奈川県横浜市青葉区7-8-9", joinDate: "2020-01-10", visits: 64, lastVisit: "2026-02-08", handicap: 22, notes: "膝の調子に注意" },
  { id: 4, memberNo: "M-0004", name: "山田 美咲", nameKana: "ヤマダ ミサキ", type: "法人会員", gender: "女性", birthDate: "1980-05-25", phone: "090-4567-8901", email: "yamada@corp.example.com", address: "東京都千代田区丸の内1-1-1", joinDate: "2022-03-01", visits: 32, lastVisit: "2026-01-28", handicap: 28, notes: "ABC商事 接待利用多い" },
  { id: 5, memberNo: "M-0005", name: "高橋 誠", nameKana: "タカハシ マコト", type: "正会員", gender: "男性", birthDate: "1970-11-10", phone: "090-5678-9012", email: "takahashi@example.com", address: "千葉県市川市南行徳2-3-4", joinDate: "2016-09-20", visits: 210, lastVisit: "2026-02-16", handicap: 8, notes: "クラブ競技常連" },
  { id: 6, memberNo: "M-0006", name: "伊藤 裕子", nameKana: "イトウ ユウコ", type: "家族会員", gender: "女性", birthDate: "1975-02-14", phone: "080-6789-0123", email: "ito.y@example.com", address: "千葉県市川市南行徳2-3-4", joinDate: "2017-04-01", visits: 78, lastVisit: "2026-02-12", handicap: 24, notes: "高橋誠の配偶者" },
  { id: 7, memberNo: "V-0001", name: "中村 大輔", nameKana: "ナカムラ ダイスケ", type: "ビジター", gender: "男性", birthDate: "1985-07-30", phone: "070-7890-1234", email: "nakamura@example.com", address: "東京都新宿区西新宿5-6-7", joinDate: "", visits: 3, lastVisit: "2026-01-15", handicap: 30, notes: "入会検討中" },
  { id: 8, memberNo: "M-0007", name: "小林 直樹", nameKana: "コバヤシ ナオキ", type: "正会員", gender: "男性", birthDate: "1960-09-05", phone: "090-8901-2345", email: "kobayashi@example.com", address: "埼玉県さいたま市浦和区8-9-10", joinDate: "2010-11-01", visits: 320, lastVisit: "2026-02-15", handicap: 5, notes: "元理事" },
  { id: 9, memberNo: "M-0008", name: "渡辺 さくら", nameKana: "ワタナベ サクラ", type: "平日会員", gender: "女性", birthDate: "1968-04-08", phone: "090-9012-3456", email: "watanabe@example.com", address: "東京都杉並区荻窪3-2-1", joinDate: "2021-07-15", visits: 45, lastVisit: "2026-02-05", handicap: 26, notes: "" },
  { id: 10, memberNo: "V-0002", name: "加藤 隆", nameKana: "カトウ タカシ", type: "ビジター", gender: "男性", birthDate: "1990-01-22", phone: "080-0123-4567", email: "kato@example.com", address: "東京都品川区大崎6-7-8", joinDate: "", visits: 1, lastVisit: "2026-02-16", handicap: 36, notes: "高橋誠の紹介" },
  { id: 11, memberNo: "M-0009", name: "松本 和彦", nameKana: "マツモト カズヒコ", type: "法人会員", gender: "男性", birthDate: "1962-06-18", phone: "090-1111-2222", email: "matsumoto@corp2.example.com", address: "東京都中央区銀座8-8-8", joinDate: "2019-05-01", visits: 48, lastVisit: "2026-02-11", handicap: 15, notes: "XYZ株式会社 代表取締役" },
  { id: 12, memberNo: "M-0010", name: "井上 恵美", nameKana: "イノウエ エミ", type: "正会員", gender: "女性", birthDate: "1978-10-30", phone: "090-3333-4444", email: "inoue@example.com", address: "神奈川県鎌倉市由比ガ浜1-1-1", joinDate: "2017-12-01", visits: 112, lastVisit: "2026-02-13", handicap: 16, notes: "" },
];

const RESERVATIONS = [
  { id: 1, date: "2026-02-17", startTime: "07:00", course: "OUT", holes: 18, customerId: 5, customerName: "高橋 誠", guests: 3, status: "confirmed", notes: "コンペ" },
  { id: 2, date: "2026-02-17", startTime: "07:08", course: "OUT", holes: 18, customerId: 8, customerName: "小林 直樹", guests: 2, status: "confirmed", notes: "" },
  { id: 3, date: "2026-02-17", startTime: "07:16", course: "OUT", holes: 18, customerId: 1, customerName: "田中 太郎", guests: 3, status: "confirmed", notes: "接待" },
  { id: 4, date: "2026-02-17", startTime: "07:24", course: "OUT", holes: 18, customerId: 2, customerName: "鈴木 花子", guests: 1, status: "confirmed", notes: "" },
  { id: 5, date: "2026-02-17", startTime: "07:00", course: "IN", holes: 18, customerId: 11, customerName: "松本 和彦", guests: 3, status: "confirmed", notes: "法人接待" },
  { id: 6, date: "2026-02-17", startTime: "07:08", course: "IN", holes: 18, customerId: 12, customerName: "井上 恵美", guests: 1, status: "pending", notes: "" },
  { id: 7, date: "2026-02-17", startTime: "09:30", course: "OUT", holes: 18, customerId: 3, customerName: "佐藤 健一", guests: 3, status: "confirmed", notes: "" },
  { id: 8, date: "2026-02-18", startTime: "08:00", course: "OUT", holes: 18, customerId: 4, customerName: "山田 美咲", guests: 3, status: "pending", notes: "ABC商事ゴルフコンペ 20名" },
  { id: 9, date: "2026-02-18", startTime: "10:00", course: "IN", holes: 9, customerId: 7, customerName: "中村 大輔", guests: 1, status: "confirmed", notes: "ハーフ希望" },
  { id: 10, date: "2026-02-19", startTime: "07:30", course: "OUT", holes: 18, customerId: 6, customerName: "伊藤 裕子", guests: 0, status: "confirmed", notes: "" },
  { id: 11, date: "2026-02-19", startTime: "08:00", course: "OUT", holes: 18, customerId: 9, customerName: "渡辺 さくら", guests: 3, status: "cancelled", notes: "体調不良でキャンセル" },
  { id: 12, date: "2026-02-20", startTime: "07:00", course: "OUT", holes: 18, customerId: 5, customerName: "高橋 誠", guests: 3, status: "confirmed", notes: "" },
];

const VISIT_HISTORY = [
  { id: 1, customerId: 5, customerName: "高橋 誠", date: "2026-02-16", course: "OUT→IN", score: 78, putts: 30, fairwayKeep: "71%", notes: "ベストスコア更新" },
  { id: 2, customerId: 8, customerName: "小林 直樹", date: "2026-02-15", course: "IN→OUT", score: 74, putts: 28, fairwayKeep: "78%", notes: "" },
  { id: 3, customerId: 2, customerName: "鈴木 花子", date: "2026-02-14", course: "OUT→IN", score: 92, putts: 34, fairwayKeep: "57%", notes: "" },
  { id: 4, customerId: 12, customerName: "井上 恵美", date: "2026-02-13", course: "OUT→IN", score: 88, putts: 32, fairwayKeep: "64%", notes: "" },
  { id: 5, customerId: 6, customerName: "伊藤 裕子", date: "2026-02-12", course: "OUT→IN", score: 98, putts: 36, fairwayKeep: "50%", notes: "" },
  { id: 6, customerId: 11, customerName: "松本 和彦", date: "2026-02-11", course: "IN→OUT", score: 85, putts: 31, fairwayKeep: "64%", notes: "接待利用" },
  { id: 7, customerId: 1, customerName: "田中 太郎", date: "2026-02-10", course: "OUT→IN", score: 82, putts: 30, fairwayKeep: "71%", notes: "" },
  { id: 8, customerId: 3, customerName: "佐藤 健一", date: "2026-02-08", course: "OUT", score: 48, putts: 18, fairwayKeep: "57%", notes: "ハーフのみ" },
  { id: 9, customerId: 9, customerName: "渡辺 さくら", date: "2026-02-05", course: "OUT→IN", score: 102, putts: 38, fairwayKeep: "42%", notes: "" },
  { id: 10, customerId: 10, customerName: "加藤 隆", date: "2026-02-16", course: "OUT→IN", score: 110, putts: 40, fairwayKeep: "35%", notes: "初ラウンド" },
  { id: 11, customerId: 4, customerName: "山田 美咲", date: "2026-01-28", course: "IN→OUT", score: 105, putts: 38, fairwayKeep: "42%", notes: "接待" },
  { id: 12, customerId: 5, customerName: "高橋 誠", date: "2026-02-09", course: "IN→OUT", score: 80, putts: 29, fairwayKeep: "78%", notes: "" },
  { id: 13, customerId: 8, customerName: "小林 直樹", date: "2026-02-08", course: "OUT→IN", score: 72, putts: 27, fairwayKeep: "85%", notes: "シニア月例杯 優勝" },
  { id: 14, customerId: 1, customerName: "田中 太郎", date: "2026-02-01", course: "OUT→IN", score: 84, putts: 32, fairwayKeep: "64%", notes: "" },
  { id: 15, customerId: 7, customerName: "中村 大輔", date: "2026-01-15", course: "OUT→IN", score: 115, putts: 42, fairwayKeep: "28%", notes: "レッスン受講" },
];

const MEMBERSHIP_PLANS = [
  {
    name: "正会員",
    price: "2,200,000",
    unit: "入会金 + 年会費 264,000円/年",
    features: ["平日・土日祝日プレー可", "メンバーフィー適用", "クラブ競技参加可能", "ロッカー利用可", "月例杯・理事長杯への参加", "ゲスト同伴割引あり"],
    memberCount: 450,
  },
  {
    name: "平日会員",
    price: "1,100,000",
    unit: "入会金 + 年会費 132,000円/年",
    features: ["平日のみプレー可", "メンバーフィー適用", "平日クラブ競技参加可能", "ロッカー利用可", "平日月例杯への参加"],
    memberCount: 120,
  },
  {
    name: "法人会員",
    price: "3,300,000",
    unit: "入会金 + 年会費 396,000円/年",
    features: ["平日・土日祝日プレー可", "記名者2名登録可", "メンバーフィー適用", "優先予約枠あり", "コンペ開催サポート", "請求書一括払い対応"],
    memberCount: 85,
    featured: true,
  },
  {
    name: "家族会員",
    price: "550,000",
    unit: "入会金 + 年会費 66,000円/年",
    features: ["正会員の家族限定", "平日・土日祝日プレー可", "メンバーフィー適用", "クラブ競技参加可能"],
    memberCount: 60,
  },
];

const MONTHLY_VISITORS = [
  { month: "9月", count: 1850 },
  { month: "10月", count: 2100 },
  { month: "11月", count: 1920 },
  { month: "12月", count: 1200 },
  { month: "1月", count: 980 },
  { month: "2月", count: 1150 },
];
