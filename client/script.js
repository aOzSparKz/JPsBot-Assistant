import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}


function chatStripes( value, uniqueId, linkUrl) {
    return `

                <div class="messages" id="${uniqueId}">
                    ${linkUrl ? `<a href="${linkUrl}" target="_blank">${value}</a>` : value}
                </div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const userPrompt = data.get('prompt').toLowerCase(); // Convert the input to lowercase for case-insensitive matching


if (userPrompt.includes('joe-paul-sajot') || userPrompt.includes('joe') || userPrompt.includes('paul')|| userPrompt.includes('sajot') || userPrompt.includes('developer') || userPrompt.includes('jpsbot')) {
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'), generateUniqueId());
    chatContainer.innerHTML += chatStripe(true, "Joe Paul Sajot is the Developer of JPsBot<br>You can reach him at the following contact details:<br>Email: joepaulsajot@gmail.com<br> PH mobile no: 09451049548 ", generateUniqueId());
    form.reset();
    
    } else {
        // Display the user's input in the chat container
        chatContainer.innerHTML += chatStripe(false, data.get('prompt'), generateUniqueId());

        // User's chatstripe for non-car-related questions
      //  chatContainer.innerHTML += chatStripe(true, "The Information you mentioned is not within the organization.", generateUniqueId());

        // Clear the textarea input
        form.reset();

        // Bot's chatstripe
        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

        // Focus scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Specific message div
        const messageDiv = document.getElementById(uniqueId);

        // messageDiv.innerHTML = "..."
        loader(messageDiv);


        const response = await fetch('https://wirebot.onrender.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: data.get('prompt')
            })
        });

        clearInterval(loadInterval);
        messageDiv.innerHTML = " ";

        if (response.ok) {
            const responseData = await response.json();
            const parsedData = responseData.bot.trim(); // Trim any trailing spaces/'\n'

            typeText(messageDiv, parsedData);
        } else {
            const err = await response.text();

            messageDiv.innerHTML = "Something went wrong";
            alert(err);
        }
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})