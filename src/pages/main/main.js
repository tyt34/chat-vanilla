import './main.css'
import '../../images/def-ava.png'
console.log(' M A I N ')

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
const socket = io("http://localhost:3000/")


const string = document.querySelector('.main__user-name')
let nameMainUser = ''
//const firstUser = document.querySelector('.main__item')
const tempUser = document.querySelector('.template-item')
const listUsers = document.querySelector('.main__list')
//let listItems = document.querySelectorAll('li')
let usersList = []


/**
 * Используется для присваивания имени текущему пользователю
 */
socket.emit("give a name")

socket.on("give a name", (userName) => {
  string.textContent = 'Вы: ' + userName
  nameMainUser = userName
})

/**
 * Получение списка пользователей на момент подключения
 */
socket.on("now list users", (users) => {
  users.map( (user) => {
    if (user.name !== nameMainUser) {
      let newUser = tempUser.content.cloneNode(true)
      newUser.querySelector('.main__item-text').textContent = user.name
      listUsers.append(newUser)
    }
  })
  usersList = users
})

/**
 * Используется при подключение нового пользователя
 */
socket.on('add new user', (newUserObj) => {
  let newUser = tempUser.content.cloneNode(true)
  newUser.querySelector('.main__item-text').textContent = newUserObj.name
  listUsers.append(newUser)
  usersList.push(newUserObj)
})

/**
 * Используется при отключение пользователя
 */
socket.on('remove user', (idUser) => {
  usersList.map( (user, i) => {
    if (user.id === idUser) {
      let elForRem
      [...document.querySelectorAll('li')].map( (el) => {
        if (el.querySelector('.main__item-text').textContent === user.name) {
          el.remove()
        }
      })
      usersList.splice(i, 1)
    }
  })
})


//string.textContent = 'la la la'
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
    string.textContent = 'Вы: ' + userName
    //firstUser.querySelector('.main__item-text').textContent = userName
  })
  //console.log(' NAME: ')
  socket.on("now list users", (users) => {
    console.log(' all users: ', users)
    users.map( (user) => {
      let newUser = tempUser.content.cloneNode(true)
      newUser.querySelector('.main__item-text').textContent = user.name
      listUsers.append(newUser)
    })
    usersList = users
  })
}
getName()
*/