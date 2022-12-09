const store = {
    set(menu) {
        localStorage.setItem('menu', JSON.stringify(menu));
    },
    get() {
        return localStorage.getItem('menu')
    }
}

export default store;
