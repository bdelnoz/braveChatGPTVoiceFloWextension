<!--
Document: README_FR.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
-->

# ChatGPT Voice Flow

ChatGPT Voice Flow est une extension locale Brave / Chromium pour ChatGPT Web.

Elle ajoute un widget flottant déplaçable qui permet d’automatiser un flux semi-conversationnel basé sur les fonctions existantes de transcription vocale et de lecture à voix haute de ChatGPT Web.

## Ce que fait l’extension

L’extension peut aider à automatiser ce flux :

1. Démarrer la transcription vocale ChatGPT Web.
2. Détecter le silence utilisateur et valider la transcription.
3. Envoyer le texte transcrit.
4. Attendre la réponse assistant.
5. Lancer la lecture à voix haute intégrée de ChatGPT.
6. Optionnellement démarrer une nouvelle transcription vocale.

Le but est de créer un flux vocal pratique sans utiliser le mode conversation live de ChatGPT.

## Fonctions principales

- Widget flottant déplaçable.
- Interrupteur global Flow On / Off.
- Automatisation de l’envoi de transcription.
- Automatisation de la lecture à voix haute.
- Automatisation du démarrage de transcription.
- Détection du temps de silence.
- Seuil de volume manuel.
- Affichage du volume micro en direct.
- Bouton manuel Next step.
- Modes d’affichage compact et complet.
- Indicateurs d’étape visibles.
- Icône rouge visible dans la barre du navigateur.

## Conception local-first

L’extension n’utilise pas de backend.

Elle n’appelle pas d’API externe.

Elle n’upload pas les données utilisateur.

Elle ne fournit pas son propre moteur speech-to-text ou text-to-speech.

Elle automatise uniquement les contrôles de ChatGPT Web dans le navigateur.

## Navigateurs supportés

- Brave Browser.
- Navigateurs basés sur Chromium supportant les extensions Manifest V3 non empaquetées.

## Sites supportés

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

## Fichiers du dépôt

Fichiers runtime :

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

Fichiers de documentation :

- `SPECIFICATIONS_GLOBAL.md`
- `SPECIFICATIONS_GLOBAL_FR.md`
- `README.md`
- `README_FR.md`
- `INSTALL.md`
- `INSTALL_FR.md`
- `CHANGELOG.md`
- `CHANGELOG_FR.md`
- `ARCHITECTURE.md`
- `ARCHITECTURE_FR.md`

## État du développement

La baseline runtime courante est v8.0.

L’extension a été construite par itérations avec des tests réels dans ChatGPT Web.

La version actuelle couvre l’objectif initial et plusieurs fonctions supplémentaires d’automatisation du flux.

## Note importante

L’extension dépend de la structure UI de ChatGPT Web.

Si le DOM de ChatGPT Web change, les sélecteurs peuvent devoir être adaptés.
