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

export default myStorage;