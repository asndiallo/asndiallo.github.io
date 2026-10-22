---
business: Djidiawax
location: Boutique en ligne en France
vertical: online-shop
status: in-progress
homepage: false
summary: 'Une boutique de mode refaite pour le téléphone : pages 10 fois plus légères, paiement corrigé, avis avec photos, Google mieux guidé. Résultats à venir.'
consent: true
disclosure: 'Transparence : la propriétaire de Djidiawax est ma sœur.'
website: https://djidiawax.com/
services:
  - Accueil et fiches produits pensées pour le téléphone
  - 'Vitesse du site : photos, extensions, cache'
  - 'Paiement corrigé : livraison offerte, précommandes'
  - Avis clients avec photos
  - Offre de bienvenue et inscriptions par e-mail
  - 'SEO technique : titres, catégories, plan du site, données structurées'
image:
  src: ../../../assets/work/djidiawax/fr/hero.png
  alt: 'La nouvelle page d’accueil de djidiawax.com : le titre « Blazers et ensembles en wax » à côté d’une femme portant un blazer en wax bordeaux et rose.'
order: 10
---

## La boutique

Djidiawax vend en ligne, depuis la France, des vêtements afro-contemporains : blazers, ensembles, vestes et hauts en wax, confectionnés en petites séries entre le Sénégal et Paris. La boutique tourne sous WordPress et WooCommerce, et la plupart des visiteuses achètent sur leur téléphone.

## Avant

Les photos étaient belles, mais la boutique perdait des clientes en route vers le paiement :

- **La livraison offerte était promise mais jamais appliquée.** Le bandeau annonçait « livraison offerte dès 200 € », mais le paiement comptait toujours les frais de port.
- **Les précommandes ne pouvaient pas être payées.** Les cinq ensembles en précommande n’avaient qu’un formulaire e-mail.
- **Le contenu de démonstration du thème était encore en ligne.** La page Contact affichait les textes anglais du thème et des numéros américains, et 16 articles de blog d’exemple en anglais étaient envoyés à Google.
- **Des impasses.** Des boutons et 11 liens du menu menaient à des pages vides.
- **Des pages lourdes.** Les photos produits étaient enregistrées en PNG, un format fait pour les logos : une photo de 800 pixels pesait 1,2 Mo. Les pages pesaient 6 à 9 Mo, ce qui est lent sur téléphone.
- **De mauvais signaux pour Google.** Toutes les pages catégories avaient le même titre, et certains produits n’étaient dans aucune catégorie.

## Ce que j’ai fait

### Vitesse

- Photos servies au format WebP, sans perte visible. Les originaux sont conservés.
- 8 extensions inutiles désactivées. Une fiche produit charge maintenant 73 fichiers au lieu de 127.
- Un cache de pages : les pages sont prêtes à l’avance (sauf le panier, le paiement et le compte client).

Les pages sont passées de 6 à 9 Mo à environ 0,6 Mo, mesuré le 21 octobre 2026 sur les mêmes pages, sans être connecté.

### Accueil et fiches produits, pensés pour le téléphone

- **Page d’accueil :** le premier écran montre un vrai blazer de la boutique, ce qu’elle vend et deux boutons. Avant, le premier produit n’apparaissait qu’après quatre écrans.
- **Une seule police d’écriture** sur tout le site, au lieu de trois.
- **Fiches produits :** boutons de taille plus grands, guide des tailles, livraison et retours juste sous le bouton, badge de paiement en français.

![Deux captures sur téléphone de la page d’accueil de djidiawax.com. À gauche, avant : une photo de deux mannequins dans un escalier, le nom de la marque et un bouton « Découvrir la collection ». À droite, après : une femme en blazer en wax bordeaux et rose, le titre « Blazers et ensembles en wax » et un bouton « Découvrir les blazers ».](../../../assets/work/djidiawax/fr/home.png)

_Page d’accueil sur téléphone. À gauche : avant. À droite : après. Captures du 22 octobre 2026._

![Deux captures sur téléphone de la même fiche produit. À gauche, avant : petits boutons de taille, liens « Aide », « Livrer et retourner » et « Partager », et un badge en anglais « Guarantee safe checkout ». À droite, après : boutons de taille plus grands, lien vers le guide des tailles, et lignes livraison, retours, presse et WhatsApp sous les boutons.](../../../assets/work/djidiawax/fr/product.png)

_Fiche produit sur téléphone, au niveau du choix de taille. À gauche : avant. À droite : après._

### Paiement et confiance

- **La livraison standard offerte en France dès 99 €** s’applique vraiment au paiement, avec un message « Plus que X € » dans le panier.
- **Les précommandes peuvent être payées,** avec le délai de 15 jours affiché sur la page et noté sur la commande.
- **Une vraie page Contact :** WhatsApp, téléphone, e-mail et un formulaire en français.
- **Une politique de confidentialité** écrite d’après les outils réellement utilisés, et un lien vers les vraies conditions générales de vente au moment du paiement.
- **Tout en français :** tri, fil d’Ariane, recherche, panier, filtres, compte client et page d’erreur 404.

### Avis clients et offre de bienvenue

- **Des avis clients avec photos,** intégrés à la boutique sans service extérieur. Sept jours après une commande terminée, la cliente reçoit un seul e-mail avec un lien personnel : seules de vraies clientes peuvent laisser un avis. La propriétaire valide chaque avis avant publication.
- **−10 % sur la première commande** contre une adresse e-mail : un code à usage unique, affiché tout de suite et envoyé par e-mail. L’offre n’apparaît qu’après avoir fait défiler la page, jamais en fenêtre surgissante à l’arrivée.

### Google

- Titres et descriptions écrits pour la page d’accueil, les catégories et les pages importantes. Les produits au nom court (« Bomber Azur ») ont un titre qui dit ce que c’est.
- 12 produits rangés dans leur catégorie, articles d’exemple du thème retirés, plan du site nettoyé.
- Textes alternatifs sur 120 photos, pour Google Images et pour les personnes qui utilisent un lecteur d’écran.
- Données structurées produits (prix, stock, retours sous 14 jours), qui préparent aussi les annonces gratuites Google Shopping.

## Ce que j’ai choisi de ne pas faire

- **Pas d’images générées par IA, pas de fond blanc.** Les photos de studio sont déjà homogènes et montrent la coupe.
- **Pas de fenêtre surgissante à l’arrivée, pas de compte à rebours, pas de faux « plus que 2 en stock ».** Ces procédés donnent une image de site discount, et les fausses urgences sont interdites par le droit de la consommation français.
- **Pas de code maison pour remplacer WooCommerce ou les extensions de paiement.** Réunies, elles pèsent environ 0,5 Mo. Le poids venait des photos.

## La mise en ligne

Tout a d’abord été construit et testé sur une copie de la boutique. Une quarantaine de tests automatiques rejouent les parcours importants sur téléphone et sur ordinateur : ajout au panier, précommande, livraison offerte, offre de bienvenue, avis avec photo, recherche et liens cassés. La mise en ligne a pris environ une heure, sans interrompre les commandes, et chaque changement peut être annulé.

Prochaine étape : faire venir plus de visiteuses, par Instagram et les annonces gratuites Google Shopping.
