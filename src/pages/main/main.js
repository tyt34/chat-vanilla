import './main.css'
import '../../images/def-ava.png'
console.log(' M A I N ')

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
const socket = io("http://localhost:3000/")

const htmlNameMainUser = document.querySelector('.main__user-name')
const htmlAvaMainUser = document.querySelector('.main__user-ava')
let nameMainUser = ''
const htmlTempUser = document.querySelector('.template-item')
const htmlListUsers = document.querySelector('.main__list')
let usersList = []

// https://random.imagecdn.app/100/100

/**
 * Используется для присваивания имени текущему пользователю
 */
socket.emit("give a name")

socket.on("give a name", (user) => {
  htmlNameMainUser.textContent = 'Вы: ' + user.name
  nameMainUser = user.name
  htmlAvaMainUser.src = user.img
})

/**
 * Получение списка пользователей на момент подключения
 */
socket.on("now list users", (users) => {
  users.map( (user) => {
    if (user.name !== nameMainUser) {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector('.main__item-text').textContent = user.name
      newUser.querySelector('.main__user-ava').src = user.img
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
  newUser.querySelector('.main__ava-mini').src = newUserObj.img
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