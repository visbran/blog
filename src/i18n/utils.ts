/**
 * Utilitaires pour le système de traduction
 *
 * @note Ces fonctions permettent d'accéder facilement aux traductions
 * sans avoir à importer directement le fichier fr.ts partout
 */

import fr from './fr'

// Type pour les traductions
type Translations = typeof fr

/**
 * Récupère une traduction à partir d'une clé avec notation pointée
 *
 * @example
 * t('blog.title') // => "Blog"
 * t('nav.home') // => "Accueil"
 *
 * @param key - Clé de traduction (ex: 'blog.title')
 * @returns La traduction ou la clé si non trouvée
 */
export function t(key: string): string {
  const keys = key.split('.')
  let value: any = fr

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // En développement, affiche un warning pour les clés manquantes
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Clé de traduction non trouvée : ${key}`)
      }
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Récupère toutes les traductions d'une section
 *
 * @example
 * getSection('blog') // => { title: "Blog", description: "...", ... }
 *
 * @param section - Nom de la section (ex: 'blog')
 * @returns Objet avec toutes les traductions de la section
 */
export function getSection(section: string) {
  return fr[section as keyof Translations] || {}
}

/**
 * Fonction helper pour remplacer des variables dans une traduction
 *
 * @example
 * replace(t('date.minutesAgo'), { minutes: 5 }) // => "il y a 5 minutes"
 *
 * @param text - Texte avec placeholders {variable}
 * @param vars - Objet avec les valeurs à remplacer
 * @returns Texte avec les variables remplacées
 */
export function replace(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}

/**
 * Export des traductions pour utilisation directe
 */
export { fr }
export default { t, getSection, replace, fr }
