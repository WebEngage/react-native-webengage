# iOS SDK Setup #

#### Minimum SDK Requirements ####

> Webengage SDK is supported for `iOS7` and above only. We needs the following frameworks to be linked as part of the XCode project(Direct Integration). Specifically:
    1. CoreLocation.framework
    2. SystemConfiguration.framework
    3. -lsqlite3

#### There are two ways of integrating Webengage to your existing/new XCode Project.

#### Cocoapods Integration (Recommended)####

1. Add the below lines to your Podfile
    
    For Xcode 7 and above:

    ```
    target 'WebEngageExample' do
    pod 'WebEngage'
    ```
    For XCode 6:

    ```
    target 'WebEngageExample' do
    pod 'WebEngage/Xcode6'
    ```

Learn about Podfile Specifications [here](https://guides.cocoapods.org/using/the-podfile.html)

#### Direct Integration ####

1. Download the SDK file [here](https://s3-us-west-2.amazonaws.com/webengage-sdk/ios/latest/WebEngageFramework.zip). Extract the downloaded zip file. In the extracted zip there would be two directories - xc6 and xc7. If you are using XCode 6 use the `Webengage.framework` within the `xc6` directory. For Xcode 7 and above use the one in `xc7`. Save the appropriate `Webengage.framework` it in a location on your computer.
    
2. Select the name of the project in the project navigator. The project editor appears in the editor area of the Xcode workspace window. 
    
3. Click on the `General` Tab at the top of project editor.
    
4. In the section `Embedded Libraries` click on `+` button. It will open up the file chooser for your project. Open WebEngage.framework and select `Copy if needed` option. This will copy the framework to your project directory.

5. Below Embedded Libraries, there is `Linked Frameworks and Libraries` click the `+` button and add the following frameworks:
    
    ```
    SystemConfiguration.framework 
    CoreLocation.framework
    ```
![Screenshot](http://docs.webengage.com/sdks/ios/integration/adding_sdk_to_project/frameworks.png) 


6. Go to 'Build Settings' tab on the top of the project editor. Search for `Other Linker Flags` option. 
Add `-lsqlite3` under it.
![Screenshot](http://docs.webengage.com/sdks/ios/integration/adding_sdk_to_project/linker_flags.png)
    
At this point, Webengage SDK integration is complete and your project should build successfully.