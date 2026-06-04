#!/usr/bin/env bash
set -u

printf '\n'
printf '============================================================\n'
printf ' ChatGPT Voice Flow - aide installation Brave / Chromium\n'
printf '============================================================\n'
printf '\n'

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

printf 'Dossier de cette extension :\n'
printf '  %s\n\n' "$HERE"

if [ ! -f "$HERE/manifest.json" ]; then
  printf 'ERREUR : manifest.json introuvable dans ce dossier.\n'
  printf 'Sélectionne le dossier qui contient directement manifest.json.\n'
  exit 1
fi

printf 'Fichiers runtime détectés :\n'
for f in manifest.json background.js content-autosend.js autosend-style.css; do
  if [ -e "$HERE/$f" ]; then
    printf '  OK  %s\n' "$f"
  else
    printf '  KO  %s manquant\n' "$f"
  fi
done

if [ -d "$HERE/icons" ]; then
  printf '  OK  icons/\n'
else
  printf '  KO  icons/ manquant\n'
fi

printf '\n'
printf 'Installation manuelle dans Brave :\n'
printf '  1. Ouvre Brave.\n'
printf '  2. Va dans : brave://extensions/\n'
printf '  3. Active le Mode développeur.\n'
printf '  4. Clique sur Load unpacked / Charger l extension non empaquetée.\n'
printf '  5. Sélectionne ce dossier :\n'
printf '     %s\n' "$HERE"
printf '  6. Ouvre ChatGPT Web.\n'
printf '  7. Clique sur l icône ChatGPT Voice Flow.\n'
printf '\n'

printf 'Note : ce script ne peut pas charger automatiquement une extension dans Brave.\n'
printf 'Brave impose le chargement manuel via brave://extensions/.\n'
printf '\n'

printf 'Terminé.\n'
printf '============================================================\n'
