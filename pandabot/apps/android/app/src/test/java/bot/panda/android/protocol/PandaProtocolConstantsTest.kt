package bot.panda.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class PandaProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", PandaCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", PandaCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", PandaCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", PandaCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", PandaCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", PandaCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", PandaCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", PandaCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", PandaCapability.Canvas.rawValue)
    assertEquals("camera", PandaCapability.Camera.rawValue)
    assertEquals("screen", PandaCapability.Screen.rawValue)
    assertEquals("voiceWake", PandaCapability.VoiceWake.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", PandaScreenCommand.Record.rawValue)
  }
}
