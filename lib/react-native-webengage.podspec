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
  s.module_name    = 'WebEngageReact' 
  s.platform       = :ios, '11.0'

  s.preserve_paths = 'LICENSE.md', 'README.md', 'package.json', 'src/**/*', 'types/**/*'
  s.source_files   = 'ios/WebEngageReact/*.{h,m,mm}'

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end

  if ENV['WEBENGAGE_USE_CORE'] == 'true'
    s.dependency 'WebEngage/Core','>= 6.16.6'
  else
    s.dependency 'WebEngage','>= 6.16.6'
  end

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.compiler_flags = '-DRCT_NEW_ARCH_ENABLED=1'
    s.pod_target_xcconfig = {
      'DEFINES_MODULE' => 'YES',
      'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) COCOAPODS=1 RCT_NEW_ARCH_ENABLED=1',
      "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
      "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    
    s.dependency 'React-Codegen'
    s.dependency 'RCT-Folly'
    s.dependency 'RCTRequired'
    s.dependency 'RCTTypeSafety'
    s.dependency 'ReactCommon/turbomodule/core'
  end
end
