import './main.css'
import '../../images/def-ava.png'
import { 
  urlSocket, selAvaMainUser, sendChatMessage, selMessageText, 
  selMessageUser, selMessage, selMessageMainUser, textForBeginYourName,
  defaultImg, giveName, giveAllUsers, selItemText, getNewUser,
  selAvaMini, selUser, getOldUser, getNewMessage, selMessageOtherUser
} from './constants-string.js'

import {
  htmlNameMainUser, htmlAvaMainUser, htmlTempUser, htmlTempMessage,
  htmlListUsers, buttonSendMessage, buttonSendImg, htmlTextMessage, 
  htmlListMessage
} from './constants-html.js'

console.log(' M A I N ')

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io(urlSocket)

let nameMainUser = ''
let idMainUser = ''
let imgMainUser = ''
let usersList = []

const listenerButSendMessage = function() {
  if (htmlTextMessage.value !== '') {
    socket.emit(sendChatMessage, htmlTextMessage.value)
    let newMessage = htmlTempMessage.content.cloneNode(true)
    newMessage.querySelector(selMessageText).textContent = htmlTextMessage.value
    newMessage.querySelector(selMessageUser).textContent = nameMainUser
    newMessage.querySelector(selAvaMainUser).src = imgMainUser
    newMessage.querySelector(selMessage).classList.add(selMessageMainUser)
    htmlListMessage.append(newMessage)
    htmlTextMessage.value = ''
  } 
}

/**
 * Отключение отправки формы при нажатие на кнопки
 */
buttonSendMessage.onclick = function() {
  event.preventDefault()
}

buttonSendImg.onclick = function() {
  event.preventDefault()
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