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
  s.platform       = :ios, '10.0'

  s.preserve_paths = 'LICENSE.md', 'README.md', 'package.json', 'index.js'
  s.source_files   = 'ios/*.{h,m}'

  if ENV['WEBENGAGE_USE_CORE'] == 'true'
    s.dependency 'WebEngage/Core','>= 6.16.1'
  else
    s.dependency 'WebEngage','>= 6.16.1'
  end
  s.dependency 'React-Core'
end
