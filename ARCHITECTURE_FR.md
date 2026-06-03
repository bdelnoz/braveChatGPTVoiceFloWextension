<!--
Document: ARCHITECTURE_FR.md
Project: ChatGPT Voice Flow
Author: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version: v1.0.0
Project Runtime Version: v8.0
Date / Time: 2026-06-03 21:20
-->

# Architecture

## Vue générale

ChatGPT Voice Flow est une extension navigateur Manifest V3.

Elle fonctionne principalement via un content script injecté dans ChatGPT Web.

Le content script gère le widget flottant et la logique d’automatisation de l’interface.

## Composants

### manifest.json

Définit les métadonnées de l’extension, les permissions, les permissions d’hôte, le service worker, le content script, le CSS et les icônes.

### background.js

Gère les événements de l’action d’extension et le routage des messages.

Le background worker reste volontairement léger.

### content-autosend.js

Module runtime principal.

Responsabilités :

- créer et mettre à jour le widget ;
- stocker l’état du widget ;
- détecter l’état du composer ChatGPT ;
- détecter les contrôles voice-to-text de ChatGPT ;
- détecter les contrôles read-aloud de ChatGPT ;
- envoyer les transcriptions ;
- lancer la lecture à voix haute ;
- redémarrer la transcription ;
- détecter le silence via analyse RMS du micro ;
- afficher le volume courant ;
- empêcher les transitions prématurées du flux ;
- implémenter le bouton next step manuel.

### autosend-style.css

Définit la mise en page et le style du widget flottant.

Inclut les modes complet et compact, le style des boutons, les statuts et les indicateurs d’étape.

### icons

Contient les icônes de barre navigateur.

La couleur rouge est volontaire pour une reconnaissance rapide.

## Flux runtime

Le flux complet visé est :

1. L’utilisateur démarre la transcription vocale ChatGPT.
2. L’utilisateur parle.
3. T.O.S. peut détecter le silence et valider la transcription.
4. Send transcription peut envoyer le texte transcrit.
5. ChatGPT génère la réponse assistant.
6. Read aloud peut lancer la lecture à voix haute.
7. Start transcription peut redémarrer la transcription voice-to-text.

## Modèle d’état

L’extension suit l’état de ses réglages et l’état visible de ChatGPT Web.

Groupes d’état importants :

- Flow global activé ou désactivé ;
- options individuelles ;
- indicateur d’étape courant ;
- dernier texte utilisateur observé ;
- état de la dernière réponse assistant ;
- état lecture à voix haute active ou inactive ;
- état génération ou réflexion ;
- volume micro et timer de silence ;
- position du widget et mode d’affichage.

## Modèle de sécurité

L’extension est conçue pour échouer sans action dangereuse.

Quand une cible DOM est ambiguë, il vaut mieux ne rien cliquer que cliquer le mauvais élément.

Quand Flow est désactivé, aucune action du workflow ne doit s’exécuter.

Quand une lecture ou une génération est active, le redémarrage de transcription doit être bloqué.

Quand la permission microphone n’est pas disponible, T.O.S. ne doit pas tourner.

## Limites

Le DOM de ChatGPT Web n’est pas une API publique stable.

Les sélecteurs peuvent casser si ChatGPT modifie son interface.

L’extension automatise un comportement UI et doit être retestée après tout changement visible de l’interface ChatGPT Web.
