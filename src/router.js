import {Form} from "./components/form.js";
import {Choiсe} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answer} from "./components/answers.js";

export class Router {
    constructor() {
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
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: 'css/form.css',
                load: () => {
                    new Form();
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
        const newRoute = this.routs.find(item => {
            return item.route === window.location.hash.split('?')[0];
        })
        if (!newRoute){
            window.location.href = '#/';
            return;
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute ('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;
        newRoute.load();
    }
}