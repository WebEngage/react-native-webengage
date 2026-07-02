require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = package['name']
  s.version        = package['version']
  s.summary        = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.source         = { :git => package['repository']['url'].gsub('git+', ''), :tag => s.version }

  s.requires_arc   = true
  s.module_name    = 'WEGWebEngageBridge' 
  s.platform       = :ios, '11.0'

  s.preserve_paths = 'LICENSE.md', 'README.md', 'package.json', 'src/**/*', 'types/**/*'
  s.source_files   = 'ios/WEGWebEngageBridge/*.{h,m,mm}'
  s.public_header_files = 'ios/WEGWebEngageBridge/WEGWebEngageBridge.h'

  # WebEngage native SDK is provided via Swift Package Manager (SPM).
  # URL: https://github.com/WebEngage/webengage-ios-sdk
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'FRAMEWORK_SEARCH_PATHS' => '"$(PODS_CONFIGURATION_BUILD_DIR)"',
    'HEADER_SEARCH_PATHS' => '"$(PODS_CONFIGURATION_BUILD_DIR)/WebEngageCore.framework/Headers"',
    'OTHER_LDFLAGS' => '-framework WebEngageCore'
  }

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end

end
