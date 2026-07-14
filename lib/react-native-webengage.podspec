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
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end

  if ENV['WEBENGAGE_USE_SPM'] == 'true' && respond_to?(:spm_dependency, true)
    spm_dependency(s,
      url: 'https://github.com/WebEngage/webengage-ios-sdk.git',
      requirement: { kind: 'upToNextMajorVersion', minimumVersion: '2.0.0' },
      products: ['WebEngageCore']
    )
  else
    if ENV['WEBENGAGE_USE_CORE'] == 'true'
      s.dependency 'WebEngage/Core', '>= 6.16.6'
    else
      s.dependency 'WebEngage', '>= 6.16.6'
    end
  end
end
