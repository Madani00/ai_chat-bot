
const searching = document.querySelector(".searching")

//  take the input and store is in userMessage

searching.addEventListener("submit" , (s) => {
    s.preventDefault();
    const userMessage = document.querySelector(".inputtt").value;
    console.log(userMessage);
})