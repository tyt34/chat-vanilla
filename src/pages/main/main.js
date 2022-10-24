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
  htmlPopup, htmlNumberUsers
} from './constants-html.js'

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io(urlSocket)

let nameMainUser = ''
let idMainUser = ''
let imgMainUser = ''
let imgInBase64 = ''
let usersList = new Map()
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
 * Используется для добавления сообщения на страницу пользователя
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
  const { avatar, id, name} = user
  htmlNameMainUser.textContent = textForBeginYourName + name
  nameMainUser = name
  idMainUser = id
  if (avatar !== defaultImg) {
    imgMainUser = avatar
    htmlAvaMainUser.src = avatar
  }
})

/**
 * Получение списка пользователей на момент подключения
 */
socket.on(giveAllUsers, (users) => {
  users.map( (user) => {
    const { avatar, id, name} = user
    if (!usersList.get(id)) {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector(selItemText).textContent = name
      if (avatar !== defaultImg) {
        newUser.querySelector(selAvaMainUser).src = avatar
      }
      htmlListUsers.append(newUser)

      usersList.set(id, {
        name,
        avatar
      })
    }    
  })
  htmlNumberUsers.textContent = usersList.size
})

/**
 * Используется при подключение нового пользователя
 */
socket.on(getNewUser, (user) => {
  const { avatar, id, name} = user
  if (!usersList.get(id)) {
    let newUser = htmlTempUser.content.cloneNode(true)
    newUser.querySelector(selItemText).textContent = name
    if (avatar !== defaultImg) {
      newUser.querySelector(selAvaMini).src = avatar
    }
    htmlListUsers.append(newUser)

    usersList.set(id, {
      name,
      avatar
    })
    htmlNumberUsers.textContent = usersList.size
  }
})

/**
 * Используется при отключение пользователя
 */
socket.on(getOldUser, (idUser) => {
  [...document.querySelectorAll(selUser)].map( (el) => {
    if (el.querySelector(selItemText).textContent === usersList.get(idUser).name) {
      el.remove()
      usersList.delete(idUser)
    }
  })
  htmlNumberUsers.textContent = usersList.size
})

/**
 * Используется для получения сообщения от всех пользователей, включая отправителя 
 */
socket.on(getNewMessage, (messageObj) => {
  const { avatar, id, imageFile, message, name} = messageObj
  if (id !== idMainUser) {
    let newMessage = htmlTempMessage.content.cloneNode(true)
    addMessageInPage(newMessage, message, name, selMessageOtherUser)
    if (avatar !== defaultImg) {
      newMessage.querySelector(selAvaMainUser).src = avatar
    }
    if (imageFile !== '') {
      addImgInPage(imageFile, newMessage)
    }
    htmlListMessage.append(newMessage)
  }
})