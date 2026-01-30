import Foundation

public enum PandaChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(PandaChatEventPayload)
    case agent(PandaAgentEventPayload)
    case seqGap
}

public protocol PandaChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> PandaChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [PandaChatAttachmentPayload]) async throws -> PandaChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> PandaChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<PandaChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension PandaChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "PandaChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> PandaChatSessionsListResponse {
        throw NSError(
            domain: "PandaChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
