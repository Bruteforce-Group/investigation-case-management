// Package configuration for macOS deployment
// Investigation Case Management Application

import PackageDescription
import Foundation

let package = Package(
    name: "InvestigationCaseManager",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .executable(
            name: "InvestigationCaseManager",
            targets: ["InvestigationCaseManager"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/postgres-kit.git", from: "2.0.0"),
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-crypto.git", from: "2.0.0"),
        .package(url: "https://github.com/apple/swift-collections.git", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-algorithms", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-nio.git", from: "2.0.0"),
        .package(url: "https://github.com/apple/swift-http-types.git", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-format.git", from: "0.50700.0"),
        .package(url: "https://github.com/pointfreeco/swift-composable-architecture", from: "1.0.0"),
        .package(url: "https://github.com/realm/realm-swift.git", from: "10.0.0"),
        .package(url: "https://github.com/groue/GRDB.swift.git", from: "6.0.0"),
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.0.0"),
        .package(url: "https://github.com/onevcat/Kingfisher.git", from: "7.0.0"),
        .package(url: "https://github.com/SwiftyJSON/SwiftyJSON.git", from: "5.0.0"),
        .package(url: "https://github.com/danielgindi/Charts.git", from: "4.0.0"),
        .package(url: "https://github.com/Quick/Quick.git", from: "6.0.0"),
        .package(url: "https://github.com/Quick/Nimble.git", from: "12.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "InvestigationCaseManager",
            dependencies: [
                .product(name: "PostgresKit", package: "postgres-kit"),
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Crypto", package: "swift-crypto"),
                .product(name: "Collections", package: "swift-collections"),
                .product(name: "Algorithms", package: "swift-algorithms"),
                .product(name: "NIO", package: "swift-nio"),
                .product(name: "HTTPTypes", package: "swift-http-types"),
                .product(name: "SwiftFormat", package: "swift-format"),
                .product(name: "ComposableArchitecture", package: "swift-composable-architecture"),
                .product(name: "RealmSwift", package: "realm-swift"),
                .product(name: "GRDB", package: "GRDB.swift"),
                .product(name: "Alamofire", package: "Alamofire"),
                .product(name: "Kingfisher", package: "Kingfisher"),
                .product(name: "SwiftyJSON", package: "SwiftyJSON"),
                .product(name: "Charts", package: "Charts"),
            ],
            path: "Sources"
        ),
        .testTarget(
            name: "InvestigationCaseManagerTests",
            dependencies: [
                "InvestigationCaseManager",
                .product(name: "Quick", package: "Quick"),
                .product(name: "Nimble", package: "Nimble"),
            ],
            path: "Tests"
        )
    ]
)
