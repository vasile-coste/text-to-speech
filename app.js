const btnTalk = document.querySelector('.btnTalk');
const textInput = document.querySelector('.textInput');
const textOutput = document.querySelector('.textOutput');

const greetings = [
    'Hello, how are you doing?',
    'Howdy!'
];

const jokes = [
    'One joke, coming up! What is a sea monster’s favorite snack? Ships and dip.',
    'This might make you laugh. How do robots eat guacamole? With computer chips.',
    `What do you call a bee that can't make up its mind? A Maybe.`
];

btnTalk.addEventListener('click', (e) => {
    e.preventDefault();
    textInput.textContent = '';
    textOutput.textContent = '';
    recognition.start();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
    console.log('You may speak');
    // cancel in case it is running 
    speechSynthesis.cancel();

    btnTalk.style.backgroundColor = 'green';
}

recognition.onspeechend = () => {
    console.log('Speach ended');
    btnTalk.style.backgroundColor = '#fff';
}

recognition.onresult = (e) => {
    const current = e.resultIndex;

    const transcript = e.results[current][0].transcript.toLowerCase();
    textInput.innerHTML = `<b>You said:</b> ${transcript}`;

    prepareResponse(transcript);
}

function prepareResponse(msg) {
    let response = `I couldn't understant, can you please repeat?`;
    if (msg.includes('help')) {
        response = 'This is what i can do:';
        textOutput.innerHTML = `${response} 
            <ul>
                <li>Show help menu</li>
                <li>Greet. Say: 'Hello'</li>
                <li>Tell you who is my creator. Say: 'Who is your creator' or 'Who made you'</li>
                <li>Tell you a joke. Say: 'Tell me a joke'</li>
                <li>Tell you the weather. Say: 'Tell me the weather'</li>
            </ul>`;

        return talkBack(response);
    }

    if (msg.includes('hello')) {
        const rand = Math.floor(Math.random() * greetings.length);
        response = greetings[rand];
        textOutput.innerHTML = response;

        return talkBack(response);
    }

    if (msg.includes('creator') || msg.includes('made')) {
        response = 'My creator is Vasile!';
        textOutput.innerHTML = response;

        return talkBack(response);
    }

    if (msg.includes('joke')) {
        const rand = Math.floor(Math.random() * jokes.length);
        response = jokes[rand] + " Haha ha";
        textOutput.innerHTML = response;

        return talkBack(response);
    }
    if (msg.includes('weather') || msg.includes('made')) {

        let ip = '86.121.176.73';
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://weatherstack.com/ws_api.php?ip=${ip}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                data = JSON.parse(result);
                console.log(data);
                response = `The weather in ${data.location.region} is ${data.current.weather_descriptions[0]} with ${data.current.temperature} degrees Celsius!`;

                textOutput.innerHTML = `<img src="${data.current.weather_icons[0]}"><br /> ${response}`;
                return talkBack(response);
            })
            .catch(error => {
                let text = `I'm unable to make the request, something is wrong or you need an extenstion to allow cors.`
                textOutput.innerHTML = text;
                talkBack(text);
                console.log('error', error);
            });
    }
}

function talkBack(msg) {
    const speech = new SpeechSynthesisUtterance();

    speech.text = msg;

    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    // cancel in case it is running 
    speechSynthesis.cancel();

    // talk
    speechSynthesis.speak(speech);
}
