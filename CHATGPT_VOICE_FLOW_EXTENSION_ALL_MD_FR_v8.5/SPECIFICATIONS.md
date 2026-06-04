<!--
Document: SPECIFICATIONS.md
Projet: ChatGPT Voice Flow
Auteur: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version document: v1.0.2
Version extension: v8.5
Date: 2026-06-04
Langue: Français
-->

# Spécifications de correction

## 1. Point de reprise

La base de reprise propre est la version v8.5.

Les versions expérimentales créées après dans un autre chat, notamment v8.7, v8.8, v8.9 et v9.0, ne doivent pas être utilisées comme base sans vérification.

## 2. Objectif de la prochaine version

La prochaine version doit être une v8.6 propre basée sur v8.5.

Elle doit corriger le moteur d’état avant d’ajouter de nouvelles fonctions.

## 3. Priorités

Priorités de correction :

1. séparer clairement Thinking et Read aloud ;
2. empêcher Start transcription pendant Thinking ;
3. empêcher Start transcription pendant Read aloud ;
4. corriger Next ;
5. simplifier les indicateurs d’état ;
6. garder le widget compact.

## 4. États

États à gérer :

- Idle ;
- Voice recording ;
- Transcribing ;
- Thinking ;
- Read aloud.

Send transcription est une action courte, pas un état long.

## 5. Next pendant Thinking

Si l’utilisateur clique Next pendant Thinking :

- ne pas essayer de stopper Read aloud ;
- Read aloud n’a pas encore commencé ;
- passer à l’étape suivante seulement si c’est sûr et autorisé.

## 6. Next pendant Read aloud

Si l’utilisateur clique Next pendant Read aloud :

- cliquer le vrai bouton Stop Read aloud ;
- attendre confirmation de l’arrêt ;
- seulement ensuite relancer la transcription si autorisé.

## 7. Time of Silence

Time of Silence doit agir seulement pendant Voice recording.

Il ne doit pas agir pendant Thinking ou Read aloud.

## 8. Sécurité

L’extension doit invalider les anciens timers et anciens jobs async quand :

- Flow est mis sur Off ;
- un toggle change ;
- un nouveau message est envoyé ;
- un nouveau cycle commence ;
- Next est cliqué ;
- le widget est masqué ou désactivé.

## 9. Critères d’acceptation

La version est acceptable si :

- rien ne démarre quand Flow est Off ;
- Start transcription ne démarre pas quand il est sur No ;
- Start transcription ne démarre pas pendant Thinking ;
- Start transcription ne démarre pas pendant Read aloud ;
- Next pendant Read aloud stoppe d’abord la lecture ;
- le widget ne disparaît pas au clic ;
- les versions sont cohérentes dans tous les fichiers.
