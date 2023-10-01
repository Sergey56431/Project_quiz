(function () {

    const Answer = {
        currentQuestionIndex: 0,
        questionTitleElement: null,
        answersElement: null,
        questions: [],
        testId: null,
        quiz: null,
        answer: [],
        dots: null,
        answId: null,
        questionNum: [],
        result: null,
        answersNum: [],

        init() {

            const url = new URL(location.href)
            const resId = url.searchParams.get('id');
            this.testId = resId;

            if (this.testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + this.testId, false);
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

        },

        getTestInformation() {

            if (this.testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.site/get-quiz?id=' + this.testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);

                    } catch (e) {
                        location.href = 'index.html';
                    }
                    this.showResult();
                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },

        showResult() {

            document.getElementById('pre-title-name').innerText = this.quiz.name;

            const url = new URL(location.href);
            const userResult = url.searchParams.get('res');
            result = JSON.parse(userResult)

            this.questionNum = result.map(question => question.questionId);
            this.answersNum = result.map(answer => answer.chosenAnswerId)

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

                    if (this.answersNum[i] === this.answer[i]) {
                        if (answerId === this.answersNum[i]) {
                            this.dots.classList.add('valid')
                        }
                    } else if (this.answersNum[i] !== this.answer[i]) {
                        if (answerId === this.answersNum[i])
                            this.dots.classList.add('invalid')
                    }

                    const answerOptionTextElement = document.createElement('div');
                    answerOptionTextElement.className = 'answer-text'
                    answerOptionTextElement.innerText = answer.answer

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

        },

    }

    document.getElementById('back-result').onclick = function () {
        location.href = 'resoult.html' + location.search
    }
    Answer.init();
})();