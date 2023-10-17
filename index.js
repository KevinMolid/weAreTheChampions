import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://realtime-database-1944c-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const msgListInDB = ref(database, "msgList")

const inputField = document.getElementById("input-field")
const toInput = document.getElementById("to-input")
const fromInput = document.getElementById("from-input")
const publishBtn = document.getElementById("publish-btn")
const msgContainer = document.getElementById("msg-container")

onValue(msgListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let msgArray = Object.entries(snapshot.val())

    clearMessages()
    for (let i = 0; i < msgArray.length; i++) {
      let currentMsg = msgArray[i]
      let currentMsgID = currentMsg[0]
      let currentMsgObject = currentMsg[1]
      let currentMsgValue = currentMsgObject.msg

      addToMessages(currentMsg)
    }
  } else {
    msgContainer.innerHTML = "<p>There are no endorsements yet...</p>"
  }
})

publishBtn.addEventListener("click", function() {
  let inputValue = inputField.value
  let toValue = toInput.value
  let fromValue = fromInput.value
  let msgObject = {
    msg: inputValue,
    to: toValue,
    from: fromValue
  }

  clearInput()

  push(msgListInDB, msgObject)
  console.log(`Message "${inputValue}" added to database`)

})

function clearInput() {
  inputField.value = ""
  toInput.value = ""
  fromInput.value = ""
}

function clearMessages() {
  msgContainer.innerHTML = ""
}

function addToMessages(msg) {
  let msgID = msg[0]
  let msgObject = msg[1]
  let msgValue = msgObject.msg
  let msgTo = msgObject.to
  let msgFrom = msgObject.from

  let newEl = document.createElement("div")
  newEl.className = "messageDiv";

  newEl.addEventListener("dblclick", function() {
    let exactLocationOfMsgInDB = ref(database, `msgList/${msgID}`)

    remove(exactLocationOfMsgInDB)
    console.log(`${msgValue} removed from database`)
  })

  newEl.innerHTML = `
    <p>To <strong>${msgTo}</strong></p>
    <p>${msgValue}</p>
    <p>From <strong>${msgFrom}</strong></p>
  `

  msgContainer.prepend(newEl)
}