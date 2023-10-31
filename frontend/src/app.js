import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handelRouteChanging.bind(this));
        window.addEventListener('popstate', this.handelRouteChanging.bind(this));
    }
    handelRouteChanging(){
        this.router.openRoute();
    }
}

(new App());