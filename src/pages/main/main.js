import './main.css'
import '../../images/def-ava.png'
import { 
  urlSocket, selAvaMainUser, sendChatMessage, selMessageText, 
  selMessageUser, selMessage, selMessageMainUser, textForBeginYourName,
  defaultImg, giveName, giveAllUsers, selItemText, getNewUser,
  selAvaMini, selUser, getOldUser, getNewMessage, selMessageOtherUser, sendChatImg,
  selSrcImg
} from './constants-string.js'

import {
  htmlNameMainUser, htmlAvaMainUser, htmlTempUser, htmlTempMessage,
  htmlListUsers, buttonSendMessage, buttonSendImg, htmlTextMessage, 
  htmlListMessage, htmlInput, htmlPrev, htmlTempImg
} from './constants-html.js'

console.log(' M A I N ')

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io(urlSocket)

let nameMainUser = ''
let idMainUser = ''
let imgMainUser = ''
let imgInBase64 = ''
let usersList = []
let srcImg = ''

/**
 * Используется для отправки сообщения и добавления его на страницу
 */
const listenerButSendMessage = function() {
  if (htmlTextMessage.value !== '') {
    //console.log(' base64: ', imgInBase64)
    socket.emit(sendChatMessage, htmlTextMessage.value)
    let newMessage = htmlTempMessage.content.cloneNode(true)
    newMessage.querySelector(selMessageText).textContent = htmlTextMessage.value
    newMessage.querySelector(selMessageUser).textContent = nameMainUser
    newMessage.querySelector(selAvaMainUser).src = imgMainUser
    newMessage.querySelector(selMessage).classList.add(selMessageMainUser)
    htmlTextMessage.value = ''
    if (imgInBase64) {
      socket.emit(sendChatImg, imgInBase64)
      let newImg = htmlTempImg.content.cloneNode(true)
      newImg.querySelector(selSrcImg).src = srcImg
      newMessage.querySelector(selMessage).append(newImg)
    } 
    imgInBase64 = ''
    htmlPrev.textContent = 'Файл не выбран'
    htmlListMessage.append(newMessage)
  } 
}

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
    let img = document.createElement('img')
    img.crossOrigin = 'Anonymous'
    srcImg = URL.createObjectURL(htmlInput.files[0])
    img.src = URL.createObjectURL(htmlInput.files[0])
    let canvas = document.createElement('canvas')
    img.onload = function() {
      canvas.width = img.width
      canvas.height = img.height
      let dataURL = canvas.toDataURL("image/png")
      let res = dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
      htmlTextMessage.value = htmlTextMessage.value + ' '
      imgInBase64 = res
      //console.log(' res: ', res)
    }
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
  if (user.img !== defaultImg) {
    imgMainUser = user.img
    htmlAvaMainUser.src = user.img
  }
})

/**
 * Получение списка пользователей на момент подключения
 */
socket.on(giveAllUsers, (users) => {
  users.map( (user) => {
    if (user.name !== nameMainUser) {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector(selItemText).textContent = user.name
      if (user.img !== defaultImg) {
        newUser.querySelector(selAvaMainUser).src = user.img
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
  if (newUserObj.img !== defaultImg) {
    newUser.querySelector(selAvaMini).src = newUserObj.img
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
    newMessage.querySelector(selMessageText).textContent = messageObj.message
    newMessage.querySelector(selMessageUser).textContent = messageObj.name
    if (messageObj.img !== defaultImg) {
      newMessage.querySelector(selAvaMainUser).src = messageObj.img
    }
    newMessage.querySelector(selMessage).classList.add(selMessageOtherUser)
    htmlListMessage.append(newMessage)
  }
})