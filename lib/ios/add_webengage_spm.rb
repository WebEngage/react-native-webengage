#!/usr/bin/env ruby
# Automatically adds the WebEngage iOS SDK (WebEngageCore) as an SPM dependency.
#
# Usage in Podfile (single line - no need to call in post_install):
#   require_relative '../node_modules/react-native-webengage/ios/add_webengage_spm'

require 'xcodeproj'

WEBENGAGE_REPO_URL = 'https://github.com/WebEngage/webengage-ios-sdk'
WEBENGAGE_BRANCH = 'main'
WEBENGAGE_PRODUCT_NAME = 'WebEngageCore'

def add_webengage_spm(installer, options = {})
  repo_url = options[:repo_url] || WEBENGAGE_REPO_URL
  branch = options[:branch] || WEBENGAGE_BRANCH
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

  pkg_ref = project.root_object.package_references.find { |ref| ref.repositoryURL == repo_url }
  if pkg_ref
    puts "[react-native-webengage] WebEngage SPM package reference already present."
  else
    pkg_ref = project.new(Xcodeproj::Project::Object::XCRemoteSwiftPackageReference)
    pkg_ref.repositoryURL = repo_url
    pkg_ref.requirement = { 'kind' => 'branch', 'branch' => branch }
    project.root_object.package_references << pkg_ref
    puts "[react-native-webengage] Added WebEngage SPM package reference (branch: #{branch})."
  end

  app_target = project.targets.find { |t| t.product_type == 'com.apple.product-type.application' }
  if app_target
    existing = app_target.package_product_dependencies.any? { |d| d.product_name == product_name }
    unless existing
      dep = project.new(Xcodeproj::Project::Object::XCSwiftPackageProductDependency)
      dep.package = pkg_ref
      dep.product_name = product_name
      app_target.package_product_dependencies << dep
      puts "[react-native-webengage] Added SPM product: #{product_name}"
    end
  end

  project.save
end

# Auto-register into CocoaPods post_install hook
Pod::HooksManager.register('react-native-webengage', :post_install) do |installer|
  add_webengage_spm(installer)
end
