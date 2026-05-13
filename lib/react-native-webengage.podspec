require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = package['name']
  s.version        = package['version']
  s.summary        = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.source         = { :git => 'https://github.com/WebEngage/react-native-webengage.git', :tag => s.version }

  s.requires_arc   = true
  s.module_name    = 'webengageBridge' 
  s.platform       = :ios, '13.0'

  s.preserve_paths = 'LICENSE.md', 'README.md', 'package.json', 'index.js'
  s.source_files   = 'ios/*.{h,m}'

  s.dependency 'React-Core'

  # WebEngage native SDK is now provided via Swift Package Manager (SPM).
  # Add the WebEngage SPM package in your Xcode project:
  #   URL: https://github.com/WebEngage/webengage-ios-sdk

  # Allow the bridge code to find SPM-provided WebEngage framework headers
  s.pod_target_xcconfig = {
    'FRAMEWORK_SEARCH_PATHS' => '"$(PODS_CONFIGURATION_BUILD_DIR)"',
    'HEADER_SEARCH_PATHS' => '"$(PODS_CONFIGURATION_BUILD_DIR)/WebEngage.framework/Headers"',
    'OTHER_LDFLAGS' => '-framework WebEngage'
  }
end
