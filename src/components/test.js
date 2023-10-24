import {UrlManager} from "./utils/url-manager.js";

export class Test {

    constructor() {
        this.questionTitleElement = null;
        this.nextButtonElement = null;
        this.prevButtonElement = null;
        this.optionsElement = null;
        this.quiz = null;
        this.currentQuestionIndex = 1;
        this.progressBarElement = null;
        this.userResoult = [];
        this.routeParams = UrlManager.getQueryParams();
        UrlManager.checkUserData(this.routeParams);

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
                this.startQuiz();
            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }
    }


    startQuiz() {
        this.questionTitleElement = document.getElementById('title');
        this.progressBarElement = document.getElementById('progress-bar');
        this.optionsElement = document.getElementById('options');
        this.nextButtonElement = document.getElementById('next');
        this.nextButtonElement.onclick = this.move.bind(this, 'next');
        this.prevButtonElement = document.getElementById('prev');
        this.prevButtonElement.onclick = this.move.bind(this, 'prev');
        this.passButtonElement = document.getElementById('pass');
        this.passButtonElement.onclick = this.move.bind(this, 'pass');
        document.getElementById('pre-title').innerText = this.quiz.name;

        this.prepareProgressBar();
        this.showQuestion();

        const timerElement = document.getElementById('timer');
        let seconds = 59;
        const interval = setInterval(function () {
            seconds--
            timerElement.innerText = seconds;
            if (seconds === 0) {
                clearInterval(interval);
                this.complete();
            }
        }.bind(this), 1000)
    }


    prepareProgressBar() {
        for (let i = 0; i < this.quiz.questions.length; i++) {
            const itemElement = document.createElement('div');
            itemElement.className = 'test-progress-bar-item ' + (i === 0 ? 'active' : '');

            const itemCircleElement = document.createElement('div')
            itemCircleElement.className = 'test-progress-bar-item-circle';

            const itemTextElement = document.createElement('div')
            itemTextElement.className = 'test-progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1);

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement);
        }
    }

    showQuestion() {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        this.questionTitleElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex
            + ':</span> ' + activeQuestion.question;

        this.optionsElement.innerHTML = '';
        const that = this;
        const chosenOption = this.userResoult.find(item => item.questionId === activeQuestion.id)
        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';

            const inputId = 'answer-' + answer.id;
            const inputElement = document.createElement('input');
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            inputElement.className = 'option-answer';
            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                inputElement.setAttribute('checked', 'checked');
            }

            inputElement.onchange = function () {
                that.chooseAnswer();
            }

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);
        });
        if (chosenOption && chosenOption.chosenAnswerId) {
            this.nextButtonElement.removeAttribute('disabled');
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled');
        }

        this.nextButtonElement.setAttribute('disabled', 'disabled');
        if (this.currentQuestionIndex === this.quiz.questions.length) {
            this.nextButtonElement.innerText = 'Завершить';
        } else {
            this.nextButtonElement.innerText = 'Дальше';
        }
        if (this.currentQuestionIndex > 1) {
            this.prevButtonElement.removeAttribute('disabled');
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled')
        }
    }

    chooseAnswer() {
        this.nextButtonElement.removeAttribute('disabled');

    }

    move(action) {

        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
            return element.checked
        });

        let chosenAnswerId = null;
        if (chosenAnswer && chosenAnswer.value) {
            chosenAnswerId = Number(chosenAnswer.value);
        }

        const existingResoult = this.userResoult.find(item => {
            return item.questionId === activeQuestion.id
        })
        if (existingResoult) {
            existingResoult.chosenAnswerId === chosenAnswerId;
        } else {
            this.userResoult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: chosenAnswerId
            })
        }

        if (action === 'next' || action === 'pass') {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }
        if (this.currentQuestionIndex > this.quiz.questions.length) {
            this.complete();
            return;
        }

        Array.from(this.progressBarElement.children).forEach((item, index) => {
            const currentItemIndex = index + 1;
            item.classList.remove('complete');
            item.classList.remove('active');

            if (currentItemIndex === this.currentQuestionIndex) {
                item.classList.add('active');
            } else if (currentItemIndex < this.currentQuestionIndex) {
                item.classList.add('complete');
            }
        })

        this.showQuestion();
    }

    complete() {

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://testologia.site/pass-quiz?id=' + this.routeParams.id, false);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify({
            name: this.routeParams.name,
            lastName: this.routeParams.lastName,
            email: this.routeParams.email,
            results: this.userResoult,

        }));

        if (xhr.status === 200 && xhr.responseText) {
            let result = null;
            try {
                result = JSON.parse(xhr.responseText);
            } catch (e) {
                location.href = '#/';
            }
            if (result) {
                location.href = '#/resoult?score=' + result.score + '&total=' + result.total
                    + '&id=' + this.routeParams.id + '&res=' + JSON.stringify(this.userResoult)
            } else {
                location.href = '#/'
            }
        }
    }
}
