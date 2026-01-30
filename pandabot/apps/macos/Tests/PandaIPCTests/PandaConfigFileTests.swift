import Foundation
import Testing
@testable import Panda

@Suite(.serialized)
struct PandaConfigFileTests {
    @Test
    func configPathRespectsEnvOverride() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("panda-config-\(UUID().uuidString)")
            .appendingPathComponent("panda.json")
            .path

        await TestIsolation.withEnvValues(["PANDA_CONFIG_PATH": override]) {
            #expect(PandaConfigFile.url().path == override)
        }
    }

    @MainActor
    @Test
    func remoteGatewayPortParsesAndMatchesHost() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("panda-config-\(UUID().uuidString)")
            .appendingPathComponent("panda.json")
            .path

        await TestIsolation.withEnvValues(["PANDA_CONFIG_PATH": override]) {
            PandaConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "ws://gateway.ts.net:19999",
                    ],
                ],
            ])
            #expect(PandaConfigFile.remoteGatewayPort() == 19999)
            #expect(PandaConfigFile.remoteGatewayPort(matchingHost: "gateway.ts.net") == 19999)
            #expect(PandaConfigFile.remoteGatewayPort(matchingHost: "gateway") == 19999)
            #expect(PandaConfigFile.remoteGatewayPort(matchingHost: "other.ts.net") == nil)
        }
    }

    @MainActor
    @Test
    func setRemoteGatewayUrlPreservesScheme() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("panda-config-\(UUID().uuidString)")
            .appendingPathComponent("panda.json")
            .path

        await TestIsolation.withEnvValues(["PANDA_CONFIG_PATH": override]) {
            PandaConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                    ],
                ],
            ])
            PandaConfigFile.setRemoteGatewayUrl(host: "new-host", port: 2222)
            let root = PandaConfigFile.loadDict()
            let url = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any])?["url"] as? String
            #expect(url == "wss://new-host:2222")
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() async {
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("panda-state-\(UUID().uuidString)", isDirectory: true)
            .path

        await TestIsolation.withEnvValues([
            "PANDA_CONFIG_PATH": nil,
            "PANDA_STATE_DIR": dir,
        ]) {
            #expect(PandaConfigFile.stateDirURL().path == dir)
            #expect(PandaConfigFile.url().path == "\(dir)/panda.json")
        }
    }
}
