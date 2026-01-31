import { SupportedLanguage } from '@/config/tld-language';

export interface LoadingTranslations {
  step1Label: string;
  step1Detail: string;
  step2Label: string;
  step2Detail: string;
  step3Label: string;
  step3Detail: string;
  step4Label: string;
  step4Detail: string;
  creatingVisuals: string;
}

export interface ModuleTranslations {
  loading: LoadingTranslations;
  riskFreeScaler: {
    title: string;
    titleBold: string;
    traditional: string;
    irunica: string;
    fastTrack: string;
    moq: string;
    moqTraditional: string;
    moqIrunica: string;
    timeToMarket: string;
    timeTraditional: string;
    timeIrunica: string;
    rdCert: string;
    rdTraditional: string;
    rdIrunica: string;
    inventoryRisk: string;
    inventoryTraditional: string;
    inventoryIrunica: string;
    footnote: string;
  };
  protocolMatcher: {
    title: string;
    titleBold: string;
    matchingFormula: string;
    suggestedLabeling: string;
    exclusiveAfterCare: string;
    laser: string;
    laserMatch: string;
    laserBenefit: string;
    peeling: string;
    peelingMatch: string;
    peelingBenefit: string;
    filler: string;
    fillerMatch: string;
    fillerBenefit: string;
  };
  colorAtelier: {
    title: string;
    titleBold: string;
    subtitle: string;
    cta: string;
  };
  trendAnalysis: {
    title: string;
    titleBold: string;
    subtitle: string;
    trendReady: string;
    trendReadyDesc: string;
    viewCatalog: string;
    glassSkin: string;
    glassSkinDesc: string;
    skinBarrier: string;
    skinBarrierDesc: string;
    cleanBeauty: string;
    cleanBeautyDesc: string;
    fermented: string;
    fermentedDesc: string;
    hybrid: string;
    hybridDesc: string;
    personalization: string;
    personalizationDesc: string;
  };
  bulkPricing: {
    title: string;
    titleBold: string;
    subtitle: string;
    perUnit: string;
    save: string;
    units: string;
    mostPopular: string;
    starter: string;
    growth: string;
    scale: string;
    enterprise: string;
    fullCustomization: string;
    standardPackaging: string;
    premiumPackaging: string;
    allPackaging: string;
    bespokeFormulation: string;
    production30: string;
    production21: string;
    production14: string;
    expressProduction: string;
    dedicatedManager: string;
    prioritySupport: string;
    dedicatedTeam: string;
    quarterlyReports: string;
    exclusiveTrends: string;
    footnote: string;
    customQuote: string;
  };
  whiteLabel: {
    title: string;
    titleBold: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    amenitySets: string;
    essentialSet: string;
    premiumSet: string;
    luxurySet: string;
    essentialItems: string;
    premiumItems: string;
    luxuryItems: string;
    idealFor: string;
    rooms: string;
    popular: string;
    trusted: string;
    schedule: string;
  };
  leadCapture: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
    downloadButton: string;
    disclaimer: string;
    assetsSent: string;
    assetsSentDesc: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    completeButton: string;
    successTitle: string;
    successDesc: string;
  };
}

export const translations: Record<SupportedLanguage, ModuleTranslations> = {
  en: {
    loading: {
      step1Label: "THE INVITATION",
      step1Detail: "We invite you to a journey beyond the ordinary...",
      step2Label: "ESSENCE DISCOVERY",
      step2Detail: "Uncovering the hidden potential within your brand...",
      step3Label: "PURE ALCHEMY",
      step3Detail: "Fusing your unique identity with our innovation...",
      step4Label: "THE REVELATION",
      step4Detail: "Preparing to unveil the future of your product...",
      creatingVisuals: "Creating Visuals...",
    },
    riskFreeScaler: {
      title: "Your Growth,",
      titleBold: "Zero Risk.",
      traditional: "Traditional OEM/ODM",
      irunica: "IRUNICA Private Label",
      fastTrack: "FAST TRACK",
      moq: "Minimum Order (MOQ)",
      moqTraditional: "5,000+ units",
      moqIrunica: "100+ units",
      timeToMarket: "Time to Market",
      timeTraditional: "6 ~ 12 Months",
      timeIrunica: "14 Days",
      rdCert: "R&D / Certification",
      rdTraditional: "$10,000+ (High Risk)",
      rdIrunica: "$0 (Pre-certified)",
      inventoryRisk: "Inventory Risk",
      inventoryTraditional: "Extremely High",
      inventoryIrunica: "Managed by Irunica",
      footnote: "*We hold pre-certified CPNP/FDA formulas. You simply define the brand equity.",
    },
    protocolMatcher: {
      title: "Your Protocol,",
      titleBold: "Our Solution.",
      matchingFormula: "Matching Formula",
      suggestedLabeling: "Suggested Labeling",
      exclusiveAfterCare: "Exclusive After-Care by",
      laser: "Laser Therapy",
      laserMatch: "Nano-Liposome Recovery Cream",
      laserBenefit: "Immediate redness reduction & barrier repair",
      peeling: "Chemical Peeling",
      peelingMatch: "Glutathione Radiance Serum",
      peelingBenefit: "Non-irritating glow enhancement & melanin inhibition",
      filler: "Injectables",
      fillerMatch: "Arnica B-tox Calming Ampoule",
      fillerBenefit: "Swelling reduction & procedure longevity",
    },
    colorAtelier: {
      title: "Color",
      titleBold: "Atelier",
      subtitle: "Trending K-Beauty colors curated for your brand",
      cta: "Explore Full Palette",
    },
    trendAnalysis: {
      title: "K-Beauty Trends,",
      titleBold: "Your Advantage.",
      subtitle: "Stay ahead with real-time trend data. We formulate what consumers will want next.",
      trendReady: "Trend-Ready Formulations",
      trendReadyDesc: "We already have products matching these trends. Launch in 14 days.",
      viewCatalog: "View Catalog",
      glassSkin: "Glass Skin",
      glassSkinDesc: "Dewy, luminous finish products",
      skinBarrier: "Skin Barrier",
      skinBarrierDesc: "Ceramide & barrier repair focus",
      cleanBeauty: "Clean Beauty",
      cleanBeautyDesc: "Minimal, transparent formulations",
      fermented: "Fermented Actives",
      fermentedDesc: "Probiotic & fermented ingredients",
      hybrid: "Hybrid Skincare",
      hybridDesc: "Makeup-skincare fusion products",
      personalization: "Personalization",
      personalizationDesc: "Customizable formulations",
    },
    bulkPricing: {
      title: "Scale Your Brand,",
      titleBold: "Maximize Margins.",
      subtitle: "Transparent pricing that grows with your business. No hidden fees, no surprises.",
      perUnit: "/unit",
      save: "Save",
      units: "units",
      mostPopular: "MOST POPULAR",
      starter: "Starter",
      growth: "Growth",
      scale: "Scale",
      enterprise: "Enterprise",
      fullCustomization: "Full customization",
      standardPackaging: "Standard packaging",
      premiumPackaging: "Premium packaging options",
      allPackaging: "All packaging options",
      bespokeFormulation: "Bespoke formulation",
      production30: "30-day production",
      production21: "21-day production",
      production14: "14-day production",
      expressProduction: "Express production",
      dedicatedManager: "Dedicated account manager",
      prioritySupport: "Priority support",
      dedicatedTeam: "Dedicated team",
      quarterlyReports: "Quarterly trend reports",
      exclusiveTrends: "Exclusive trends access",
      footnote: "All prices are per unit. Shipping calculated separately.",
      customQuote: "Custom quotes available for 10,000+ units.",
    },
    whiteLabel: {
      title: "Your Brand,",
      titleBold: "Our Expertise.",
      subtitle: "Create a signature amenity line that reflects your property's identity and delights your guests.",
      feature1Title: "Your Brand, Your Identity",
      feature1Desc: "Complete customization of packaging, labels, and formulation names. Your guests will only see your brand.",
      feature2Title: "Flexible MOQ",
      feature2Desc: "Start with as few as 100 units per SKU. Perfect for boutique hotels and growing properties.",
      feature3Title: "Premium Formulations",
      feature3Desc: "Same K-Beauty quality trusted by luxury spas worldwide. Elevate your guest experience.",
      feature4Title: "Rapid Turnaround",
      feature4Desc: "From design approval to delivery in as little as 14 days. Never run out of amenities.",
      amenitySets: "Curated Amenity Sets",
      essentialSet: "Essential Set",
      premiumSet: "Premium Set",
      luxurySet: "Luxury Set",
      essentialItems: "Shampoo, Conditioner, Body Wash, Lotion",
      premiumItems: "+ Face Cleanser, Moisturizer, Hand Cream",
      luxuryItems: "+ Serum, Eye Cream, Lip Balm, Bath Salts",
      idealFor: "Ideal for",
      rooms: "rooms",
      popular: "POPULAR",
      trusted: "Trusted by boutique hotels and luxury resorts worldwide.",
      schedule: "Schedule a consultation today.",
    },
    leadCapture: {
      title: "Receive Your Custom Assets",
      subtitle: "Enter your email to instantly receive the visual package.",
      emailPlaceholder: "Business Email",
      downloadButton: "Download Assets",
      disclaimer: "* By clicking download, you agree to receive a one-time proposal PDF.",
      assetsSent: "Assets Sent!",
      assetsSentDesc: "While you check your inbox, leave your contact details for a priority consultation.",
      namePlaceholder: "Contact Name",
      phonePlaceholder: "Phone Number / WhatsApp",
      messagePlaceholder: "Any specific requests? (e.g. MOQ, specific ingredients)",
      completeButton: "Complete Inquiry",
      successTitle: "You're All Set.",
      successDesc: "Our team has received your inquiry and will direct-connect with you within 24 hours.",
    },
  },
  ko: {
    loading: {
      step1Label: "초대",
      step1Detail: "특별한 여정으로 당신을 초대합니다...",
      step2Label: "본질 발견",
      step2Detail: "브랜드의 숨겨진 잠재력을 발견합니다...",
      step3Label: "순수한 연금술",
      step3Detail: "당신만의 정체성과 혁신을 융합합니다...",
      step4Label: "공개",
      step4Detail: "제품의 미래를 공개할 준비를 합니다...",
      creatingVisuals: "비주얼 생성 중...",
    },
    riskFreeScaler: {
      title: "당신의 성장,",
      titleBold: "리스크는 제로.",
      traditional: "기존 OEM/ODM",
      irunica: "IRUNICA 프라이빗 라벨",
      fastTrack: "패스트 트랙",
      moq: "최소주문수량 (MOQ)",
      moqTraditional: "5,000개 이상",
      moqIrunica: "100개 이상",
      timeToMarket: "출시 소요시간",
      timeTraditional: "6 ~ 12개월",
      timeIrunica: "14일",
      rdCert: "R&D / 인증",
      rdTraditional: "$10,000+ (고위험)",
      rdIrunica: "$0 (사전 인증 완료)",
      inventoryRisk: "재고 리스크",
      inventoryTraditional: "매우 높음",
      inventoryIrunica: "이루니카가 관리",
      footnote: "*CPNP/FDA 사전 인증 포뮬러 보유. 브랜드 가치만 정의하세요.",
    },
    protocolMatcher: {
      title: "당신의 프로토콜,",
      titleBold: "우리의 솔루션.",
      matchingFormula: "매칭 포뮬러",
      suggestedLabeling: "제안 라벨링",
      exclusiveAfterCare: "전용 애프터케어 by",
      laser: "레이저 테라피",
      laserMatch: "나노 리포좀 리커버리 크림",
      laserBenefit: "즉각적인 홍조 완화 및 피부 장벽 회복",
      peeling: "케미컬 필링",
      peelingMatch: "글루타치온 래디언스 세럼",
      peelingBenefit: "자극 없는 광채 증진 및 멜라닌 억제",
      filler: "필러/주사 시술",
      fillerMatch: "아르니카 비톡스 카밍 앰플",
      fillerBenefit: "붓기 완화 및 시술 지속력 향상",
    },
    colorAtelier: {
      title: "컬러",
      titleBold: "아틀리에",
      subtitle: "당신의 브랜드를 위한 트렌디한 K-뷰티 컬러",
      cta: "전체 팔레트 보기",
    },
    trendAnalysis: {
      title: "K-뷰티 트렌드,",
      titleBold: "당신의 경쟁력.",
      subtitle: "실시간 트렌드 데이터로 앞서가세요. 소비자가 원할 제품을 미리 만듭니다.",
      trendReady: "트렌드 대응 포뮬러",
      trendReadyDesc: "이미 트렌드에 맞는 제품을 보유하고 있습니다. 14일 내 출시 가능.",
      viewCatalog: "카탈로그 보기",
      glassSkin: "글래스 스킨",
      glassSkinDesc: "촉촉하고 빛나는 피니시 제품",
      skinBarrier: "피부 장벽",
      skinBarrierDesc: "세라마이드 & 장벽 회복 중심",
      cleanBeauty: "클린 뷰티",
      cleanBeautyDesc: "미니멀하고 투명한 포뮬러",
      fermented: "발효 성분",
      fermentedDesc: "프로바이오틱 & 발효 성분",
      hybrid: "하이브리드 스킨케어",
      hybridDesc: "메이크업-스킨케어 융합 제품",
      personalization: "개인 맞춤",
      personalizationDesc: "맞춤형 포뮬러",
    },
    bulkPricing: {
      title: "브랜드를 확장하고,",
      titleBold: "마진을 극대화하세요.",
      subtitle: "비즈니스와 함께 성장하는 투명한 가격. 숨겨진 비용 없음.",
      perUnit: "/개",
      save: "절약",
      units: "개",
      mostPopular: "인기",
      starter: "스타터",
      growth: "그로스",
      scale: "스케일",
      enterprise: "엔터프라이즈",
      fullCustomization: "완전 맞춤 제작",
      standardPackaging: "표준 패키징",
      premiumPackaging: "프리미엄 패키징 옵션",
      allPackaging: "모든 패키징 옵션",
      bespokeFormulation: "맞춤 포뮬러",
      production30: "30일 생산",
      production21: "21일 생산",
      production14: "14일 생산",
      expressProduction: "익스프레스 생산",
      dedicatedManager: "전담 매니저",
      prioritySupport: "우선 지원",
      dedicatedTeam: "전담 팀",
      quarterlyReports: "분기별 트렌드 리포트",
      exclusiveTrends: "독점 트렌드 액세스",
      footnote: "모든 가격은 개당 가격입니다. 배송비 별도.",
      customQuote: "10,000개 이상 맞춤 견적 가능.",
    },
    whiteLabel: {
      title: "당신의 브랜드,",
      titleBold: "우리의 전문성.",
      subtitle: "호텔의 아이덴티티를 반영하고 고객을 만족시키는 시그니처 어메니티 라인을 만드세요.",
      feature1Title: "당신의 브랜드, 당신의 아이덴티티",
      feature1Desc: "패키징, 라벨, 포뮬러 이름 완전 맞춤 제작. 고객은 오직 당신의 브랜드만 봅니다.",
      feature2Title: "유연한 MOQ",
      feature2Desc: "SKU당 100개부터 시작. 부티크 호텔과 성장하는 프로퍼티에 적합.",
      feature3Title: "프리미엄 포뮬러",
      feature3Desc: "전 세계 럭셔리 스파가 신뢰하는 K-뷰티 품질. 고객 경험을 높이세요.",
      feature4Title: "빠른 턴어라운드",
      feature4Desc: "디자인 승인부터 배송까지 최소 14일. 어메니티가 떨어질 일 없습니다.",
      amenitySets: "큐레이티드 어메니티 세트",
      essentialSet: "에센셜 세트",
      premiumSet: "프리미엄 세트",
      luxurySet: "럭셔리 세트",
      essentialItems: "샴푸, 컨디셔너, 바디워시, 로션",
      premiumItems: "+ 페이스 클렌저, 모이스처라이저, 핸드크림",
      luxuryItems: "+ 세럼, 아이크림, 립밤, 배스솔트",
      idealFor: "적합 객실 수",
      rooms: "실",
      popular: "인기",
      trusted: "전 세계 부티크 호텔과 럭셔리 리조트가 신뢰합니다.",
      schedule: "오늘 상담을 예약하세요.",
    },
    leadCapture: {
      title: "맞춤 에셋 받기",
      subtitle: "이메일을 입력하시면 비주얼 패키지를 즉시 보내드립니다.",
      emailPlaceholder: "비즈니스 이메일",
      downloadButton: "에셋 다운로드",
      disclaimer: "* 다운로드 클릭 시 일회성 제안서 PDF 수신에 동의합니다.",
      assetsSent: "에셋 전송 완료!",
      assetsSentDesc: "받은 편지함을 확인하시는 동안, 우선 상담을 위해 연락처를 남겨주세요.",
      namePlaceholder: "담당자 성함",
      phonePlaceholder: "전화번호 / 카카오톡",
      messagePlaceholder: "특별 요청사항 (예: MOQ, 특정 성분)",
      completeButton: "문의 완료",
      successTitle: "접수 완료",
      successDesc: "24시간 내에 담당자가 직접 연락드리겠습니다.",
    },
  },
  ja: {
    loading: {
      step1Label: "招待",
      step1Detail: "特別な旅へご招待します...",
      step2Label: "本質の発見",
      step2Detail: "ブランドの隠された可能性を発見します...",
      step3Label: "純粋な錬金術",
      step3Detail: "あなたのアイデンティティと革新を融合させます...",
      step4Label: "公開",
      step4Detail: "製品の未来を公開する準備をしています...",
      creatingVisuals: "ビジュアルを作成中...",
    },
    riskFreeScaler: {
      title: "あなたの成長、",
      titleBold: "リスクはゼロ。",
      traditional: "従来のOEM/ODM",
      irunica: "IRUNICA プライベートラベル",
      fastTrack: "ファストトラック",
      moq: "最小注文数量（MOQ）",
      moqTraditional: "5,000個以上",
      moqIrunica: "100個以上",
      timeToMarket: "市場投入までの時間",
      timeTraditional: "6〜12ヶ月",
      timeIrunica: "14日",
      rdCert: "R&D / 認証",
      rdTraditional: "$10,000+（高リスク）",
      rdIrunica: "$0（事前認証済み）",
      inventoryRisk: "在庫リスク",
      inventoryTraditional: "非常に高い",
      inventoryIrunica: "Irunicaが管理",
      footnote: "*CPNP/FDA事前認証フォーミュラ保有。ブランド価値を定義するだけ。",
    },
    protocolMatcher: {
      title: "あなたのプロトコル、",
      titleBold: "私たちのソリューション。",
      matchingFormula: "マッチングフォーミュラ",
      suggestedLabeling: "推奨ラベリング",
      exclusiveAfterCare: "専用アフターケア by",
      laser: "レーザー治療",
      laserMatch: "ナノリポソーム リカバリークリーム",
      laserBenefit: "即効性のある赤み軽減とバリア修復",
      peeling: "ケミカルピーリング",
      peelingMatch: "グルタチオン ラディアンスセラム",
      peelingBenefit: "低刺激のツヤ向上とメラニン抑制",
      filler: "注入治療",
      fillerMatch: "アルニカ B-tox カーミングアンプル",
      fillerBenefit: "腫れ軽減と施術効果の持続",
    },
    colorAtelier: {
      title: "カラー",
      titleBold: "アトリエ",
      subtitle: "あなたのブランドのためのトレンドK-ビューティーカラー",
      cta: "全パレットを見る",
    },
    trendAnalysis: {
      title: "K-ビューティートレンド、",
      titleBold: "あなたのアドバンテージ。",
      subtitle: "リアルタイムのトレンドデータで先を行く。消費者が次に求めるものを処方します。",
      trendReady: "トレンド対応フォーミュラ",
      trendReadyDesc: "すでにこれらのトレンドに対応した製品を保有。14日で発売可能。",
      viewCatalog: "カタログを見る",
      glassSkin: "グラススキン",
      glassSkinDesc: "みずみずしく輝くフィニッシュ製品",
      skinBarrier: "肌バリア",
      skinBarrierDesc: "セラミド＆バリア修復フォーカス",
      cleanBeauty: "クリーンビューティー",
      cleanBeautyDesc: "ミニマルで透明なフォーミュラ",
      fermented: "発酵成分",
      fermentedDesc: "プロバイオティック＆発酵成分",
      hybrid: "ハイブリッドスキンケア",
      hybridDesc: "メイク・スキンケア融合製品",
      personalization: "パーソナライズ",
      personalizationDesc: "カスタマイズ可能なフォーミュラ",
    },
    bulkPricing: {
      title: "ブランドを拡大し、",
      titleBold: "マージンを最大化。",
      subtitle: "ビジネスと共に成長する透明な価格設定。隠れた費用なし。",
      perUnit: "/個",
      save: "節約",
      units: "個",
      mostPopular: "人気",
      starter: "スターター",
      growth: "グロース",
      scale: "スケール",
      enterprise: "エンタープライズ",
      fullCustomization: "完全カスタマイズ",
      standardPackaging: "標準パッケージ",
      premiumPackaging: "プレミアムパッケージオプション",
      allPackaging: "全パッケージオプション",
      bespokeFormulation: "オーダーメイドフォーミュラ",
      production30: "30日生産",
      production21: "21日生産",
      production14: "14日生産",
      expressProduction: "エクスプレス生産",
      dedicatedManager: "専任マネージャー",
      prioritySupport: "優先サポート",
      dedicatedTeam: "専任チーム",
      quarterlyReports: "四半期トレンドレポート",
      exclusiveTrends: "独占トレンドアクセス",
      footnote: "すべての価格は1個あたりです。送料別途。",
      customQuote: "10,000個以上のカスタム見積もり可能。",
    },
    whiteLabel: {
      title: "あなたのブランド、",
      titleBold: "私たちの専門知識。",
      subtitle: "ホテルのアイデンティティを反映し、ゲストを喜ばせるシグネチャーアメニティラインを作成。",
      feature1Title: "あなたのブランド、あなたのアイデンティティ",
      feature1Desc: "パッケージ、ラベル、フォーミュラ名の完全カスタマイズ。ゲストはあなたのブランドだけを見ます。",
      feature2Title: "柔軟なMOQ",
      feature2Desc: "SKUあたり100個から開始可能。ブティックホテルや成長中の施設に最適。",
      feature3Title: "プレミアムフォーミュラ",
      feature3Desc: "世界中のラグジュアリースパが信頼するK-ビューティー品質。ゲスト体験を向上。",
      feature4Title: "迅速なターンアラウンド",
      feature4Desc: "デザイン承認から配送まで最短14日。アメニティ切れの心配なし。",
      amenitySets: "キュレーテッドアメニティセット",
      essentialSet: "エッセンシャルセット",
      premiumSet: "プレミアムセット",
      luxurySet: "ラグジュアリーセット",
      essentialItems: "シャンプー、コンディショナー、ボディウォッシュ、ローション",
      premiumItems: "+ 洗顔料、モイスチャライザー、ハンドクリーム",
      luxuryItems: "+ セラム、アイクリーム、リップバーム、バスソルト",
      idealFor: "最適客室数",
      rooms: "室",
      popular: "人気",
      trusted: "世界中のブティックホテルとラグジュアリーリゾートに信頼されています。",
      schedule: "今日相談を予約してください。",
    },
    leadCapture: {
      title: "カスタムアセットを受け取る",
      subtitle: "メールを入力すると、ビジュアルパッケージを即座にお届けします。",
      emailPlaceholder: "ビジネスメール",
      downloadButton: "アセットをダウンロード",
      disclaimer: "* ダウンロードをクリックすると、1回限りの提案書PDFの受信に同意したことになります。",
      assetsSent: "アセット送信完了！",
      assetsSentDesc: "受信トレイをご確認の間、優先相談のために連絡先をお残しください。",
      namePlaceholder: "担当者名",
      phonePlaceholder: "電話番号 / LINE",
      messagePlaceholder: "特別なリクエスト（例：MOQ、特定成分）",
      completeButton: "お問い合わせ完了",
      successTitle: "設定完了",
      successDesc: "24時間以内に担当者から直接ご連絡いたします。",
    },
  },
  es: {
    loading: {
      step1Label: "LA INVITACIÓN",
      step1Detail: "Te invitamos a un viaje más allá de lo ordinario...",
      step2Label: "DESCUBRIMIENTO",
      step2Detail: "Descubriendo el potencial oculto de tu marca...",
      step3Label: "ALQUIMIA PURA",
      step3Detail: "Fusionando tu identidad única con nuestra innovación...",
      step4Label: "LA REVELACIÓN",
      step4Detail: "Preparando para revelar el futuro de tu producto...",
      creatingVisuals: "Creando Visuales...",
    },
    riskFreeScaler: {
      title: "Tu Crecimiento,",
      titleBold: "Cero Riesgo.",
      traditional: "OEM/ODM Tradicional",
      irunica: "IRUNICA Marca Privada",
      fastTrack: "VÍA RÁPIDA",
      moq: "Pedido Mínimo (MOQ)",
      moqTraditional: "5,000+ unidades",
      moqIrunica: "100+ unidades",
      timeToMarket: "Tiempo al Mercado",
      timeTraditional: "6 ~ 12 Meses",
      timeIrunica: "14 Días",
      rdCert: "I+D / Certificación",
      rdTraditional: "$10,000+ (Alto Riesgo)",
      rdIrunica: "$0 (Pre-certificado)",
      inventoryRisk: "Riesgo de Inventario",
      inventoryTraditional: "Extremadamente Alto",
      inventoryIrunica: "Gestionado por Irunica",
      footnote: "*Contamos con fórmulas pre-certificadas CPNP/FDA. Tú solo defines el valor de marca.",
    },
    protocolMatcher: {
      title: "Tu Protocolo,",
      titleBold: "Nuestra Solución.",
      matchingFormula: "Fórmula Compatible",
      suggestedLabeling: "Etiquetado Sugerido",
      exclusiveAfterCare: "Cuidado Post-Tratamiento Exclusivo por",
      laser: "Terapia Láser",
      laserMatch: "Crema Recuperadora Nano-Liposoma",
      laserBenefit: "Reducción inmediata del enrojecimiento y reparación de barrera",
      peeling: "Peeling Químico",
      peelingMatch: "Sérum Radiante de Glutatión",
      peelingBenefit: "Mejora del brillo sin irritación e inhibición de melanina",
      filler: "Inyectables",
      fillerMatch: "Ampolla Calmante Árnica B-tox",
      fillerBenefit: "Reducción de hinchazón y longevidad del procedimiento",
    },
    colorAtelier: {
      title: "Color",
      titleBold: "Atelier",
      subtitle: "Colores K-Beauty de tendencia seleccionados para tu marca",
      cta: "Explorar Paleta Completa",
    },
    trendAnalysis: {
      title: "Tendencias K-Beauty,",
      titleBold: "Tu Ventaja.",
      subtitle: "Mantente adelante con datos de tendencias en tiempo real. Formulamos lo que los consumidores querrán.",
      trendReady: "Fórmulas Listas para Tendencias",
      trendReadyDesc: "Ya tenemos productos que coinciden con estas tendencias. Lanzamiento en 14 días.",
      viewCatalog: "Ver Catálogo",
      glassSkin: "Piel de Cristal",
      glassSkinDesc: "Productos con acabado luminoso y húmedo",
      skinBarrier: "Barrera Cutánea",
      skinBarrierDesc: "Enfoque en ceramidas y reparación de barrera",
      cleanBeauty: "Belleza Limpia",
      cleanBeautyDesc: "Formulaciones mínimas y transparentes",
      fermented: "Activos Fermentados",
      fermentedDesc: "Ingredientes probióticos y fermentados",
      hybrid: "Skincare Híbrido",
      hybridDesc: "Productos fusión maquillaje-skincare",
      personalization: "Personalización",
      personalizationDesc: "Formulaciones personalizables",
    },
    bulkPricing: {
      title: "Escala Tu Marca,",
      titleBold: "Maximiza Márgenes.",
      subtitle: "Precios transparentes que crecen con tu negocio. Sin cargos ocultos, sin sorpresas.",
      perUnit: "/unidad",
      save: "Ahorra",
      units: "unidades",
      mostPopular: "MÁS POPULAR",
      starter: "Inicial",
      growth: "Crecimiento",
      scale: "Escala",
      enterprise: "Empresa",
      fullCustomization: "Personalización completa",
      standardPackaging: "Empaque estándar",
      premiumPackaging: "Opciones de empaque premium",
      allPackaging: "Todas las opciones de empaque",
      bespokeFormulation: "Formulación a medida",
      production30: "Producción 30 días",
      production21: "Producción 21 días",
      production14: "Producción 14 días",
      expressProduction: "Producción express",
      dedicatedManager: "Gerente de cuenta dedicado",
      prioritySupport: "Soporte prioritario",
      dedicatedTeam: "Equipo dedicado",
      quarterlyReports: "Informes trimestrales de tendencias",
      exclusiveTrends: "Acceso exclusivo a tendencias",
      footnote: "Todos los precios son por unidad. Envío calculado por separado.",
      customQuote: "Cotizaciones personalizadas disponibles para 10,000+ unidades.",
    },
    whiteLabel: {
      title: "Tu Marca,",
      titleBold: "Nuestra Experiencia.",
      subtitle: "Crea una línea de amenidades distintiva que refleje la identidad de tu propiedad y deleite a tus huéspedes.",
      feature1Title: "Tu Marca, Tu Identidad",
      feature1Desc: "Personalización completa de empaque, etiquetas y nombres de fórmulas. Tus huéspedes solo verán tu marca.",
      feature2Title: "MOQ Flexible",
      feature2Desc: "Comienza con tan solo 100 unidades por SKU. Perfecto para hoteles boutique y propiedades en crecimiento.",
      feature3Title: "Fórmulas Premium",
      feature3Desc: "La misma calidad K-Beauty confiada por spas de lujo en todo el mundo. Eleva la experiencia de tus huéspedes.",
      feature4Title: "Entrega Rápida",
      feature4Desc: "Desde aprobación de diseño hasta entrega en tan solo 14 días. Nunca te quedes sin amenidades.",
      amenitySets: "Sets de Amenidades Seleccionados",
      essentialSet: "Set Esencial",
      premiumSet: "Set Premium",
      luxurySet: "Set Lujo",
      essentialItems: "Champú, Acondicionador, Gel de Ducha, Loción",
      premiumItems: "+ Limpiador Facial, Hidratante, Crema de Manos",
      luxuryItems: "+ Sérum, Crema de Ojos, Bálsamo Labial, Sales de Baño",
      idealFor: "Ideal para",
      rooms: "habitaciones",
      popular: "POPULAR",
      trusted: "Confiado por hoteles boutique y resorts de lujo en todo el mundo.",
      schedule: "Agenda una consulta hoy.",
    },
    leadCapture: {
      title: "Recibe Tus Recursos Personalizados",
      subtitle: "Ingresa tu correo para recibir instantáneamente el paquete visual.",
      emailPlaceholder: "Correo Empresarial",
      downloadButton: "Descargar Recursos",
      disclaimer: "* Al hacer clic en descargar, aceptas recibir un PDF de propuesta única.",
      assetsSent: "¡Recursos Enviados!",
      assetsSentDesc: "Mientras revisas tu bandeja de entrada, deja tus datos de contacto para una consulta prioritaria.",
      namePlaceholder: "Nombre de Contacto",
      phonePlaceholder: "Teléfono / WhatsApp",
      messagePlaceholder: "¿Alguna solicitud específica? (ej. MOQ, ingredientes específicos)",
      completeButton: "Completar Consulta",
      successTitle: "¡Todo Listo!",
      successDesc: "Nuestro equipo ha recibido tu consulta y se conectará contigo en 24 horas.",
    },
  },
  zh: {
    loading: {
      step1Label: "邀请",
      step1Detail: "邀请您踏上非凡之旅...",
      step2Label: "发现本质",
      step2Detail: "发掘品牌的隐藏潜力...",
      step3Label: "纯粹炼金术",
      step3Detail: "将您的独特身份与我们的创新融合...",
      step4Label: "揭晓",
      step4Detail: "准备揭晓产品的未来...",
      creatingVisuals: "正在创建视觉效果...",
    },
    riskFreeScaler: {
      title: "您的成长，",
      titleBold: "零风险。",
      traditional: "传统OEM/ODM",
      irunica: "IRUNICA 自有品牌",
      fastTrack: "快速通道",
      moq: "最小起订量（MOQ）",
      moqTraditional: "5,000+件",
      moqIrunica: "100+件",
      timeToMarket: "上市时间",
      timeTraditional: "6~12个月",
      timeIrunica: "14天",
      rdCert: "研发/认证",
      rdTraditional: "$10,000+（高风险）",
      rdIrunica: "$0（预认证）",
      inventoryRisk: "库存风险",
      inventoryTraditional: "极高",
      inventoryIrunica: "由Irunica管理",
      footnote: "*我们拥有CPNP/FDA预认证配方。您只需定义品牌价值。",
    },
    protocolMatcher: {
      title: "您的方案，",
      titleBold: "我们的解决方案。",
      matchingFormula: "匹配配方",
      suggestedLabeling: "建议标签",
      exclusiveAfterCare: "专属术后护理 by",
      laser: "激光治疗",
      laserMatch: "纳米脂质体修复霜",
      laserBenefit: "即时减少红肿，修复皮肤屏障",
      peeling: "化学换肤",
      peelingMatch: "谷胱甘肽亮肤精华",
      peelingBenefit: "无刺激提亮，抑制黑色素",
      filler: "注射类",
      fillerMatch: "山金车B-tox舒缓安瓶",
      fillerBenefit: "消肿，延长效果持久性",
    },
    colorAtelier: {
      title: "色彩",
      titleBold: "工坊",
      subtitle: "为您的品牌精选的K-Beauty流行色",
      cta: "探索完整色板",
    },
    trendAnalysis: {
      title: "K-Beauty趋势，",
      titleBold: "您的优势。",
      subtitle: "通过实时趋势数据保持领先。我们配制消费者未来想要的产品。",
      trendReady: "趋势就绪配方",
      trendReadyDesc: "我们已有符合这些趋势的产品。14天内可上市。",
      viewCatalog: "查看目录",
      glassSkin: "玻璃肌",
      glassSkinDesc: "水润透亮质感产品",
      skinBarrier: "皮肤屏障",
      skinBarrierDesc: "神经酰胺和屏障修复为核心",
      cleanBeauty: "纯净美容",
      cleanBeautyDesc: "极简透明配方",
      fermented: "发酵活性成分",
      fermentedDesc: "益生菌和发酵成分",
      hybrid: "混合护肤",
      hybridDesc: "彩妆-护肤融合产品",
      personalization: "个性化",
      personalizationDesc: "可定制配方",
    },
    bulkPricing: {
      title: "扩展您的品牌，",
      titleBold: "最大化利润。",
      subtitle: "与您的业务共同成长的透明定价。无隐藏费用，无意外。",
      perUnit: "/件",
      save: "节省",
      units: "件",
      mostPopular: "最受欢迎",
      starter: "入门",
      growth: "成长",
      scale: "规模",
      enterprise: "企业",
      fullCustomization: "完全定制",
      standardPackaging: "标准包装",
      premiumPackaging: "高级包装选项",
      allPackaging: "所有包装选项",
      bespokeFormulation: "定制配方",
      production30: "30天生产",
      production21: "21天生产",
      production14: "14天生产",
      expressProduction: "快速生产",
      dedicatedManager: "专属客户经理",
      prioritySupport: "优先支持",
      dedicatedTeam: "专属团队",
      quarterlyReports: "季度趋势报告",
      exclusiveTrends: "独家趋势访问",
      footnote: "所有价格均为单件价格。运费另计。",
      customQuote: "10,000+件可获得定制报价。",
    },
    whiteLabel: {
      title: "您的品牌，",
      titleBold: "我们的专业。",
      subtitle: "创建反映您物业身份并令客人满意的标志性洗护用品系列。",
      feature1Title: "您的品牌，您的身份",
      feature1Desc: "包装、标签和配方名称完全定制。您的客人只会看到您的品牌。",
      feature2Title: "灵活的MOQ",
      feature2Desc: "每SKU可从100件起订。非常适合精品酒店和成长中的物业。",
      feature3Title: "高端配方",
      feature3Desc: "与全球顶级水疗中心信赖的K-Beauty品质相同。提升您的宾客体验。",
      feature4Title: "快速交付",
      feature4Desc: "从设计批准到交付最快14天。永不断货。",
      amenitySets: "精选洗护套装",
      essentialSet: "基础套装",
      premiumSet: "高级套装",
      luxurySet: "奢华套装",
      essentialItems: "洗发水、护发素、沐浴露、乳液",
      premiumItems: "+ 洁面乳、保湿霜、护手霜",
      luxuryItems: "+ 精华液、眼霜、润唇膏、浴盐",
      idealFor: "适合",
      rooms: "间客房",
      popular: "热门",
      trusted: "全球精品酒店和豪华度假村信赖之选。",
      schedule: "立即预约咨询。",
    },
    leadCapture: {
      title: "获取您的定制资源",
      subtitle: "输入邮箱，立即收到视觉包。",
      emailPlaceholder: "企业邮箱",
      downloadButton: "下载资源",
      disclaimer: "* 点击下载即表示您同意接收一次性方案PDF。",
      assetsSent: "资源已发送！",
      assetsSentDesc: "在您查看收件箱的同时，请留下联系方式以获得优先咨询。",
      namePlaceholder: "联系人姓名",
      phonePlaceholder: "电话 / 微信",
      messagePlaceholder: "任何特殊要求？（如：MOQ、特定成分）",
      completeButton: "完成咨询",
      successTitle: "全部完成",
      successDesc: "我们的团队已收到您的咨询，将在24小时内与您联系。",
    },
  },
};

// Helper function to get translations
export function getTranslations(lang: SupportedLanguage): ModuleTranslations {
  return translations[lang] || translations.en;
}
