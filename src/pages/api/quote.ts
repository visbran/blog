import type { APIRoute } from 'astro'

// Endpoint serveur pour les citations françaises
// Remplace l'API externe dummyjson.com (anglais) par des citations locales en français
export const prerender = false

const quotes = [
  'La simplicité est la sophistication suprême.',
  "La perfection est atteinte non pas quand il n'y a plus rien à ajouter, mais quand il n'y a plus rien à enlever.",
  "Un bon administrateur système, c'est celui dont on n'entend jamais parler.",
  'Automatisez ce qui peut l'être, documentez ce qui ne peut pas.',
  'La sécurité n'est pas un produit, c'est un processus.',
  "Toujours sauvegarder avant d'expérimenter.",
  'Le monitoring est la conscience du système.',
  'La documentation d'aujourd'hui est le gain de temps de demain.',
  "Faire simple est souvent plus difficile que faire compliqué.",
  'Tout système complexe qui fonctionne a évolué depuis un système simple qui fonctionnait.',
  "L'open source est la force tranquille qui fait avancer le monde.",
  'Le code propre se lit comme de la prose bien écrite.',
  "Un serveur qui tombe la nuit, c'est un administrateur qui se lève.",
  "En informatique, il n'y a pas de problème sans solution, seulement des solutions inconnues.",
  "L'infrastructure n'est pas une fin en soi, c'est le socle de tout le reste.",
  "Mesurer, c'est savoir. Monitorer, c'est anticiper.",
  'Le meilleur outil est celui que vous maîtrisez.',
  "La redondance n'est pas du gaspillage, c'est de la résilience.",
]

export const GET: APIRoute = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]
  return new Response(JSON.stringify({ quote }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
