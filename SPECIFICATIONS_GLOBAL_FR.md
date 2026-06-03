<!--
Document: SPECIFICATIONS_GLOBAL_FR.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
Purpose: Spécification globale stable du projet d’extension ChatGPT Voice Flow.
-->

# ChatGPT Voice Flow — Spécifications globales

## 1. Objectif

ChatGPT Voice Flow est une extension locale Brave / Chromium qui ajoute un widget flottant de contrôle dans ChatGPT Web.

Son objectif est de créer un workflow semi-conversationnel basé sur les fonctions existantes de transcription vocale et de lecture à voix haute de ChatGPT Web, sans utiliser le mode conversation vocale de ChatGPT.

L’extension automatise des actions que l’utilisateur fait normalement à la main :

- valider une transcription vocale terminée ;
- envoyer le texte transcrit ;
- lancer la lecture à voix haute intégrée de ChatGPT sur la réponse assistant ;
- relancer optionnellement une nouvelle transcription vocale après lecture ;
- détecter optionnellement le silence utilisateur et valider automatiquement la transcription ;
- permettre d’avancer manuellement dans le flux.

## 2. Périmètre global

L’extension cible ChatGPT Web dans Brave / Chromium.

Pages hôtes supportées :

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

L’extension est une couche d’automatisation côté navigateur. Elle ne fournit pas son propre moteur speech-to-text, son propre moteur text-to-speech, son propre backend, son propre service distant, ni son propre native host.

## 3. Comportement stable vérifié du dépôt

Le dépôt contient une extension Manifest V3 avec les fichiers runtime suivants :

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

L’extension injecte un widget flottant déplaçable dans ChatGPT Web quand elle est activée depuis l’action d’extension du navigateur.

Le widget fournit les contrôles du flux vocal complet :

- activation ou désactivation globale du flux ;
- envoi du texte transcrit ;
- lecture de la réponse assistant ;
- démarrage d’une nouvelle transcription ;
- automatisation par temps de silence ;
- durée de silence ;
- seuil de volume ;
- affichage du volume micro ;
- action manuelle next step ;
- modes d’affichage compact et complet ;
- indicateurs d’étape visibles.

## 4. Architecture du dépôt

Le dépôt reste volontairement léger.

`manifest.json` déclare les métadonnées de l’extension, les permissions, les permissions d’hôte, le service worker, le content script et les icônes.

`background.js` coordonne les clics sur l’action d’extension et le routage des messages.

`content-autosend.js` contient la logique principale d’automatisation dans la page :

- création du widget ;
- persistance de l’état du widget ;
- découverte DOM des contrôles ChatGPT ;
- automatisation de l’envoi ;
- automatisation de la lecture à voix haute ;
- automatisation du redémarrage de transcription ;
- détection du temps de silence ;
- suivi de l’étape active ;
- garde-fous lecture/génération ;
- logique next step.

`autosend-style.css` définit le style du widget, des modes compact/complet, des boutons, des indicateurs d’étape et des statuts runtime.

`icons/` contient les icônes de l’extension. L’icône actuelle est volontairement rouge et visible dans la barre du navigateur.

## 5. Exigences fonctionnelles globales

### 5.1 Widget flottant

L’extension doit injecter un widget flottant dans ChatGPT Web.

Le widget doit être déplaçable et conserver sa position quand c’est possible.

Le widget doit proposer un mode compact et un mode complet.

Le mode compact doit utiliser des labels courts.

Le mode complet doit utiliser des labels plus clairs pour les utilisateurs qui n’ont pas construit l’extension.

Le nom public de l’extension doit être `ChatGPT Voice Flow`.

### 5.2 Interrupteur global du flux

Le widget doit exposer un interrupteur global du flux.

Quand Flow est désactivé :

- aucune automatisation d’envoi ne doit s’exécuter ;
- aucune automatisation de lecture ne doit s’exécuter ;
- aucun redémarrage de transcription ne doit s’exécuter ;
- aucune automatisation T.O.S. ne doit s’exécuter ;
- les timers actifs ne doivent pas déclencher d’action ;
- l’analyse micro doit être stoppée quand elle n’est plus nécessaire.

Quand Flow est activé, les sous-options choisies par l’utilisateur déterminent les actions actives.

### 5.3 Envoi de transcription

L’extension doit envoyer le texte courant du composer ChatGPT quand l’option d’envoi de transcription est active et que le texte est stable.

Cette étape correspond à l’action normale de cliquer sur le bouton d’envoi ChatGPT après la transcription vocale.

L’extension doit éviter les doubles envois du même texte.

L’extension ne doit pas cliquer des boutons sans rapport.

### 5.4 Lecture à voix haute depuis ChatGPT

L’extension doit pouvoir déclencher la lecture à voix haute intégrée de ChatGPT Web sur la dernière réponse assistant.

L’extension doit cibler uniquement le dernier message assistant.

L’extension doit éviter de relire d’anciens messages assistant lorsqu’une réponse plus récente existe.

L’extension ne doit pas utiliser son propre moteur text-to-speech.

### 5.5 Démarrage de transcription

L’extension doit pouvoir démarrer optionnellement une nouvelle transcription vocale ChatGPT Web après la lecture de la réponse assistant.

Cette étape doit cibler le contrôle de transcription voice-to-text, pas le contrôle du mode conversation live de ChatGPT.

L’extension doit éviter de démarrer une transcription pendant que ChatGPT génère, réfléchit ou lit encore une réponse.

### 5.6 Temps de silence

L’extension doit pouvoir détecter le silence utilisateur pendant qu’une transcription vocale ChatGPT est active.

Quand T.O.S. est activé, l’extension doit mesurer le volume micro avec un analyseur audio navigateur.

T.O.S. doit utiliser une mesure RMS basée sur `getByteTimeDomainData()` avec une FFT de 2048.

T.O.S. doit exposer une durée de silence réglable.

T.O.S. doit exposer un seuil de volume réglable.

T.O.S. doit afficher le volume micro courant pour aider l’utilisateur à régler le seuil.

Quand le volume micro reste sous le seuil configuré pendant la durée configurée, l’extension doit tenter de valider la transcription vocale ChatGPT en cours.

### 5.7 Next step manuel

Le widget doit exposer un contrôle next step manuel.

Ce contrôle doit tenter d’avancer dans le flux selon l’état visible courant.

Les actions possibles sont notamment :

- valider la transcription courante ;
- envoyer la transcription courante ;
- lancer la lecture à voix haute ;
- démarrer une nouvelle transcription.

L’action next step doit respecter le réglage global Flow.

### 5.8 Indicateurs d’étape

Le widget doit afficher des indicateurs d’étape visibles.

Il doit au minimum distinguer :

- envoi de transcription ;
- lecture à voix haute ;
- démarrage de transcription.

L’étape active doit être mise en évidence visuellement.

T.O.S. n’est pas une étape conversationnelle. C’est une option d’automatisation qui peut déclencher la validation de transcription.

## 6. Exigences non fonctionnelles globales

L’extension doit rester local-first.

L’extension ne doit pas uploader le contenu utilisateur.

L’extension ne doit pas appeler d’API externe.

L’extension ne doit pas envoyer de télémétrie.

L’extension ne doit pas utiliser de backend.

L’extension ne doit pas utiliser Native Messaging.

L’extension ne doit demander l’accès micro que pour la détection locale du silence.

L’extension doit garder des permissions navigateur limitées.

L’extension doit fonctionner comme extension non empaquetée de développement dans Brave / Chromium.

Si un contrôle cible est ambigu, l’extension doit ne rien faire plutôt que cliquer le mauvais bouton.

## 7. Entrées globales

Les entrées utilisateur sont des actions navigateur et des réglages du widget :

- clic sur l’action d’extension ;
- position du widget ;
- Flow activé ou désactivé ;
- envoi de transcription activé ou désactivé ;
- lecture à voix haute activée ou désactivée ;
- démarrage de transcription activé ou désactivé ;
- T.O.S. activé ou désactivé ;
- durée de silence ;
- seuil de volume ;
- mode compact ou complet ;
- clic next step ;
- contrôles voice-to-text de ChatGPT Web ;
- contrôles read aloud de ChatGPT Web.

## 8. Sorties globales

L’extension produit uniquement des effets d’automatisation UI :

- visibilité du widget flottant ;
- affichage du statut d’étape ;
- affichage du volume ;
- clics sur les contrôles ChatGPT Web ;
- persistance locale d’état dans la page ou le stockage extension.

L’extension ne produit pas d’exports de chat, de transcriptions téléchargeables, de logs serveur ou de rapports externes.

## 9. Fichiers et répertoires globaux

Fichiers runtime attendus :

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/icon16.png`
- `icons/icon32.png`
- `icons/icon48.png`
- `icons/icon128.png`

Fichiers de documentation attendus :

- `README.md`
- `README_FR.md`
- `INSTALL.md`
- `INSTALL_FR.md`
- `CHANGELOG.md`
- `CHANGELOG_FR.md`
- `ARCHITECTURE.md`
- `ARCHITECTURE_FR.md`
- `SPECIFICATIONS_GLOBAL.md`
- `SPECIFICATIONS_GLOBAL_FR.md`

Les fichiers de gouvernance comme `AGENTS.md` et `CLAUDE.md` ne sont pas des fichiers runtime de l’extension.

## 10. Interfaces et commandes globales

L’extension s’installe via le workflow d’extension non empaquetée du navigateur.

L’utilisateur charge le dossier du dépôt dans `brave://extensions/` ou `chrome://extensions/`, avec le mode développeur activé.

Après remplacement de fichiers pendant le développement, l’utilisateur doit recharger l’extension dans la page des extensions et rafraîchir l’onglet ChatGPT Web.

Aucune commande runtime en ligne de commande n’est requise.

## 11. Contraintes globales et règles de sécurité

L’extension ne doit pas contrôler de sites sans rapport.

L’extension ne doit pas exécuter d’action quand Flow est désactivé.

L’extension doit éviter de déclencher le mode conversation live de ChatGPT.

L’extension doit éviter de démarrer une transcription pendant que la lecture à voix haute est encore active.

L’extension doit éviter de démarrer une transcription pendant que ChatGPT génère ou réfléchit.

L’extension doit stopper ou ignorer les timers quand le widget est désactivé ou retiré.

L’extension doit préserver les réglages utilisateur quand c’est possible.

L’extension doit préférer l’inactivité sûre au mauvais clic.

## 12. Critères de validation et d’acceptation globaux

L’extension est acceptable quand ces tests manuels passent dans ChatGPT Web :

1. L’action d’extension affiche ou masque le widget flottant.
2. Le widget peut être déplacé et reste utilisable après déplacement.
3. Flow désactivé empêche toute automatisation.
4. L’envoi de transcription envoie automatiquement une transcription terminée.
5. La lecture à voix haute démarre sur la dernière réponse assistant.
6. Le démarrage de transcription lance la transcription voice-to-text et pas le mode conversation live.
7. T.O.S. affiche les variations de volume micro pendant que l’utilisateur parle.
8. T.O.S. valide la transcription après la durée et le seuil configurés.
9. Le workflow ne redémarre pas la transcription pendant que ChatGPT génère.
10. Le workflow ne redémarre pas la transcription pendant que read aloud est actif.
11. Next step avance le workflow sans ignorer le réglage global Flow.
12. Les modes compact et complet affichent les labels prévus.

## 13. Hors périmètre

L’extension n’implémente pas son propre moteur speech-to-text.

L’extension n’implémente pas son propre moteur text-to-speech.

L’extension ne remplace pas le mode conversation vocale officiel de ChatGPT.

L’extension n’exporte pas les chats.

L’extension ne gère pas les paramètres de compte OpenAI.

L’extension ne fournit pas de composant serveur.

L’extension ne garantit pas la compatibilité avec les futurs changements DOM de ChatGPT Web.

## 14. Notes de passation Codex

Ce fichier est la spécification globale stable du dépôt.

Codex doit utiliser ce document comme référence principale du comportement stable lorsqu’il génère ou corrige le code runtime et la documentation.

Les détails historiques, corrections de bugs et évolutions par version appartiennent à `CHANGELOG.md`, pas à ce fichier de spécification globale.
