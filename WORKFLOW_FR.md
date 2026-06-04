<!--
Document: WORKFLOW_FR.md
Project: ChatGPT Voice Flow
Version: v8.5
Language: French
-->

# Workflow de ChatGPT Voice Flow

## Flux complet prévu

1. L’utilisateur démarre une transcription vocale dans ChatGPT.
2. L’utilisateur parle.
3. L’extension peut détecter un silence.
4. L’extension valide la transcription vocale.
5. ChatGPT place le texte dans le champ de message.
6. L’extension peut envoyer le message.
7. ChatGPT réfléchit et prépare la réponse.
8. L’extension peut lancer Read aloud.
9. ChatGPT lit la réponse.
10. L’extension peut relancer la transcription.

## États importants

Les états utiles sont :

- enregistrement vocal ;
- transcription ;
- réflexion de ChatGPT ;
- lecture vocale ;
- attente.

## Attention

L’étape “Send transcription” est très courte.

Ce n’est pas vraiment un état long.

C’est plutôt une action interne.

## Problème à éviter

Il ne faut jamais que la transcription redémarre pendant que ChatGPT lit encore sa réponse.

Sinon, le micro peut enregistrer la voix de ChatGPT au lieu de la voix de l’utilisateur.

C’est le bug serpent qui se mord la queue, version micro et haut-parleur.
