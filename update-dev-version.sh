#!/usr/bin/env bash
# ============================================================================
# PATH         : ./update-dev-version.sh
# SCRIPT NAME  : update-dev-version.sh
# AUTHOR       : Bruno DELNOZ
# EMAIL        : bruno.delnoz@protonmail.com
# TARGET USAGE : Fast local updater and Native Messaging installer for ChatGPT Voice Flow dev builds
# VERSION      : v11.3.0
# DATE         : 2026-06-06 04:55
# ============================================================================
# CHANGELOG:
#   v11.3.0 - 2026-06-06 04:55 - Bruno DELNOZ
#       Changed:
#       - Version synchronization for mini button widget package.
#   v11.2.0 - 2026-06-05 14:35 - Bruno DELNOZ
#       Added:
#       - Added --install-native-host for Brave Native Messaging developer updater.
#       - Added --native-status and --native-uninstall.
#       - Added optional copy of .dev-toolkit from future ZIP packages.
#       - Keeps AGENTS.md, CLAUDE.md, .git, .zip and .old out of scope.
#   v11.1.0 - 2026-06-05 13:20 - Bruno DELNOZ
#       Changed:
#       - Version sync for Developer Mode ON/OFF package.
#   v11.0.0 - 2026-06-05 12:15 - Bruno DELNOZ
#       Added:
#       - First fast local updater for ZIP packages downloaded into ./.zip.
#       - Validates manifest.json before replacing repository runtime files.
#       - Creates timestamped backup under ./.old before overwrite.
#       - Refuses AGENTS.md / CLAUDE.md package content.
#       - Supports --latest, --package, --repo, --dry-run and --help.
# ============================================================================

set -Eeuo pipefail

SCRIPT_VERSION="11.3.0"
DEFAULT_REPO_DIR="/mnt/data2_78g/Security/scripts/Projects_web/braveChatGPTVoiceFloWextension"
NATIVE_HOST_NAME="be.noxoz.voiceflow.dev_updater"
BRAVE_NATIVE_HOST_DIR="${HOME}/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts"
BRAVE_PROFILES_ROOT="${HOME}/.config/BraveSoftware/Brave-Browser"

REPO_DIR=""
PACKAGE=""
USE_LATEST=0
DRY_RUN=0
INSTALL_NATIVE_HOST=0
NATIVE_STATUS=0
NATIVE_UNINSTALL=0
EXTENSION_ID=""

print_help() {
    cat <<'EOF'
update-dev-version.sh - fast updater for ChatGPT Voice Flow dev ZIPs

USAGE:
  ./update-dev-version.sh --latest
  ./update-dev-version.sh --package ./.zip/braveChatGPTVoiceFlow_runtime_v11.2.0_native_update_dev.zip
  ./update-dev-version.sh --install-native-host
  ./update-dev-version.sh --install-native-host --extension-id <brave_extension_id>
  ./update-dev-version.sh --native-status
  ./update-dev-version.sh --native-uninstall
  ./update-dev-version.sh --dry-run --latest

DEV FLOW:
  1. Put new runtime ZIP in ./.zip/
  2. Click the widget "Update" button
  3. Native host runs ./update-dev-version.sh --latest
  4. Extension reloads and open ChatGPT tabs are refreshed

FIRST NATIVE HOST SETUP:
  ./update-dev-version.sh --install-native-host

NOTES:
  - Install native host once after loading the unpacked extension in Brave.
  - The installer auto-detects the extension ID from Brave Preferences when possible.
  - If detection fails, pass --extension-id manually.
EOF
}

fail() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

log() {
    printf '[update-dev-version] %s\n' "$*"
}

if [[ $# -eq 0 ]]; then
    print_help
    exit 0
fi

while (($#)); do
    case "$1" in
        --repo)
            shift
            [[ $# -gt 0 ]] || fail "--repo needs a path"
            REPO_DIR="$1"
            ;;
        --package)
            shift
            [[ $# -gt 0 ]] || fail "--package needs a ZIP path"
            PACKAGE="$1"
            ;;
        --latest)
            USE_LATEST=1
            ;;
        --dry-run|--simulate)
            DRY_RUN=1
            ;;
        --install-native-host)
            INSTALL_NATIVE_HOST=1
            ;;
        --native-status)
            NATIVE_STATUS=1
            ;;
        --native-uninstall)
            NATIVE_UNINSTALL=1
            ;;
        --extension-id)
            shift
            [[ $# -gt 0 ]] || fail "--extension-id needs a value"
            EXTENSION_ID="$1"
            ;;
        --help|-h)
            print_help
            exit 0
            ;;
        *)
            fail "Unknown argument: $1"
            ;;
    esac
    shift
done

resolve_repo_dir() {
    if [[ -z "$REPO_DIR" ]]; then
        if [[ -f "./manifest.json" && -f "./content-autosend.js" ]]; then
            REPO_DIR="$(pwd)"
        elif [[ -d "$DEFAULT_REPO_DIR" ]]; then
            REPO_DIR="$DEFAULT_REPO_DIR"
        else
            fail "Run from the repo root or pass --repo /path/to/repo"
        fi
    fi

    [[ -d "$REPO_DIR" ]] || fail "Repo directory does not exist: $REPO_DIR"
    [[ -f "$REPO_DIR/manifest.json" ]] || fail "manifest.json not found in repo: $REPO_DIR"
    [[ -f "$REPO_DIR/content-autosend.js" ]] || fail "content-autosend.js not found in repo: $REPO_DIR"
}

detect_extension_id() {
    if [[ -n "$EXTENSION_ID" ]]; then
        printf '%s\n' "$EXTENSION_ID"
        return 0
    fi

    command -v python3 >/dev/null 2>&1 || fail "python3 command not found"

    REPO_DIR_FOR_PY="$REPO_DIR" BRAVE_PROFILES_ROOT_FOR_PY="$BRAVE_PROFILES_ROOT" python3 - <<'PY'
import json
import os
import pathlib
import sys

repo = pathlib.Path(os.environ["REPO_DIR_FOR_PY"]).resolve()
root = pathlib.Path(os.environ["BRAVE_PROFILES_ROOT_FOR_PY"]).expanduser()

matches = []
for pref in root.glob("*/Preferences"):
    try:
        data = json.loads(pref.read_text(encoding="utf-8"))
    except Exception:
        continue

    settings = data.get("extensions", {}).get("settings", {})
    for ext_id, cfg in settings.items():
        path = cfg.get("path")
        if not path:
            continue
        try:
            if pathlib.Path(path).expanduser().resolve() == repo:
                matches.append(ext_id)
        except Exception:
            continue

if len(matches) == 1:
    print(matches[0])
    sys.exit(0)

if len(matches) > 1:
    print(matches[0])
    sys.exit(0)

sys.exit(2)
PY
}

write_native_host_files() {
    resolve_repo_dir

    local toolkit_dir="$REPO_DIR/.dev-toolkit/native-host"
    local host_script="$toolkit_dir/voiceflow-dev-updater-host.py"
    local host_manifest="$BRAVE_NATIVE_HOST_DIR/${NATIVE_HOST_NAME}.json"
    local detected_id

    detected_id="$(detect_extension_id)" || fail "Could not auto-detect Brave extension ID. Open brave://extensions/ and rerun with --extension-id <id>"

    mkdir -p "$toolkit_dir" "$BRAVE_NATIVE_HOST_DIR"

    cat > "$host_script" <<'PYHOST'
#!/usr/bin/env python3
import json
import pathlib
import struct
import subprocess
import sys

REPO_DIR = pathlib.Path("__REPO_DIR__")
UPDATE_SCRIPT = REPO_DIR / "update-dev-version.sh"

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        return None
    if len(raw_length) != 4:
        raise RuntimeError("Invalid native message length header")
    length = struct.unpack("<I", raw_length)[0]
    if length > 1024 * 1024:
        raise RuntimeError("Native message too large")
    payload = sys.stdin.buffer.read(length)
    if len(payload) != length:
        raise RuntimeError("Incomplete native message")
    return json.loads(payload.decode("utf-8"))

def send_message(message):
    encoded = json.dumps(message, ensure_ascii=False).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def main():
    try:
        message = read_message() or {}
        action = message.get("action", "updateLatest")

        if action != "updateLatest":
            send_message({"ok": False, "error": f"Unsupported action: {action}"})
            return

        if not UPDATE_SCRIPT.exists():
            send_message({"ok": False, "error": f"Update script not found: {UPDATE_SCRIPT}"})
            return

        result = subprocess.run(
            [str(UPDATE_SCRIPT), "--repo", str(REPO_DIR), "--latest"],
            text=True,
            capture_output=True,
            timeout=240,
            cwd=str(REPO_DIR),
        )

        version = "UNKNOWN"
        manifest = REPO_DIR / "manifest.json"
        if manifest.exists():
            try:
                version = json.loads(manifest.read_text(encoding="utf-8")).get("version", "UNKNOWN")
            except Exception:
                pass

        send_message({
            "ok": result.returncode == 0,
            "returncode": result.returncode,
            "version": version,
            "stdout": result.stdout[-8000:],
            "stderr": result.stderr[-8000:],
        })
    except Exception as exc:
        send_message({"ok": False, "error": str(exc)})

if __name__ == "__main__":
    main()
PYHOST

    python3 - "$host_script" "$REPO_DIR" <<'PYEDIT'
import pathlib
import sys
path = pathlib.Path(sys.argv[1])
repo = sys.argv[2]
text = path.read_text(encoding="utf-8").replace("__REPO_DIR__", repo)
path.write_text(text, encoding="utf-8")
PYEDIT

    chmod +x "$host_script"

    cat > "$host_manifest" <<EOFHOST
{
  "name": "$NATIVE_HOST_NAME",
  "description": "ChatGPT Voice Flow local developer updater",
  "path": "$host_script",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$detected_id/"
  ]
}
EOFHOST

    log "Native host installed: $host_manifest"
    log "Native host script: $host_script"
    log "Allowed extension ID: $detected_id"
}

native_status() {
    resolve_repo_dir
    local host_manifest="$BRAVE_NATIVE_HOST_DIR/${NATIVE_HOST_NAME}.json"
    local host_script="$REPO_DIR/.dev-toolkit/native-host/voiceflow-dev-updater-host.py"

    log "Repo: $REPO_DIR"
    if [[ -f "$host_manifest" ]]; then
        log "Native manifest: OK - $host_manifest"
    else
        log "Native manifest: MISSING - $host_manifest"
    fi

    if [[ -x "$host_script" ]]; then
        log "Native host script: OK - $host_script"
    else
        log "Native host script: MISSING or not executable - $host_script"
    fi
}

native_uninstall() {
    local host_manifest="$BRAVE_NATIVE_HOST_DIR/${NATIVE_HOST_NAME}.json"
    rm -f "$host_manifest"
    log "Native manifest removed: $host_manifest"
    log "Local .dev-toolkit files were left in place."
}

if [[ "$INSTALL_NATIVE_HOST" -eq 1 ]]; then
    write_native_host_files
    exit 0
fi

if [[ "$NATIVE_STATUS" -eq 1 ]]; then
    native_status
    exit 0
fi

if [[ "$NATIVE_UNINSTALL" -eq 1 ]]; then
    native_uninstall
    exit 0
fi

resolve_repo_dir

ZIP_DIR="$REPO_DIR/.zip"
OLD_DIR="$REPO_DIR/.old"
mkdir -p "$ZIP_DIR" "$OLD_DIR"

if [[ "$USE_LATEST" -eq 1 ]]; then
    mapfile -t zip_candidates < <(find "$ZIP_DIR" -maxdepth 1 -type f -name 'braveChatGPTVoiceFlow_runtime_v*.zip' -printf '%f\n' | sort -V)
    [[ ${#zip_candidates[@]} -gt 0 ]] || fail "No braveChatGPTVoiceFlow runtime ZIP found in $ZIP_DIR"
    PACKAGE="$ZIP_DIR/${zip_candidates[-1]}"
fi

[[ -n "$PACKAGE" ]] || { print_help; exit 0; }
[[ -f "$PACKAGE" ]] || fail "Package not found: $PACKAGE"

command -v unzip >/dev/null 2>&1 || fail "unzip command not found"
command -v python3 >/dev/null 2>&1 || fail "python3 command not found"

TMP_DIR="$(mktemp -d /tmp/cgvf-update.XXXXXXXXXX)"
cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

log "Repo: $REPO_DIR"
log "Package: $PACKAGE"

unzip -q "$PACKAGE" -d "$TMP_DIR/pkg"

if find "$TMP_DIR/pkg" \( -name 'AGENTS.md' -o -name 'CLAUDE.md' \) | grep -q .; then
    fail "Package contains AGENTS.md or CLAUDE.md; refusing"
fi

PKG_ROOT="$TMP_DIR/pkg"
if [[ ! -f "$PKG_ROOT/manifest.json" ]]; then
    first_dir="$(find "$TMP_DIR/pkg" -mindepth 1 -maxdepth 1 -type d | head -n 1 || true)"
    if [[ -n "$first_dir" && -f "$first_dir/manifest.json" ]]; then
        PKG_ROOT="$first_dir"
    fi
fi

[[ -f "$PKG_ROOT/manifest.json" ]] || fail "manifest.json not found in package"
[[ -f "$PKG_ROOT/content-autosend.js" ]] || fail "content-autosend.js not found in package"
[[ -f "$PKG_ROOT/background.js" ]] || fail "background.js not found in package"
[[ -f "$PKG_ROOT/autosend-style.css" ]] || fail "autosend-style.css not found in package"

PKG_VERSION="$(PKG_ROOT_FOR_PY="$PKG_ROOT" python3 - <<'PYJSON'
import json, os, pathlib
p = pathlib.Path(os.environ['PKG_ROOT_FOR_PY']) / 'manifest.json'
data = json.loads(p.read_text(encoding='utf-8'))
print(data.get('version', 'UNKNOWN'))
PYJSON
)"
[[ "$PKG_VERSION" != "UNKNOWN" ]] || fail "Package manifest has no version"

log "Package version: $PKG_VERSION"

FILES=(
  manifest.json
  background.js
  content-autosend.js
  autosend-style.css
  README.md
  SPECIFICATIONS_GLOBAL.md
  CHANGELOG.md
  update-dev-version.sh
)

BACKUP_DIR="$OLD_DIR/backup_before_v${PKG_VERSION}_$(date +%Y-%m-%d_%H%M%S)"

if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY RUN: would create backup: $BACKUP_DIR"
else
    mkdir -p "$BACKUP_DIR"
fi

for rel in "${FILES[@]}"; do
    if [[ -f "$PKG_ROOT/$rel" ]]; then
        if [[ -f "$REPO_DIR/$rel" ]]; then
            if [[ "$DRY_RUN" -eq 1 ]]; then
                log "DRY RUN: would backup $rel"
            else
                mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
                cp -a "$REPO_DIR/$rel" "$BACKUP_DIR/$rel"
            fi
        fi
        if [[ "$DRY_RUN" -eq 1 ]]; then
            log "DRY RUN: would install $rel"
        else
            cp -a "$PKG_ROOT/$rel" "$REPO_DIR/$rel"
        fi
    fi
done

if [[ -d "$PKG_ROOT/icons" ]]; then
    if [[ "$DRY_RUN" -eq 1 ]]; then
        log "DRY RUN: would backup/install icons/"
    else
        mkdir -p "$BACKUP_DIR/icons" "$REPO_DIR/icons"
        find "$REPO_DIR/icons" -maxdepth 1 -type f -exec cp -a {} "$BACKUP_DIR/icons/" \;
        cp -a "$PKG_ROOT/icons/." "$REPO_DIR/icons/"
    fi
fi

if [[ -d "$PKG_ROOT/.dev-toolkit" ]]; then
    if [[ "$DRY_RUN" -eq 1 ]]; then
        log "DRY RUN: would install .dev-toolkit/"
    else
        mkdir -p "$REPO_DIR/.dev-toolkit"
        cp -a "$PKG_ROOT/.dev-toolkit/." "$REPO_DIR/.dev-toolkit/"
    fi
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY RUN complete. No files changed."
else
    chmod +x "$REPO_DIR/update-dev-version.sh" || true
    find "$REPO_DIR/.dev-toolkit" -type f -name '*.sh' -exec chmod +x {} \; 2>/dev/null || true
    find "$REPO_DIR/.dev-toolkit" -type f -name '*.py' -exec chmod +x {} \; 2>/dev/null || true
    log "Updated repo to package version $PKG_VERSION"
    log "Backup created: $BACKUP_DIR"
    log "Next first-time native setup: ./update-dev-version.sh --install-native-host"
    log "Future updates: download ZIP into ./.zip then click Update in Developer Mode."
fi
