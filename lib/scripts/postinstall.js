#!/usr/bin/env node
/**
 * Post-install script for react-native-webengage
 * Automatically adds WebEngage SPM setup to the iOS Podfile.
 */

const fs = require('fs');
const path = require('path');

const REQUIRE_LINE = "require_relative '../node_modules/react-native-webengage/ios/add_webengage_spm'";
const HOOK_CALL = '    add_webengage_spm(installer)';

function findPodfile() {
  const projectRoot = path.resolve(__dirname, '..', '..', '..');
  const podfilePath = path.join(projectRoot, 'ios', 'Podfile');
  if (fs.existsSync(podfilePath)) {
    return podfilePath;
  }
  return null;
}

function patchPodfile() {
  const podfilePath = findPodfile();
  if (!podfilePath) {
    return;
  }

  let content = fs.readFileSync(podfilePath, 'utf8');
  let modified = false;

  // Add require_relative if not present
  if (!content.includes('react-native-webengage/ios/add_webengage_spm')) {
    content = REQUIRE_LINE + '\n' + content;
    modified = true;
  }

  // Add add_webengage_spm(installer) in post_install if not present
  if (!content.includes('add_webengage_spm(installer)')) {
    const postInstallRegex = /(post_install\s+do\s+\|installer\|)/;
    if (postInstallRegex.test(content)) {
      content = content.replace(postInstallRegex, `$1\n${HOOK_CALL}`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(podfilePath, content, 'utf8');
    console.log('[react-native-webengage] ✅ Podfile patched with WebEngage SPM setup.');
  }
}

try {
  patchPodfile();
} catch (e) {
  console.warn('[react-native-webengage] Could not auto-patch Podfile:', e.message);
}
