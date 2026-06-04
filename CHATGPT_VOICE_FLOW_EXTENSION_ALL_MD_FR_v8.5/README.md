<!--
Document: README.md
Projet: ChatGPT Voice Flow
Auteur: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version document: v1.0.2
Version extension: v8.5
Date: 2026-06-04
Langue: Français
-->

# ChatGPT Voice Flow

ChatGPT Voice Flow est une extension locale Brave / Chromium pour ChatGPT Web.

Elle automatise un flux vocal semi-conversationnel à partir des fonctions déjà présentes dans ChatGPT Web :

- transcription vocale ;
- envoi automatique de la transcription ;
- lecture vocale de la réponse via Read aloud ;
- redémarrage optionnel de la transcription ;
- validation automatique optionnelle après silence.

Cette extension n’est pas une extension officielle OpenAI.

Elle pilote localement l’interface Web de ChatGPT dans le navigateur.

## État actuel

Point de reprise propre : v8.5.

Les versions expérimentales créées après v8.5 dans un autre chat, notamment v8.7, v8.8, v8.9 et v9.0, ne doivent pas être utilisées comme base sans vérification.

## Objectif

Réduire les clics répétitifs dans ChatGPT Web quand on utilise :

- le micro ;
- la transcription ;
- l’envoi du message ;
- Read aloud ;
- le redémarrage d’une nouvelle transcription.

## Contrôles principaux

Le widget contient ou doit contenir :

- Flow activation ;
- Send transcription ;
- Read aloud from ChatGPT ;
- Start transcription ;
- Time of Silence ;
- Sec ;
- Thr ;
- Vol ;
- Next ;
- Mini / Maxi.

## Règle importante

Tout doit être désactivé par défaut au chargement.

L’utilisateur active seulement ce qu’il veut tester ou utiliser.

## Avertissement

Comme l’extension automatise l’interface ChatGPT Web, elle peut casser si OpenAI modifie fortement le DOM ou les boutons de ChatGPT.
