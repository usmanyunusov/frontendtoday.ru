import MyStorage from './../utils/MyStorage';

export default function Switcher() {
    const switcher = document.querySelector('.Switch-button');
    const alert = document.querySelector('.Switch-alert');
    switcher && switcher.addEventListener('click', onClick);

    function onClick() {
        alert.classList.toggle('Switch-alertShow');
        document.querySelector(`input[value="${MyStorage.get('theme') || 'theme-device'}"]`).focus();
    }

    function addEvents() {
        let inputs = document.querySelectorAll('input[name="themes"]');
        inputs.forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.body.removeAttribute('class');
                document.body.classList.add(e.target.value);
                MyStorage.set('theme', e.target.value);
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 27) {
                alert.classList.remove('Switch-alertShow');
            }
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".Switch-root") && alert.classList.contains('Switch-alertShow')) {
                alert.classList.remove('Switch-alertShow');
            }
        });
    }

    function main() {
        document.body.removeAttribute('class');
        document.body.classList.add(MyStorage.get('theme') || 'theme-device');
        document.querySelector(`input[value="${MyStorage.get('theme') || 'theme-device'}"]`).setAttribute('checked', true);
        addEvents();
    }

    main();
}