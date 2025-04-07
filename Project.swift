// Xcode project configuration for macOS deployment
// Investigation Case Management Application

import ProjectDescription

let projectName = "InvestigationCaseManager"
let organizationName = "Investigation Solutions"
let bundleId = "com.investigationsolutions.casemanager"
let version = "1.0.0"
let deploymentTarget = DeploymentTarget.macOS(targetVersion: "12.0")

let project = Project(
    name: projectName,
    organizationName: organizationName,
    options: .options(
        automaticSchemesOptions: .disabled,
        disableBundleAccessors: false,
        disableSynthesizedResourceAccessors: false,
        textSettings: .textSettings(
            usesTabs: false,
            indentWidth: 4,
            tabWidth: 4,
            wrapsLines: true
        )
    ),
    packages: [
        .remote(url: "https://github.com/vapor/postgres-kit.git", requirement: .upToNextMajor(from: "2.0.0")),
        .remote(url: "https://github.com/apple/swift-argument-parser", requirement: .upToNextMajor(from: "1.0.0")),
        .remote(url: "https://github.com/apple/swift-log.git", requirement: .upToNextMajor(from: "1.0.0")),
        .remote(url: "https://github.com/apple/swift-crypto.git", requirement: .upToNextMajor(from: "2.0.0")),
        .remote(url: "https://github.com/apple/swift-collections.git", requirement: .upToNextMajor(from: "1.0.0")),
        .remote(url: "https://github.com/apple/swift-algorithms", requirement: .upToNextMajor(from: "1.0.0")),
        .remote(url: "https://github.com/apple/swift-nio.git", requirement: .upToNextMajor(from: "2.0.0")),
        .remote(url: "https://github.com/pointfreeco/swift-composable-architecture", requirement: .upToNextMajor(from: "1.0.0")),
        .remote(url: "https://github.com/realm/realm-swift.git", requirement: .upToNextMajor(from: "10.0.0")),
        .remote(url: "https://github.com/groue/GRDB.swift.git", requirement: .upToNextMajor(from: "6.0.0")),
        .remote(url: "https://github.com/Alamofire/Alamofire.git", requirement: .upToNextMajor(from: "5.0.0")),
        .remote(url: "https://github.com/onevcat/Kingfisher.git", requirement: .upToNextMajor(from: "7.0.0")),
        .remote(url: "https://github.com/danielgindi/Charts.git", requirement: .upToNextMajor(from: "4.0.0")),
    ],
    settings: .settings(
        base: [
            "MACOSX_DEPLOYMENT_TARGET": "12.0",
            "SWIFT_VERSION": "5.7",
            "PRODUCT_BUNDLE_IDENTIFIER": bundleId,
            "MARKETING_VERSION": version,
            "CURRENT_PROJECT_VERSION": "1",
            "CODE_SIGN_IDENTITY": "Apple Development",
            "CODE_SIGN_STYLE": "Automatic",
            "DEVELOPMENT_TEAM": "XXXXXXXXXX", // Replace with actual development team ID
            "ENABLE_HARDENED_RUNTIME": "YES",
            "SWIFT_STRICT_CONCURRENCY": "complete",
            "SWIFT_OPTIMIZATION_LEVEL": "-O",
            "SWIFT_COMPILATION_MODE": "wholemodule",
            "GCC_OPTIMIZATION_LEVEL": "s",
            "DEAD_CODE_STRIPPING": "YES",
            "CLANG_ENABLE_MODULES": "YES",
            "CLANG_ENABLE_OBJC_ARC": "YES",
            "ENABLE_NS_ASSERTIONS": "NO",
            "ENABLE_TESTABILITY": "YES",
            "COPY_PHASE_STRIP": "NO",
            "ALWAYS_SEARCH_USER_PATHS": "NO",
        ],
        configurations: [
            .debug(name: "Debug", settings: [
                "SWIFT_OPTIMIZATION_LEVEL": "-Onone",
                "SWIFT_COMPILATION_MODE": "singlefile",
                "GCC_OPTIMIZATION_LEVEL": "0",
                "ENABLE_NS_ASSERTIONS": "YES",
                "ONLY_ACTIVE_ARCH": "YES",
                "DEBUG_INFORMATION_FORMAT": "dwarf",
                "SWIFT_ACTIVE_COMPILATION_CONDITIONS": "DEBUG",
                "GCC_PREPROCESSOR_DEFINITIONS": ["DEBUG=1", "$(inherited)"],
            ]),
            .release(name: "Release", settings: [
                "DEBUG_INFORMATION_FORMAT": "dwarf-with-dsym",
                "VALIDATE_PRODUCT": "YES",
            ]),
        ]
    ),
    targets: [
        Target(
            name: projectName,
            platform: .macOS,
            product: .app,
            bundleId: bundleId,
            deploymentTarget: deploymentTarget,
            infoPlist: .extendingDefault(with: [
                "CFBundleName": "$(PRODUCT_NAME)",
                "CFBundleDisplayName": "Investigation Case Manager",
                "CFBundleShortVersionString": "$(MARKETING_VERSION)",
                "CFBundleVersion": "$(CURRENT_PROJECT_VERSION)",
                "LSMinimumSystemVersion": "$(MACOSX_DEPLOYMENT_TARGET)",
                "LSApplicationCategoryType": "public.app-category.productivity",
                "NSHumanReadableCopyright": "Copyright © 2025 Investigation Solutions. All rights reserved.",
                "NSPrincipalClass": "NSApplication",
                "NSMainStoryboardFile": "Main",
                "NSAppTransportSecurity": [
                    "NSAllowsArbitraryLoads": false,
                ],
                "NSCameraUsageDescription": "This app requires camera access to scan documents and capture evidence photos.",
                "NSMicrophoneUsageDescription": "This app requires microphone access to record audio evidence.",
                "NSPhotoLibraryUsageDescription": "This app requires photo library access to import evidence photos.",
            ]),
            sources: ["Sources/**"],
            resources: ["Resources/**"],
            dependencies: [
                .package(product: "PostgresKit"),
                .package(product: "Logging"),
                .package(product: "Crypto"),
                .package(product: "Collections"),
                .package(product: "Algorithms"),
                .package(product: "NIO"),
                .package(product: "ComposableArchitecture"),
                .package(product: "RealmSwift"),
                .package(product: "GRDB"),
                .package(product: "Alamofire"),
                .package(product: "Kingfisher"),
                .package(product: "Charts"),
            ],
            settings: .settings(base: [:])
        ),
        Target(
            name: "\(projectName)Tests",
            platform: .macOS,
            product: .unitTests,
            bundleId: "\(bundleId).tests",
            deploymentTarget: deploymentTarget,
            infoPlist: .default,
            sources: ["Tests/**"],
            dependencies: [
                .target(name: projectName),
            ],
            settings: .settings(base: [:])
        ),
    ],
    schemes: [
        Scheme(
            name: projectName,
            shared: true,
            buildAction: .buildAction(targets: ["\(projectName)"]),
            testAction: .targets(["\(projectName)Tests"]),
            runAction: .runAction(configuration: "Debug"),
            archiveAction: .archiveAction(configuration: "Release"),
            profileAction: .profileAction(configuration: "Release"),
            analyzeAction: .analyzeAction(configuration: "Debug")
        ),
    ]
)
