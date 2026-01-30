package bot.panda.android.ui

import androidx.compose.runtime.Composable
import bot.panda.android.MainViewModel
import bot.panda.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
