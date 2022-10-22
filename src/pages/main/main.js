import './main.css'
import '../../images/def-ava.png'
import { 
  urlSocket, selAvaMainUser, sendChatMessage, selMessageText, 
  selMessageUser, selMessage, selMessageMainUser, textForBeginYourName,
  defaultImg, giveName, giveAllUsers, selItemText, getNewUser,
  selAvaMini, selUser, getOldUser, getNewMessage, selMessageOtherUser,
  selSrcImg, popupIsOpen, fileNotChoice, selPopupButtonClose
} from './constants-string.js'

import {
  htmlNameMainUser, htmlAvaMainUser, htmlTempUser, htmlTempMessage,
  htmlListUsers, buttonSendMessage, buttonSendImg, htmlTextMessage, 
  htmlListMessage, htmlInput, htmlPrev, htmlTempImg, htmlPopupImg,
  htmlPopup
} from './constants-html.js'

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io(urlSocket)

let nameMainUser = ''
let idMainUser = ''
let imgMainUser = ''
let imgInBase64 = ''
let usersList = []
let srcImg = ''

/**
 * Добавление картинки на страницу
 * @param {*} image 
 * @param {*} newMessage 
 */
const addImgInPage = function(image, newMessage) {
  let newImg = htmlTempImg.content.cloneNode(true)
  newImg.querySelector(selSrcImg).src = image
  newImg.querySelector(selSrcImg).addEventListener('click', () => {
    htmlPopupImg.src = image
    htmlPopup.classList.add(popupIsOpen)
  })
  newMessage.querySelector(selMessage).append(newImg)
}

/**
 * 
 */
const addMessageInPage = function(newMessage, message, name, selecter) {
  newMessage.querySelector(selMessageText).textContent = message
  newMessage.querySelector(selMessageUser).textContent = name
  newMessage.querySelector(selMessage).classList.add(selecter)
}

/**
 * Используется для отправки сообщения и добавления его на страницу
 */
const listenerButSendMessage = function() {
  if (htmlTextMessage.value !== '') {
    let newMessage = htmlTempMessage.content.cloneNode(true)
    addMessageInPage(newMessage, htmlTextMessage.value, nameMainUser, selMessageMainUser)
    newMessage.querySelector(selAvaMainUser).src = imgMainUser
    if (imgInBase64) {
      addImgInPage(srcImg, newMessage)   
    }
    socket.emit(sendChatMessage, {
      message: htmlTextMessage.value,
      imageFile: imgInBase64
    })
    htmlTextMessage.value = ''
    imgInBase64 = ''
    htmlPrev.textContent = fileNotChoice
    htmlInput.value = ''
    htmlListMessage.append(newMessage)
  } 
}

/**
 * Закрытие попапа
 */
document.querySelector(selPopupButtonClose).addEventListener('click', () => {
  htmlPopup.classList.remove(popupIsOpen)
})

/**
 * Отключение отправки формы при нажатие на кнопки
 */
buttonSendMessage.onclick = function() {
  event.preventDefault()
}

/**
 * Получение изображения с помощью input и преобразование в base64
 */
buttonSendImg.onclick = function() {
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

buttonSendMessage.addEventListener('click', listenerButSendMessage)

/**
 * Используется для присваивания имени текущему пользователю
 */
socket.emit(giveName)

socket.on(giveName, (user) => {
  htmlNameMainUser.textContent = textForBeginYourName + user.name
  nameMainUser = user.name
  idMainUser = user.id
  if (user.avatar !== defaultImg) {
    imgMainUser = user.avatar
    htmlAvaMainUser.src = user.avatar
  }
})

/**
 * проверка на наличие данного пользователя в списке
 * @param {} idUser 
 * @returns 
 */
function checkUserInList(idUser) {
  let result = true
  usersList.map( (user) => {
    if (user.id === idUser) {
      result = false
    }
  })
  return result
}

/**
 * Получение списка пользователей на момент подключения
 */
socket.on(giveAllUsers, (users) => {
  users.map( (user) => {
    if (checkUserInList(user.id)) {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector(selItemText).textContent = user.name
      if (user.avatar !== defaultImg) {
        newUser.querySelector(selAvaMainUser).src = user.avatar
      }
      htmlListUsers.append(newUser)
    }
  })
  usersList = users
})

/**
 * Используется при подключение нового пользователя
 */
socket.on(getNewUser, (newUserObj) => {
  let newUser = htmlTempUser.content.cloneNode(true)
  newUser.querySelector(selItemText).textContent = newUserObj.name
  if (newUserObj.avatar !== defaultImg) {
    newUser.querySelector(selAvaMini).src = newUserObj.avatar
  }
  htmlListUsers.append(newUser)
  usersList.push(newUserObj)
})

/**
 * Используется при отключение пользователя
 */
socket.on(getOldUser, (idUser) => {
  usersList.map( (user, i) => {
    if (user.id === idUser) {
      [...document.querySelectorAll(selUser)].map( (el) => {
        if (el.querySelector(selItemText).textContent === user.name) {
          el.remove()
        }
      })
      usersList.splice(i, 1)
    }
  })
})

/**
 * Используется для получения сообщения от всех пользователей, включая отправителя 
 */
socket.on(getNewMessage, (messageObj) => {
  if (messageObj.id !== idMainUser) {
    let newMessage = htmlTempMessage.content.cloneNode(true)
    addMessageInPage(newMessage, messageObj.message, messageObj.name, selMessageOtherUser)
    if (messageObj.avatar !== defaultImg) {
      newMessage.querySelector(selAvaMainUser).src = messageObj.avatar
    }
    if (messageObj.imageFile !== '') {
      addImgInPage(messageObj.imageFile, newMessage)
    }
    htmlListMessage.append(newMessage)
  }
})