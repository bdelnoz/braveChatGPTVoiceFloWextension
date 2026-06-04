<!--
Document: INSTALL_FR.md
Project: ChatGPT Voice Flow
Version: v8.5
Language: French
-->

# Installation de ChatGPT Voice Flow dans Brave

## 1. Décompresser l’archive

Décompressez le fichier ZIP dans un dossier local.

Exemple :

```text
CHATGPT_VOICE_FLOW_EXTENSION_FR_v8.5/
```

Ce dossier doit contenir notamment :

- `manifest.json`
- `background.js`
- `content-autosend.js`
- `autosend-style.css`
- `icons/`

## 2. Ouvrir la page des extensions Brave

Dans Brave, ouvrez :

```text
brave://extensions/
```

## 3. Activer le mode développeur

Activez le bouton :

```text
Developer mode
```

ou en français :

```text
Mode développeur
```

## 4. Charger l’extension

Cliquez sur :

```text
Load unpacked
```

ou en français :

```text
Charger l’extension non empaquetée
```

Sélectionnez le dossier décompressé de l’extension.

Il faut sélectionner le dossier qui contient directement `manifest.json`.

## 5. Tester dans ChatGPT

Ouvrez ChatGPT Web.

Cliquez sur l’icône de l’extension.

Le widget flottant doit apparaître.

## 6. Mise à jour de l’extension

Si vous remplacez les fichiers de l’extension :

1. retournez dans `brave://extensions/` ;
2. cliquez sur le bouton de rechargement de l’extension ;
3. rafraîchissez la page ChatGPT.

C’est important, car les scripts déjà injectés dans la page peuvent rester actifs tant que la page n’a pas été rechargée.

## 7. Réglages conseillés pour un test simple

Pour tester progressivement :

- Flow activation : Yes.
- Send transcription : Yes.
- Read aloud from ChatGPT : No au début.
- Start transcription : No au début.
- Time of Silence : No au début.

Ensuite, activez les options une par une.
