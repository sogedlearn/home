/**
 * Site-wide English / Español translations.
 * Shares localStorage key with the Learning Hub (guna_ui_language).
 */
(function () {
    const STORAGE_KEY = 'guna_ui_language';

    const strings = {
        en: {
            'nav.home': 'Home',
            'nav.learn': 'Learn',
            'nav.history': 'History',
            'nav.about': 'About Us',
            'nav.login': 'Login',
            'nav.register': 'Register',
            'nav.toggle': 'Toggle navigation',
            'nav.close': 'Close menu',
            'nav.langAria': 'Interface language',

            'footer.desc': "Preserving Panama's indigenous languages - Guna, Ngabe, Naso and Embera - through culture, community and interactive learning.",
            'footer.explore': 'Explore',
            'footer.languages': 'Languages',
            'footer.aboutSoged': 'About SOGED',
            'footer.resources': 'Resources',
            'footer.contact': 'Contact',
            'footer.learnCulture': 'Learn with culture',
            'footer.learningHub': 'Learning Hub',
            'footer.gunaPath': 'Guna path',
            'footer.culturalReadings': 'Cultural readings',
            'footer.gamesMolas': 'Games & molas',
            'footer.support': 'Support',
            'footer.contactUs': 'Contact Us',
            'footer.youtube': 'YouTube channel',
            'footer.feedback': 'Send feedback',
            'footer.newsletterTitle': 'Stay connected to the culture',
            'footer.newsletterText': 'Updates on new lessons, molas, stories and language preservation initiatives.',
            'footer.emailPlaceholder': 'Enter your email address',
            'footer.subscribe': 'Subscribe',
            'footer.copyright': "SOGED. Dedicated to preserving Panama's indigenous languages and cultures.",
            'footer.about': 'About',
            'footer.feedbackTitle': 'Send feedback',
            'footer.name': 'Name',
            'footer.email': 'Email',
            'footer.message': 'Message',
            'footer.send': 'Send',
            'footer.thanks': 'Thank you! Your message was prepared.',

            'about.pageTitle': 'About Us | SOGED — Preserving Indigenous Languages',
            'about.badge': 'Preserving Indigenous Languages',
            'about.heroTitle': 'Who We Are',
            'about.heroSub': 'Empowering Cultural Heritage Through Technology',
            'about.heroLead': "SOGED is a revolutionary educational platform designed to preserve and teach Panama's Indigenous languages in a modern, accessible, and culturally respectful way. We reconnect people with their roots and protect linguistic diversity for future generations.",
            'about.inAction': 'SOGED in Action',
            'about.inActionSub': 'Building bridges between tradition and technology',
            'about.galleryLabel': 'Team & Collaborators Gallery',
            'about.alliances': 'Our Alliances',
            'about.congresoName': 'Guna General Congress',
            'about.congresoShort': 'Community governance and cultural authority guiding every step of our mission.',
            'about.udelasName': 'UDELAS — CIEPI',
            'about.udelasShort': 'Academic research and teacher training powering evidence-based indigenous education.',
            'about.museoName': 'Museo de la Mola',
            'about.museoShort': 'Safeguarding Guna textile heritage woven into our visual and cultural identity.',
            'about.exploreAlliance': 'Explore Alliance',
            'about.purpose': 'Our Purpose',
            'about.mission': 'Our Mission',
            'about.missionP1': "To preserve and promote Panama's indigenous languages through cutting-edge technology and innovative education methods. We combine traditional knowledge with modern digital tools to make language learning accessible, engaging, and culturally respectful.",
            'about.missionP2': 'Our platform serves as a bridge between generations, ensuring that these precious linguistic treasures are not lost to time.',
            'about.startLearning': 'Start Learning',
            'about.lookingForward': 'Looking Forward',
            'about.vision': 'Our Vision',
            'about.visionP1': 'A future where every Guna child grows up fluent in their ancestral language, where elders see their wisdom honored in digital form, and where the world recognizes indigenous languages as living treasures—not relics of the past.',
            'about.visionP2': 'We envision SOGED as the global reference for culturally grounded language technology, co-created with the communities it serves and inspired by the geometric beauty of mola art.',
            'about.culturalRespect': 'Cultural Respect',
            'about.communityFirst': 'Community First',
            'about.globalImpact': 'Global Impact',
            'about.teamTitle': 'Meet Our Team',
            'about.teamSub': "The passionate individuals and collaborators behind SOGED's mission to preserve indigenous languages.",
            'about.visitSite': 'Visit Official Website',
            'about.prevPhoto': 'Previous photo',
            'about.nextPhoto': 'Next photo',
            'about.closeAlliance': 'Close alliance details',

            'home.pageTitle': 'Soged - Learn Indigenous Languages of Panama',
            'home.kicker': 'Indigenous Languages of Panama',
            'home.heroTitleA': 'Speak the',
            'home.heroTitleB': 'Living Languages',
            'home.heroTitleC': 'of',
            'home.heroTitleD': 'Panama',
            'home.startFree': 'Start Learning Free',
            'home.howToStart': 'How To Start',
            'home.gunaLive': 'Guna live now',
            'home.ngabeSoon': 'Ngäbe soon',
            'home.nasoSoon': 'Naso soon',
            'home.emberaSoon': 'Emberá soon',
            'home.whyKicker': 'Why Soged',
            'home.whyTitle': 'Why learners come back every day',
            'home.whySub': 'Fun, cultural, and built to keep you coming back — one word at a time.',
            'home.bentoAlive': 'A learning platform that feels alive',
            'home.bentoAliveP': 'Your all-in-one space to master indigenous languages with bite-sized lessons, games, and a path that grows with you — from first words to real conversation.',
            'home.bentoBadges': 'Recognition badges',
            'home.bentoBadgesP': 'Earn insignias for every milestone. Celebrate progress the way communities celebrate craft: with pride you can see.',
            'home.bentoAudio': 'Native audio',
            'home.bentoAudioP': 'Hear the language as it is spoken — rhythm, tone, and stories from the people who live it.',
            'home.bentoFun': 'Dynamic & fun',
            'home.bentoFunP': 'Interactive lessons and daily practice that keep you engaged without feeling like homework.',
            'home.bentoCulture': 'Culture-rich resources',
            'home.bentoCultureP': 'Molas, stories, and traditions at your fingertips — learning that honors where the language comes from.',
            'home.langKicker': 'Languages',
            'home.langTitle': 'Explore our languages',
            'home.langSub': 'Each language carries the wisdom and culture of its people. Start with Guna today — more voices are on the way.',
            'home.availableNow': 'Available now',
            'home.gunaP': 'Master the language of the Guna people from the San Blas Islands. Interactive lessons, cultural readings, games, and a community-backed path designed with respect for Guna Yala.',
            'home.startGuna': 'Start Learning Guna',
            'home.ngabeP': 'Learn the language of the Ngäbe people, the largest indigenous group in Panama.',
            'home.comingSoon': 'Coming soon',
            'home.nasoP': 'Discover the musical language of the Naso people with its unique rhythms.',
            'home.emberaP': 'Explore the ancient language of the Emberá people and their traditions.',
            'home.plansKicker': 'Plans',
            'home.plansTitle': 'Choose your learning plan',
            'home.plansSub': "Start free and upgrade when you're ready for more — same colors, same mission.",
            'home.perMonth': '/month',
            'home.oneUser': '1 Individual User',
            'home.freeAds': 'Free with ads',
            'home.free1': 'Full access to basic interactive lessons',
            'home.free2': 'Native audio for dynamic learning',
            'home.free3': 'Personal Dashboard with statistics',
            'home.free4': 'Limited Lives System (5 daily)',
            'home.free5': 'Cocos Economy (+25 per lesson)',
            'home.free6': 'Access to basic Soged Market',
            'home.startFreeBtn': 'Start Free',
            'home.recommended': 'Recommended',
            'home.adFree': 'Ad-free',
            'home.prem1': 'Everything included in Free Plan',
            'home.prem2': 'Unlimited Lives System',
            'home.prem3': 'Access to Soggy AI (Smart Tutor)',
            'home.prem4': 'Advanced and Exclusive Content',
            'home.prem5': 'Technical vocabulary (scientific/medical)',
            'home.prem6': 'Priority in technical support',
            'home.getPremium': 'Get Premium',
            'home.custom': 'Custom',
            'home.orgUsers': 'For Organizations (+5 users)',
            'home.customQuote': 'Custom Quote',
            'home.b2b1': 'Everything included in Premium',
            'home.b2b2': 'Administration Dashboard',
            'home.b2b3': 'Teacher Panel',
            'home.b2b4': 'Collective performance charts',
            'home.b2b5': 'Attendance monitoring and metrics',
            'home.b2b6': 'Dedicated Technical Support',
            'home.requestQuote': 'Request Quote',
            'home.startKicker': 'Get started',
            'home.startTitle': 'How to start',
            'home.startSub': 'Learn indigenous languages of Panama in four simple steps with Soged.',
            'home.step1': 'Create your account',
            'home.step1P': 'Sign up for free, choose your language — Guna first, then Ngäbe, Emberá, and more — and set your goals in minutes.',
            'home.step2': 'Explore & learn',
            'home.step2P': 'Dive into bite-sized lessons with native audio, cultural stories, and exercises designed for real-world conversation.',
            'home.step3': 'Practice daily',
            'home.step3P': 'Reinforce what you learn with games, quizzes, and speaking drills that adapt to your pace.',
            'home.step4': 'Track your progress',
            'home.step4P': "Earn badges, unlock levels, and celebrate milestones as you help preserve Panama's living languages.",
            'home.voicesKicker': 'Voices',
            'home.voicesTitle': 'What our students say',
            'home.voicesSub': 'Join learners discovering the beauty of indigenous languages — and the culture they carry.',
            'home.student': 'Student',

            'contact.pageTitle': 'Contact Us | Soged',
            'contact.badge': 'Get in Touch',
            'contact.title1': "Let's Start a",
            'contact.title2': 'Conversation',
            'contact.lead': "Have questions about our indigenous language learning platform? We're here to help you on your journey to preserve and learn these beautiful languages.",
            'contact.sendMessage': 'Send Message',
            'contact.info': 'Contact Info',
            'contact.formTitle': 'Send us a Message',
            'contact.faq': 'Frequently Asked Questions',

            'resources.pageTitle': 'Resources | SOGED — Indigenous Language Learning',
            'resources.badge': 'Guna Cultural Library',
            'resources.title': 'Learning Resources',
            'resources.lead': 'Discover comprehensive materials to master the Guna language',
            'resources.allCategory': 'All Category',
            'resources.vocabulary': 'Vocabulary',
            'resources.grammar': 'Grammar',
            'resources.audio': 'Audio',
            'resources.video': 'Video',
            'resources.docs': 'Documents',
            'resources.culture': 'Culture',
            'resources.allLevels': 'All Levels',
            'resources.beginner': 'Beginner',
            'resources.intermediate': 'Intermediate',
            'resources.advanced': 'Advanced',

            'history.eyebrow': 'Indigenous Culture · Panama',
            'history.heroTitle': 'History of Indigenous Languages',
            'history.heroSub': "Discover the rich linguistic heritage of Panama's indigenous peoples — languages shaped by centuries of tradition, identity, and resilience.",
            'history.museumCredit': 'Image provided by Museo de la Mola',
            'history.where': 'Where They Live',
            'history.gunaYala': 'Guna Yala: The Archipelago Comarca',
            'history.worldview': 'Worldview',
            'history.universe': 'The Universe According to the Guna People',
            'history.textile': 'Ancestral Textile Art',
            'history.mola': 'The Mola: Identity Woven in Layers',
            'history.governance': 'Autonomy & Governance',
            'history.congress': 'The Guna General Congress: Ancestral Democracy',
            'history.life': 'Life & Customs',
            'history.traditions': 'Traditions That Give Life to the People',
            'history.more': 'Expanding Our Reach',
            'history.moreTitle': 'More Indigenous Languages',

            'cta.title': 'Ready to Learn Dulegaya?',
            'cta.subtitle': "Start with your first words in the Guna language. It's free and connects you with one of the most vibrant cultures in the Americas.",
            'cta.button': 'Start Lesson →',

            lessonContinue: 'CONTINUE',
            lessonCheck: 'CHECK',
            lessonDone: 'DONE',
            lessonLoading: 'Loading lesson...',
            lessonGreat: 'Great review!',
            lessonExcellent: 'Excellent!',
            lessonTryAgain: 'Not quite. Try again!'
        },
        es: {
            'nav.home': 'Inicio',
            'nav.learn': 'Aprender',
            'nav.history': 'Historia',
            'nav.about': 'Nosotros',
            'nav.login': 'Entrar',
            'nav.register': 'Registrarse',
            'nav.toggle': 'Abrir menú',
            'nav.close': 'Cerrar menú',
            'nav.langAria': 'Idioma de la interfaz',

            'footer.desc': 'Preservamos las lenguas indígenas de Panamá — Guna, Ngäbe, Naso y Emberá — a través de la cultura, la comunidad y el aprendizaje interactivo.',
            'footer.explore': 'Explorar',
            'footer.languages': 'Lenguas',
            'footer.aboutSoged': 'Sobre SOGED',
            'footer.resources': 'Recursos',
            'footer.contact': 'Contacto',
            'footer.learnCulture': 'Aprende con cultura',
            'footer.learningHub': 'Centro de aprendizaje',
            'footer.gunaPath': 'Ruta Guna',
            'footer.culturalReadings': 'Lecturas culturales',
            'footer.gamesMolas': 'Juegos y molas',
            'footer.support': 'Soporte',
            'footer.contactUs': 'Contáctanos',
            'footer.youtube': 'Canal de YouTube',
            'footer.feedback': 'Enviar comentarios',
            'footer.newsletterTitle': 'Mantente cerca de la cultura',
            'footer.newsletterText': 'Novedades sobre lecciones, molas, historias e iniciativas de preservación lingüística.',
            'footer.emailPlaceholder': 'Ingresa tu correo electrónico',
            'footer.subscribe': 'Suscribirse',
            'footer.copyright': 'SOGED. Dedicados a preservar las lenguas y culturas indígenas de Panamá.',
            'footer.about': 'Nosotros',
            'footer.feedbackTitle': 'Enviar comentarios',
            'footer.name': 'Nombre',
            'footer.email': 'Correo',
            'footer.message': 'Mensaje',
            'footer.send': 'Enviar',
            'footer.thanks': '¡Gracias! Tu mensaje fue preparado.',

            'about.pageTitle': 'Nosotros | SOGED — Preservando lenguas indígenas',
            'about.badge': 'Preservando lenguas indígenas',
            'about.heroTitle': 'Quiénes somos',
            'about.heroSub': 'Empoderando el patrimonio cultural con tecnología',
            'about.heroLead': 'SOGED es una plataforma educativa para preservar y enseñar las lenguas indígenas de Panamá de forma moderna, accesible y respetuosa. Reconectamos a las personas con sus raíces y protegemos la diversidad lingüística para las futuras generaciones.',
            'about.inAction': 'SOGED en acción',
            'about.inActionSub': 'Puentes entre tradición y tecnología',
            'about.galleryLabel': 'Galería del equipo y colaboradores',
            'about.alliances': 'Nuestras alianzas',
            'about.congresoName': 'Congreso General Guna',
            'about.congresoShort': 'Gobernanza comunitaria y autoridad cultural que guía cada paso de nuestra misión.',
            'about.udelasName': 'UDELAS — CIEPI',
            'about.udelasShort': 'Investigación académica y formación docente para una educación indígena con evidencia.',
            'about.museoName': 'Museo de la Mola',
            'about.museoShort': 'Protegiendo el patrimonio textil guna tejido en nuestra identidad visual y cultural.',
            'about.exploreAlliance': 'Explorar alianza',
            'about.purpose': 'Nuestro propósito',
            'about.mission': 'Nuestra misión',
            'about.missionP1': 'Preservar y promover las lenguas indígenas de Panamá con tecnología e innovación educativa. Unimos el saber tradicional con herramientas digitales para un aprendizaje accesible, atractivo y respetuoso.',
            'about.missionP2': 'Nuestra plataforma es un puente entre generaciones para que estos tesoros lingüísticos no se pierdan con el tiempo.',
            'about.startLearning': 'Empezar a aprender',
            'about.lookingForward': 'Mirando al futuro',
            'about.vision': 'Nuestra visión',
            'about.visionP1': 'Un futuro donde cada niña y niño guna crezca fluido en su lengua ancestral, los mayores vean su sabiduría honrada en lo digital, y el mundo reconozca las lenguas indígenas como tesoros vivos.',
            'about.visionP2': 'Soñamos SOGED como referencia mundial de tecnología lingüística con raíces culturales, co-creada con las comunidades e inspirada en la geometría de la mola.',
            'about.culturalRespect': 'Respeto cultural',
            'about.communityFirst': 'La comunidad primero',
            'about.globalImpact': 'Impacto global',
            'about.teamTitle': 'Nuestro equipo',
            'about.teamSub': 'Las personas apasionadas detrás de la misión de SOGED de preservar las lenguas indígenas.',
            'about.visitSite': 'Visitar sitio oficial',
            'about.prevPhoto': 'Foto anterior',
            'about.nextPhoto': 'Foto siguiente',
            'about.closeAlliance': 'Cerrar detalles de la alianza',

            'home.pageTitle': 'Soged - Aprende lenguas indígenas de Panamá',
            'home.kicker': 'Lenguas indígenas de Panamá',
            'home.heroTitleA': 'Habla las',
            'home.heroTitleB': 'lenguas vivas',
            'home.heroTitleC': 'de',
            'home.heroTitleD': 'Panamá',
            'home.startFree': 'Empieza gratis',
            'home.howToStart': 'Cómo empezar',
            'home.gunaLive': 'Guna disponible',
            'home.ngabeSoon': 'Ngäbe pronto',
            'home.nasoSoon': 'Naso pronto',
            'home.emberaSoon': 'Emberá pronto',
            'home.whyKicker': 'Por qué Soged',
            'home.whyTitle': 'Por qué los estudiantes vuelven cada día',
            'home.whySub': 'Divertido, cultural y pensado para que regreses — una palabra a la vez.',
            'home.bentoAlive': 'Una plataforma de aprendizaje que se siente viva',
            'home.bentoAliveP': 'Tu espacio para dominar lenguas indígenas con lecciones cortas, juegos y una ruta que crece contigo — de las primeras palabras a la conversación real.',
            'home.bentoBadges': 'Insignias de reconocimiento',
            'home.bentoBadgesP': 'Gana insignias en cada hito. Celebra el progreso como se celebra el oficio: con orgullo visible.',
            'home.bentoAudio': 'Audio nativo',
            'home.bentoAudioP': 'Escucha la lengua como se habla — ritmo, tono e historias de quienes la viven.',
            'home.bentoFun': 'Dinámico y divertido',
            'home.bentoFunP': 'Lecciones interactivas y práctica diaria que enganchan sin sentirse como tarea.',
            'home.bentoCulture': 'Recursos con cultura',
            'home.bentoCultureP': 'Molas, historias y tradiciones al alcance — un aprendizaje que honra de dónde viene la lengua.',
            'home.langKicker': 'Lenguas',
            'home.langTitle': 'Explora nuestras lenguas',
            'home.langSub': 'Cada lengua lleva la sabiduría y la cultura de su pueblo. Empieza con Guna hoy — más voces vienen en camino.',
            'home.availableNow': 'Disponible ahora',
            'home.gunaP': 'Domina la lengua del pueblo Guna de las islas de San Blas. Lecciones, lecturas culturales, juegos y una ruta respetuosa con Guna Yala.',
            'home.startGuna': 'Empezar a aprender Guna',
            'home.ngabeP': 'Aprende la lengua del pueblo Ngäbe, el grupo indígena más numeroso de Panamá.',
            'home.comingSoon': 'Próximamente',
            'home.nasoP': 'Descubre la lengua musical del pueblo Naso y sus ritmos únicos.',
            'home.emberaP': 'Explora la lengua ancestral del pueblo Emberá y sus tradiciones.',
            'home.plansKicker': 'Planes',
            'home.plansTitle': 'Elige tu plan de aprendizaje',
            'home.plansSub': 'Empieza gratis y mejora cuando quieras más — mismos colores, misma misión.',
            'home.perMonth': '/mes',
            'home.oneUser': '1 usuario individual',
            'home.freeAds': 'Gratis con anuncios',
            'home.free1': 'Acceso completo a lecciones básicas interactivas',
            'home.free2': 'Audio nativo para un aprendizaje dinámico',
            'home.free3': 'Panel personal con estadísticas',
            'home.free4': 'Sistema de vidas limitado (5 diarias)',
            'home.free5': 'Economía de Cocos (+25 por lección)',
            'home.free6': 'Acceso al mercado básico de Soged',
            'home.startFreeBtn': 'Empezar gratis',
            'home.recommended': 'Recomendado',
            'home.adFree': 'Sin anuncios',
            'home.prem1': 'Todo lo incluido en el plan Gratis',
            'home.prem2': 'Sistema de vidas ilimitadas',
            'home.prem3': 'Acceso a Soggy IA (tutor inteligente)',
            'home.prem4': 'Contenido avanzado y exclusivo',
            'home.prem5': 'Vocabulario técnico (científico/médico)',
            'home.prem6': 'Prioridad en soporte técnico',
            'home.getPremium': 'Obtener Premium',
            'home.custom': 'A medida',
            'home.orgUsers': 'Para organizaciones (+5 usuarios)',
            'home.customQuote': 'Cotización a medida',
            'home.b2b1': 'Todo lo incluido en Premium',
            'home.b2b2': 'Panel de administración',
            'home.b2b3': 'Panel docente',
            'home.b2b4': 'Gráficas de desempeño colectivo',
            'home.b2b5': 'Monitoreo de asistencia y métricas',
            'home.b2b6': 'Soporte técnico dedicado',
            'home.requestQuote': 'Solicitar cotización',
            'home.startKicker': 'Empieza',
            'home.startTitle': 'Cómo empezar',
            'home.startSub': 'Aprende lenguas indígenas de Panamá en cuatro pasos con Soged.',
            'home.step1': 'Crea tu cuenta',
            'home.step2': 'Explora y aprende',
            'home.step1P': 'Regístrate gratis, elige tu lengua — primero Guna, luego Ngäbe, Emberá y más — y define tus metas en minutos.',
            'home.step2P': 'Entra a lecciones cortas con audio nativo, historias culturales y ejercicios para conversar de verdad.',
            'home.step3': 'Practica cada día',
            'home.step3P': 'Refuerza lo aprendido con juegos, quizzes y práctica oral que se adaptan a tu ritmo.',
            'home.step4': 'Sigue tu progreso',
            'home.step4P': 'Gana insignias, desbloquea niveles y celebra hitos mientras ayudas a preservar las lenguas vivas de Panamá.',
            'home.voicesKicker': 'Voces',
            'home.voicesTitle': 'Lo que dicen nuestros estudiantes',
            'home.voicesSub': 'Únete a quienes descubren la belleza de las lenguas indígenas y la cultura que llevan.',
            'home.student': 'Estudiante',

            'contact.pageTitle': 'Contáctanos | Soged',
            'contact.badge': 'Hablemos',
            'contact.title1': 'Empecemos una',
            'contact.title2': 'conversación',
            'contact.lead': '¿Tienes preguntas sobre nuestra plataforma de lenguas indígenas? Estamos para acompañarte a preservar y aprender estas lenguas.',
            'contact.sendMessage': 'Enviar mensaje',
            'contact.info': 'Información de contacto',
            'contact.formTitle': 'Envíanos un mensaje',
            'contact.faq': 'Preguntas frecuentes',

            'resources.pageTitle': 'Recursos | SOGED — Aprendizaje de lenguas indígenas',
            'resources.badge': 'Biblioteca cultural Guna',
            'resources.title': 'Recursos de aprendizaje',
            'resources.lead': 'Materiales para dominar la lengua guna',
            'resources.allCategory': 'Todas las categorías',
            'resources.vocabulary': 'Vocabulario',
            'resources.grammar': 'Gramática',
            'resources.audio': 'Audio',
            'resources.video': 'Video',
            'resources.docs': 'Documentos',
            'resources.culture': 'Cultura',
            'resources.allLevels': 'Todos los niveles',
            'resources.beginner': 'Principiante',
            'resources.intermediate': 'Intermedio',
            'resources.advanced': 'Avanzado',

            'history.eyebrow': 'Cultura indígena · Panamá',
            'history.heroTitle': 'Historia de las lenguas indígenas',
            'history.heroSub': 'Descubre el patrimonio lingüístico de los pueblos indígenas de Panamá — lenguas formadas por siglos de tradición, identidad y resiliencia.',
            'history.museumCredit': 'Imagen cortesía del Museo de la Mola',
            'history.where': 'Dónde viven',
            'history.gunaYala': 'Guna Yala: la comarca archipiélago',
            'history.worldview': 'Cosmovisión',
            'history.universe': 'El universo según el pueblo Guna',
            'history.textile': 'Arte textil ancestral',
            'history.mola': 'La mola: identidad tejida en capas',
            'history.governance': 'Autonomía y gobernanza',
            'history.congress': 'El Congreso General Guna: democracia ancestral',
            'history.life': 'Vida y costumbres',
            'history.traditions': 'Tradiciones que dan vida al pueblo',
            'history.more': 'Ampliando nuestro alcance',
            'history.moreTitle': 'Más lenguas indígenas',

            'cta.title': '¿Listo para aprender dulegaya?',
            'cta.subtitle': 'Empieza con tus primeras palabras en lengua guna. Es gratis y te conecta con una de las culturas más vivas de las Américas.',
            'cta.button': 'Empezar lección →',

            lessonContinue: 'CONTINUAR',
            lessonCheck: 'COMPROBAR',
            lessonDone: 'LISTO',
            lessonLoading: 'Cargando lección...',
            lessonGreat: '¡Buen repaso!',
            lessonExcellent: '¡Excelente!',
            lessonTryAgain: 'Casi. ¡Inténtalo de nuevo!'
        }
    };

    function mergeIntoGuna() {
        if (!window.GunaI18n || !GunaI18n.strings) return;
        Object.assign(GunaI18n.strings.en, strings.en);
        Object.assign(GunaI18n.strings.es, strings.es);
    }

    function fillVars(text, vars) {
        if (!vars || typeof text !== 'string') return text;
        Object.keys(vars).forEach(function (name) {
            text = text.replaceAll('{' + name + '}', String(vars[name] ?? ''));
        });
        return text;
    }

    const SiteI18n = {
        STORAGE_KEY: STORAGE_KEY,
        strings: strings,

        getLanguage: function () {
            if (window.GunaI18n && typeof GunaI18n.getLanguage === 'function') {
                return GunaI18n.getLanguage();
            }
            var stored = localStorage.getItem(STORAGE_KEY);
            return stored === 'es' ? 'es' : 'en';
        },

        t: function (key, vars) {
            mergeIntoGuna();
            if (window.GunaI18n && typeof GunaI18n.t === 'function' && (GunaI18n.strings.en[key] || strings.en[key])) {
                return GunaI18n.t(key, vars);
            }
            var lang = this.getLanguage();
            var text = (strings[lang] && strings[lang][key]) || strings.en[key] || key;
            return fillVars(text, vars);
        },

        apply: function (root) {
            mergeIntoGuna();
            var scope = root || document;
            var lang = this.getLanguage();
            if (!root) {
                document.documentElement.lang = lang;
                document.documentElement.dataset.lang = lang;
            }
            var self = this;
            scope.querySelectorAll('[data-i18n]').forEach(function (el) {
                var key = el.dataset.i18n;
                var vars = {};
                if (el.dataset.i18nN != null) vars.n = el.dataset.i18nN;
                if (el.dataset.i18nName) vars.name = el.dataset.i18nName;
                var text = self.t(key, vars);
                if (text) el.textContent = text;
            });
            scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
                el.placeholder = self.t(el.dataset.i18nPlaceholder);
            });
            scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
                el.title = self.t(el.dataset.i18nTitle);
            });
            scope.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
                el.setAttribute('aria-label', self.t(el.dataset.i18nAria));
            });
            if (!root) {
                var titleEl = document.querySelector('title[data-i18n]');
                if (titleEl) titleEl.textContent = self.t(titleEl.dataset.i18n);
            }
        },

        setLanguage: function (lang) {
            var next = lang === 'es' ? 'es' : 'en';
            localStorage.setItem(STORAGE_KEY, next);
            mergeIntoGuna();
            if (window.GunaI18n && typeof GunaI18n.setLanguage === 'function') {
                GunaI18n.setLanguage(next);
            } else {
                this.apply();
                document.dispatchEvent(new CustomEvent('guna-language-changed', { detail: { lang: next } }));
            }
        }
    };

    window.SiteI18n = SiteI18n;
    mergeIntoGuna();

    document.addEventListener('DOMContentLoaded', function () {
        SiteI18n.apply();
    });

    document.addEventListener('guna-language-changed', function () {
        SiteI18n.apply();
    });
})();
