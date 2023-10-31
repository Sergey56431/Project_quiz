import {UrlManager} from "./utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answer {

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.currentQuestionIndex = 0;
        this.questionTitleElement = null;
        this.answersElement = null;
        this.questions = [];
        this.testId = null;
        this.quiz = null;
        this.answer = [];
        this.dots = null;
        this.answId = null;
        this.questionNum = [];
        this.result = null;
        this.answersNum = [];

        this.init();


        document.getElementById('back-result').onclick = () => {
            location.href = '#/resoult?id=' + this.routeParams.id
        }
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.answers = result.test.questions.filter(answ => answ.answers);
                this.questionNum = result.test.questions.map(id => id.id);
                this.quest = result.test.questions;
                this.quizName = result.test.name;

                this.showResult();
            }

        } catch (error) {
            console.log(error)
        }

    }

    showResult() {

        document.getElementById('pre-title-name').innerText = this.quizName;
        this.showTestPerson();

        for (let i = 0; i <= this.questionNum.length; i++) {
            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'question'

            const questionTextElement = document.createElement('div');
            questionTextElement.innerHTML = '<span>Вопрос ' + (i + 1)
                + ': </span>' + this.quest[i].question;

            const answersElement = document.createElement('div');
            answersElement.className = 'answers'

            answersElement.innerHTML = '';
            this.quest[i].answers.forEach(answer => {

                const answerId = answer.id;
                const answerText = answer.answer;
                const correctAnswer = answer.correct;

                const answerOptionElement = document.createElement('div');
                answerOptionElement.className = 'answer-list-item';

                this.dots = document.createElement('div');
                this.dots.classList.add('answer-point');
                this.dots.setAttribute('id', answerId)

                const answerOptionTextElement = document.createElement('div');
                answerOptionTextElement.setAttribute('id', answerId);
                answerOptionTextElement.className = 'answer-text'
                answerOptionTextElement.innerText = answerText;

                    if (correctAnswer === true) {
                        answerOptionTextElement.classList.add('valid-text');
                        this.dots.classList.add('valid');
                    }
                    if (correctAnswer === false) {
                        answerOptionTextElement.classList.add('invalid-text');
                        this.dots.classList.add('invalid');
                    }

                answerOptionElement.appendChild(this.dots);
                answerOptionElement.appendChild(answerOptionTextElement);
                answersElement.appendChild(answerOptionElement)
            })

            const questionItemElement = document.getElementById('question')
            questionTitleElement.appendChild(questionTextElement)
            questionItemElement.appendChild(questionTitleElement)
            questionItemElement.appendChild(answersElement)
            questionItemElement.className = 'answer-item'
        }
    }

    async showTestPerson (){
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        const personInformationElement = document.getElementById('personInfo');
        personInformationElement.className = 'person-text';
        personInformationElement.innerHTML = '<p>Тест проходил '+ '<span><b>' + userInfo.fullName + ', ' + userInfo.email +'</b></span></p>'
    }
}



