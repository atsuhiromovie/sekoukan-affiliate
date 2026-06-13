import { PrefData, JobTypeData, SuccessPoint } from './types';

// ===== 47都道府県マスター =====
// avgSalary: 施工管理の都道府県別平均年収（概算・万円）
// ※実際の数値はGoogleスプレッドシートで上書き可能

export const PREFS: PrefData[] = [
  { id: 'hokkaido', name: '北海道', nameShort: '北海道', region: '北海道', avgSalary: 420, demandLevel: 'medium', majorCity: '札幌市', features: ['大規模公共工事が多い', '厳冬期の施工経験が強みになる', '観光・インフラ整備で需要増'], trendKeywords: ['札幌都心再開発', '北海道新幹線延伸工事', '洋上風力発電基地', '道路・橋梁老朽化対策'] },
  { id: 'aomori', name: '青森県', nameShort: '青森', region: '東北', avgSalary: 400, demandLevel: 'medium', majorCity: '青森市', features: ['再生可能エネルギー案件増加', '農業・食品系施設の建設需要'], trendKeywords: ['洋上風力発電施設', '北海道新幹線青函トンネル改良', '農業・食品工場建設', '防災インフラ整備'] },
  { id: 'iwate', name: '岩手県', nameShort: '岩手', region: '東北', avgSalary: 400, demandLevel: 'medium', majorCity: '盛岡市', features: ['復興関連工事の実績が強みに', '自然豊かな環境でのQOL'], trendKeywords: ['東日本大震災復興事業', '半導体関連工場誘致', '盛岡駅周辺再開発', '再生可能エネルギー施設'] },
  { id: 'miyagi', name: '宮城県', nameShort: '宮城', region: '東北', avgSalary: 430, demandLevel: 'high', majorCity: '仙台市', features: ['東北最大の都市・仙台への集積', '復興需要と新規開発が継続'], trendKeywords: ['仙台駅周辺再開発', '復興公営住宅整備', 'データセンター建設', '物流施設整備'] },
  { id: 'akita', name: '秋田県', nameShort: '秋田', region: '東北', avgSalary: 395, demandLevel: 'low', majorCity: '秋田市', features: ['洋上風力発電の拠点として注目', '生活コスト低でワークライフ充実'], trendKeywords: ['秋田港・能代港洋上風力', '再生可能エネルギー関連施設', '道路・橋梁更新工事', '木質バイオマス発電所'] },
  { id: 'yamagata', name: '山形県', nameShort: '山形', region: '東北', avgSalary: 400, demandLevel: 'medium', majorCity: '山形市', features: ['製造業の工場建設案件が豊富', '首都圏へのアクセスも良好'], trendKeywords: ['山形新幹線高速化工事', '食品・精密機器工場建設', '物流センター整備', '再生可能エネルギー施設'] },
  { id: 'fukushima', name: '福島県', nameShort: '福島', region: '東北', avgSalary: 410, demandLevel: 'medium', majorCity: '福島市', features: ['廃炉・復興事業の長期継続', '再生可能エネルギー施設建設'], trendKeywords: ['東京電力廃炉関連工事', '福島イノベーションコースト', '再生可能エネルギー施設', '復興まちづくり事業'] },
  { id: 'ibaraki', name: '茨城県', nameShort: '茨城', region: '関東', avgSalary: 450, demandLevel: 'high', majorCity: '水戸市', features: ['首都圏近郊の物流・工業施設需要', 'つくば研究学園都市の関連案件'], trendKeywords: ['つくば研究施設建設', 'データセンター大規模整備', '常磐道沿線物流拠点', '半導体・先端工場誘致'] },
  { id: 'tochigi', name: '栃木県', nameShort: '栃木', region: '関東', avgSalary: 445, demandLevel: 'high', majorCity: '宇都宮市', features: ['北関東道沿線の物流拠点化', '工場・倉庫建設案件が安定'], trendKeywords: ['宇都宮LRT延伸', '北関東道沿線物流施設', '自動車部品工場建設', 'データセンター誘致'] },
  { id: 'gunma', name: '群馬県', nameShort: '群馬', region: '関東', avgSalary: 440, demandLevel: 'high', majorCity: '前橋市', features: ['製造業集積で工場建設多数', '自動車関連施設の建設'], trendKeywords: ['EV・自動車工場更新', '大型物流センター建設', '再生可能エネルギー施設', '上信越道沿線開発'] },
  { id: 'saitama', name: '埼玉県', nameShort: '埼玉', region: '関東', avgSalary: 480, demandLevel: 'high', majorCity: 'さいたま市', features: ['首都圏の大規模開発が継続', '物流・住宅建設の需要旺盛'], trendKeywords: ['さいたま新都心再開発', '大宮駅グランドセントラルステーション', '物流施設2024年問題対応', 'データセンター集積'] },
  { id: 'chiba', name: '千葉県', nameShort: '千葉', region: '関東', avgSalary: 480, demandLevel: 'high', majorCity: '千葉市', features: ['湾岸エリアの大型プロジェクト', '成田空港周辺の開発案件'], trendKeywords: ['成田空港第3滑走路工事', '幕張新都心再整備', '千葉港湾エリア再開発', '物流・倉庫施設建設'] },
  { id: 'tokyo', name: '東京都', nameShort: '東京', region: '関東', avgSalary: 560, demandLevel: 'high', majorCity: '東京都', features: ['国内建設投資の約15〜20%が集中する最大市場', '五大ゼネコン（鹿島・清水・大成・大林・竹中）本社が集積し大手求人へのアクセスが容易', '年収700〜800万円台の求人が他都市より圧倒的に多い', '超高層複合再開発から地下鉄延伸・首都高リニューアルまで幅広い案件が並行進行'], trendKeywords: ['虎ノ門・麻布台ヒルズ周辺次期開発案件', 'データセンター建設ラッシュ（江東・品川・多摩）', '首都高速大規模リニューアル工事', '品川・神宮外苑・豊洲エリア再開発'] },
  { id: 'kanagawa', name: '神奈川県', nameShort: '神奈川', region: '関東', avgSalary: 520, demandLevel: 'high', majorCity: '横浜市', features: ['横浜・川崎の大規模再開発', '港湾・製造業施設の需要'], trendKeywords: ['横浜みなとみらい開発', '川崎臨海部再開発', '神奈川リニア工事', 'EV・先端製造工場建設'] },
  { id: 'niigata', name: '新潟県', nameShort: '新潟', region: '中部', avgSalary: 420, demandLevel: 'medium', majorCity: '新潟市', features: ['日本海側最大の都市', '食品・化学工場の建設需要'], trendKeywords: ['日本海側拠点港整備', '食品・化学プラント建設', '半導体工場誘致', '防雪インフラ整備'] },
  { id: 'toyama', name: '富山県', nameShort: '富山', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '富山市', features: ['薬品・化学系工場の施工案件', '北陸新幹線沿線の開発'], trendKeywords: ['北陸新幹線敦賀延伸効果', '医薬品工場建設', '富山港湾整備', 'アルミ関連施設更新'] },
  { id: 'ishikawa', name: '石川県', nameShort: '石川', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '金沢市', features: ['北陸新幹線延伸で需要増', '観光施設・ホテル建設案件'], trendKeywords: ['能登半島地震復興工事', '北陸新幹線小松・加賀温泉開発', '観光ホテル・施設建設', '金沢駅周辺再整備'] },
  { id: 'fukui', name: '福井県', nameShort: '福井', region: '中部', avgSalary: 420, demandLevel: 'medium', majorCity: '福井市', features: ['原子力関連施設の施工実績', '北陸新幹線工事の恩恵'], trendKeywords: ['北陸新幹線福井・敦賀開業後開発', '原子力施設リプレース工事', '福井駅周辺再開発', '繊維・化学工場更新'] },
  { id: 'yamanashi', name: '山梨県', nameShort: '山梨', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '甲府市', features: ['リニア中央新幹線の工事需要', '物流・観光施設建設'], trendKeywords: ['リニア中央新幹線山梨工区', '物流センター建設', '富士北麓観光施設整備', 'データセンター誘致'] },
  { id: 'nagano', name: '長野県', nameShort: '長野', region: '中部', avgSalary: 440, demandLevel: 'medium', majorCity: '長野市', features: ['半導体・精密機器工場建設', 'リゾート施設の新築・改修'], trendKeywords: ['半導体・精密機器工場建設', 'リニア中央新幹線長野工区', 'リゾート施設改修・新設', '再生可能エネルギー施設'] },
  { id: 'gifu', name: '岐阜県', nameShort: '岐阜', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '岐阜市', features: ['自動車・機械系の製造業が集積し工場建設案件が安定', '名古屋圏への通勤圏で大型案件にアクセスしやすい'], trendKeywords: ['リニア中央新幹線 岐阜県駅（中津川）関連工事', '東海環状自動車道 整備', '自動車・部品工場の更新・増設', '大規模物流センター建設'] },
  { id: 'shizuoka', name: '静岡県', nameShort: '静岡', region: '中部', avgSalary: 460, demandLevel: 'high', majorCity: '静岡市', features: ['製造業集積で工場建設多数', '東西交通の要衝でインフラ需要'], trendKeywords: ['リニア中央新幹線静岡工区', '浜松SA周辺物流施設', 'EV・自動車工場更新', '港湾・物流施設整備'] },
  { id: 'aichi', name: '愛知県', nameShort: '愛知', region: '中部', avgSalary: 510, demandLevel: 'high', majorCity: '名古屋市', features: ['東海圏最大の建設市場', '自動車・製造業関連施設が豊富'], trendKeywords: ['名古屋駅周辺超高層開発', 'EV工場・バッテリー施設建設', 'リニア名古屋工区', 'アジア競技大会施設整備'] },
  { id: 'mie', name: '三重県', nameShort: '三重', region: '近畿', avgSalary: 440, demandLevel: 'medium', majorCity: '津市', features: ['石油化学コンビナート施設', '半導体工場の建設需要増'], trendKeywords: ['半導体工場建設需要増', '石油化学コンビナート更新', '三重県四日市港整備', '伊勢志摩観光施設整備'] },
  { id: 'shiga', name: '滋賀県', nameShort: '滋賀', region: '近畿', avgSalary: 455, demandLevel: 'high', majorCity: '大津市', features: ['製造業・物流拠点が急増', '大阪・京都への通勤圏でQOL高'], trendKeywords: ['物流施設建設ラッシュ', '半導体・電子部品工場建設', '栗東新駅周辺開発', '湖南工業地帯拡張'] },
  { id: 'kyoto', name: '京都府', nameShort: '京都', region: '近畿', avgSalary: 470, demandLevel: 'high', majorCity: '京都市', features: ['文化財保護に絡む特殊施工', '観光施設・ホテルの建設好調'], trendKeywords: ['京都駅周辺再開発', 'ラグジュアリーホテル建設', '文化財保護工事', '半導体・精密機器工場誘致'] },
  { id: 'osaka', name: '大阪府', nameShort: '大阪', region: '近畿', avgSalary: 510, demandLevel: 'high', majorCity: '大阪市', features: ['万博・IR関連の大型案件', '西日本最大の建設市場', '年収500万超えが狙いやすい'], trendKeywords: ['万博関連工事', 'IR統合型リゾート', '夢洲開発', '大阪・梅田再開発'] },
  { id: 'hyogo', name: '兵庫県', nameShort: '兵庫', region: '近畿', avgSalary: 480, demandLevel: 'high', majorCity: '神戸市', features: ['神戸港湾エリアの再開発', '医療施設・製造業案件が豊富'], trendKeywords: ['神戸ポートアイランド拡張', '医療・バイオクラスター施設', '阪神臨海部再開発', '播磨科学公園都市開発'] },
  { id: 'nara', name: '奈良県', nameShort: '奈良', region: '近畿', avgSalary: 445, demandLevel: 'medium', majorCity: '奈良市', features: ['文化財保護関連の特殊施工', '大阪・京都通勤圏の住宅需要'], trendKeywords: ['大和郡山産業団地造成', '文化財保護工事', 'リニア新大阪駅周辺整備', '住宅・マンション建設需要'] },
  { id: 'wakayama', name: '和歌山県', nameShort: '和歌山', region: '近畿', avgSalary: 420, demandLevel: 'medium', majorCity: '和歌山市', features: ['石油化学コンビナート施設', '観光・農業インフラ整備'], trendKeywords: ['和歌山IR候補地整備', '石油化学プラント更新', '南海トラフ防災インフラ', '観光・農業施設建設'] },
  { id: 'tottori', name: '鳥取県', nameShort: '鳥取', region: '中国', avgSalary: 395, demandLevel: 'low', majorCity: '鳥取市', features: ['再生可能エネルギー施設建設', '公共インフラ整備が継続'], trendKeywords: ['再生可能エネルギー施設', '山陰道整備', '防災・老朽化インフラ更新', '食品・農業関連施設建設'] },
  { id: 'shimane', name: '島根県', nameShort: '島根', region: '中国', avgSalary: 395, demandLevel: 'low', majorCity: '松江市', features: ['IT企業誘致に伴う施設建設', '公共工事が安定して存在'], trendKeywords: ['島根原子力発電所再稼働関連', 'IT企業誘致関連施設', '山陰道・西部延伸', '防災・海岸保全工事'] },
  { id: 'okayama', name: '岡山県', nameShort: '岡山', region: '中国', avgSalary: 440, demandLevel: 'medium', majorCity: '岡山市', features: ['中国地方の交通ハブで開発活発', '製造業・物流施設の需要'], trendKeywords: ['岡山駅周辺再開発', '物流・製造施設集積', '半導体工場誘致', '瀬戸内観光施設整備'] },
  { id: 'hiroshima', name: '広島県', nameShort: '広島', region: '中国', avgSalary: 460, demandLevel: 'high', majorCity: '広島市', features: ['中国地方最大の建設市場', '製造業・造船関連施設が豊富'], trendKeywords: ['広島駅周辺再開発', 'EV・自動車工場更新', '造船施設整備', '広島空港アクセス整備'] },
  { id: 'yamaguchi', name: '山口県', nameShort: '山口', region: '中国', avgSalary: 420, demandLevel: 'medium', majorCity: '山口市', features: ['石油化学・半導体工場施工', 'コンビナート設備工事が安定'], trendKeywords: ['石油化学コンビナート更新', '半導体工場新設', '山口宇部空港周辺開発', '防衛関連施設整備'] },
  { id: 'tokushima', name: '徳島県', nameShort: '徳島', region: '四国', avgSalary: 400, demandLevel: 'medium', majorCity: '徳島市', features: ['半導体工場建設の需要増', '大型物流センター建設'], trendKeywords: ['半導体・電子部品工場建設', '大型物流センター整備', '四国横断自動車道整備', '防災・南海トラフ対策'] },
  { id: 'kagawa', name: '香川県', nameShort: '香川', region: '四国', avgSalary: 405, demandLevel: 'medium', majorCity: '高松市', features: ['四国の中心都市として開発活発', 'インフラ整備と民間投資が継続'], trendKeywords: ['高松市中心部再開発', '瀬戸内国際芸術祭関連施設', '四国新幹線誘致準備', '物流・港湾施設整備'] },
  { id: 'ehime', name: '愛媛県', nameShort: '愛媛', region: '四国', avgSalary: 410, demandLevel: 'medium', majorCity: '松山市', features: ['造船・化学工場の施設整備', '再生可能エネルギー案件増加'], trendKeywords: ['造船・海洋関連施設整備', '再生可能エネルギー施設', '松山市中心部再開発', '四国中央部インフラ整備'] },
  { id: 'kochi', name: '高知県', nameShort: '高知', region: '四国', avgSalary: 390, demandLevel: 'low', majorCity: '高知市', features: ['防災インフラ整備が喫緊課題', '公共工事の比率が高い市場'], trendKeywords: ['南海トラフ防災インフラ', '津波対策堤防建設', '四万十川水系整備', '農業・林業関連施設建設'] },
  { id: 'fukuoka', name: '福岡県', nameShort: '福岡', region: '九州', avgSalary: 480, demandLevel: 'high', majorCity: '福岡市', features: ['九州最大の建設市場', '都市開発・再開発が活発', 'インバウンド施設建設も好調'], trendKeywords: ['福岡市天神・博多再開発', 'MICE・国際会議場建設', '九州新幹線西九州ルート', '半導体関連施設建設'] },
  { id: 'saga', name: '佐賀県', nameShort: '佐賀', region: '九州', avgSalary: 400, demandLevel: 'medium', majorCity: '佐賀市', features: ['半導体工場建設の急増', '台湾TSMC関連需要が波及'], trendKeywords: ['TSMC関連サプライチェーン施設', '半導体工場建設急増', '佐賀空港周辺開発', '有明佐賀空港MRO拠点化'] },
  { id: 'nagasaki', name: '長崎県', nameShort: '長崎', region: '九州', avgSalary: 400, demandLevel: 'medium', majorCity: '長崎市', features: ['ジャパネット関連施設建設', '観光・医療施設の整備'], trendKeywords: ['西九州新幹線沿線開発', 'ジャパネット長崎スタジアム', '長崎IR統合型リゾート', '造船・海洋関連施設'] },
  { id: 'kumamoto', name: '熊本県', nameShort: '熊本', region: '九州', avgSalary: 450, demandLevel: 'high', majorCity: '熊本市', features: ['TSMC進出で施工管理需要が急増', '半導体関連工場建設ラッシュ'], trendKeywords: ['TSMC菊陽工場', '半導体関連施設', '九州自動車道沿線開発', 'ラピダス関連サプライヤー施設'] },
  { id: 'oita', name: '大分県', nameShort: '大分', region: '九州', avgSalary: 415, demandLevel: 'medium', majorCity: '大分市', features: ['半導体・化学工場の施設整備', '温泉リゾート施設の建設'], trendKeywords: ['半導体・電子部品工場建設', '温泉リゾート施設新設', '大分港・港湾整備', '再生可能エネルギー施設'] },
  { id: 'miyazaki', name: '宮崎県', nameShort: '宮崎', region: '九州', avgSalary: 395, demandLevel: 'low', majorCity: '宮崎市', features: ['観光・農業インフラ整備', 'SpaceX誘致候補地として注目'], trendKeywords: ['宇宙関連施設・射場整備', '観光・アグリツーリズム施設', '農業インフラ・食品工場', '宮崎港整備'] },
  { id: 'kagoshima', name: '鹿児島県', nameShort: '鹿児島', region: '九州', avgSalary: 400, demandLevel: 'medium', majorCity: '鹿児島市', features: ['再生可能エネルギー施設建設', '農業・食品系施設の整備'], trendKeywords: ['種子島宇宙センター関連工事', '洋上風力・地熱発電施設', '農業・食品工場建設', '鹿児島港整備'] },
  { id: 'okinawa', name: '沖縄県', nameShort: '沖縄', region: '沖縄', avgSalary: 390, demandLevel: 'medium', majorCity: '那覇市', features: ['観光・リゾート施設建設が活発', '米軍基地返還地の再開発案件'], trendKeywords: ['辺野古新基地建設工事', '米軍基地返還地再開発', 'リゾートホテル・観光施設', '那覇空港第2滑走路活用整備'] },
];

// ===== 5工種マスター =====
export const JOB_TYPES: JobTypeData[] = [
  {
    id: 'architecture',
    name: '建築',
    fullName: '建築施工管理',
    license: '1級・2級建築施工管理技士',
    avgSalary: 30, // 都道府県基準に加算（万円）
    description: 'オフィスビル・マンション・商業施設・工場などの建築工事全般を担当。工程・品質・安全・原価の4大管理を統括する。',
  },
  {
    id: 'civil',
    name: '土木',
    fullName: '土木施工管理',
    license: '1級・2級土木施工管理技士',
    avgSalary: 25,
    description: '道路・橋梁・トンネル・ダム・河川などの土木インフラ工事を管理。公共工事の比率が高く安定性が魅力。',
  },
  {
    id: 'electrical',
    name: '電気工事',
    fullName: '電気工事施工管理',
    license: '1級・2級電気工事施工管理技士',
    avgSalary: 35,
    description: '建物の電気設備・変電設備・通信設備の施工を管理。DX・脱炭素の流れで需要拡大中。',
  },
  {
    id: 'pipe',
    name: '管工事',
    fullName: '管工事施工管理',
    license: '1級・2級管工事施工管理技士',
    avgSalary: 30,
    description: '空調・給排水・ガスなどの設備配管工事を管理。建物の快適性・省エネに直結する専門性が高い職種。',
  },
  {
    id: 'landscaping',
    name: '造園',
    fullName: '造園施工管理',
    license: '1級・2級造園施工管理技士',
    avgSalary: 10,
    description: '公園・緑地・ゴルフ場・マンション植栽など造園工事を管理。都市緑化ニーズの高まりで注目度上昇。',
  },
];

// IDからデータを取得するヘルパー
export const getPrefById = (id: string): PrefData | undefined =>
  PREFS.find((p) => p.id === id);

export const getJobTypeById = (id: string): JobTypeData | undefined =>
  JOB_TYPES.find((j) => j.id === id);

/** 都道府県×工種データから地域固有のアドバイス文を生成する */
export function getLocalAdvice(jobTypeId: string, prefId: string): string {
  const pref = getPrefById(prefId);
  const jobType = getJobTypeById(jobTypeId);
  if (!pref || !jobType) return '';

  if (prefId === 'tokyo') {
    const tokyoAdvice: Record<string, string> = {
      architecture: '東京は国内最大の建設市場で、五大ゼネコン（鹿島・清水・大成・大林・竹中）すべてが本社を置く求人の集積地です。虎ノ門ヒルズや麻布台ヒルズ完工後も品川・新宿・江東区湾岸エリアで次期大型複合施設の案件が続いており、施工管理特化型エージェントの非公開求人には年収700〜800万円台のポジションも含まれます。担当現場の延床面積・最大規模・職人統括人数を数字で整理し、1級建築施工管理技士を最優先で取得して大手ゼネコン・デベロッパー案件に挑みましょう。',
      civil: '東京では首都高速道路の大規模リニューアル（C1都心環状線・湾岸線など）、東京外環道の関連工事、東京メトロ有楽町線豊洲〜住吉延伸、東京都水道局・下水道局発注の老朽化更新工事など長期公共案件が目白押しです。地下工事・シールド工法の施工経験者はどの案件でも引く手あまたで、1級土木施工管理技士にその実績が加われば年収600〜700万円台も現実的な目標になります。',
      electrical: 'AI需要の拡大を背景に江東区・品川区・多摩エリアでデータセンターの建設が急増しており、高圧受変電設備や非常用発電設備の施工管理経験者の不足が深刻です。超高層ビルの電気設備大規模改修・BAS（ビルオートメーション）統合工事も活発で、1級電気工事施工管理技士があれば東京では年収700万円以上が現実的な目標です。複数エージェントに並行登録して内定を競わせる強気の戦略が特に有効です。',
      pipe: '麻布台ヒルズ・東京ミッドタウン・豊洲・有明エリアの大型複合施設では、ZEB対応の空調・熱源設備リニューアルが継続しています。BIM（Revit MEP）の操作スキルと省エネ計算書・BEMS導入の施工経験は東京の案件で特に高く評価され、1級管工事施工管理技士と組み合わせれば年収600〜700万円台が狙えます。新築だけでなく大規模修繕・改修のキャリアも積極的にアピールしましょう。',
      landscaping: '東京都の「東京グリーンビズ」推進と大型再開発の緑地整備義務化で、都市造園の求人は23区を中心に拡大しています。新宿エリアでは神宮外苑地区の再開発関連や新宿中央公園のPark-PFI運営、江東区では豊洲・有明など臨海部の公園整備や海の森公園関連の植栽工事、区部全域では街路樹の維持管理・都立公園の指定管理案件が並行して動いており、求人は「新植・外構造園」と「維持管理」の両輪で発生しています。1級造園施工管理技士に屋上緑化・植栽基盤設計の経験を組み合わせると年収500万円台が現実的で、維持管理会社から再開発元請の施工管理へキャリアアップする転職も東京では実現しやすい環境です。',
    };
    return tokyoAdvice[jobTypeId] ?? tokyoAdvice['architecture'];
  }

  const demandPhrase: Record<'high' | 'medium' | 'low', string> = {
    high:   `${pref.name}は施工管理の求人需要が特に旺盛で、好条件の案件が多数出ています。`,
    medium: `${pref.name}は安定した施工管理需要があり、転職タイミングを選べば好条件の求人に巡り会えます。`,
    low:    `${pref.name}は求人数こそ多くないものの、地域密着型エージェントを活用することで非公開求人にアクセスできます。`,
  };

  const trendPhrase = `特に「${pref.trendKeywords[0]}」「${pref.trendKeywords[1]}」関連の案件が活発で、${jobType.fullName}経験者への需要は高まっています。`;

  const jobAdvice: Record<string, string> = {
    architecture: `大手ゼネコン・デベロッパー系の案件を狙うなら1級建築施工管理技士の取得が年収交渉の決め手になります。複数のエージェントを比較して求人の幅を広げましょう。`,
    civil:        `公共工事メインなら官公庁案件に強いエージェントが有利です。1級土木施工管理技士＋舗装・橋梁などの専門経験で年収アップが狙えます。`,
    electrical:   `電気系は慢性的な人材不足で売り手市場が続いており、1級電気工事施工管理技士があれば年収600万円超えも現実的です。再生可能エネルギー分野の経験は特に高評価です。`,
    pipe:         `省エネ・ZEB対応設備の施工経験は引き合いが強く、CAD・BIM操作スキルがあると書類選考の通過率が大幅に上がります。`,
    landscaping:  `都市緑化・グリーンインフラ需要の拡大で求人は増加中です。公共造園工事の実績と1級造園施工管理技士の組み合わせが転職時の最大の武器になります。`,
  };

  return `${demandPhrase[pref.demandLevel]}${trendPhrase}${jobAdvice[jobTypeId] ?? ''}`;
}

/** 都道府県×工種データから転職成功ポイント3項目を生成する */
export function getSuccessPoints(jobTypeId: string, prefId: string): SuccessPoint[] {
  const pref = getPrefById(prefId);
  const jobType = getJobTypeById(jobTypeId);
  if (!pref || !jobType) return [];

  if (prefId === 'tokyo') {
    const tokyoPoints: Record<string, SuccessPoint[]> = {
      architecture: [
        { title: '五大ゼネコン・大手デベロッパー系の非公開求人を今すぐ押さえる', body: '東京の大型建築案件の多くは施工管理特化型エージェントのみ扱う非公開求人です。鹿島・清水・大成・大林・竹中の元請け企業やゼネコン子会社を狙うなら、今すぐ2〜3社に同時登録して非公開求人へのアクセスを確保することが最重要です。' },
        { title: '担当現場の延床面積・工事費を数字で職務経歴書に記載する', body: '東京の書類選考では「延床〇〇㎡・工事費〇〇億円規模の現場でQCDS管理を担当」のように規模感を数字で示すと通過率が大幅に上がります。特に工事費100億円超・延床5万㎡超の経験は大手ゼネコンが特に高く評価します。' },
        { title: '1級建築施工管理技士取得で年収700万円台を現実的な目標に設定する', body: '東京では1級保有者と未保有者で年収に100〜200万円の差が出るケースが多く、取得後の転職タイミングで一気に年収700万円台に引き上げることが現実的です。取得見込み段階でもエージェント経由で積極的に交渉できます。' },
      ],
      civil: [
        { title: '首都高・外環・地下鉄延伸など東京都・国交省発注案件に強いエージェントを選ぶ', body: '東京の公共土木は案件規模が大きく、発注者との関係が深いエージェント経由の方が非公開求人へのアクセスが有利です。地下工事・シールド工法の施工経験がある場合はその旨を登録時に必ず明記してください。' },
        { title: '1級土木施工管理技士＋地下・シールド工法の経験で希少価値を高める', body: '東京の土木案件では地下工事・シールド工法の技術者が慢性的に不足しています。1級資格に加えてこの経験があると複数社から同時に声がかかるケースが多く、年収600〜700万円台の求人で年収交渉を優位に進められます。' },
        { title: '複数内定を取ってから年収交渉する強気の戦略を取る', body: '東京は土木施工管理の需要が非常に旺盛で、複数社から内定を取ることが十分可能です。内定状況をエージェントに伝えながら条件を引き上げる戦略が有効で、年収50〜100万円アップの事例も多くあります。' },
      ],
      electrical: [
        { title: 'データセンター・再エネ分野の経験を武器に不足人材市場を活用する', body: '東京のデータセンター建設ラッシュで高圧受変電・非常用発電の施工管理者は深刻に不足しています。この経験がある場合は強みを前面に出してエージェントに伝え、優先的に紹介を受けられる状況を作りましょう。' },
        { title: 'BAS統合・省エネ設備改修の経験を数字とともにアピールする', body: '東京では既存超高層ビルのBAS更新・LED化・太陽光設備設置など省エネ改修工事が急増しています。電力削減率など改修効果の数字とともに職務経歴書に記載すると書類選考で強く印象づけられます。' },
        { title: '複数社に内定を競わせて年収700万円台を現実的な目標に設定する', body: '電気工事施工管理は全工種で最も人材不足が深刻で、東京ではその傾向が特に顕著です。1級資格保有者なら複数社から内定を得て条件を比較することで年収700万円台への引き上げが十分現実的です。' },
      ],
      pipe: [
        { title: 'ZEB対応・省エネ設備施工の経験を職務経歴書の核心に置く', body: 'ZEB認証取得のための空調・熱源改修施工経験は東京の案件で最大の差別化ポイントになります。BEI計算や省エネ計画書の作成に関わった実績があれば必ず明記し、大手設備会社への転職で年収600万円台を狙いましょう。' },
        { title: 'BIM（Revit MEP）の操作スキルで書類通過率を上げる', body: '東京の大型案件では設計段階からBIM連携が標準になっており、Revit MEP・CADewの操作経験は書類選考段階から注目されます。スキルがある場合は職務経歴書に明記し、ない場合はオンライン講座での取得を優先しましょう。' },
        { title: '新築と大規模改修の両方の経験で求人の幅を最大化する', body: '東京の管工事施工管理市場は新築超高層と既存大型ビルの改修が並行して存在します。どちらの経験でも十分アピールでき、両方の経験があれば複数の求人で高い市場価値を発揮できます。' },
      ],
      landscaping: [
        { title: '「新植」と「維持管理」どちらの実績も数字で整理する', body: '東京の造園求人は神宮外苑・臨海部など再開発の新植工事と、街路樹・都立公園の維持管理の2系統で発生しています。植栽面積・本数・工事金額・管理面積を数字で職務経歴書に記載すると、どちらの系統でも書類通過率が大きく上がります。' },
        { title: '応募先を「再開発元請系」か「公共維持管理系」かで絞り込む', body: '同じ造園施工管理でも、大手ゼネコン協力会社として再開発の植栽工事を担う会社と、区・都発注の街路樹維持管理や指定管理を担う会社では働き方も年収レンジも異なります。エージェントに希望の系統を最初に伝えることで、ミスマッチのない求人紹介を受けられます。' },
        { title: '屋上緑化・植栽基盤設計・樹木医で年収500万円台を狙う', body: '緑地整備義務化で屋上・壁面緑化の施工需要が急増しており、一般造園と異なる専門技術として高く評価されます。1級造園施工管理技士に屋上緑化や植栽基盤設計の経験、樹木医資格を組み合わせると、東京では年収500万円台を超える求人を現実的に狙えます。' },
      ],
    };
    return tokyoPoints[jobTypeId] ?? tokyoPoints['architecture'];
  }

  const point1ByDemand: Record<'high' | 'medium' | 'low', SuccessPoint> = {
    high: {
      title: '施工管理特化エージェントに今すぐ複数登録する',
      body: `${pref.name}は求人需要が旺盛で、好条件の求人は早期に埋まります。今すぐ施工管理特化型エージェントに2〜3社同時登録して、非公開求人を押さえることが転職成功の第一歩です。`,
    },
    medium: {
      title: '地域特化型と全国型の両方のエージェントに登録する',
      body: `${pref.name}の転職では、地域密着型エージェント（地場ゼネコン求人に強い）と全国型エージェント（大手・中堅案件に強い）を併用することで、選択肢を最大化できます。`,
    },
    low: {
      title: '全国展開型エージェントも併用して求人の選択肢を広げる',
      body: `${pref.name}は求人数が限られるため、地域特化型だけでなく全国展開型エージェントも並行して使い、隣接エリアの求人まで視野に入れることが重要です。`,
    },
  };

  const point2ByJobType: Record<string, SuccessPoint> = {
    architecture: {
      title: `${jobType.license}の取得・アピールを最優先にする`,
      body: `1級建築施工管理技士は大手ゼネコンへの転職で必須条件になることが多く、取得だけで年収交渉の余地が大幅に広がります。未取得なら取得計画を、取得済みなら担当した工事規模・種別を具体的にアピールしましょう。`,
    },
    civil: {
      title: `${jobType.license}＋専門分野経験を組み合わせてアピールする`,
      body: `1級土木施工管理技士に加えて、舗装・橋梁・トンネルなど専門性の高い施工経験があると希少人材として評価されます。施工計画書の作成経験も重要なアピールポイントです。`,
    },
    electrical: {
      title: `${jobType.license}を武器に売り手市場で強気に交渉する`,
      body: `電気工事施工管理は全工種で最も人材不足が深刻です。1級電気工事施工管理技士があれば年収600万円超えも現実的で、複数社から内定を取って条件を比較する強気の戦略が有効です。`,
    },
    pipe: {
      title: `${jobType.license}＋BIM・省エネ設備経験で差別化する`,
      body: `管工事施工管理は省エネ・ZEB対応の需要増で注目度が上昇中です。CAD・BIM操作スキルと省エネ設備の施工経験を組み合わせることで、年収交渉のレバレッジが大きく高まります。`,
    },
    landscaping: {
      title: `${jobType.license}と公共造園工事の実績を前面に出す`,
      body: `造園施工管理は都市緑化・グリーンインフラ需要の高まりで求人が拡大中です。1級造園施工管理技士の資格と公園・緑地などの公共造園工事の実績は転職時の最大の差別化ポイントになります。`,
    },
  };

  const point3ByDemand: Record<'high' | 'medium' | 'low', SuccessPoint> = {
    high: {
      title: '複数社に同時並行で応募して条件を比較する',
      body: `求人が豊富な${pref.name}では、1社ずつ応募するより複数社に並行して応募することで内定が競合し、年収や条件の交渉余地が生まれます。エージェント経由で一括管理すると効率的です。`,
    },
    medium: {
      title: '職務経歴書に数字・規模・人数を具体的に記載して差をつける',
      body: `「どんな規模の現場を・何人のチームで・どのような課題を解決しながら管理したか」を数字で表現することで、書類選考の通過率が大幅に上がります。エージェントに添削を依頼するのも有効です。`,
    },
    low: {
      title: '希望エリアを隣県まで広げ求人数を最大化する',
      body: `求人数が限られる${pref.name}では、隣接する都道府県や通勤圏内の求人まで視野を広げることで選択肢が一気に増えます。転勤許容度を上げることが収入アップへの近道になるケースも多いです。`,
    },
  };

  return [
    point1ByDemand[pref.demandLevel],
    point2ByJobType[jobTypeId] ?? {
      title: `${jobType.license}の取得を目指す`,
      body: `資格があることで求人の幅が大幅に広がり、年収交渉でも有利になります。特に1級は管理職候補として高待遇での転職が狙えます。`,
    },
    point3ByDemand[pref.demandLevel],
  ];
}

// ===== 記事カテゴリ 英語ID → 日本語 =====
export const ARTICLE_CATEGORIES: Record<string, string> = {
  career:        '転職・キャリア',
  salary:        '給与・年収',
  qualification: '資格',
  work:          '仕事内容',
  region:        '地域特化',
};

// 地域グループ（prefId基準・単一の真実）。トップのRegionAccordionと全都道府県リンクハブで共有する。
// PREFSの region フィールドは粒度が粗く複合ラベルに一致しないため、グルーピングはこの prefId 定義に統一する。
export interface AreaGroup {
  label: string;
  en: string;
  prefIds: string[];
}

export const AREA_GROUPS: AreaGroup[] = [
  {
    label: '北海道・東北',
    en: 'HOKKAIDO / TOHOKU',
    prefIds: ['hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'],
  },
  {
    label: '関東',
    en: 'KANTO',
    prefIds: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'],
  },
  {
    label: '中部',
    en: 'CHUBU',
    prefIds: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi', 'mie'],
  },
  {
    label: '近畿',
    en: 'KINKI',
    prefIds: ['shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'],
  },
  {
    label: '中国',
    en: 'CHUGOKU',
    prefIds: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi'],
  },
  {
    label: '四国',
    en: 'SHIKOKU',
    prefIds: ['tokushima', 'kagawa', 'ehime', 'kochi'],
  },
  {
    label: '九州・沖縄',
    en: 'KYUSHU / OKINAWA',
    prefIds: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'],
  },
];
