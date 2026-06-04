<!--
Document: INSTALL.md
Projet: ChatGPT Voice Flow
Auteur: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version document: v1.0.2
Version extension: v8.5
Date: 2026-06-04
Langue: Français
-->

# Installation de ChatGPT Voice Flow dans Brave

## 1. Décompresser l’archive

Décompressez le fichier ZIP dans un dossier local.

Exemple de dossier :

`CHATGPT_VOICE_FLOW_EXTENSION_ALL_MD_FR_v8.5`

Le dossier choisi doit contenir directement le fichier :

`manifest.json`

Il doit aussi contenir les fichiers runtime suivants :

- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

## 2. Ouvrir la page des extensions Brave

Dans Brave, ouvrez cette adresse :

`brave://extensions/`

Vous pouvez la copier-coller directement dans la barre d’adresse du navigateur.

## 3. Activer le mode développeur

Sur la page des extensions, activez :

`Mode développeur`

ou, selon la langue du navigateur :

`Developer mode`

Ce bouton se trouve généralement en haut à droite de la page.

## 4. Charger l’extension non empaquetée

Cliquez sur :

`Charger l’extension non empaquetée`

ou, en anglais :

`Load unpacked`

Sélectionnez le dossier décompressé de l’extension.

Attention : il faut sélectionner le dossier qui contient directement `manifest.json`.

Ne sélectionnez pas un dossier parent qui contient seulement un autre dossier.

## 5. Vérifier que l’extension est chargée

Après sélection du dossier, Brave doit afficher l’extension dans la liste.

Le nom attendu est :

`ChatGPT Voice Flow`

La version attendue pour ce paquet est :

`v8.5`

Si Brave affiche une ancienne version, rechargez l’extension.

## 6. Ouvrir ChatGPT Web

Ouvrez ChatGPT Web dans un onglet Brave.

Cliquez ensuite sur l’icône de l’extension.

Le widget flottant doit apparaître dans la page.

## 7. Premier test conseillé

Ne mettez pas tout à Yes directement.

Commencez doucement.

Réglage conseillé pour un premier test :

- Flow activation : Yes.
- Send transcription : No.
- Read aloud from ChatGPT : No.
- Start transcription : No.
- Time of Silence : No.

Vérifiez d’abord que le widget apparaît et ne disparaît pas quand vous cliquez dedans.

## 8. Test de Send transcription

Ensuite, vous pouvez tester uniquement :

- Flow activation : Yes.
- Send transcription : Yes.
- Read aloud from ChatGPT : No.
- Start transcription : No.
- Time of Silence : No.

L’objectif est seulement de vérifier que la transcription peut être envoyée automatiquement.

## 9. Test de Read aloud

Ensuite, testez :

- Flow activation : Yes.
- Send transcription : Yes.
- Read aloud from ChatGPT : Yes.
- Start transcription : No.
- Time of Silence : No.

L’objectif est de vérifier que ChatGPT lit la réponse.

## 10. Test de Time of Silence

Ensuite, testez Time of Silence séparément.

Réglage possible :

- Flow activation : Yes.
- Send transcription : No.
- Read aloud from ChatGPT : No.
- Start transcription : No.
- Time of Silence : Yes.
- Sec : 3 à 5 secondes.
- Thr : à ajuster selon le micro.

L’objectif est de vérifier que l’extension valide la transcription après un silence.

## 11. Mise à jour de l’extension

Quand vous remplacez les fichiers de l’extension :

1. retournez dans `brave://extensions/` ;
2. cliquez sur le bouton de rechargement de l’extension ;
3. retournez sur l’onglet ChatGPT ;
4. rafraîchissez la page ChatGPT.

Cette étape est importante.

Un ancien script déjà injecté dans la page peut rester actif tant que l’onglet ChatGPT n’a pas été rafraîchi.

## 12. Script install.sh

Le fichier `install.sh` fourni dans l’archive n’installe pas automatiquement l’extension dans Brave.

Brave impose un chargement manuel depuis `brave://extensions/`.

Le script sert à :

- vérifier que les fichiers principaux sont présents ;
- afficher les étapes d’installation ;
- éviter de se tromper de dossier.

Pour le lancer :

`./install.sh`

Si le fichier n’est pas exécutable :

`chmod +x install.sh`

Puis relancez :

`./install.sh`

## 13. Désinstallation

Pour désinstaller l’extension :

1. ouvrez `brave://extensions/` ;
2. trouvez ChatGPT Voice Flow ;
3. cliquez sur Supprimer ou Remove.

## 14. Problème connu possible

Si le widget se comporte bizarrement après une mise à jour :

1. désactivez l’extension ;
2. rechargez l’extension ;
3. rafraîchissez la page ChatGPT ;
4. réactivez seulement les options nécessaires.

Ne testez pas toutes les options à la fois si vous êtes en phase de debug.
