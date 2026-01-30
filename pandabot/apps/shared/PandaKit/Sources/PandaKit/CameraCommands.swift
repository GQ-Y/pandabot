import Foundation

public enum PandaCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum PandaCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum PandaCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum PandaCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct PandaCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: PandaCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: PandaCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: PandaCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: PandaCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct PandaCameraClipParams: Codable, Sendable, Equatable {
    public var facing: PandaCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: PandaCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: PandaCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: PandaCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
