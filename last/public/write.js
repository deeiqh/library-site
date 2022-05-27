let button = document.querySelector('#writeButton');
const paragraph = document.querySelector('#writeParagraph');
button.addEventListener('click',
    () => {
        paragraph.textContent = 'Written';
        if (button.textContent === 'Clear') {
            paragraph.textContent = '';
            button.textContent = 'Write';
        } else {
            button.textContent = 'Clear';
        }
    }
);