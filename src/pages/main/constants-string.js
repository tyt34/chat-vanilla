let url
if (!process.env.apiSocket) {
  url = process.env.apiSocket
} else {
  url = 'http://localhost:3001/'
}
export const urlSocket = url

/**
 * class
 */
export const selNameMainUser = '.main__user-name'
export const selAvaMainUser = '.main__user-ava'
export const selTempUser = '.template-item'
export const selTempMessage = '.template-message'
export const selListUsers = '.main__list'
export const selSendMessage = 'send-message'
export const selSendImg = 'label-input'
export const selTextarea = '.main__textarea'
export const selListMessages = '.main__list-messages'
export const selMessageText = '.main__message-text'
export const selMessageUser = '.main__message-user'
export const selMessage = '.main__message'
export const selItemText = '.main__item-text'
export const selAvaMini = '.main__ava-mini'
export const selInput = '.main__input'
export const selPrev = '.main__prev-text'
export const selImg = '.template-img'
export const selSrcImg = '.main__img-mini'
export const selPopupImg = '.popup__img'
export const selPopup = '.popup'
export const selPopupButtonClose = '.popup__close'
export const selNumberUsers = '.main__number-users'

/**
 * other
 */
export const selMessageMainUser = 'main__message_main'
export const selUser = 'li.main__item'
export const textForBeginYourName = 'Вы: '
export const selMessageOtherUser = 'main__message_other'
export const popupIsOpen = 'popup_open'
export const fileNotChoice = 'Файл не выбран'

/**
 * socket io
 */
export const socketOptions = {
  sendChatMessage: 'chat message',
  giveName: 'give a name',
  giveAllUsers: 'now list users',
  getNewUser: 'add new user',
  getOldUser: 'remove user',
  getNewMessage: 'message for all'
}
