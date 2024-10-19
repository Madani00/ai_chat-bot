
const API_KEY = "AIzaSyCNKcWQc0pr9gR9ui0SdgU_Zz3uLdT4k1w";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;


const searching = document.querySelector(".searching")
const chat_list = document.querySelector(".chat_list")
let userMsg = null;

const typingDecoration = async (text, classText) => {
    const words = text.split(' ');
    let wordIndex = 0;
  
    const typeWord = (word) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          classText.innerText += (wordIndex === 0 ? '' : ' ') + word;
          resolve();
        }, 75);
      });
    };
    
    while (wordIndex < words.length) {
      await typeWord(words[wordIndex]);
      wordIndex++;
      window.scrollTo(0, chat_list.scrollHeight)
    }
  };

const apiResponse = async (div) => {
    const classText = div.querySelector(".text");

    try {
        const requestBody = JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: userMsg }]
            }]
        });

        const resp = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: requestBody,
        });

        const data = await resp.json();

        const apiResp = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        if (apiResp) {
            console.log("API response:", apiResp);
        } else {
            console.error("The response structure is not as expected", data);
        }
        
        typingDecoration(apiResp, classText)

    } catch(error) {
        console.log(error);
    }
    finally {
        div.classList.remove("loading")
    }
}

const copyMessage = (copy_button) => {
    const msgText = copy_button.parentElement.querySelector(".text").innerText  

    navigator.clipboard.writeText(msgText) 
    copy_button.innerHTML = "Done"
    setTimeout(() => copy_button.innerHTML = "content_copy", 2000)
}

const isLoading = () => {
    const html = `
                    <div class="message_list">
                        <img class="gemini-icon" src="imgs/gemini.svg" alt="">
                        <p class="text">
                    
                        </p>
                        <div class="loading_ind">
                            <div class="loading_sec"></div>
                            <div class="loading_sec"></div>
                            <div class="loading_sec"></div>
                        </div>
                    </div>
                    <span onClick="copyMessage(this)" class="material-symbols-rounded">
                        content_copy
                    </span>
    `

    const div = document.createElement("div"); 
    div.classList.add("message", "incoming", "loading");
    div.innerHTML =  html    
    chat_list.appendChild(div)
    window.scrollTo(0, chat_list.scrollHeight)
    apiResponse(div); 
}

searching.addEventListener("submit" , (event) => {
    event.preventDefault();

    userMsg = document.querySelector(".inputtt").value;

    // if there is no input
    if (!userMsg) return;

    const html = `
                    <div class="message_list">
                        <img src="imgs/default_picture.jpg" alt="" id="loggedUserPicture">
                        <p class="text"></p>
                    </div>
    `

    const div = document.createElement("div");   
    div.classList.add("message", "outgoing");   
    div.innerHTML =  html  
    div.querySelector(".text").innerHTML = userMsg  

    chat_list.appendChild(div)
    searching.reset() 
    window.scrollTo(0, chat_list.scrollHeight)
    
    setTimeout(isLoading, 1000)

})
