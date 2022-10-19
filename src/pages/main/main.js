import './main.css'
import '../../images/def-ava.png'
console.log(' M A I N ')

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
const socket = io("http://localhost:3000/")


const string = document.querySelector('.block__welcome')


function getName() {
  socket.emit("give a name")

  socket.on("give a name", (userName) => {
    console.log(' a: ', userName)
    string.textContent = userName
  })

  console.log(' NAME: ')
}

getName()


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