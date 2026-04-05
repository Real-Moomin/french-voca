const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

const dayConfigs = [
  {
    day: 2,
    title: "Day 02",
    contextFr: "dans une discussion d’opinion ou un devoir écrit",
    contextKo: "의견을 말하거나 글을 쓸 때",
    useCase: "exam-essay",
    targetLevel: "B1-B2",
  },
  {
    day: 3,
    title: "Day 03",
    contextFr: "dans l’organisation du travail et des études",
    contextKo: "공부와 일을 정리할 때",
    useCase: "writing-heavy",
    targetLevel: "B1-B2",
  },
  {
    day: 4,
    title: "Day 04",
    contextFr: "dans les échanges professionnels du quotidien",
    contextKo: "일상적인 업무 소통에서",
    useCase: "speaking-heavy",
    targetLevel: "B1-B2",
  },
  {
    day: 5,
    title: "Day 05",
    contextFr: "dans la lecture d’articles et de documents",
    contextKo: "기사나 문서를 읽을 때",
    useCase: "reading-heavy",
    targetLevel: "B2",
  },
  {
    day: 6,
    title: "Day 06",
    contextFr: "dans les démarches administratives et les procédures",
    contextKo: "행정 절차와 서류 처리에서",
    useCase: "writing-heavy",
    targetLevel: "B2",
  },
  {
    day: 7,
    title: "Day 07",
    contextFr: "dans les débats sur la société et les médias",
    contextKo: "사회와 미디어에 대해 토론할 때",
    useCase: "exam-essay",
    targetLevel: "B2",
  },
  {
    day: 8,
    title: "Day 08",
    contextFr: "dans l’analyse et l’interprétation d’une situation",
    contextKo: "상황을 분석하고 해석할 때",
    useCase: "reading-heavy",
    targetLevel: "B2-C1",
  },
  {
    day: 9,
    title: "Day 09",
    contextFr: "dans la planification et la résolution de problèmes",
    contextKo: "계획을 세우고 문제를 해결할 때",
    useCase: "writing-heavy",
    targetLevel: "B2-C1",
  },
  {
    day: 10,
    title: "Day 10",
    contextFr: "dans une prise de position plus nuancée",
    contextKo: "더 섬세하게 입장을 표현할 때",
    useCase: "exam-essay",
    targetLevel: "B2-C1",
  },
];

const nouns = [
  ["l’argument", "논거"], ["la thèse", "논지"], ["le point de vue", "관점"], ["la preuve", "근거"],
  ["la conséquence", "결과"], ["la comparaison", "비교"], ["la priorité", "우선순위"], ["le repère", "기준점"],
  ["la méthode", "방법"], ["la démarche", "접근 방식"], ["le constat", "관찰 결과"], ["la cohésion", "결속력"],
  ["la crédibilité", "신뢰성"], ["la perspective", "관점"], ["la contrainte", "제약"], ["la portée", "영향 범위"],
  ["la mise en œuvre", "실행"], ["la fiabilité", "신뢰성"], ["le dispositif", "장치, 체계"], ["la marge", "여유, 폭"],
  ["le cadre", "틀, 프레임"], ["l’adhésion", "지지"], ["le recul", "거리 두고 보는 시각"], ["la dynamique", "역동성"],
  ["la répartition", "배분"], ["la coordination", "조정"], ["la procédure", "절차"], ["le suivi", "후속 관리"],
  ["la médiation", "중재"], ["le repérage", "파악"], ["la vigilance", "경계"], ["l’évolution", "변화"],
  ["le raisonnement", "논리 전개"], ["la nuance", "뉘앙스"], ["l’hypothèse", "가설"], ["la référence", "참고 기준"],
  ["la synthèse", "종합"], ["la précision", "정확성"], ["la stabilité", "안정성"], ["le décalage", "어긋남"],
];

const verbs = [
  ["nuancer", "뉘앙스를 더하다"], ["mettre en avant", "강조하다"], ["remettre en cause", "의문을 제기하다"], ["approfondir", "심화하다"],
  ["souligner", "강조하다"], ["justifier", "정당화하다"], ["envisager", "고려하다"], ["distinguer", "구별하다"],
  ["structurer", "구조화하다"], ["coordonner", "조정하다"], ["concilier", "양립시키다"], ["surmonter", "극복하다"],
  ["assumer", "책임지다"], ["faire face à", "~에 직면하다"], ["préconiser", "권고하다"], ["susciter", "불러일으키다"],
  ["témoigner de", "~을 보여주다"], ["aboutir", "성사되다"], ["répartir", "배분하다"], ["gérer", "관리하다"],
  ["anticiper", "예상하고 대비하다"], ["clarifier", "명확히 하다"], ["ajuster", "조정하다"], ["hiérarchiser", "우선순위를 매기다"],
  ["appuyer", "뒷받침하다"], ["mettre en œuvre", "실행하다"], ["cibler", "겨냥하다"], ["élargir", "확장하다"],
  ["encadrer", "관리 감독하다"], ["rendre compte de", "~을 보고하다"], ["préserver", "보존하다"], ["optimiser", "최적화하다"],
  ["mobiliser", "동원하다"], ["atténuer", "완화하다"], ["révéler", "드러내다"], ["trancher", "결정하다"],
  ["interpréter", "해석하다"], ["formuler", "표현하다"], ["mesurer", "측정하다"], ["mettre en évidence", "분명히 드러내다"],
];

const adjectives = [
  ["cohérent", "일관된"], ["pertinent", "적절한"], ["fiable", "믿을 만한"], ["nuancé", "균형 잡힌"],
  ["viable", "실현 가능한"], ["précis", "정확한"], ["exigeant", "요구 수준이 높은"], ["révélateur", "시사하는"],
  ["durable", "지속 가능한"], ["subtil", "미묘한"], ["incontournable", "필수적인"], ["ambivalent", "양가적인"],
  ["crédible", "설득력 있는"], ["rigoureux", "엄밀한"], ["global", "전체적인"], ["complémentaire", "상호보완적인"],
  ["provisoire", "임시의"], ["stratégique", "전략적인"], ["modéré", "절제된"], ["contrasté", "대조적인"],
  ["fragile", "불안정한"], ["coûteux", "비용이 많이 드는"], ["souple", "유연한"], ["collectif", "집단적인"],
  ["progressif", "점진적인"], ["complexe", "복잡한"], ["central", "핵심적인"], ["secondaire", "부차적인"],
  ["lisible", "이해하기 쉬운"], ["flou", "불분명한"], ["justifié", "정당화된"], ["décisif", "결정적인"],
  ["contrastif", "대조적인"], ["stimulant", "자극이 되는"], ["résistant", "견고한"], ["instable", "불안정한"],
];

const adverbs = [
  ["néanmoins", "그럼에도 불구하고"], ["pour autant", "그렇다고 해서"], ["d’ailleurs", "게다가"], ["en revanche", "반면에"],
  ["dans l’ensemble", "전반적으로"], ["à première vue", "언뜻 보기에는"], ["en amont", "사전에"], ["à long terme", "장기적으로"],
  ["de plus en plus", "점점 더"], ["dans cette optique", "이러한 관점에서"], ["autrement dit", "다시 말해"], ["en définitive", "결국"],
  ["en pratique", "실제로"], ["à ce stade", "현 단계에서는"], ["par ailleurs", "그 밖에"], ["en effet", "실제로"],
  ["en réalité", "실제로는"], ["en partie", "부분적으로"], ["à juste titre", "정당하게"], ["à défaut", "그렇지 못할 경우"],
  ["en priorité", "우선적으로"], ["au préalable", "사전에"], ["de manière durable", "지속 가능하게"], ["sans pour autant", "그렇다고 해서 ~없이"],
  ["dans une certaine mesure", "어느 정도"], ["de façon cohérente", "일관되게"], ["en profondeur", "깊이 있게"], ["au quotidien", "일상적으로"],
  ["à moyen terme", "중기적으로"], ["en apparence", "겉보기에는"], ["tout au plus", "많아야"], ["en particulier", "특히"],
  ["dans ce cadre", "이 틀 안에서"], ["au fond", "결국"], ["en ce sens", "그런 의미에서"], ["dans la durée", "장기적으로"],
];

const nounTemplates = [
  "Dans ce contexte, {word} reste un élément important à clarifier.",
  "On comprend mieux la situation quand {word} est bien expliqué.",
  "Au moment de décider, {word} compte beaucoup.",
];

const verbTemplates = [
  "Il faut souvent {word} avant de proposer une solution crédible.",
  "Dans cette situation, nous devons {word} avec calme et précision.",
  "Pour avancer, il vaut mieux {word} dès le début.",
];

const adjectiveTemplates = [
  "Une réponse {word} rassure davantage tout le monde.",
  "Dans un exposé, un argument {word} a plus d’impact.",
  "Un ton {word} aide à rendre le message plus clair.",
];

const adverbTemplates = [
  "{word}, il faut revoir notre position.",
  "Cette idée revient {word} dans les discussions récentes.",
  "Le projet avance {word} si chacun connaît son rôle.",
];

const nounKoTemplates = [
  "{contextKo} {meaning}을 분명히 하는 일이 중요하다.",
  "{contextKo} {meaning}이 잘 설명되면 상황을 더 잘 이해하게 된다.",
  "결정을 내릴 때 {contextKo} {meaning}이 큰 역할을 한다.",
];

const verbKoTemplates = [
  "믿을 만한 해결책을 제시하기 전에 {contextKo} {meaning}할 필요가 있다.",
  "{contextKo} 차분하고 정확하게 {meaning}해야 한다.",
  "앞으로 나아가려면 {contextKo} 처음부터 {meaning}하는 편이 낫다.",
];

const adjectiveKoTemplates = [
  "{contextKo} {meaning} 답변은 사람들을 더 안심시킨다.",
  "발표에서는 {contextKo} {meaning} 논거가 더 큰 힘을 가진다.",
  "{contextKo} {meaning} 태도는 메시지를 더 분명하게 만든다.",
];

const adverbKoTemplates = [
  "{contextKo} {meaning} 관점을 다시 살펴봐야 한다.",
  "{contextKo} 이런 생각은 {meaning} 반복해서 등장한다.",
  "각자 역할을 알면 {contextKo} 계획은 {meaning} 진행된다.",
];

function take(list, start, count) {
  return Array.from({ length: count }, (_, index) => list[(start + index) % list.length]);
}

function exampleFor(kind, word, contextFr, index) {
  const templates = {
    noun: nounTemplates,
    verb: verbTemplates,
    adjective: adjectiveTemplates,
    adverb: adverbTemplates,
  };
  return templates[kind][index % templates[kind].length]
    .replace("{word}", word)
    .replace("{contextFr}", contextFr);
}

function exampleKoFor(kind, meaning, contextKo, index) {
  const templates = {
    noun: nounKoTemplates,
    verb: verbKoTemplates,
    adjective: adjectiveKoTemplates,
    adverb: adverbKoTemplates,
  };
  return templates[kind][index % templates[kind].length]
    .replace("{meaning}", meaning)
    .replace("{contextKo}", contextKo);
}

function createQuiz(words) {
  const quizIndexes = [1, 4, 7, 10, 13, 16, 20, 23, 26, 29];
  return quizIndexes.map((idx) => {
    const entry = words[idx];
    return {
      sentence: entry.example.replace(entry.word, "____"),
      answer: entry.word,
      hint: entry.meaning,
    };
  });
}

function buildDay(config, offsets) {
  const words = [];
  const nounSet = take(nouns, offsets.noun, 8);
  const verbSet = take(verbs, offsets.verb, 8);
  const adjectiveSet = take(adjectives, offsets.adjective, 7);
  const adverbSet = take(adverbs, offsets.adverb, 7);

  nounSet.forEach(([word, meaning], index) => {
    words.push({
      word,
      partOfSpeech: "noun",
      meaning,
      example: exampleFor("noun", word, config.contextFr, index),
      exampleKo: exampleKoFor("noun", meaning, config.contextKo, index),
      exampleNote: "",
    });
  });

  verbSet.forEach(([word, meaning], index) => {
    words.push({
      word,
      partOfSpeech: "verb",
      meaning,
      example: exampleFor("verb", word, config.contextFr, index),
      exampleKo: exampleKoFor("verb", meaning, config.contextKo, index),
      exampleNote: "",
    });
  });

  adjectiveSet.forEach(([word, meaning], index) => {
    words.push({
      word,
      partOfSpeech: "adjective",
      meaning,
      example: exampleFor("adjective", word, config.contextFr, index),
      exampleKo: exampleKoFor("adjective", meaning, config.contextKo, index),
      exampleNote: "",
    });
  });

  adverbSet.forEach(([word, meaning], index) => {
    words.push({
      word,
      partOfSpeech: "adverb",
      meaning,
      example: exampleFor("adverb", word, config.contextFr, index),
      exampleKo: exampleKoFor("adverb", meaning, config.contextKo, index),
      exampleNote: "",
    });
  });

  return {
    day: config.day,
    title: config.title,
    targetLevel: config.targetLevel,
    useCase: config.useCase,
    words,
    quiz: createQuiz(words),
  };
}

function main() {
  fs.mkdirSync(dataDir, { recursive: true });

  const manifest = [{ day: 1, title: "Day 01" }, ...dayConfigs.map(({ day, title }) => ({ day, title }))];
  fs.writeFileSync(path.join(dataDir, "index.json"), JSON.stringify(manifest, null, 2), "utf8");

  dayConfigs.forEach((config, index) => {
    const data = buildDay(config, {
      noun: index * 4,
      verb: index * 4,
      adjective: index * 4,
      adverb: index * 4,
    });
    fs.writeFileSync(
      path.join(dataDir, `day${String(config.day).padStart(2, "0")}.json`),
      JSON.stringify(data, null, 2),
      "utf8",
    );
  });
}

main();
