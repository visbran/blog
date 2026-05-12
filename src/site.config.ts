import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

/**
 * Configuration du thème en français
 *
 * @note Cette configuration est maintenue dans src/ et ne sera pas écrasée
 * lors des mises à jour du thème Astro Pure
 */

export const theme: ThemeUserConfig = {
  // [Informations de base]

  /** Titre du site - utilisé dans les métadonnées et l'onglet du navigateur */
  title: 'Visbran',

  /** Auteur du site - utilisé dans la page d'accueil et le copyright */
  author: 'Visbran',

  /** Description du site - utilisée dans les métadonnées */
  description: 'Veille IA quotidienne • Outils • Modèles • Recherche en français',

  /** Favicon - chemin vers l'image dans public/ */
  favicon: '/favicon/favicon.ico',

  /** Image sociale par défaut - utilisée pour les partages sur les réseaux sociaux */
  socialCard: '/images/social-card.png',

  /** Configuration de la langue (IMPORTANT POUR LE SEO) */
  locale: {
    lang: 'fr-FR',        // Code langue ISO
    attrs: 'fr-FR',       // Attribut lang HTML
    dateLocale: 'fr-FR',  // Format de date français
    dateOptions: {
      day: 'numeric',
      month: 'long',      // Affiche le mois en toutes lettres
      year: 'numeric'
    }
  },

  /** Logo affiché sur la page d'accueil */
  logo: {
    src: '/src/assets/avatar.png',
    alt: 'Avatar'
  },

  /** Séparateur dans le titre (ex: "Titre • Mon Blog") */
  titleDelimiter: '•',

  /** Active le pré-rendu pour de meilleures performances SEO */
  prerender: true,

  /** CDN pour les packages npm (par défaut jsDelivr) */
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  /** Balises head personnalisées (optionnel) */
  head: [],

  /** CSS personnalisé (optionnel) */
  customCss: [],

  // [Navigation]

  /** Menu de navigation dans le header */
  header: {
    menu: [
      { title: 'Digest', link: '/tags/digest' },
      { title: 'Outils IA', link: '/tags/outils-ia' },
      { title: 'Blog', link: '/blog' },
      { title: 'À Propos', link: '/about' }
    ]
  },

  // [Footer]

  /** Configuration du pied de page */
  footer: {
    /** Année du copyright */
    year: `© ${new Date().getFullYear()}`,
    // Alternative : année de création à maintenant
    // year: `© 2024 - ${new Date().getFullYear()}`,

    /** Liens dans le footer */
    links: [
      { title: 'Mentions légales', link: '/terms/list', pos: 1 }
    ],

    /** Affiche "Propulsé par Astro & Pure theme" */
    credits: true,

    /** Liens vers les réseaux sociaux (optionnel) */
    social: {
      github: 'https://github.com/visbran'
      // Si tu as d'autres réseaux sociaux, ajoute-les ici
    }
  },

  // [Contenu]

  content: {
    /** Configuration des liens externes */
    externalLinks: {
      content: ' ↗',  // Symbole pour les liens externes
      properties: {
        style: 'user-select:none'
      }
    },

    /** Nombre d'articles par page */
    blogPageSize: 8,

    /** Plateformes de partage disponibles */
    share: ['x', 'bluesky']  // Retiré weibo pour audience française
  }
}

/**
 * Configuration des intégrations
 */
export const integ: IntegrationUserConfig = {
  // [Liens amis]
  links: {
    /** Journal de bord des liens (optionnel) */
    logbook: [],

    /** Info pour les demandes d'échange de liens */
    applyTip: [
      { name: 'Nom', val: 'Blog Tech de visbran' },
      { name: 'Description', val: 'Veille IA quotidienne • Outils • Modèles • Recherche en français' },
      { name: 'Lien', val: 'https://www.visbran.fr/' },
      { name: 'Avatar', val: 'https://www.visbran.fr/favicon/favicon.ico' }
    ],

    /** Cache les avatars dans public/avatars/ pour de meilleures performances */
    cacheAvatar: true
  },

  // [Recherche]
  /** Active Pagefind pour la recherche sur le site */
  pagefind: true,

  // [Citation aléatoire]
  /** Citations françaises servies par l'endpoint local /api/quote */
  quote: {
    server: '/api/quote',
    target: `(data) => data.quote || 'Erreur'`
  },

  // [Typographie]
  typography: {
    class: 'prose text-base text-muted-foreground',
    /** Style des citations (normal ou italic) */
    blockquoteStyle: 'italic',
    /** Style des blocs de code inline (code ou modern) */
    inlineCodeBlockStyle: 'modern'
  },

  // [Lightbox pour les images]
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },

  // [Système de commentaires Waline]
  waline: {
    enable: true,
    /** URL de votre serveur Waline (à configurer) */
    server: 'https://waline-comments-eight-wheat.vercel.app',
    /** Émojis disponibles (noms courts, le CDN est ajouté par Comment.astro) */
    emoji: ['bmoji', 'weibo'],
    /** Configuration supplémentaire */
    additionalConfigs: {
      pageview: true,    // Compteur de vues
      comment: true,     // Active les commentaires
      turnstileKey: import.meta.env.PUBLIC_TURNSTILE_KEY, // Active Turnstile côté client
      reaction: [
      'https://cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/tw-emoji/1f621.png',
      'https://cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/tw-emoji/1f914.png',
      'https://cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/tw-emoji/1f60e.png',
      ],
      locale: {
        reactionTitle: 'Qu\'en pensez-vous ?',  // Titre général
        reaction0: 'En colère',    // Label pour le 1er emoji
        reaction1: 'Réfléchi',     // Label pour le 2ème emoji
        reaction2: 'Cool',         // Label pour le 3ème emoji
        placeholder: 'Bienvenue ! Laissez un commentaire. (L\'email permet de recevoir les réponses, connexion non obligatoire)'
      },
      imageUploader: false  // Désactive l'upload d'images
    }
  }
}

/**
 * Configuration des pages légales (optionnel)
 */
export const terms: CardListData = {
  title: 'Mentions légales',
  list: [
    {
      title: 'Politique de confidentialité',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Conditions générales d\'utilisation',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Droits d\'auteur',
      link: '/terms/copyright'
    },
    {
      title: 'Avertissement',
      link: '/terms/disclaimer'
    }
  ]
}

// Export final de la configuration
const config = { ...theme, integ } as Config
export default config
