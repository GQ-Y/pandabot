import Foundation

public enum PandaLocationMode: String, Codable, Sendable, CaseIterable {
    case off
    case whileUsing
    case always
}
