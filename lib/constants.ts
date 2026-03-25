import { PrefData, JobTypeData } from './types';

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
  { id: 'tokyo', name: '東京都', nameShort: '東京', region: '関東', avgSalary: 560, demandLevel: 'high', majorCity: '東京都', features: ['日本最大の建設市場', '超高層・再開発案件が豊富', '年収600万超えも狙いやすい'], trendKeywords: ['再開発プロジェクト', 'データセンター建設', '2025年以降の大型案件', '渋谷・虎ノ門・麻布台再開発'] },
  { id: 'kanagawa', name: '神奈川県', nameShort: '神奈川', region: '関東', avgSalary: 520, demandLevel: 'high', majorCity: '横浜市', features: ['横浜・川崎の大規模再開発', '港湾・製造業施設の需要'], trendKeywords: ['横浜みなとみらい開発', '川崎臨海部再開発', '神奈川リニア工事', 'EV・先端製造工場建設'] },
  { id: 'niigata', name: '新潟県', nameShort: '新潟', region: '中部', avgSalary: 420, demandLevel: 'medium', majorCity: '新潟市', features: ['日本海側最大の都市', '食品・化学工場の建設需要'], trendKeywords: ['日本海側拠点港整備', '食品・化学プラント建設', '半導体工場誘致', '防雪インフラ整備'] },
  { id: 'toyama', name: '富山県', nameShort: '富山', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '富山市', features: ['薬品・化学系工場の施工案件', '北陸新幹線沿線の開発'], trendKeywords: ['北陸新幹線敦賀延伸効果', '医薬品工場建設', '富山港湾整備', 'アルミ関連施設更新'] },
  { id: 'ishikawa', name: '石川県', nameShort: '石川', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '金沢市', features: ['北陸新幹線延伸で需要増', '観光施設・ホテル建設案件'], trendKeywords: ['能登半島地震復興工事', '北陸新幹線小松・加賀温泉開発', '観光ホテル・施設建設', '金沢駅周辺再整備'] },
  { id: 'fukui', name: '福井県', nameShort: '福井', region: '中部', avgSalary: 420, demandLevel: 'medium', majorCity: '福井市', features: ['原子力関連施設の施工実績', '北陸新幹線工事の恩恵'], trendKeywords: ['北陸新幹線福井・敦賀開業後開発', '原子力施設リプレース工事', '福井駅周辺再開発', '繊維・化学工場更新'] },
  { id: 'yamanashi', name: '山梨県', nameShort: '山梨', region: '中部', avgSalary: 430, demandLevel: 'medium', majorCity: '甲府市', features: ['リニア中央新幹線の工事需要', '物流・観光施設建設'], trendKeywords: ['リニア中央新幹線山梨工区', '物流センター建設', '富士北麓観光施設整備', 'データセンター誘致'] },
  { id: 'nagano', name: '長野県', nameShort: '長野', region: '中部', avgSalary: 440, demandLevel: 'medium', majorCity: '長野市', features: ['半導体・精密機器工場建設', 'リゾート施設の新築・改修'], trendKeywords: ['半導体・精密機器工場建設', 'リニア中央新幹線長野工区', 'リゾート施設改修・新設', '再生可能エネルギー施設'] },
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

// ===== アドバイステンプレート（5工種 × 3パターン）=====
// パターンは都道府県IDの文字コード合計を3で割った余り（0/1/2）で決定

const ADVICE_TEMPLATES: Record<string, [string, string, string]> = {
  architecture: [
    '大手ゼネコン・デベロッパー系の案件に強いエージェントへの登録が特に効果的です。1級建築施工管理技士の取得が年収交渉の要になります。',
    '商業施設・オフィスビル・マンションと幅広い案件に対応できる経験が武器になります。複数のエージェントを比較して求人の幅を広げましょう。',
    '建築BIMの操作スキルを磨くと差別化ポイントになります。地域密着型の中堅ゼネコンも好条件の求人が多いため、地域特化型エージェントへの登録もおすすめです。',
  ],
  civil: [
    '公共工事メインで安定志向なら官公庁案件に強いエージェントが有利です。1級土木施工管理技士＋舗装・橋梁などの専門経験で年収アップが狙えます。',
    '国土強靭化・防災インフラ整備で土木の需要は今後も安定しています。道路・橋梁・河川の施工経験は全国どこでも高く評価されます。',
    '民間の物流・工業施設の基礎・造成工事にも視野を広げると選択肢が増えます。施工計画書の作成能力をアピールポイントにしましょう。',
  ],
  electrical: [
    '電気系は慢性的な人材不足で売り手市場が続いています。1級電気工事施工管理技士があれば年収600万円超えも現実的です。',
    '太陽光・蓄電池・EV充電設備など再生可能エネルギー分野の施工経験は市場価値が急上昇中です。積極的にアピールしましょう。',
    'データセンター・工場の電気設備施工経験は特に高単価案件につながります。施工管理特化型エージェントに先行して求人を押さえてもらうのがおすすめです。',
  ],
  pipe: [
    '空調・衛生設備のCAD・BIM操作スキルがあると書類選考の通過率が高まります。現場経験に加え設計補助経験のある方は特に高評価です。',
    '省エネ・ZEB対応設備の施工経験は引き合いが強く、管工事は建物の省エネ性能に直結するため今後も安定した需要が続きます。',
    'ガス・プラント系の施工経験をお持ちの場合は専門特化型エージェント経由でプラントメーカー案件を狙うと高年収が期待できます。',
  ],
  landscaping: [
    '都市緑化・グリーンインフラの需要増で造園の求人は拡大中です。公共造園工事の実績は転職時の強いアピール材料になります。',
    '植栽管理だけでなくランドスケープ設計の知識があると民間大型案件での評価が上がります。資格取得と合わせてアピールしましょう。',
    'ゴルフ場・公園管理の現場経験に加えて施工管理ソフトを使いこなせると、応募できる求人の幅が大きく広がります。',
  ],
};

/** 都道府県IDの文字コード合計を3で割った余りでパターン（0/1/2）を決定 */
export function getAdvicePattern(prefId: string): 0 | 1 | 2 {
  const sum = prefId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (sum % 3) as 0 | 1 | 2;
}

/** 工種IDと都道府県IDからローカライズされたアドバイス文を返す */
export function getLocalAdvice(jobTypeId: string, prefId: string): string {
  const templates = ADVICE_TEMPLATES[jobTypeId];
  if (!templates) return '';
  return templates[getAdvicePattern(prefId)];
}
