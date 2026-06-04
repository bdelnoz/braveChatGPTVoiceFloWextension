<!--
Document: WORKFLOW.md
Projet: ChatGPT Voice Flow
Auteur: Bruno DELNOZ
Email: bruno.delnoz@protonmail.com
Version document: v1.0.2
Version extension: v8.5
Date: 2026-06-04
Langue: Français
-->

# Workflow de ChatGPT Voice Flow

## 1. Flux complet prévu

Le flux complet prévu est :

1. l’utilisateur démarre l’enregistrement vocal ;
2. l’utilisateur parle ;
3. Time of Silence peut détecter la fin de parole ;
4. l’extension valide la transcription vocale ;
5. ChatGPT transforme l’audio en texte ;
6. Send transcription envoie le message ;
7. ChatGPT passe en phase Thinking ;
8. ChatGPT prépare la réponse ;
9. Read aloud peut être lancé ;
10. ChatGPT lit la réponse ;
11. Start transcription peut relancer une nouvelle prise de parole.

## 2. États visibles utiles

Les vrais états utiles sont :

- Voice recording ;
- Transcribing ;
- Thinking ;
- Read aloud ;
- Idle.

## 3. Actions internes

Certaines actions sont trop courtes pour être de vrais états affichés.

Exemples :

- validation de la transcription ;
- clic sur Send ;
- ouverture du menu Read aloud ;
- clic sur Stop Read aloud ;
- redémarrage du micro.

## 4. Règle Thinking

Après Send transcription, l’extension doit considérer que le flux est en état Thinking.

Thinking veut dire :

- ChatGPT réfléchit ;
- ChatGPT génère ;
- la réponse n’est pas encore prête ;
- Read aloud n’a pas encore réellement commencé.

## 5. Règle Read aloud

Read aloud commence seulement quand ChatGPT lit vraiment la réponse.

Pendant Read aloud :

- il ne faut pas redémarrer la transcription ;
- il ne faut pas enregistrer la voix de ChatGPT ;
- le bouton Next doit d’abord stopper Read aloud.

## 6. Règle Next

Pendant Thinking :

- Next peut ignorer l’attente et passer à la suite si c’est autorisé.

Pendant Read aloud :

- Next doit stopper Read aloud ;
- si l’arrêt n’est pas confirmé, il ne doit pas lancer la transcription.

Pendant Voice recording :

- Next peut valider la transcription si possible.

Pendant un état inconnu :

- Next ne doit rien faire de dangereux.

## 7. Bug principal à éviter

Le bug principal à éviter est :

ChatGPT lit sa réponse pendant que le micro est relancé.

Dans ce cas, ChatGPT peut enregistrer sa propre voix.

C’est le bug serpent qui se mord la queue, version haut-parleur et micro.

## 8. Règle de sécurité

Si l’état est incertain, l’extension doit préférer ne rien faire.

Mieux vaut rater une automatisation que déclencher une transcription au mauvais moment.
