import './index.css'; // импорт для билда
console.log(' hii ')

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
const socket = io("http://localhost:3000/")

/*
socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
socket.on("hello from server", (...args) => {
 console.log('0 --> ', ...args) 
});
*/
//console.log(' --> ') 