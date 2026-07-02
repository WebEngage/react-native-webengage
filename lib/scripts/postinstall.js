#!/usr/bin/env node
/**
 * Post-install script for react-native-webengage
 * Automatically adds WebEngage SPM setup to the iOS Podfile.
 */

const fs = require('fs');
const path = require('path');

const REQUIRE_LINE = "require_relative '../node_modules/react-native-webengage/ios/add_webengage_spm'";
const HOOK_CALL = '    add_webengage_spm(installer)'; // 4-space indent to match Podfile convention

function findPodfile() {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, 'ios', 'Podfile');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function patchPodfile() {
  const podfilePath = findPodfile();
  if (!podfilePath) {
    console.warn('[react-native-webengage] Could not find ios/Podfile. Add the following manually:');
    console.warn(`  ${REQUIRE_LINE}`);
    console.warn(`  ${HOOK_CALL.trim()} (inside post_install block)`);
    return;
  }

  let content = fs.readFileSync(podfilePath, 'utf8');
  let modified = false;

  if (!content.includes('react-native-webengage/ios/add_webengage_spm')) {
    content = REQUIRE_LINE + '\n' + content;
    modified = true;
  }

  if (!content.includes('add_webengage_spm(installer)')) {
    const postInstallRegex = /(post_install\s+do\s+\|installer\|)/g;
    if (postInstallRegex.test(content)) {
      content = content.replace(/(post_install\s+do\s+\|installer\|)/g, `$1\n${HOOK_CALL}`);
      modified = true;
    } else {
      content = content + '\npost_install do |installer|\n' + HOOK_CALL + '\nend\n';
      modified = true;
      console.warn('[react-native-webengage] No post_install block found. Created one at end of Podfile.');
    }
  }

  if (modified) {
    fs.writeFileSync(podfilePath + '.bak', fs.readFileSync(podfilePath));
    fs.writeFileSync(podfilePath, content, 'utf8');
    console.log('[react-native-webengage] ✅ Podfile patched with WebEngage SPM setup.');
  }
}

try {
  patchPodfile();
} catch (e) {
  console.warn('[react-native-webengage] Could not auto-patch Podfile:', e.message);
}
