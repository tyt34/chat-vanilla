import './main.css'
import '../../images/def-ava.png'
console.log(' M A I N ')

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
const socket = io("http://localhost:3000/")


const string = document.querySelector('.main__user-name')
const firstUser = document.querySelector('.main__item')

function getName() {
  socket.emit("give a name")

  socket.on("give a name", (userName) => {
    console.log(' a: ', userName)
    string.textContent = 'Вы: ' + userName
    firstUser.querySelector('.main__item-text').textContent = userName
  })

  console.log(' NAME: ')

  socket.on("now list users", (users) => {
    console.log(' u: ', users)
  })
  
}

getName()

socket.on('add new user', (newUserObj) => {
  console.log(' add new user: ', newUserObj)
})

socket.on('remove user', (idUser) => {
  console.log(' remove user: ', idUser)
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