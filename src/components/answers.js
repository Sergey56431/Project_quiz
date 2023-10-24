import {UrlManager} from "./utils/url-manager.js";

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

        if (this.routeParams.id) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + this.routeParams.id, false);
            xhr.send()

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.answer = JSON.parse(xhr.responseText)
                } catch (e) {
                    console.log(error)
                }
            }
        }
        this.getTestInformation();

    }

    getTestInformation() {

        if (this.routeParams.id) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + this.routeParams.id, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);

                } catch (e) {
                    location.href = '#/';
                }
                this.showResult();
            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }
    }

    showResult() {

        document.getElementById('pre-title-name').innerText = this.quiz.name;

        const result = JSON.parse(this.routeParams.res);


        this.questionNum = result.map(question => question.questionId);
        this.answersNum = result.map(answer => answer.chosenAnswerId);

        for (let i = 0; this.currentQuestionIndex < this.quiz.questions.length; i++) {
            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'question'

            const question = this.quiz.questions[this.currentQuestionIndex];
            const questionTextElement = document.createElement('div');
            questionTextElement.innerHTML = '<span>Вопрос ' + (++this.currentQuestionIndex)
                + ': </span>' + question.question;

            const answersElement = document.createElement('div');
            answersElement.className = 'answers'

            answersElement.innerHTML = '';
            question.answers.forEach(answer => {

                const answerId = answer.id
                this.answId = answerId

                const answerOptionElement = document.createElement('div');
                answerOptionElement.className = 'answer-list-item';

                this.dots = document.createElement('div')
                this.dots.classList.add('answer-point');
                this.dots.setAttribute('id', answerId)

                const answerOptionTextElement = document.createElement('div');
                answerOptionTextElement.setAttribute('id', answerId)
                answerOptionTextElement.className = 'answer-text'
                answerOptionTextElement.innerText = answer.answer

                if (this.answersNum[i] === this.answer[i]) {
                    if (answerId === this.answersNum[i]) {
                        this.dots.classList.add('valid');
                        answerOptionTextElement.style.color = '#5FDC33';
                    }
                } else if (this.answersNum[i] !== this.answer[i]) {
                    if (answerId === this.answersNum[i])
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
        const that = this;
        document.getElementById('back-result').onclick = function () {
            location.href = '#/resoult' + that.routeParams.id + '&res=' + that.routeParams.res
        }
    }
}



