import '../styles/all.scss';

(function () {
    var switcher = document.querySelector('.Switch-root');

    switcher && switcher.addEventListener('click', onClick);

    function onClick() {
        myStorage.set('theme', toggleTheme());
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

    const myStorage = {
        hasLocalStorage: 'localStorage' in window,
        get: function (name) {
            if (this.hasLocalStorage) {
                return localStorage.getItem(name)
            } else {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].split('=');
                    var item = cookie[0];
                    var value = cookie.slice(1).join('=');
                    if (item.trim() === name.trim()) return value;
                }
            }
        },
        set: function (name, val) {
            if (this.hasLocalStorage) {
                localStorage.setItem(name, val)
            } else {
                var date = new Date(new Date().getTime() + timeOffSet);
                document.cookie = name + "=" + val + " ; path=/; expires=" + date.toUTCString();
            }
        },
        remove: function (name) {
            localStorage.removeItem(name)
            var date = new Date(0);
            document.cookie = name + "= ; path=/; expires=" + date.toUTCString();
        }
    };


    function main() {
        document.body.classList.remove('light');
        document.body.classList.add(myStorage.get('theme') || 'light');
    }

    main();
}());
