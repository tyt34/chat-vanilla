import './main.css'
import '../../images/def-ava.png'
import { 
  urlSocket, selAvaMainUser, selMessageMainUser, 
  fileNotChoice, selPopupButtonClose, socketOptions
} from './constants-string.js'

import {
  htmlTempMessage, buttonSendMessage, buttonSendImg, 
  htmlTextMessage, htmlListMessage, htmlInput, htmlPrev,
} from './constants-html.js'

import {
  addMessageInPage, addImgInPage, listenerPopup, setUser, 
  getListNowUsers, addNewUser, removeUser, addNewMessage
} from './functions.js'

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io(urlSocket)

export let mainUser = {
  name: '',
  id: '',
  avatar: ''
}
export let imgInBase64 = ''
export let usersList = new Map()
export let srcImg = ''

/***********************
 *  BASE FUNCTIONS 
 ***********************/

const offPrev = function() {
  event.preventDefault()
}

const imgConvertToBase64 = function() {
  event.preventDefault()
  htmlInput.click()
  htmlInput.addEventListener('change', function (e) {
    htmlPrev.textContent = htmlInput.files[0].name
    htmlTextMessage.value = htmlTextMessage.value + ' '
    srcImg = URL.createObjectURL(htmlInput.files[0])
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      imgInBase64 = reader.result
    })
    reader.readAsDataURL(htmlInput.files[0])
  })
}

const listenerButtonSendMessage = function() {
  if (htmlTextMessage.value !== '') {
    let newMessage = htmlTempMessage.content.cloneNode(true)
    addMessageInPage(newMessage, htmlTextMessage.value, mainUser.name, selMessageMainUser)
    newMessage.querySelector(selAvaMainUser).src = mainUser.avatar
    if (imgInBase64 !== '') {
      addImgInPage(srcImg, newMessage)   
    }
    socket.emit(socketOptions.sendChatMessage, {
      message: htmlTextMessage.value,
      imageFile: imgInBase64
    })

    htmlTextMessage.value = ''
    imgInBase64 = ''
    htmlPrev.textContent = fileNotChoice
    htmlInput.value = ''
    htmlListMessage.append(newMessage)
    htmlListMessage.scrollTo(0, htmlListMessage.scrollHeight)
  } 
}

/***********************
 * MAIN 
 ***********************/

/**
 * Отключение отправки формы при нажатие на кнопки
 */
buttonSendMessage.onclick = offPrev
 
/**
 * Получение изображения с помощью input и преобразование в base64
 */
buttonSendImg.onclick = imgConvertToBase64

/**
 * Используется для отправки сообщения и добавления его на страницу
 */
buttonSendMessage.addEventListener('click', listenerButtonSendMessage)

/**
 * Используется для отправки данных, чтобы в дальнейшем присвоить имя текущему пользователю
 */
socket.emit(socketOptions.giveName)

/**
 * Используется для присваивания имени текущему пользователю
 */
socket.on(socketOptions.giveName, (user) => {
  setUser(user)
})

/**
 * Получение списка пользователей на момент подключения
 */
socket.on(socketOptions.giveAllUsers, (users) => {
  getListNowUsers(users)
})

/**
 * Используется при подключение нового пользователя
 */
socket.on(socketOptions.getNewUser, (user) => {
  addNewUser(user)
})

/**
 * Используется при отключение пользователя
 */
socket.on(socketOptions.getOldUser, (idUser) => {
  removeUser(idUser)
})

/**
 * Используется для получения сообщения от всех пользователей, включая отправителя 
 */
socket.on(socketOptions.getNewMessage, (messageObj) => {
  addNewMessage(messageObj)
})

/**
 * Закрытие попапа
 */
document.querySelector(selPopupButtonClose).addEventListener('click', listenerPopup)
