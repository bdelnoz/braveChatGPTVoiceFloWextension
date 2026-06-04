<!--
Document: INSTALL_FR.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
-->

# Installation

## Prérequis

- Brave Browser ou un autre navigateur basé sur Chromium.
- Mode développeur activé dans la page des extensions.
- Dossier local du dépôt contenant les fichiers runtime de l’extension.

## Fichiers runtime nécessaires

Le navigateur doit charger un dossier contenant au minimum :

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

## Installation comme extension non empaquetée dans Brave

1. Ouvrir Brave.
2. Ouvrir `brave://extensions/`.
3. Activer le mode développeur.
4. Cliquer sur Load unpacked.
5. Sélectionner le dossier du dépôt qui contient `manifest.json`.
6. Ouvrir ChatGPT Web.
7. Cliquer sur l’icône de l’extension pour afficher le widget.

## Mise à jour pendant le développement

Quand les fichiers de l’extension sont remplacés pendant le développement :

1. Écraser les fichiers dans le dossier local du dépôt.
2. Ouvrir `brave://extensions/`.
3. Cliquer sur Reload sur la carte de l’extension.
4. Rafraîchir l’onglet ChatGPT Web.

Il n’est normalement pas nécessaire de supprimer et réimporter l’extension si elle reste chargée depuis le même dossier non empaqueté.

## Permission microphone

L’extension peut demander la permission microphone pour la détection locale du temps de silence.

Le micro est utilisé localement dans le navigateur pour mesurer le volume audio.

L’extension n’upload pas l’audio.

## Premier test recommandé

Utiliser une séquence simple :

1. Ouvrir ChatGPT Web.
2. Afficher le widget.
3. Mettre Flow sur On.
4. Activer uniquement Send transcription au départ.
5. Démarrer manuellement la transcription vocale ChatGPT.
6. Dire une courte phrase.
7. Valider manuellement la transcription.
8. Vérifier que l’extension envoie le texte.

Ensuite, activer Read aloud, Start transcription et T.O.S. un par un.

## Dépannage

Si le widget n’apparaît pas, recharger l’extension et rafraîchir l’onglet ChatGPT.

Si les changements ne sont pas visibles, vérifier que Brave charge le bon dossier local.

Si T.O.S. ne réagit pas, vérifier la permission microphone et regarder la valeur de volume dans le widget.

Si le mauvais bouton ChatGPT est cliqué, le sélecteur DOM doit être adapté dans `content-autosend.js`.
