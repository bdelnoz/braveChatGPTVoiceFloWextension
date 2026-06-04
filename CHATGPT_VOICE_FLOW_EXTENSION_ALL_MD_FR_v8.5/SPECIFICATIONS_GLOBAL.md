<!--
Document: SPECIFICATIONS_GLOBAL.md
Projet: ChatGPT Voice Flow
Auteur: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version document: v1.0.2
Version extension: v8.5
Date: 2026-06-04
Langue: Français
-->

# Spécifications globales

## 1. Projet

Nom du projet :

ChatGPT Voice Flow.

Ancien nom de travail :

braveGPTAUTOSENDextenstion.

## 2. Objectif

Créer une extension locale Brave / Chromium qui automatise un flux vocal dans ChatGPT Web.

## 3. Plateforme

Cible :

- Brave Browser ;
- Chromium ;
- ChatGPT Web ;
- extension locale chargée en mode développeur.

## 4. Fichiers runtime

Fichiers runtime attendus :

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

## 5. Contrôles attendus

Le widget doit gérer :

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

## 6. Valeurs par défaut

Tout doit être désactivé par défaut.

L’ordre des toggles doit être :

No / Yes.

No à gauche.

Yes à droite.

## 7. Principe de sécurité

En cas de doute, ne rien déclencher.

L’extension ne doit pas redémarrer le micro pendant que ChatGPT réfléchit ou parle.

## 8. Documentation minimale

Les documents utiles sont :

- `README.md`
- `INSTALL.md`
- `CHANGELOG.md`
- `WHY.md`
- `WORKFLOW.md`
- `SPECIFICATIONS.md`
- `SPECIFICATIONS_GLOBAL.md`

Pas besoin de créer une usine documentaire.
