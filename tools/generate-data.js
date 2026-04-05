const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const themes = [
  ["Saluer et commencer", "인사와 기본 생활", "첫 만남과 하루 시작에 자주 나오는 표현을 모았습니다."],
  ["Maison et famille", "집과 가족", "가정생활과 집안일, 가족 대화에 자주 쓰이는 어휘입니다."],
  ["Etudes et apprentissage", "학습과 학교", "수업, 복습, 과제 설명에 잘 맞는 표현입니다."],
  ["Ville et transport", "도시와 이동", "길 찾기와 대중교통 상황에서 유용합니다."],
  ["Courses et achats", "쇼핑과 구매", "가격 비교와 주문, 교환에 자주 쓰입니다."],
  ["Repas et cafe", "식사와 카페", "주문과 맛 표현, 식습관 대화에 많이 나옵니다."],
  ["Sante au quotidien", "건강과 몸", "컨디션 설명과 병원, 휴식 관련 표현입니다."],
  ["Travail et bureau", "직장과 업무", "업무 지시와 협업, 보고에 필요한 어휘입니다."],
  ["Vie numerique", "디지털 생활", "메시지, 파일, 온라인 서비스와 관련된 단어입니다."],
  ["Preparation du voyage", "여행 준비", "예약과 일정, 출발 전 점검 표현을 담았습니다."],
  ["Hotel et sejour", "숙소와 체류", "체크인과 문의, 불편 전달에 자주 쓰입니다."],
  ["Amitie et emotions", "우정과 감정", "관계와 기분, 반응을 자연스럽게 말할 수 있습니다."],
  ["Temps et meteo", "시간과 날씨", "날짜와 계절, 예보, 일정 조정에서 유용합니다."],
  ["Culture et loisirs", "문화와 취미", "전시, 공연, 운동, 여가 대화에 맞춘 어휘입니다."],
  ["Administration", "행정과 서류", "신청과 제출, 확인, 공식 절차에 필요한 표현입니다."],
  ["Environnement", "환경과 생활 습관", "절약과 재활용, 지속가능성 관련 단어입니다."],
  ["Argent et banque", "돈과 금융", "예산과 결제, 계좌, 환불 상황에 자주 나옵니다."],
  ["Medias et communication", "미디어와 소통", "뉴스, 게시물, 의견 전달에 맞는 표현입니다."],
  ["Resoudre un probleme", "문제 해결", "원인 파악과 대안 제시, 조정 표현을 담았습니다."],
  ["Opinion et debat", "의견과 토론", "찬반과 근거, 설득 표현을 익히기 좋습니다."],
  ["Strategie d apprentissage", "학습 전략", "기억과 집중, 계획, 반복 학습에 맞춘 표현입니다."],
  ["Societe et quotidien", "사회 이슈와 일상", "공공생활과 사회 현상을 말할 때 유용합니다."],
  ["Projet et equipe", "프로젝트와 팀워크", "역할 분담과 진행 공유, 협업 표현입니다."],
  ["Evenement et organisation", "행사와 준비", "모임과 안내, 장소 운영에 필요한 어휘입니다."],
  ["Demenagement", "이사와 정리", "집 구하기와 짐 정리, 계약 표현을 모았습니다."],
  ["Service client", "고객 응대", "문의와 안내, 해결, 사과 표현을 담았습니다."],
  ["Entretien et carriere", "면접과 커리어", "경험 설명과 강점 소개, 지원 상황에 유용합니다."],
  ["Regles et securite", "규칙과 안전", "주의와 금지, 허가, 긴급 상황 표현입니다."],
  ["Connecteurs utiles", "연결어와 고급 표현", "문장을 자연스럽게 이어 주는 핵심 표현입니다."],
  ["Revision generale", "종합 복습", "실전 대화에서 다시 자주 만나게 될 핵심 어휘입니다."],
];

const nouns = [
  ["l'accueil","맞이함"],["la conversation","대화"],["le rendez-vous","약속"],["la famille","가족"],["la chambre","방"],
  ["la cuisine","부엌"],["le quartier","동네"],["le cours","수업"],["le devoir","과제"],["la methode","방법"],
  ["la question","질문"],["la reponse","답변"],["la ville","도시"],["la station","역"],["le trajet","이동 경로"],
  ["le ticket","승차권"],["le magasin","가게"],["le produit","상품"],["la commande","주문"],["le recu","영수증"],
  ["le repas","식사"],["la boisson","음료"],["le dessert","디저트"],["la reservation","예약"],["la sante","건강"],
  ["la douleur","통증"],["le symptome","증상"],["le repos","휴식"],["le bureau","사무실"],["la reunion","회의"],
  ["le dossier","서류철"],["la tache","업무"],["le message","메시지"],["le fichier","파일"],["le mot de passe","비밀번호"],
  ["le voyage","여행"],["la valise","여행가방"],["le passeport","여권"],["l'itineraire","여행 경로"],["la chambre d'hotel","호텔 방"],
  ["la reception","프런트"],["le bruit","소음"],["l'amitie","우정"],["la confiance","신뢰"],["la joie","기쁨"],
  ["la tristesse","슬픔"],["la meteo","날씨"],["la saison","계절"],["la temperature","기온"],["le soleil","태양"],
  ["le musee","박물관"],["l'exposition","전시"],["le concert","공연"],["le loisir","여가"],["le formulaire","신청서"],
  ["la signature","서명"],["le document","문서"],["la demande","신청"],["l'environnement","환경"],["le recyclage","재활용"],
  ["l'energie","에너지"],["le budget","예산"],["la depense","지출"],["le paiement","결제"],["la facture","청구서"],
  ["le remboursement","환불"],["l'actualite","시사"],["le commentaire","댓글"],["la publication","게시물"],["l'article","기사"],
  ["le probleme","문제"],["la solution","해결책"],["la cause","원인"],["la consequence","결과"],["l'opinion","의견"],
  ["l'argument","논거"],["la preuve","근거"],["la concentration","집중"],["l'objectif","목표"],["le progres","진전"],
  ["la societe","사회"],["la diversite","다양성"],["le respect","존중"],["le projet","프로젝트"],["l'equipe","팀"],
  ["la coordination","조율"],["l'evenement","행사"],["l'invitation","초대"],["le programme","일정표"],["le demenagement","이사"],
  ["le carton","상자"],["le contrat","계약"],["le loyer","월세"],["le client","고객"],["la reclamation","불만 제기"],
  ["la satisfaction","만족"],["l'entretien","면접"],["l'experience","경험"],["la competence","역량"],["la regle","규칙"],
  ["la securite","안전"],["l'urgence","긴급 상황"],["la conclusion","결론"],["la condition","조건"],["l'exemple","예시"],
];

const verbs = [
  ["accueillir","맞이하다"],["saluer","인사하다"],["presenter","소개하다"],["demander","요청하다"],["expliquer","설명하다"],
  ["commencer","시작하다"],["continuer","계속하다"],["ranger","정리하다"],["nettoyer","청소하다"],["preparer","준비하다"],
  ["inviter","초대하다"],["etudier","공부하다"],["memoriser","암기하다"],["relire","다시 읽다"],["comparer","비교하다"],
  ["corriger","수정하다"],["progresser","향상되다"],["se deplacer","이동하다"],["traverser","건너다"],["attendre","기다리다"],
  ["confirmer","확인하다"],["acheter","구매하다"],["choisir","고르다"],["essayer","입어보다"],["commander","주문하다"],
  ["payer","지불하다"],["echanger","교환하다"],["economiser","절약하다"],["deguster","맛보다"],["reserver","예약하다"],
  ["ajouter","추가하다"],["melanger","섞다"],["respirer","호흡하다"],["soigner","돌보다"],["consulter","진료받다"],
  ["se reposer","쉬다"],["recuperer","회복하다"],["eviter","피하다"],["collaborer","협업하다"],["transmettre","전달하다"],
  ["planifier","계획하다"],["reporter","미루다"],["finaliser","마무리하다"],["gerer","관리하다"],["telecharger","다운로드하다"],
  ["envoyer","보내다"],["sauvegarder","저장하다"],["supprimer","삭제하다"],["se connecter","로그인하다"],["verifier","확인하다"],
  ["emporter","챙겨 가다"],["annuler","취소하다"],["rejoindre","합류하다"],["embarquer","탑승하다"],["voyager","여행하다"],
  ["s'enregistrer","체크인하다"],["deposer","맡기다"],["ouvrir","열다"],["changer","바꾸다"],["regler","조정하다"],
  ["sourire","미소 짓다"],["rassurer","안심시키다"],["soutenir","응원하다"],["pardonner","용서하다"],["apprecier","좋아하다"],
  ["prevoir","예상하다"],["s'adapter","적응하다"],["observer","관찰하다"],["visiter","방문하다"],["lire","읽다"],
  ["admirer","감상하다"],["pratiquer","연습하다"],["participer","참가하다"],["remplir","작성하다"],["soumettre","제출하다"],
  ["joindre","첨부하다"],["imprimer","출력하다"],["classer","분류하다"],["declarer","신고하다"],["trier","분류하다"],
  ["recycler","재활용하다"],["reduire","줄이다"],["proteger","보호하다"],["eteindre","끄다"],["retirer","인출하다"],
  ["virer","송금하다"],["facturer","청구하다"],["rembourser","환불하다"],["negocier","협상하다"],["publier","게시하다"],
  ["commenter","댓글 달다"],["diffuser","배포하다"],["debattre","토론하다"],["identifier","파악하다"],["resoudre","해결하다"],
  ["ameliorer","개선하다"],["clarifier","명확히 하다"],["proposer","제안하다"],["justifier","정당화하다"],["conclure","결론짓다"],
  ["reviser","복습하다"],["se concentrer","집중하다"],["retenir","기억하다"],["respecter","존중하다"],["coordonner","조율하다"],
];

const adjectives = [
  ["utile","유용한"],["poli","예의 바른"],["ponctuel","시간을 잘 지키는"],["simple","간단한"],["familial","가정적인"],
  ["pratique","실용적인"],["propre","깨끗한"],["calme","조용한"],["efficace","효율적인"],["clair","명확한"],
  ["serieux","진지한"],["regulier","규칙적인"],["rapide","빠른"],["proche","가까운"],["direct","직접적인"],
  ["cher","비싼"],["abordable","가격이 괜찮은"],["fiable","믿을 만한"],["savoureux","맛있는"],["equilibre","균형 잡힌"],
  ["fatigue","피곤한"],["urgent","긴급한"],["sain","건강한"],["professionnel","전문적인"],["precis","정확한"],
  ["charge","바쁜"],["souple","유연한"],["numerique","디지털의"],["securise","보안이 된"],["complet","완전한"],
  ["international","국제적인"],["confortable","편안한"],["bruyant","시끄러운"],["spacieux","넓은"],["sincere","진심 어린"],
  ["heureux","행복한"],["decu","실망한"],["touchant","감동적인"],["ensoleille","화창한"],["variable","변덕스러운"],
  ["creatif","창의적인"],["passionnant","흥미진진한"],["culturel","문화적인"],["officiel","공식적인"],["obligatoire","의무적인"],
  ["administratif","행정의"],["valide","유효한"],["ecologique","친환경적인"],["durable","지속 가능한"],["responsable","책임감 있는"],
  ["gratuit","무료의"],["mensuel","월간의"],["rentable","가성비 좋은"],["public","공공의"],["credible","신뢰할 수 있는"],
  ["complexe","복잡한"],["grave","심각한"],["acceptable","받아들일 만한"],["coherent","일관된"],["convaincant","설득력 있는"],
  ["essentiel","핵심적인"],["attentif","주의 깊은"],["motive","동기부여된"],["autonome","자율적인"],["patient","끈기 있는"],
  ["social","사회적인"],["collectif","공동의"],["inclusif","포용적인"],["strategique","전략적인"],["realiste","현실적인"],
  ["festif","축제 분위기의"],["accueillant","환영하는 분위기의"],["visible","눈에 잘 띄는"],["lumineux","채광이 좋은"],["renove","수리된"],
  ["courtois","공손한"],["mecontent","불만족한"],["motivant","의욕을 주는"],["qualifie","자격을 갖춘"],["polyvalent","다재다능한"],
  ["strict","엄격한"],["dangereux","위험한"],["autorise","허용된"],["preventif","예방의"],["logique","논리적인"],
  ["fluide","자연스러운"],["pertinent","적절한"],["modere","적당한"],["disponible","이용 가능한"],["discret","눈에 띄지 않는"],
];

const adverbs = [
  ["tout de suite","바로"],["d'abord","우선"],["souvent","자주"],["en general","대체로"],["a l'heure","정시에"],
  ["de bonne heure","일찍"],["en meme temps","동시에"],["tranquillement","차분하게"],["petit a petit","조금씩"],["sur place","현장에서"],
  ["au besoin","필요하면"],["par coeur","암기해서"],["en detail","자세히"],["a nouveau","다시"],["en avance","미리"],
  ["tout droit","곧장"],["en retard","늦게"],["au centre","중앙에"],["en promotion","할인 중인"],["a bas prix","저렴하게"],
  ["en stock","재고가 있는"],["a emporter","포장으로"],["en liquide","현금으로"],["sans faute","반드시"],["bien cuit","잘 익게"],
  ["a jeun","공복으로"],["avec moderation","적당히"],["sur le pouce","간단히"],["pas trop","너무 심하지 않게"],["en forme","좋은 컨디션으로"],
  ["au calme","조용한 곳에서"],["sans tarder","지체 없이"],["en priorite","우선적으로"],["en equipe","팀으로"],["a distance","원격으로"],
  ["en urgence","긴급히"],["au plus vite","가능한 한 빨리"],["dans les temps","제시간에"],["en ligne","온라인으로"],["hors ligne","오프라인으로"],
  ["a jour","최신 상태로"],["en prive","개인적으로"],["a l'avance","미리"],["de passage","지나는 길에"],["aller-retour","왕복으로"],
  ["au complet","만실로"],["en silence","조용히"],["de tout coeur","진심으로"],["sans doute","아마"],["a vrai dire","사실은"],
  ["heureusement","다행히"],["malheureusement","유감스럽게도"],["a mon avis","내 생각에는"],["demain matin","내일 아침"],["ce soir","오늘 저녁"],
  ["en ce moment","지금"],["malgre tout","그럼에도"],["pour le plaisir","즐거움 때문에"],["en direct","실시간으로"],["par courrier","우편으로"],
  ["en copie","참조로"],["sans erreur","실수 없이"],["dans les regles","규정대로"],["au quotidien","일상적으로"],["a long terme","장기적으로"],
  ["sans gaspillage","낭비 없이"],["autant que possible","가능한 한"],["a credit","카드로"],["au total","총합으로"],["sans frais","수수료 없이"],
  ["en resume","요약하면"],["en bref","간단히 말해"],["en pratique","실제로"],["au final","결국"],["par consequent","따라서"],
  ["en revanche","반면에"],["pourtant","그런데도"],["d'ailleurs","게다가"],["autrement dit","즉"],["dans ce cas","그 경우에는"],
  ["par etapes","단계적으로"],["sans pression","부담 없이"],["ensemble","함께"],["avec respect","존중하며"],["en conclusion","결론적으로"],
];

const situations = [
  "quand je rencontre quelqu'un pour la premiere fois",
  "avant le diner en famille",
  "pendant la preparation d'un cours",
  "quand je cherche mon chemin en ville",
  "au moment de payer dans un magasin",
  "quand je commande dans un cafe",
  "lorsque je ne me sens pas tres bien",
  "pendant une journee de travail chargee",
  "quand je gere mes fichiers en ligne",
  "la veille d'un depart en voyage",
  "en arrivant a l'hotel",
  "quand je parle avec un ami proche",
  "en consultant la meteo du jour",
  "quand je prevois une sortie culturelle",
  "au moment de remplir un dossier officiel",
  "dans une habitude plus respectueuse de l'environnement",
  "quand je fais attention a mes depenses",
  "en suivant l'actualite sur mon telephone",
  "lorsqu'un souci apparait dans l'organisation",
  "pendant une discussion ou chacun donne son avis",
  "quand j'essaie d'apprendre plus efficacement",
  "dans une conversation sur la vie en societe",
  "pendant un projet mene avec d'autres personnes",
  "en preparant un evenement pour plusieurs invites",
  "au moment de changer de logement",
  "quand je reponds a un client mecontent",
  "pendant un entretien d'embauche",
  "dans une situation ou la securite compte d'abord",
  "quand je veux relier mes idees plus clairement",
  "au moment de revoir les mots les plus utiles",
];

const templates = {
  noun: [
    "On rencontre souvent {word} {situation}.",
    "Dans la vraie vie, {word} revient souvent {situation}.",
    "Je remarque souvent {word} {situation}.",
  ],
  verb: [
    "En general, je dois {word} {situation}.",
    "Dans cette scene, nous pouvons {word} sans perdre de temps {situation}.",
    "Il faut parfois {word} naturellement {situation}.",
  ],
  adjective: [
    "Il vaut souvent mieux etre {word} {situation}.",
    "Rester {word} aide beaucoup {situation}.",
    "Essayer d'etre {word} fait souvent la difference {situation}.",
  ],
  adverb: [
    "On agit souvent {word} {situation}.",
    "Dans la vraie vie, on fait souvent cela {word} {situation}.",
    "On entend souvent cette expression, {word}, {situation}.",
  ],
};

function take(list, start, count) {
  return Array.from({ length: count }, (_, index) => list[(start + index) % list.length]);
}

function exampleFor(partOfSpeech, word, theme, description, day, index) {
  return templates[partOfSpeech][index % templates[partOfSpeech].length]
    .replace("{word}", word)
    .replace("{situation}", situations[day - 1]);
}

function exampleKoFor(partOfSpeech, meaning, day, index) {
  const situationKo = [
    "처음 누군가를 만날 때",
    "가족과 저녁을 먹기 전에",
    "수업 준비를 하는 동안",
    "도시에서 길을 찾을 때",
    "가게에서 계산할 때",
    "카페에서 주문할 때",
    "몸이 좋지 않을 때",
    "바쁜 업무 중에",
    "온라인 파일을 관리할 때",
    "여행 출발 전날에",
    "호텔에 도착했을 때",
    "친한 친구와 이야기할 때",
    "오늘 날씨를 확인할 때",
    "문화생활 계획을 세울 때",
    "공식 서류를 작성할 때",
    "환경을 더 배려하는 습관 속에서",
    "지출을 조심할 때",
    "휴대폰으로 뉴스를 볼 때",
    "일정에 문제가 생겼을 때",
    "각자 의견을 말하는 토론 중에",
    "더 효율적으로 공부하려고 할 때",
    "사회 생활에 대해 이야기할 때",
    "여럿이 함께 프로젝트를 할 때",
    "여러 사람을 위한 행사를 준비할 때",
    "집을 옮길 때",
    "불만 있는 고객에게 답할 때",
    "면접 중에",
    "안전이 가장 중요한 상황에서",
    "생각을 더 논리적으로 잇고 싶을 때",
    "핵심 단어를 다시 복습할 때",
  ][day - 1];

  const koTemplates = {
    noun: [
      `${situationKo} ${meaning} 같은 표현을 자주 보게 된다.`,
      `실생활에서는 ${situationKo} ${meaning}이 자주 나온다.`,
      `${situationKo} ${meaning}을 자주 접하게 된다.`,
    ],
    verb: [
      `${situationKo} ${meaning}해야 하는 경우가 많다.`,
      `${situationKo} 시간을 끌지 않고 ${meaning} 수 있다.`,
      `${situationKo} 자연스럽게 ${meaning}할 필요가 있다.`,
    ],
    adjective: [
      `${situationKo} ${meaning} 태도가 더 도움이 되는 경우가 많다.`,
      `${situationKo} ${meaning} 상태를 유지하는 것이 큰 도움이 된다.`,
      `${situationKo} ${meaning} 태도를 가지면 차이가 난다.`,
    ],
    adverb: [
      `${situationKo} 보통 ${meaning} 행동하게 된다.`,
      `실생활에서는 ${situationKo} 보통 ${meaning} 하게 된다.`,
      `${situationKo} ${meaning} 같은 표현을 자주 듣게 된다.`,
    ],
  };

  return koTemplates[partOfSpeech][index % koTemplates[partOfSpeech].length];
}

function buildDay(day) {
  const [title, theme, description] = themes[day - 1];
  const words = [];
  const nounSet = take(nouns, (day - 1) * 4, 15);
  const verbSet = take(verbs, (day - 1) * 4, 15);
  const adjectiveSet = take(adjectives, (day - 1) * 3, 10);
  const adverbSet = take(adverbs, (day - 1) * 3, 10);

  nounSet.forEach(([word, meaning], index) => words.push({ word, partOfSpeech: "noun", meaning, example: exampleFor("noun", word, theme, description, day, index), exampleKo: exampleKoFor("noun", meaning, day, index), exampleNote: "" }));
  verbSet.forEach(([word, meaning], index) => words.push({ word, partOfSpeech: "verb", meaning, example: exampleFor("verb", word, theme, description, day, index), exampleKo: exampleKoFor("verb", meaning, day, index), exampleNote: "" }));
  adjectiveSet.forEach(([word, meaning], index) => words.push({ word, partOfSpeech: "adjective", meaning, example: exampleFor("adjective", word, theme, description, day, index), exampleKo: exampleKoFor("adjective", meaning, day, index), exampleNote: "" }));
  adverbSet.forEach(([word, meaning], index) => words.push({ word, partOfSpeech: "adverb", meaning, example: exampleFor("adverb", word, theme, description, day, index), exampleKo: exampleKoFor("adverb", meaning, day, index), exampleNote: "" }));

  const quizIndexes = [1, 4, 9, 13, 18, 22, 29, 34, 41, 47];
  const quiz = quizIndexes.map((entryIndex) => {
    const entry = words[entryIndex];
    return {
      sentence: entry.example.replace(entry.word, "____"),
      answer: entry.word,
      hint: entry.meaning,
    };
  });

  return { day, title, theme, description, words, quiz };
}

fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "index.json"), JSON.stringify(themes.map(([title], index) => ({ day: index + 1, title })), null, 2), "utf8");
for (let day = 1; day <= 30; day += 1) {
  fs.writeFileSync(path.join(dataDir, `day${String(day).padStart(2, "0")}.json`), JSON.stringify(buildDay(day), null, 2), "utf8");
}
