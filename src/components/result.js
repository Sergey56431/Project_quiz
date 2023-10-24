import {UrlManager} from "./utils/url-manager.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        const that = this;
        document.getElementById('result-score').innerText = this.routeParams.score +
            '/' + this.routeParams.total;
        document.getElementById('myAnswers').onclick = function () {

            location.href = '#/answers?id=' + that.routeParams.id + '&res=' + that.routeParams.res
        }
    }
}