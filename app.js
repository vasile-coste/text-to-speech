const btnTalk = document.querySelector('.btnTalk');
const textInput = document.querySelector('.textInput');
const textOutput = document.querySelector('.textOutput');

const greetings = [
    'Hello Vali',
    'Hello, how are you doing Vali?'
];

btnTalk.addEventListener('click', () => {
    textInput.textContent = '';
    textOutput.textContent = '';
    recognition.start();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
    console.log('You may speak');
}

recognition.onspeechend = () => {
    console.log('Speach ended');
}

recognition.onresult = (e) => {
    const current = e.resultIndex;

    const transcript = e.results[current][0].transcript;
    textInput.textContent = transcript;

    talkBack(transcript);
}

function talkBack(msg) {
    const speech = new SpeechSynthesisUtterance();

    speech.text = `I couldn't understant, can you please repeat?`;
    if (msg.includes('hello')) {
        const rand = Math.floor(Math.random() * greetings.length);
        const output = greetings[rand];
        speech.text = output;
    }
    textOutput.textContent = speech.text;

    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    // cancel in case it is running 
    speechSynthesis.cancel();

    // talk
    speechSynthesis.speak(speech);
}
