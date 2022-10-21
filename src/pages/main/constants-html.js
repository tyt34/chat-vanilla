import { 
  selNameMainUser, selAvaMainUser, selTempUser,
  selTempMessage, selListUsers, selSendMessage, selSendImg,
  selTextarea, selListMessages
} from './constants-string.js'

export const htmlNameMainUser = document.querySelector(selNameMainUser)
export const htmlAvaMainUser = document.querySelector(selAvaMainUser)
export const htmlTempUser = document.querySelector(selTempUser)
export const htmlTempMessage = document.querySelector(selTempMessage)
export const htmlListUsers = document.querySelector(selListUsers)
export const buttonSendMessage = document.getElementById(selSendMessage)
export const buttonSendImg = document.getElementById(selSendImg)
export const htmlTextMessage = document.querySelector(selTextarea)
export const htmlListMessage = document.querySelector(selListMessages)
