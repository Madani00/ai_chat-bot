
const searching = document.querySelector(".searching")

const chat_list = document.querySelector(".chat_list")

searching.addEventListener("submit" , (event) => {
    event.preventDefault();

    const userMsg = document.querySelector(".inputtt").value;
    // console.log(userMessage);

    // if there is no input
    if (!userMsg) return;

    // if there is an input
    const html = `
                    <div class="message_list">
                        <img src="imgs/user.jpg" alt="">
                        <p class="text"></p>
                    </div>
    `

    const div = document.createElement("div");   // creates a new <div> element in the DOM.
    div.classList.add("message", "outgoing");     // adds two classes, "message" and "outgoing", to the newly created <div>
    div.innerHTML =  html       // Setting the inner HTML to the previos html variable
    div.querySelector(".text").innerHTML = userMsg    // Replacing the message text to useMsg

    chat_list.appendChild(div)
    searching.reset()     // to erase the message from searching
})
