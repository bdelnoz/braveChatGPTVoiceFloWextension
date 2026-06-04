<!--
Document: README_FR.md
Project: ChatGPT Voice Flow
Version: v8.5
Language: French
-->

# ChatGPT Voice Flow

ChatGPT Voice Flow est une extension locale pour Brave / Chromium, destinée à ChatGPT Web.

Elle automatise une partie du flux vocal de ChatGPT Web :

- transcription vocale vers texte ;
- envoi automatique de la transcription ;
- lecture vocale de la réponse avec Read aloud ;
- redémarrage possible de la transcription ;
- détection optionnelle du silence.

## État de cette version

Cette archive contient la version de reprise **v8.5**.

La version v8.5 est considérée comme le point de reprise propre.

Les versions expérimentales suivantes créées ailleurs, comme v8.7, v8.8, v8.9 ou v9.0, ne doivent pas être utilisées sans vérification, car elles ont introduit des régressions.

## Important

Cette extension n’est pas une fonctionnalité officielle d’OpenAI.

Elle automatise l’interface Web existante de ChatGPT dans le navigateur.

Si l’interface ChatGPT change, certains sélecteurs peuvent casser.

## Utilisation prévue

L’utilisateur ouvre ChatGPT Web, charge l’extension, affiche le widget flottant, puis active seulement les options nécessaires.

Tous les réglages doivent rester désactivés par défaut au départ.

## Boutons principaux

- Flow activation : active ou désactive le flux global.
- Send transcription : envoie automatiquement la transcription.
- Read aloud from ChatGPT : lance la lecture vocale de la réponse.
- Start transcription : relance la transcription vocale.
- Time of Silence : valide automatiquement la transcription après un silence.
- Sec : durée du silence.
- Thr : seuil de volume.
- Vol : volume micro détecté.
- Next : avance manuellement dans le flux.

## Recommandation

Pour un premier test, ne pas tout activer d’un coup.

Tester d’abord :

1. affichage du widget ;
2. activation du flow ;
3. transcription vocale ;
4. Time of Silence ;
5. Send transcription ;
6. Read aloud ;
7. Start transcription.
