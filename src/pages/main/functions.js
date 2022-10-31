import {
  htmlNameMainUser, htmlAvaMainUser, htmlTempUser, htmlTempMessage,
  htmlListUsers, htmlListMessage, htmlTempImg, htmlPopupImg, htmlPopup, 
  htmlNumberUsers
} from './constants-html.js'

import { 
  selAvaMainUser, selMessageText, selMessageUser, selMessage, 
  textForBeginYourName, selItemText, selAvaMini, selUser, 
  selMessageOtherUser, selSrcImg, popupIsOpen
} from './constants-string.js'

import {
  mainUser,
  usersList,
} from './main.js'

/**
 * Добавление картинки на страницу отправителя
 * @param {*} image 
 * @param {*} newMessage 
 */
export const addImgInPage = function(image, newMessage) {
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
export const addMessageInPage = function(newMessage, message, name, selecter) {
  newMessage.querySelector(selMessageText).textContent = message
  newMessage.querySelector(selMessageUser).textContent = name
  newMessage.querySelector(selMessage).classList.add(selecter)
}

export const listenerPopup = function() {
  htmlPopup.classList.remove(popupIsOpen)
}

export const setUser = function({ avatar, id, name}) {
  htmlNameMainUser.textContent = textForBeginYourName + name
  mainUser.name = name
  mainUser.id = id
  mainUser.avatar = avatar
  htmlAvaMainUser.src = avatar
}

export const getListNowUsers = function(users) {
  users.map( ({ avatar, id, name}) => {
    if (!usersList.get(id)) {
      let newUser = htmlTempUser.content.cloneNode(true)
      newUser.querySelector(selItemText).textContent = name
      newUser.querySelector(selAvaMainUser).src = avatar
      htmlListUsers.append(newUser)

      usersList.set(id, {
        name,
        avatar
      })
    }    
  })
  htmlNumberUsers.textContent = usersList.size
}

export const addNewUser = function({ avatar, id, name}) {
  if (!usersList.get(id)) {
    let newUser = htmlTempUser.content.cloneNode(true)
    newUser.querySelector(selItemText).textContent = name
    newUser.querySelector(selAvaMini).src = avatar
    htmlListUsers.append(newUser)

    usersList.set(id, {
      name,
      avatar
    })
    htmlNumberUsers.textContent = usersList.size
  }
}

export const removeUser = function(idUser) {
  [...document.querySelectorAll(selUser)].map( (el) => {
    if (el.querySelector(selItemText).textContent === usersList.get(idUser).name) {
      el.remove()
      usersList.delete(idUser)
    }
  })
  htmlNumberUsers.textContent = usersList.size
}

export const addNewMessage = function({ avatar, id, imageFile, message, name}) {
  if (id !== mainUser.id) {
    let newMessage = htmlTempMessage.content.cloneNode(true)
    addMessageInPage(newMessage, message, name, selMessageOtherUser)
    newMessage.querySelector(selAvaMainUser).src = avatar
    if (imageFile !== '') {
      let newImg = htmlTempImg.content.cloneNode(true)
      fetch(imageFile)
      .then(res => res.blob())
      .then(blob => {
        newImg.querySelector(selSrcImg).src = window.URL.createObjectURL(blob)
        newImg.querySelector(selSrcImg).addEventListener('click', () => {
          htmlPopupImg.src = window.URL.createObjectURL(blob)
          htmlPopup.classList.add(popupIsOpen)
        })
        newMessage.querySelector(selMessage).append(newImg)
        htmlListMessage.append(newMessage)
      })
    } else {
      htmlListMessage.append(newMessage)
    }
  }
}

export const offPrev = function() {
  event.preventDefault()
}