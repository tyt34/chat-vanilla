import './main.css'
import '../../images/def-ava.png'
//import { urlSocket } from './const.js'
console.log(' M A I N ')

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
const socket = io("http://localhost:3000/")

const htmlNameMainUser = document.querySelector('.main__user-name')
const htmlAvaMainUser = document.querySelector('.main__user-ava')
const htmlTempUser = document.querySelector('.template-item')
const htmlTempMessage = document.querySelector('.template-message')
const htmlListUsers = document.querySelector('.main__list')
const buttonSendMessage = document.getElementById('send-message')
const buttonSendImg = document.getElementById('send-image')
const htmlTextMessage = document.querySelector('.main__textarea')
const htmlListMessage = document.querySelector('.main__list-messages')
let nameMainUser = ''
let idMainUser = ''
let imgMainUser = ''
let usersList = []

const listenerButSendMessage = function() {
  console.log(' send message ')
  console.log(' text: ', htmlTextMessage.value)
  socket.emit("chat message", htmlTextMessage.value)
  let newMessage = htmlTempMessage.content.cloneNode(true)
  newMessage.querySelector('.main__message-text').textContent = htmlTextMessage.value
  newMessage.querySelector('.main__message-user').textContent = nameMainUser
  newMessage.querySelector('.main__user-ava').src = imgMainUser
  newMessage.querySelector('.main__message').classList.add('main__message_main')
  htmlListMessage.append(newMessage)
  htmlTextMessage.value = ''
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
socket.emit("give a name")

socket.on("give a name", (user) => {
  htmlNameMainUser.textContent = 'Вы: ' + user.name
  nameMainUser = user.name
  idMainUser = user.id
  if (user.img !== 'default') {
    imgMainUser = user.img
    htmlAvaMainUser.src = user.img
  }
})

/**
 * Получение списка пользователей на момент подключения
 */
socket.on("now list users", (users) => {
  users.map( (user) => {
    if (user.name !== nameMainUser) {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector('.main__item-text').textContent = user.name
      if (user.img !== 'default') {
        newUser.querySelector('.main__user-ava').src = user.img
      }
      htmlListUsers.append(newUser)
    }
  })
  usersList = users
})

/**
 * Используется при подключение нового пользователя
 */
socket.on('add new user', (newUserObj) => {
  let newUser = htmlTempUser.content.cloneNode(true)
  newUser.querySelector('.main__item-text').textContent = newUserObj.name
  if (newUserObj.img !== 'default') {
    newUser.querySelector('.main__ava-mini').src = newUserObj.img
  }
  htmlListUsers.append(newUser)
  usersList.push(newUserObj)
})

/**
 * Используется при отключение пользователя
 */
socket.on('remove user', (idUser) => {
  usersList.map( (user, i) => {
    if (user.id === idUser) {
      [...document.querySelectorAll('li')].map( (el) => {
        if (el.querySelector('.main__item-text').textContent === user.name) {
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
socket.on('message for all', (messageObj) => {
  console.log(' mes: ', messageObj)
  if (messageObj.id !== idMainUser) {
    console.log(' new Mes: ', messageObj)
    let newMessage = htmlTempMessage.content.cloneNode(true)
    newMessage.querySelector('.main__message-text').textContent = messageObj.message
    newMessage.querySelector('.main__message-user').textContent = messageObj.name
    if (messageObj.img !== 'default') {
      newMessage.querySelector('.main__user-ava').src = messageObj.img
    }
    newMessage.querySelector('.main__message').classList.add('main__message_other')
    htmlListMessage.append(newMessage)
  }
})


//htmlNameMainUser.textContent = 'la la la'
/*
function displayName() {
  socket.emit("give a name")
  console.log(' NAME: ')
  socket.emit("display a name")
  socket.on("display a name", (...args) => {
    console.log('res: ', ...args) 
  })
}

displayName()
*/

/*
function getName() {
  socket.emit("give a name")
  socket.on("give a name", (userName) => {
    console.log(' a: ', userName)
    htmlNameMainUser.textContent = 'Вы: ' + userName
    //firstUser.querySelector('.main__item-text').textContent = userName
  })
  //console.log(' NAME: ')
  socket.on("now list users", (users) => {
    console.log(' all users: ', users)
    users.map( (user) => {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector('.main__item-text').textContent = user.name
      htmlListUsers.append(newUser)
    })
    usersList = users
  })
}
getName()
*/