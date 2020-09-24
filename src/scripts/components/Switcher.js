import MyStorage from './../utils/MyStorage';

export default function Switcher() {
    var switcher = document.querySelector('.Switch-root');

    switcher && switcher.addEventListener('click', onClick);

    function onClick() {
        MyStorage.set('theme', toggleTheme());
    }

    function toggleTheme() {
        if (document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            return 'dark';
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            return 'light';
        }
    }

    function main() {
        document.body.classList.remove('light');
        document.body.classList.add(MyStorage.get('theme') || 'light');
    }

    main();
}