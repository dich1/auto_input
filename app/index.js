window.addEventListener('load', function() {
    setTimeout(function(){
        input();
    }, 1000);
});

/**
 * PJ一覧を取得する
 * @return {Object} タイトル、画像URL
 */
function projects(mail, password) {
    if (mail === '' || password == '') {
        alert('上手く読み込めませんでした。');
        return;
    }
    var request = {
        mail    : mail,
        password: password
    };
    var projects = API.projects(request);
    projects.done(function(projectList){
        alert('成功');
        localStorage.setItem('mail', mail);
        localStorage.setItem('password', password);
        setElement('set', '<input type="start" name="start" placeholder="勤務開始時間" value="" required="">' + projectList);
        setElement('button', '<input type="button" name="set" value="設定" onclick="set(document.set.start.value, document.set.project.value);">');
    }).fail(function(data, textStatus, errorThrown) {
        alert('失敗');
    });
}

/**
 * 要素を設定する
 * @param {String} id id属性
 * @param {String} element 追加要素
 */
function setElement(id, element) {
    var target = document.getElementById(id);
    target.textContent = null;
    target.insertAdjacentHTML('afterbegin', element);
}

/**
 * プロジェクトを設定する
 * @return {Object} タイトル、画像URL
 */
function set(start, project) {
    if (project === '') {
        alert('プロジェクトを設定してください');
        return;
    }
    if (start === '') {
        alert('開始時間を設定してください');
        return;
    }
    localStorage.setItem('start', start);
    localStorage.setItem('project', project);
}

/**
 * 入力する
 */
function input() {
    if (!isLocalStorageGettem()) {
        return;
    }
    var request = {
        mail    : localStorage.getItem('mail'),
        password: localStorage.getItem('password'),
        start   : localStorage.getItem('start'),
        end     : endTime(),
        project : localStorage.getItem('project')
    };
    var input = API.input(request);
    input.done(function(data){
        alert('勤怠入力しました。');
    }).fail(function(data, textStatus, errorThrown) {
        alert('失敗');
    });
}

/**
 * ローカルストレージに必要情報が格納されているかどうか
 * @return {Booleam} 判定の可否
 */
function isLocalStorageGettem() {
    return (localStorage.getItem('mail') !== null
         && localStorage.getItem('password') !== null
         && localStorage.getItem('start') !== null
         && localStorage.getItem('project') !== null);
}
/**
 * 退勤時間を算出
 * @return {string} コロン繋ぎにした退勤時間
 */
function endTime() {
    var time = new Date();
    var hour = toDoubleDigits(time.getHours());
    var minute = time.getMinutes();

    if (minute === 0) {
        // 00
        return hour + ":" + toDoubleDigits(minute);
    } else if (minute < 15) {
        // 01 ~ 14
        return hour + ":" + '00';
    } else if (minute < 30) {
        // 15 ~ 29
        return hour + ":" + '15';
    } else if (minute < 45) {
        // 30 ~ 44
        return hour + ":" + '30';
    } else if (minute <= 59) {
        // 45 ~ 59
        return hour + ":" + '45';
    }

    return hour + ":" + minute;
}

/**
 * ゼロパディング
 *
 * @param {number} number 取得した時間or分
 * @return {string} 2桁にした数字
 */
function toDoubleDigits(number) {
    // Number -> String
    number += "";
    if (number.length !== 1) {
        return number;
    }
    return number = "0" + number;
}