// swift-tools-version: 6.2
// Package manifest for the Panda macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Panda",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "PandaIPC", targets: ["PandaIPC"]),
        .library(name: "PandaDiscovery", targets: ["PandaDiscovery"]),
        .executable(name: "Panda", targets: ["Panda"]),
        .executable(name: "panda-mac", targets: ["PandaMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/PandaKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "PandaIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "PandaDiscovery",
            dependencies: [
                .product(name: "PandaKit", package: "PandaKit"),
            ],
            path: "Sources/PandaDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Panda",
            dependencies: [
                "PandaIPC",
                "PandaDiscovery",
                .product(name: "PandaKit", package: "PandaKit"),
                .product(name: "PandaChatUI", package: "PandaKit"),
                .product(name: "PandaProtocol", package: "PandaKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            path: "Sources/Panda",
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Panda.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "PandaMacCLI",
            dependencies: [
                "PandaDiscovery",
                .product(name: "PandaKit", package: "PandaKit"),
                .product(name: "PandaProtocol", package: "PandaKit"),
            ],
            path: "Sources/PandaMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "PandaIPCTests",
            dependencies: [
                "PandaIPC",
                "Panda",
                "PandaDiscovery",
                .product(name: "PandaProtocol", package: "PandaKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            path: "Tests/PandaIPCTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
