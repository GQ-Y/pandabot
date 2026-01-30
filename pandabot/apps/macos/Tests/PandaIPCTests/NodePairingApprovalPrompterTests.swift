import Testing
@testable import Panda

@Suite(.serialized)
@MainActor
struct NodePairingApprovalPrompterTests {
    @Test func nodePairingApprovalPrompterExercises() async {
        await NodePairingApprovalPrompter.exerciseForTesting()
    }
}
