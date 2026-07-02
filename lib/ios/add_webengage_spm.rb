#!/usr/bin/env ruby
# Automatically adds the WebEngage iOS SDK (WebEngageCore) as an SPM dependency.
#
# Usage in Podfile (single line - no need to call in post_install):
#   require_relative '../node_modules/react-native-webengage/ios/add_webengage_spm'

begin
  require 'xcodeproj'
rescue LoadError
  raise "[react-native-webengage] The 'xcodeproj' gem is required. Run: sudo gem install xcodeproj"
end

WEBENGAGE_REPO_URL = defined?(WEBENGAGE_REPO_URL) ? WEBENGAGE_REPO_URL : 'https://github.com/WebEngage/webengage-ios-sdk'
WEBENGAGE_MIN_VERSION = defined?(WEBENGAGE_MIN_VERSION) ? WEBENGAGE_MIN_VERSION : '2.0.0'
WEBENGAGE_PRODUCT_NAME = defined?(WEBENGAGE_PRODUCT_NAME) ? WEBENGAGE_PRODUCT_NAME : 'WebEngageCore'

def add_webengage_spm(installer, options = {})
  repo_url = options[:repo_url] || WEBENGAGE_REPO_URL
  min_version = options[:min_version] || WEBENGAGE_MIN_VERSION
  product_name = options[:product_name] || WEBENGAGE_PRODUCT_NAME

  project = nil
  installer.aggregate_targets.each do |target|
    if target.user_project
      project = target.user_project
      break
    end
  end

  unless project
    puts "[react-native-webengage] Could not find user Xcode project, skipping SPM setup."
    return
  end

  project_modified = false

  pkg_ref = project.root_object.package_references.find { |ref| ref.repositoryURL == repo_url }
  if pkg_ref
    puts "[react-native-webengage] WebEngage SPM package reference already present."
  else
    pkg_ref = project.new(Xcodeproj::Project::Object::XCRemoteSwiftPackageReference)
    pkg_ref.repositoryURL = repo_url
    pkg_ref.requirement = { 'kind' => 'upToNextMajorVersion', 'minimumVersion' => min_version }
    project.root_object.package_references << pkg_ref
    puts "[react-native-webengage] Added WebEngage SPM package reference (>= #{min_version})."
    project_modified = true
  end

  app_target = project.targets.find { |t| t.product_type == 'com.apple.product-type.application' }
  unless app_target
    puts "[react-native-webengage] Could not find application target, skipping SPM product setup."
    return
  end

  existing = app_target.package_product_dependencies.any? { |d| d.product_name == product_name }
  unless existing
    dep = project.new(Xcodeproj::Project::Object::XCSwiftPackageProductDependency)
    dep.package = pkg_ref
    dep.product_name = product_name
    app_target.package_product_dependencies << dep
    puts "[react-native-webengage] Added SPM product: #{product_name}"
    project_modified = true
  end

  # only save if something actually changed
  project.save if project_modified
end

# Auto-register into CocoaPods post_install hook
Pod::HooksManager.register('react-native-webengage', :post_install) do |installer|
  add_webengage_spm(installer)
end
