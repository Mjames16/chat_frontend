 // Preloader  
window.onload = function () {  
    const preloader = document.getElementById("preloader");  
    const content = document.getElementById("content");  

    setTimeout(function () {  
        if (preloader && general) {  
            preloader.style.display = "none";  
            general.style.display = "block";  
        }  
    }, 3000);  
};  

/* Chat Assistant */  
const history = [];  

async function getChatResponse(userMessage) {
    const chatBody = document.querySelector(".chat-body");

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage,
                history
            })
        });

        const data = await response.json();
        const reply = data.reply;
        const replyCleaned = reply.replace(/\*/g, "");

        const loader = document.querySelector(".loader");
        if (loader && loader.parentElement) {
            loader.parentElement.remove();
        }

        const messageContainer = document.createElement("div");
        messageContainer.classList.add("model");
        const messageParagraph = document.createElement("p");
        messageContainer.appendChild(messageParagraph);
        chatBody.appendChild(messageContainer);

        let index = 0;
        const interval = setInterval(() => {
            if (index < replyCleaned.length) {
                messageParagraph.textContent += replyCleaned.charAt(index);
                index++;
                chatBody.scrollTop = chatBody.scrollHeight;
            } else {
                clearInterval(interval);
                history.push(
                    { role: "user", parts: [{ text: userMessage }] },
                    { role: "model", parts: [{ text: replyCleaned }] }
                );
            }
        }, 10);
    } catch (error) {
        const loader = document.querySelector(".loader");
        if (loader && loader.parentElement) {
            loader.parentElement.remove();
        }

        chatBody.insertAdjacentHTML("beforeend", `
            <div class="model-error">
                <p>Looks like something went wrong, please try again!</p>
            </div>
        `);
    }
}

function sendMessage() {
    const chatBody = document.querySelector(".chat-body");
    const userMessageInput = document.querySelector(".js-user-message");
    const userMessage = userMessageInput.value.trim();

    if (userMessage.length) {
        userMessageInput.value = "";

        chatBody.insertAdjacentHTML("beforeend", `
            <div class="user">
                <p>${userMessage}</p>
            </div>
        `);
        chatBody.scrollTop = chatBody.scrollHeight;

        chatBody.insertAdjacentHTML("beforeend", `
            <div class="model">
                <div class="loader"></div>
            </div>
        `);
        chatBody.scrollTop = chatBody.scrollHeight;

        getChatResponse(userMessage);
    }
}

document.querySelector(".js-send-btn").addEventListener("click", function (event) {
    event.preventDefault();
    sendMessage();
});

document.querySelector(".js-user-message").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

/* Toggle Section */
document.addEventListener('DOMContentLoaded', function () {
    const chatIcon = document.getElementById('chat-icon');
    const chatWindow = document.querySelector('.chat-general');
    const closeBtn = document.getElementById('chat-close');

    chatWindow.style.display = 'none';

    chatIcon.addEventListener('click', function () {
        chatWindow.style.display = 'flex';
        chatIcon.style.display = 'none';
    });

    closeBtn.addEventListener('click', function () {
        chatWindow.style.display = 'none';
        chatIcon.style.display = 'flex';
    });
});

/* Menu Drop-down */
const menuWindow = document.querySelector('.menu-dropdown');
const menuClose = document.querySelector('.menu-close');
const menuIcon = document.getElementById('menu-icon');

menuIcon.addEventListener('click', () => {
    menuWindow.style.display = 'flex';
    menuIcon.style.display = 'flex';
    menuClose.style.display = 'flex';
});

menuClose.addEventListener('click', () => {
    menuWindow.style.display = 'none';
    menuIcon.style.display = 'flex';
    menuClose.style.display = 'none';
});

/* Slides */
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".indicators");

slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        dots[i].classList.toggle("active", i === index);
    });
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

document.querySelector(".next").addEventListener("click", nextSlide);
document.querySelector(".prev").addEventListener("click", prevSlide);

setInterval(nextSlide, 5000);
