import {Form} from "./components/form.js";
import {Choiсe} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answer} from "./components/answers.js";
import {Auth} from "./services/auth.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profieFullNameElement = document.getElementById('profile-full-name');

        this.routs = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'css/form.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'css/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                styles: 'css/choice.css',
                load: () => {
                    new Choiсe();
                }
            },
            {
                route: '#/test',
                title: 'Тест',
                template: 'templates/test.html',
                styles: 'css/test.css',
                load: () => {
                    new Test();
                }
            },
            {
                route: '#/resoult',
                title: 'Результаты теста',
                template: 'templates/resoult.html',
                styles: 'css/resoult.css',
                load: () => {
                    new Result();
                }
            },
            {
                route: '#/answers',
                title: 'Мои ответы',
                template: 'templates/answers.html',
                styles: 'css/answers.css',
                load: () => {
                    new Answer();
                }
            },
        ]
    }

    async openRoute(){
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout'){
            await Auth.logout();
            window.location.href = '#/';
            return false;
        }

        const newRoute = this.routs.find(item => {
            return item.route === urlRoute;
        })
        if (!newRoute){
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute ('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey)
        if (userInfo && accessToken){
            this.profileElement.style.display = 'flex';
            this.profieFullNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }

        newRoute.load();
    }
}