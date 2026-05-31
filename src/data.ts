/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  number: string;
  content: string; // Brief description
  details: {
    title: string;
    description: string;
    tableHeaders?: string[];
    tableRows?: { french: string; spanish: string; note?: string }[];
    verbStructure?: { pronoun: string; base: string; ending?: string; full: string }[];
    examples: { french: string; spanish: string; audioText: string }[];
    extraContent?: string;
  };
}

export interface QuizQuestion {
  id: string;
  lessonId: number;
  type: 'multiple-choice' | 'conjugation' | 'match' | 'fill-blank' | 'sort';
  instruction: string;
  questionText: string;
  options?: string[]; // Used in MC
  correctAnswer: any; // string, string[] or key-value depending on type
  pairMatches?: { french: string; spanish: string }[]; // For matching type
  context?: string; // Additional context or hint
}

export const lessonsData: Lesson[] = [
  {
    id: 1,
    number: "1",
    title: "Les Présentations",
    subtitle: "Las presentaciones",
    content: "Aprende a decir quién eres y cómo preguntar el nombre a otras personas tanto de forma formal como informal.",
    details: {
      title: "Comment se présenter et demander le nom",
      description: "Las presentaciones sirven para decir quiénes somos y presentar a otras personas. Se utiliza principalmente la pregunta para saber el nombre y la estructura correspondiente para responder.",
      tableHeaders: ["Pregunta (Francés)", "Significado (Español)", "Uso / Contexto"],
      tableRows: [
        { french: "Comment tu t'appelles ?", spanish: "¿Cómo te llamas?", note: "Informal (con conocidos, amigos, jóvenes)" },
        { french: "Comment vous appelez-vous ?", spanish: "¿Cómo se llama usted?", note: "Formal (con personas mayores, profesores, desconocidos)" },
        { french: "Je m'appelle...", spanish: "Me llamo...", note: "Respuesta general" }
      ],
      examples: [
        { french: "Je m'appelle Nicolas.", spanish: "Me llamo Nicolas.", audioText: "Je m'appelle Nicolas." },
        { french: "Je m'appelle Camille.", spanish: "Me llamo Camille.", audioText: "Je m'appelle Camille." },
        { french: "Je m'appelle Mathilde.", spanish: "Me llamo Mathilde.", audioText: "Je m'appelle Mathilde." }
      ]
    }
  },
  {
    id: 2,
    number: "2",
    title: "Le Verbe S'appeler",
    subtitle: "El verbo llamarse",
    content: "Domina la conjugación en presente del verbo reflexivo pronominal 's'appeler'.",
    details: {
      title: "La conjugaison du verbe S'appeler",
      description: "Este es el verbo pronominal que utilizamos para dar nuestro nombre. Nota el cambio ortográfico de la doble 'll' en todas las personas excepto en 'nous' y 'vous'.",
      tableHeaders: ["Pronombre", "Pronombre Reflexivo", "Verbo", "Traducción aproximada"],
      verbStructure: [
        { pronoun: "Je", base: "m'appelle", full: "Je m'appelle" },
        { pronoun: "Tu", base: "t'appelles", full: "Tu t'appelles" },
        { pronoun: "Il", base: "s'appelle", full: "Il s'appelle" },
        { pronoun: "Elle", base: "s'appelle", full: "Elle s'appelle" },
        { pronoun: "Nous", base: "nous appelons", full: "Nous nous appelons" },
        { pronoun: "Vous", base: "vous appelez", full: "Vous vous appelez" },
        { pronoun: "Ils", base: "s'appellent", full: "Ils s'appellent" },
        { pronoun: "Elles", base: "s'appellent", full: "Elles s'appellent" }
      ],
      examples: [
        { french: "Je m'appelle Hugo.", spanish: "Me llamo Hugo.", audioText: "Je m'appelle Hugo." },
        { french: "Tu t'appelles Laura.", spanish: "Te llamas Laura.", audioText: "Tu t'appelles Laura." },
        { french: "Il s'appelle Nicolas.", spanish: "Él se llama Nicolas.", audioText: "Il s'appelle Nicolas." },
        { french: "Elles s'appellent Camille et Mathilde.", spanish: "Ellas se llaman Camille y Mathilde.", audioText: "Elles s'appellent Camille et Mathilde." }
      ]
    }
  },
  {
    id: 3,
    number: "3",
    title: "Les Salutations",
    subtitle: "Los saludos",
    content: "Aprende los saludos básicos en francés según el momento del día y el nivel de formalidad.",
    details: {
      title: "Savoir saluer",
      description: "Los saludos son fundamentales para abrir cualquier canal de comunicación. Pueden ser informales, formales o variar según la hora del día.",
      tableHeaders: ["Francés", "Español", "Detalle de uso"],
      tableRows: [
        { french: "Salut !", spanish: "¡Hola!", note: "Muy informal, solo con amigos o familiares" },
        { french: "Bonjour !", spanish: "Buenos días / Hola", note: "Estándar y educado, se usa por el día" },
        { french: "Bonsoir !", spanish: "Buenas tardes / noches", note: "Se usa a partir del atardecer" },
        { french: "Comment ça va ?", spanish: "¿Cómo estás?", note: "Estándar informal" },
        { french: "Comment allez-vous ?", spanish: "¿Cómo está usted?", note: "Fórmula formal y de respeto" }
      ],
      examples: [
        { french: "— Bonjour ! — Salut !", spanish: "— ¡Buenos días! — ¡Hola!", audioText: "Bonjour ! Salut !" }
      ]
    }
  },
  {
    id: 4,
    number: "4",
    title: "Demander et Dire comment on va",
    subtitle: "Preguntar y decir cómo estamos",
    content: "Descubre las diferentes respuestas a la pregunta '¿Cómo estás?' desde un estado fantástico hasta uno regular.",
    details: {
      title: "Donner des nouvelles",
      description: "Para responder a un saludo, usamos diferentes expresiones de estado de ánimo. La pregunta más común es 'Ça va ?' o también 'Comment ça va ?'.",
      tableHeaders: ["Respuesta en Francés", "Traducción al Español", "Tono / Nivel"],
      tableRows: [
        { french: "Ça va très bien.", spanish: "Muy bien.", note: "Excelente entusiasmo" },
        { french: "Ça va bien.", spanish: "Bien.", note: "Estándar positivo" },
        { french: "Pas mal.", spanish: "No está mal.", note: "Neutral aceptable" },
        { french: "Comme ci comme ça.", spanish: "Más o menos.", note: "Intermedio" },
        { french: "Ça ne va pas très bien.", spanish: "No muy bien.", note: "Estado de ánimo bajo o negativo" }
      ],
      examples: [
        { french: "— Ça va ? — Bien, merci !", spanish: "— ¿Cómo estás? — ¡Bien, gracias!", audioText: "Ça va ? Bien, merci !" }
      ]
    }
  },
  {
    id: 5,
    number: "5",
    title: "Les Formules de Politesse",
    subtitle: "Fórmulas de cortesía",
    content: "Normas esenciales de educación: por favor, disculpe, perdón y los agradecimientos.",
    details: {
      title: "La politesse française",
      description: "La cortesía es extremadamente valorada en la cultura francófona. Pequeñas palabras como 'S'il vous plaît' son obligatorias en cualquier interacción cotidiana.",
      tableHeaders: ["Fórmula en Francés", "Equivalencia en Español", "Uso común"],
      tableRows: [
        { french: "Merci", spanish: "Gracias", note: "Agradecimiento básico" },
        { french: "Merci beaucoup", spanish: "Muchas gracias", note: "Agradecimiento con énfasis" },
        { french: "De rien", spanish: "De nada", note: "Respuesta al agradecimiento" },
        { french: "S'il vous plaît", spanish: "Por favor", note: "Fórmula formal / informal (s'il te plaît)" },
        { french: "Excusez-moi", spanish: "Disculpe", note: "Para llamar la atención formalmente o disculparse" },
        { french: "Pardon", spanish: "Perdón", note: "Ante un tropiezo casual o problema menor" }
      ],
      examples: [
        { french: "Un café s'il vous plaît. — Merci !", spanish: "Un café por favor. — ¡Gracias!", audioText: "Un café s'il vous plaît. Merci !" }
      ]
    }
  },
  {
    id: 6,
    number: "6",
    title: "Les Adieux",
    subtitle: "Las despedidas",
    content: "Aprende a cerrar conversaciones deseando un buen día o prometiendo verte pronto.",
    details: {
      title: "Comment prendre congé",
      description: "Utiliza estas despedidas para dar por concluida una conversación de forma amistosa o formal.",
      tableHeaders: ["Despedida (Francés)", "Español", "Frecuencia/Contexto"],
      tableRows: [
        { french: "Au revoir", spanish: "Adiós", note: "Estándar, general para cualquier ocasión" },
        { french: "À demain", spanish: "Hasta mañana", note: "Cuando se verá a la persona al día siguiente" },
        { french: "À bientôt", spanish: "Hasta pronto", note: "Si el reencuentro es próximo pero indefinido" },
        { french: "À plus", spanish: "Nos vemos", note: "Coloquial/Informal" },
        { french: "Bonne journée", spanish: "Que tengas un buen día / Feliz día", note: "Deseo de cortesía al marcharte por el día" }
      ],
      examples: [
        { french: "Au revoir, à demain !", spanish: "¡Adiós, hasta mañana!", audioText: "Au revoir, à demain !" }
      ]
    }
  },
  {
    id: 7,
    number: "7",
    title: "Identifier une Personne",
    subtitle: "Identificar una persona",
    content: "La pregunta '¿Quién es?' y la estructura 'C'est...' para señalar nombres, familia o parentescos.",
    details: {
      title: "Qui est-ce ? / C'est...",
      description: "Para preguntar por la identidad de alguien usamos 'Qui est-ce ?'. Para contestar, empleamos 'C'est...' seguido del nombre o categoría de la persona.",
      tableHeaders: ["Pregunta", "Respuesta", "Significado"],
      tableRows: [
        { french: "Qui est-ce ?", spanish: "¿Quién es?", note: "Pregunta única de identificación" },
        { french: "C'est Théo.", spanish: "Es Théo.", note: "Identificando con nombre de pila" },
        { french: "C'est ma mère.", spanish: "Es mi madre.", note: "Identificando con relación familiar" },
        { french: "C'est un voisin.", spanish: "Es un vecino.", note: "Identificando con artículo indefinido" }
      ],
      examples: [
        { french: "Qui est-ce ? — C'est Nicolas.", spanish: "¿Quién es? — Es Nicolas.", audioText: "Qui est-ce ? C'est Nicolas." },
        { french: "Qui est-ce ? — C'est un voisin.", spanish: "¿Quién es? — Es un vecino.", audioText: "Qui est-ce ? C'est un voisin." }
      ]
    }
  },
  {
    id: 8,
    number: "8",
    title: "Les Personnes",
    subtitle: "Las personas",
    content: "Amplía tu vocabulario de personas distinguiendo entre masculino y femenino para amigos, vecinos y compañeros.",
    details: {
      title: "Les relations et l'entourage",
      description: "Vocabulario clave para designar los diferentes roles de las personas de nuestro entorno. Fíjate en los cambios sutiles de la terminación femenina.",
      tableHeaders: ["Tipo / Significado", "Masculino", "Femenino"],
      tableRows: [
        { french: "Amigo / Amiga", spanish: "un ami", note: "une amie" },
        { french: "Vecino / Vecina", spanish: "un voisin", note: "une voisine" },
        { french: "Compañero / Compañera (amigo)", spanish: "un copain", note: "une copine" },
        { french: "Compañero / Compañera de clase", spanish: "un camarade de classe", note: "une camarade de classe (sin cambio ortográfico, solo artículo)" },
        { french: "Amigo virtual (cyber)", spanish: "un cybercopain", note: "une cybercopine" }
      ],
      examples: [
        { french: "Jean est un copain de Lucas.", spanish: "Jean es un compañero / amigo de Lucas.", audioText: "Jean est un copain de Lucas." },
        { french: "Une amie intelligente.", spanish: "Una amiga inteligente.", audioText: "Une amie intelligente." }
      ]
    }
  },
  {
    id: 9,
    number: "9",
    title: "Les Articles Indéfinis",
    subtitle: "Los artículos indefinidos",
    content: "Une, un, des: la clave de la gramática inicial para referirse a objetos o personas indeterminadas.",
    details: {
      title: "L'usage de un, une, des",
      description: "Se usan para presentar elementos indeterminados. Concuerdan en género y número con el sustantivo que acompañan.",
      tableHeaders: ["Género", "Artículo", "Aplicación", "Ejemplo"],
      tableRows: [
        { french: "Masculino Singular", spanish: "un", note: "Un solo elemento masculino (un voisin)", },
        { french: "Femenino Singular", spanish: "une", note: "Un solo elemento femenino (une amie)", },
        { french: "Plural (Ambos géneros)", spanish: "des", note: "Varios elementos masculinos o femeninos (des camarades)" }
      ],
      examples: [
        { french: "un voisin", spanish: "un vecino (singular masculino)", audioText: "un voisin" },
        { french: "une amie", spanish: "una amiga (singular femenino)", audioText: "une amie" },
        { french: "des camarades", spanish: "unos compañeros (plural)", audioText: "des camarades" }
      ]
    }
  },
  {
    id: 10,
    number: "10",
    title: "Le Verbe Être",
    subtitle: "El verbo ser/estar",
    content: "La piedra angular del francés. Aprende la conjugación del verbo irregular 'être' y cómo usarlo.",
    details: {
      title: "La conjugaison du verbe Être",
      description: "Junto con 'avoir', es el verbo más importante en francés. Es completamente irregular. Se traduce tanto para el verbo 'ser' como para el verbo 'estar' en español.",
      tableHeaders: ["Pronombre", "Être", "Ejemplo en Francés", "Traducción"],
      verbStructure: [
        { pronoun: "Je", base: "suis", full: "Je suis" },
        { pronoun: "Tu", base: "es", full: "Tu es" },
        { pronoun: "Il / Elle", base: "est", full: "Il / Elle est" },
        { pronoun: "Nous", base: "sommes", full: "Nous sommes" },
        { pronoun: "Vous", base: "êtes", full: "Vous êtes" },
        { pronoun: "Ils / Elles", base: "sont", full: "Ils / Elles sont" }
      ],
      examples: [
        { french: "Je suis élève.", spanish: "Yo soy estudiante.", audioText: "Je suis élève." },
        { french: "Tu es sympathique.", spanish: "Tú eres simpático/a.", audioText: "Tu es sympathique." },
        { french: "Elle est intelligente.", spanish: "Ella es inteligente.", audioText: "Elle est intelligente." },
        { french: "Nous sommes amis.", spanish: "Nosotros somos amigos.", audioText: "Nous sommes amis." }
      ]
    }
  },
  {
    id: 11,
    number: "11",
    title: "Les Adjectifs Qualificatifs",
    subtitle: "Los adjetivos calificativos",
    content: "Aprende diferencias de género al adjetivar: simpático, inteligente, goloso, hablador y desordenado.",
    details: {
      title: "L'accord des adjectifs qualificatifs",
      description: "Los adjetivos describen cualidades de las personas u objetos. En francés, se añade habitualmente una -e para formar el femenino, con adaptaciones fonéticas.",
      tableHeaders: ["Adjetivo", "Masculino", "Femenino", "Español"],
      tableRows: [
        { french: "sympathique", spanish: "sympathique", note: "simpático / simpática (no cambia)" },
        { french: "intelligent", spanish: "intelligente", note: "inteligente (cambia pronunciación de la t)" },
        { french: "gourmand", spanish: "gourmande", note: "goloso / golosa (comilón)" },
        { french: "bavard", spanish: "bavarde", note: "hablador / habladora" },
        { french: "désordonné", spanish: "désordonnée", note: "desordenado / desordenada" }
      ],
      examples: [
        { french: "Il est bavard.", spanish: "Él es hablador.", audioText: "Il est bavard." },
        { french: "Elle est bavarde.", spanish: "Ella es habladora.", audioText: "Elle est bavarde." },
        { french: "Il est intelligent.", spanish: "Él es inteligente.", audioText: "Il est intelligent." },
        { french: "Elle est intelligente.", spanish: "Ella es inteligente.", audioText: "Elle est intelligente." }
      ]
    }
  },
  {
    id: 12,
    number: "12",
    title: "Le Tutoiement et le Vouvoiement",
    subtitle: "Tutear y tratar de usted (Tu vs Vous)",
    content: "Comprende el código social de cuándo usar el informal 'Tu' y el respetuoso/plural 'Vous'.",
    details: {
      title: "Tu ou Vous ?",
      description: "El francés distingue rigurosamente el trato social. Tratar con el pronombre incorrecto puede resultar descortés.",
      tableHeaders: ["Pronombre", "Uso principal", "Contexto habitual", "Ejemplo práctico"],
      tableRows: [
        { french: "TU", spanish: "Amigos, familiares, compañeros de clase, niños.", note: "Situaciones informales" },
        { french: "VOUS", spanish: "Personas desconocidas, profesores, médicos, jefes, personas mayores.", note: "Situaciones formales o de respeto" }
      ],
      examples: [
        { french: "Tu parles français ? (Informel)", spanish: "¿Hablas francés? (Informal, hablando con un amigo)", audioText: "Tu parles français ?" },
        { french: "Vous parlez français ? (Formel / Pluriel)", spanish: "¿Habla usted francés? / ¿Hablan ustedes francés?", audioText: "Vous parlez français ?" }
      ]
    }
  },
  {
    id: 13,
    number: "13",
    title: "Les Objets Scolaires",
    subtitle: "Los objetos escolares",
    content: "Mochila, cuaderno, bolígrafo, lápiz, borrador... Aprende el vocabulario esencial del aula.",
    details: {
      title: "Dans le sac à dos !",
      description: "El vocabulario clave que utilizas todos los días en clase para referirte a tus utensilios de estudio.",
      tableHeaders: ["Material escolar", "Francés", "Género"],
      tableRows: [
        { french: "le livre", spanish: "libro", note: "Masculino" },
        { french: "le cahier", spanish: "cuaderno", note: "Masculino" },
        { french: "le stylo", spanish: "bolígrafo", note: "Masculino" },
        { french: "le crayon", spanish: "lápiz", note: "Masculino" },
        { french: "la gomme", spanish: "borrador", note: "Femenino" },
        { french: "la règle", spanish: "regla", note: "Femenino" },
        { french: "les ciseaux", spanish: "tijeras", note: "Plural" },
        { french: "le sac à dos", spanish: "mochila", note: "Masculino" },
        { french: "la trousse", spanish: "cartuchera (estuche)", note: "Femenino" },
        { french: "le tableau", spanish: "pizarra", note: "Masculino" }
      ],
      examples: [
        { french: "Un stylo rouge et un cahier bleu.", spanish: "Un bolígrafo rojo y un cuaderno azul.", audioText: "Un stylo rouge et un cahier bleu." },
        { french: "J'ai une trousse dans mon sac à dos.", spanish: "Tengo un estuche en mi mochila.", audioText: "J'ai une trousse dans mon sac à dos." }
      ]
    }
  },
  {
    id: 14,
    number: "14",
    title: "Les Jours de la semaine",
    subtitle: "Los días de la semana",
    content: "¡De lunes a domingo! Memoriza los siete días de la semana, que en francés no van en mayúscula.",
    details: {
      title: "Lundi, mardi, mercredi...",
      description: "Los días de la semana en francés derivan sobre todo de planetas y dioses romanos. Todos son de género masculino y se escriben en minúscula.",
      tableHeaders: ["Francés", "Español", "Abreviación típica"],
      tableRows: [
        { french: "lundi", spanish: "lunes", note: "lun." },
        { french: "mardi", spanish: "martes", note: "mar." },
        { french: "mercredi", spanish: "miércoles", note: "mer." },
        { french: "jeudi", spanish: "jueves", note: "jeu." },
        { french: "vendredi", spanish: "viernes", note: "ven." },
        { french: "samedi", spanish: "sábado", note: "sam." },
        { french: "dimanche", spanish: "domingo", note: "dim." }
      ],
      examples: [
        { french: "Le lundi, je vais au collège.", spanish: "Los lunes voy al colegio.", audioText: "Le lundi, je vais au collège." },
        { french: "J'aime le samedi !", spanish: "¡Me gusta el sábado!", audioText: "J'aime le samedi !" }
      ]
    }
  },
  {
    id: 15,
    number: "15",
    title: "Les Mois de l'année",
    subtitle: "Los meses del año",
    content: "Aprende los doce meses del año para poder formular fechas completas de cumpleaños.",
    details: {
      title: "De Janvier à Décembre",
      description: "Al igual que los días de la semana, los meses del año no se escriben en mayúscula obligatoria en francés salvo al inicio de frase.",
      tableHeaders: ["Francés", "Español", "Estación en Europa"],
      tableRows: [
        { french: "janvier", spanish: "enero", note: "Hiver (Invierno)" },
        { french: "février", spanish: "febrero", note: "Hiver" },
        { french: "mars", spanish: "marzo", note: "Printemps (Primavera)" },
        { french: "avril", spanish: "abril", note: "Printemps" },
        { french: "mai", spanish: "mayo", note: "Printemps" },
        { french: "juin", spanish: "junio", note: "Été (Verano)" },
        { french: "juillet", spanish: "julio", note: "Été" },
        { french: "août", spanish: "agosto", note: "Été" },
        { french: "septembre", spanish: "septiembre", note: "Automne (Otoño)" },
        { french: "octobre", spanish: "octubre", note: "Automne" },
        { french: "novembre", spanish: "noviembre", note: "Automne" },
        { french: "décembre", spanish: "diciembre", note: "Hiver" }
      ],
      examples: [
        { french: "Mon anniversaire est en mai.", spanish: "Mi cumpleaños es en mayo.", audioText: "Mon anniversaire est en mai." },
        { french: "En France, juillet est en été.", spanish: "En Francia, julio es en verano.", audioText: "En France, juillet est en été." }
      ]
    }
  },
  {
    id: 16,
    number: "16",
    title: "Les Expressions de Temps",
    subtitle: "Expresiones de tiempo",
    content: "Aprende a ubicarte en el tiempo: hoy (aujourd'hui), ayer (hier) y mañana (demain).",
    details: {
      title: "Se repérer dans le temps",
      description: "Expresiones fundamentales para construir oraciones lógicas sobre cuándo suceden las cosas en el presente inmediato, pasado cercano o futuro inmediato.",
      tableHeaders: ["Expresión (Francés)", "Traducción al Español", "Uso temporal habitual"],
      tableRows: [
        { french: "aujourd'hui", spanish: "hoy", note: "Presente actual" },
        { french: "hier", spanish: "ayer", note: "Pasado inmediato" },
        { french: "demain", spanish: "mañana", note: "Futuro próximo" }
      ],
      examples: [
        { french: "Aujourd'hui, c'est lundi.", spanish: "Hoy es lunes.", audioText: "Aujourd'hui, c'est lundi." },
        { french: "Hier, c'était dimanche.", spanish: "Ayer fue domingo.", audioText: "Hier, c'était dimanche." },
        { french: "Demain, c'est mardi.", spanish: "Mañana es martes.", audioText: "Demain, c'est mardi." }
      ]
    }
  },
  {
    id: 17,
    number: "17",
    title: "Les Nationalités",
    subtitle: "Las nacionalidades",
    content: "Argelino, costarricense, nicaragüense y gabonés. Aprende su morfología masculina y femenina.",
    details: {
      title: "Dire d'où on vient",
      description: "Para expresar tu procedencia o nacionalidad, adaptamos la palabra al género de la persona. Nota las duplicaciones de consonantes en feminismo.",
      tableHeaders: ["Nacionalidad o País", "Masculino", "Femenino"],
      tableRows: [
        { french: "Nicaragüense", spanish: "nicaraguayen", note: "nicaraguayenne" },
        { french: "Costarricense", spanish: "costaricien", note: "costaricienne" },
        { french: "Argelino / Argelina", spanish: "algérien", note: "algérienne" },
        { french: "Gabonés / Gabonesa", spanish: "gabonais", note: "gabonaise" }
      ],
      examples: [
        { french: "Il est algérien.", spanish: "Él es argelino.", audioText: "Il est algérien." },
        { french: "Elle est algérienne.", spanish: "Ella es argelina.", audioText: "Elle est algérienne." },
        { french: "Il est costaricien.", spanish: "Él es costarricense.", audioText: "Il est costaricien." },
        { french: "Elle est costaricienne.", spanish: "Ella es costarricense.", audioText: "Elle est costaricienne." }
      ]
    }
  }
];

export const vocabulairesEssentiels = [
  { french: "Bonjour", spanish: "Hola / Buenos días" },
  { french: "Salut", spanish: "Hola (informal) / Adiós" },
  { french: "Au revoir", spanish: "Adiós" },
  { french: "Merci", spanish: "Gracias" },
  { french: "S'il vous plaît", spanish: "Por favor" },
  { french: "Qui est-ce ?", spanish: "¿Quién es?" },
  { french: "Je m'appelle", spanish: "Me llamo" },
  { french: "Ça va ?", spanish: "¿Cómo estás?" },
  { french: "Ami / Amie", spanish: "Amigo / Amiga" },
  { french: "Voisin / Voisine", spanish: "Vecino / Vecina" },
  { french: "Élève", spanish: "Estudiante" },
  { french: "École", spanish: "Escuela" },
  { french: "Collège", spanish: "Colegio" }
];

export const competenciesList = [
  "✓ Saludar y despedirse correctamente.",
  "✓ Presentarse y decir su nombre.",
  "✓ Preguntar e identificar personas.",
  "✓ Utilizar los artículos un, une, des.",
  "✓ Conjugar los verbos être y s'appeler.",
  "✓ Describir personas con adjetivos básicos.",
  "✓ Reconocer objetos escolares.",
  "✓ Decir días, meses y fechas.",
  "✓ Expresar nacionalidades.",
  "✓ Diferenciar el uso de tu y vous.",
  "✓ Formular preguntas simples de identificación personal."
];

// Speak synthesis function with helper
export function speakWord(text: string, voiceName?: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    // Cancel dynamic current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85; // Slightly slower for language learners

    // Find a proper French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.toLowerCase().includes('fr-') || v.lang.toLowerCase() === 'fr');
    if (frVoice) {
      utterance.voice = frVoice;
    }

    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);

    window.speechSynthesis.speak(utterance);

    // Safety timeout fallback
    setTimeout(() => {
      resolve(true);
    }, 4000);
  });
}

// Built-in Practice exercises database
export const quizDatabase: QuizQuestion[] = [
  // LES PRÉSENTATIONS
  {
    id: "q_1_1",
    lessonId: 1,
    type: 'multiple-choice',
    instruction: "Preguntar el nombre en una situación formal (trato respetuoso):",
    questionText: "¿Cómo se formula correctamente?",
    options: [
      "Comment tu t'appelles ?",
      "Comment vous appelez-vous ?",
      "Qui est-ce ?",
      "Comment ça va ?"
    ],
    correctAnswer: "Comment vous appelez-vous ?"
  },
  {
    id: "q_1_2",
    lessonId: 1,
    type: 'fill-blank',
    instruction: "Completa la presentación con el nombre correcto en francés:",
    questionText: "Je ________ Mathilde.",
    options: ["m'appelle", "t'appelles", "m'appelles", "s'appelle"],
    correctAnswer: "m'appelle"
  },

  // LE VERBE S'APPELER
  {
    id: "q_2_1",
    lessonId: 2,
    type: 'conjugation',
    instruction: "Conjuga el verbo s'appeler para 'Nous':",
    questionText: "Nous ________ Hugo et Léon.",
    options: ["nous appelons", "nous appellons", "vous appelez", "s'appellent"],
    correctAnswer: "nous appelons"
  },
  {
    id: "q_2_2",
    lessonId: 2,
    type: 'multiple-choice',
    instruction: "Identifica la opción correcta para ellas (Elles):",
    questionText: "Elles ________ Camille et Mathilde.",
    options: [
      "s'appellent",
      "s'appelle",
      "s'apellent",
      "nous appelons"
    ],
    correctAnswer: "s'appellent"
  },

  // LES SALUTATIONS
  {
    id: "q_3_1",
    lessonId: 3,
    type: 'multiple-choice',
    instruction: "¿Cuál de estos saludos es el más formal para usar en la noche?",
    questionText: "Selecciona el saludo correcto:",
    options: [
      "Salut !",
      "Bonsoir !",
      "Bonjour !",
      "Au revoir !"
    ],
    correctAnswer: "Bonsoir !"
  },

  // DEMANDER ET DIRE COMMENT ON VA
  {
    id: "q_4_1",
    lessonId: 4,
    type: 'match',
    instruction: "Asocia el estado de ánimo en francés con su traducción en español:",
    questionText: "Une con flechas / Asocia:",
    correctAnswer: {
      "Comme ci comme ça": "Más o menos",
      "Pas mal": "No está mal",
      "Ça va très bien": "Muy bien",
      "Ça ne va pas très bien": "No muy bien"
    },
    pairMatches: [
      { french: "Comme ci comme ça", spanish: "Más o menos" },
      { french: "Pas mal", spanish: "No está mal" },
      { french: "Ça va très bien", spanish: "Muy bien" },
      { french: "Ça ne va pas très bien", spanish: "No muy bien" }
    ]
  },

  // LES FORMULES DE POLITESSE
  {
    id: "q_5_1",
    lessonId: 5,
    type: 'multiple-choice',
    instruction: "¿Cómo se dice 'Por favor' de manera formal en francés?",
    questionText: "Elige la traducción correcta de 'Por favor' formal:",
    options: [
      "De rien",
      "Pardon",
      "S'il vous plaît",
      "Merci beaucoup"
    ],
    correctAnswer: "S'il vous plaît"
  },

  // LES ADIEUX
  {
    id: "q_6_1",
    lessonId: 6,
    type: 'fill-blank',
    instruction: "Desea un buen día al despedirte por la mañana:",
    questionText: "Au revoir, bonne ________ !",
    options: ["après-midi", "soirée", "journée", "nuit"],
    correctAnswer: "journée"
  },

  // IDENTIFIER UNE PERSONNE
  {
    id: "q_7_1",
    lessonId: 7,
    type: 'multiple-choice',
    instruction: "Pregunta para identificar quién es la persona que se encuentra allí:",
    questionText: "¿Cómo se pregunta '¿Quién es?'?",
    options: [
      "Qui est-ce ?",
      "Qu'est-ce que c'est ?",
      "Comment ça va ?",
      "Comment tu t'appelles ?"
    ],
    correctAnswer: "Qui est-ce ?"
  },
  {
    id: "q_7_2",
    lessonId: 7,
    type: 'fill-blank',
    instruction: "Responde: 'Es mi madre':",
    questionText: "________ ma mère.",
    options: ["C'est", "Tu es", "Il est", "Elle est"],
    correctAnswer: "C'est"
  },

  // LES PERSONNES
  {
    id: "q_8_1",
    lessonId: 8,
    type: 'multiple-choice',
    instruction: "Identifica la opción femenina de 'un voisin' (un vecino):",
    questionText: "El femenino de 'un voisin' es:",
    options: [
      "une voisine",
      "un voisine",
      "une voisin",
      "des voisines"
    ],
    correctAnswer: "une voisine"
  },

  // LES ARTICLES INDÉFINIS
  {
    id: "q_9_1",
    lessonId: 9,
    type: 'multiple-choice',
    instruction: "Selecciona el artículo indefinido correcto para 'camarades' (plural):",
    questionText: "________ camarades",
    options: ["des", "un", "une", "le"],
    correctAnswer: "des"
  },
  {
    id: "q_9_2",
    lessonId: 9,
    type: 'fill-blank',
    instruction: "Para 'une amie' (una amiga) usamos 'une', pero para 'amigo' (un ami) usamos:",
    questionText: "________ ami",
    options: ["un", "une", "des", "la"],
    correctAnswer: "un"
  },

  // LE VERBE ÊTRE
  {
    id: "q_10_1",
    lessonId: 10,
    type: 'conjugation',
    instruction: "Elige la forma conjugada del verbo être para 'Vous':",
    questionText: "Vous ________ au collège.",
    options: ["sommes", "êtes", "sont", "es"],
    correctAnswer: "êtes"
  },
  {
    id: "q_10_2",
    lessonId: 10,
    type: 'conjugation',
    instruction: "Completa con la forma adecuada para 'Ils' (Ellos):",
    questionText: "Ils ________ intelligents.",
    options: ["sont", "est", "sommes", "êtes"],
    correctAnswer: "sont"
  },

  // LES ADJECTIFS QUALIFICATIFS
  {
    id: "q_11_1",
    lessonId: 11,
    type: 'multiple-choice',
    instruction: "Si un chico habla mucho es 'bavard'. ¿Cómo se dice para una chica?",
    questionText: "Elle est ________.",
    options: [
      "bavarde",
      "bavard",
      "bavardes",
      "sympathique"
    ],
    correctAnswer: "bavarde"
  },

  // LE TUTOIEMENT ET LE VOIEMENT
  {
    id: "q_12_1",
    lessonId: 12,
    type: 'sort',
    instruction: "¿Qué pronombre usarías para hablar con tu profesor en el colegio?",
    questionText: "Selecciona el trato correcto:",
    options: ["TU", "VOUS"],
    correctAnswer: "VOUS"
  },

  // LES OBJETS SCOLAIRES
  {
    id: "q_13_1",
    lessonId: 13,
    type: 'multiple-choice',
    instruction: "Identifica el objeto escolar representado por 'bolígrafo' en francés:",
    questionText: "¿Cómo se dice 'bolígrafo'?",
    options: [
      "le cahier",
      "le stylo",
      "la gomme",
      "le crayon"
    ],
    correctAnswer: "le stylo"
  },
  {
    id: "q_13_2",
    lessonId: 13,
    type: 'multiple-choice',
    instruction: "¿Qué objeto escolar es de género femenino?",
    questionText: "Elige el objeto femenino:",
    options: [
      "le livre",
      "la trousse",
      "le sac à dos",
      "le stylo"
    ],
    correctAnswer: "la trousse"
  },

  // LES JOURS DE LA SEMAINE
  {
    id: "q_14_1",
    lessonId: 14,
    type: 'fill-blank',
    instruction: "¿Cómo se escribe 'viernes' en francés sin cometer errores ortográficos?",
    questionText: "v-e-n-d-r-e-d-i = ________",
    options: ["vendredi", "vendrede", "venderdi", "vendredi"],
    correctAnswer: "vendredi"
  },

  // LES MOIS DE L'ANNÉE
  {
    id: "q_15_1",
    lessonId: 15,
    type: 'multiple-choice',
    instruction: "¿Cuál es el mes de 'mayo' en francés?",
    questionText: "Selecciona el mes correcto:",
    options: [
      "mars",
      "mai",
      "mars",
      "avril"
    ],
    correctAnswer: "mai"
  },

  // LES EXPRESSIONS DE TEMPS
  {
    id: "q_16_1",
    lessonId: 16,
    type: 'fill-blank',
    instruction: "Si ayer fue domingo, ¿cuál es la palabra correcta para expresar 'Ayer'?",
    questionText: "________ , c'était dimanche.",
    options: ["Hier", "Aujourd'hui", "Demain", "Matin"],
    correctAnswer: "Hier"
  },

  // LES NATIONALITÉS
  {
    id: "q_17_1",
    lessonId: 17,
    type: 'multiple-choice',
    instruction: "Si él es 'nicaraguayen', ¿cómo es ella en femenino?",
    questionText: "Elle est ________.",
    options: [
      "nicaraguayenne",
      "nicaraguayen",
      "nicaraguayennes",
      "costaricienne"
    ],
    correctAnswer: "nicaraguayenne"
  }
];
