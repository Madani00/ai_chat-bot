
const API_KEY = "AIzaSyCNKcWQc0pr9gR9ui0SdgU_Zz3uLdT4k1w";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;


const searching = document.querySelector(".searching")
const chat_list = document.querySelector(".chat_list")
let userMsg = null;


// The typeWord function returns a Promise that resolves after setTimeout.
// await ensures the words are typed sequentially, one after the other.
// The while loop continues until all the words are typed.
const typingDecoration = async (text, classText) => {
    const words = text.split(' ');
    let wordIndex = 0;
  
    // Helper function to simulate typing effect
    const typeWord = (word) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          classText.innerText += (wordIndex === 0 ? '' : ' ') + word;
          resolve();
        }, 75); // Adjust typing speed here
      });
    };
    
    // Loop over words and type them one by one
    while (wordIndex < words.length) {
      await typeWord(words[wordIndex]);
      wordIndex++;
      window.scrollTo(0, chat_list.scrollHeight)
    }
  };

  // 3 third : getting data from api
const apiResponse = async (div) => {
    const classText = div.querySelector(".text");

    try {
        const requestBody = JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: userMsg }]
            }]
        });

        // console.log("Request Body:", requestBody); 

        const resp = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: requestBody,
        });

        const data = await resp.json();
        // The optional chaining (?.) ensures it won't throw an error if something is undefined.
        // const apiResp = data?.candidates?.[0]?.content?.parts?.[0]?.text.replace(/\*\*(.*?)\*\*/g, '$1');
        const apiResp = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        if (apiResp) {
            console.log("API response:", apiResp);
        } else {
            console.error("The response structure is not as expected", data);
        }
        
        typingDecoration(apiResp, classText)
        // classText.innerHTML = apiResp;

    } catch(error) {
        console.log(error);
    }
    finally {
        div.classList.remove("loading")
    }
}

const copyMessage = (copy_button) => {
    const msgText = copy_button.parentElement.querySelector(".text").innerText  // innerText Retrieves the text content.

    navigator.clipboard.writeText(msgText) //  Copies the text to the clipboard.
    copy_button.innerHTML = "Copied to clickboard"
    setTimeout(() => copy_button.innerHTML = "content_copy", 2000)
}

// 2 second
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

    apiResponse(div);   // div is important to get the apiresp in the animation 
}

// 1 first
searching.addEventListener("submit" , (event) => {
    event.preventDefault();

    userMsg = document.querySelector(".inputtt").value;
    // console.log(userMessage);

    // if there is no input
    if (!userMsg) return;

    // if there is an input
    const html = `
                    <div class="message_list">
                        <img src="imgs/default_picture.jpg" alt="" id="loggedUserPicture">
                        <p class="text"></p>
                    </div>
    `

    const div = document.createElement("div");   // creates a new <div> element in the DOM.
    div.classList.add("message", "outgoing");     // adds two classes, "message" and "outgoing", to the newly created <div>
    div.innerHTML =  html       // Setting the inner HTML to the previos html variable
    div.querySelector(".text").innerHTML = userMsg    // Replacing the message text to useMsg
    // chat_list we called it above
    chat_list.appendChild(div)
    searching.reset()     // to erase the message from searching
    

    // run the function after 1s
    setTimeout(isLoading, 1000)

})
