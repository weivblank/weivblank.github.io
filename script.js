var exams = [];
var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();

function loadData() {
    var data = localStorage.getItem("exams");
    if (data) {
        try {
            exams = JSON.parse(data);
        } catch(e) { // сброс при ошибке
            exams = []; 
        }
    }
    checkNotifications();
}

function saveData() {
    localStorage.setItem("exams", JSON.stringify(exams));
}

function showSection(id) {
    var sections = document.getElementsByClassName("section");
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove("active");
    }
    document.getElementById(id).classList.add("active");

    if (id == "exams") renderExams();
    if (id == "calendar") renderCalendar();
    if (id == "stats") renderStats();
}

function validateExamInputs() {
    var name = document.getElementById("exam-name").value;
    var date = document.getElementById("exam-date").value;
    var nameErr = document.getElementById("name-error");
    var dateErr = document.getElementById("date-error");
    var valid = true;

    var regex = /^.{2,50}$/;
    if (!regex.test(name)) {
        nameErr.innerHTML = "Название должно быть от 2 до 50 символов";
        valid = false;
    } else {
        nameErr.innerHTML = "";
    }

    if (!date) {
        dateErr.innerHTML = "Дата обязательна";
        valid = false;
    } else {
        var today = new Date();
        today.setHours(0,0,0,0);
        var examDate = new Date(date);
        if (examDate < today) {
            dateErr.innerHTML = "Дата не может быть в прошлом";
            valid = false;
        } else {
            dateErr.innerHTML = "";
        }
    }

    return valid;
}

function validateTopicInputs() {
    var name = document.getElementById("topic-name").value;
    var err = document.getElementById("topic-error");
    var regex = /^.{2,100}$/;
    if (!regex.test(name)) {
        err.innerHTML = "Название темы от 2 до 100 символов";
        return false;
    } else {
        err.innerHTML = "";
        return true;
    }
}

function addExam() {
    if (!validateExamInputs()) return;

    var name = document.getElementById("exam-name").value;
    var date = document.getElementById("exam-date").value;
    var desc = document.getElementById("exam-desc").value;

    var exam = {
        id: Date.now(),
        name: name,
        date: date,
        description: desc,
        topics: []
    };

    exams.push(exam);
    saveData();

    document.getElementById("exam-name").value = "";
    document.getElementById("exam-date").value = "";
    document.getElementById("exam-desc").value = "";

    renderExams();
}

function deleteExam(id) {
    id = Number(id);
    if (confirm("Удалить экзамен?")) {
        var newExams = [];
        for (var i = 0; i < exams.length; i++) {
            if (exams[i].id !== id) {
                newExams.push(exams[i]);
            }
        }
        exams = newExams;
        saveData();
        renderExams();
    }
}

function renderExams() {
    var list = document.getElementById("exams-list");
    list.innerHTML = "";

    exams.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });

    for (var i = 0; i < exams.length; i++) {
        var ex = exams[i];
        var progress = getProgress(ex);
        var daysLeft = getDaysLeft(ex.date);

        var card = document.createElement("div");
        card.className = "card";

        var delBtn = "<span class='delete-btn' onclick='deleteExam(" + ex.id + ")'>[удалить]</span>";
        var openBtn = "<button onclick='openDetail(" + ex.id + ")'>Открыть / Темы</button>";
        
        var html = delBtn;
        html += "<b>" + ex.name + "</b><br>";
        html += "Дата: " + ex.date + " <span class='countdown'>(" + daysLeft + " дн.)</span><br>";
        html += "<div class='progress-bar'><div class='progress-fill' style='width:" + progress + "%'></div></div>";
        html += "<small>" + progress + "% готово</small><br>";
        html += openBtn;

        card.innerHTML = html;
        list.appendChild(card);
    }
}

function getProgress(exam) {
    if (exam.topics.length == 0) return 0;
    var done = 0;
    for (var i = 0; i < exam.topics.length; i++) {
        if (exam.topics[i].completed) done++;
    }
    return Math.round((done / exam.topics.length) * 100);
}

function getDaysLeft(dateStr) {
    var now = new Date();
    now.setHours(0,0,0,0);
    var examDate = new Date(dateStr);
    examDate.setHours(0,0,0,0);
    var diff = examDate - now;
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 0;
    return days;
}

function openDetail(id) {
    id = Number(id);
    sessionStorage.setItem("currentExamId", id);
    showSection("detail");
    renderDetail();
}

function renderDetail() {
    var id = Number(sessionStorage.getItem("currentExamId"));
    var exam = null;
    for (var i = 0; i < exams.length; i++) {
        if (exams[i].id === id) {
            exam = exams[i];
            break;
        }
    }
    if (!exam) {
        document.getElementById("detail-title").innerHTML = "Экзамен не найден";
        return;
    }

    document.getElementById("detail-title").innerHTML = exam.name;
    document.getElementById("detail-desc").innerHTML = exam.description || "(нет описания)";
    document.getElementById("detail-date").innerHTML = "Дата: " + exam.date;
    document.getElementById("detail-countdown").innerHTML = "<span class='countdown'>(" + getDaysLeft(exam.date) + " дн.)</span>";
    var progress = getProgress(exam);
    document.getElementById("detail-progress").style.width = progress + "%";
    document.getElementById("detail-progress-text").innerHTML = progress + "%";

    var topicsList = document.getElementById("topics-list");
    topicsList.innerHTML = "";

    if (exam.topics.length === 0) {
        topicsList.innerHTML = "<i>Тем пока нет. Добавьте ниже.</i>";
    }

    for (var j = 0; j < exam.topics.length; j++) {
        var topic = exam.topics[j];
        var div = document.createElement("div");
        div.className = "topic-item";

        var checked = topic.completed ? "checked" : "";
        div.innerHTML = "<input type='checkbox' " + checked + " onchange='toggleTopic(" + exam.id + ", " + topic.id + ")'> " + 
                        topic.name + 
                        " <span class='delete-btn' onclick='deleteTopic(" + exam.id + ", " + topic.id + ")'>[x]</span>";

        topicsList.appendChild(div);
    }
}

function addTopic() {
    if (!validateTopicInputs()) return;

    var id = Number(sessionStorage.getItem("currentExamId"));
    var name = document.getElementById("topic-name").value;

    for (var i = 0; i < exams.length; i++) {
        if (exams[i].id === id) {
            exams[i].topics.push({
                id: Date.now(),
                name: name,
                completed: false
            });
            break;
        }
    }

    saveData();
    document.getElementById("topic-name").value = "";
    renderDetail();
}

function deleteTopic(examId, topicId) {
    examId = Number(examId);
    topicId = Number(topicId);
    
    for (var i = 0; i < exams.length; i++) {
        if (exams[i].id === examId) {
            var newTopics = [];
            for (var j = 0; j < exams[i].topics.length; j++) {
                if (exams[i].topics[j].id !== topicId) {
                    newTopics.push(exams[i].topics[j]);
                }
            }
            exams[i].topics = newTopics;
            break;
        }
    }
    saveData();
    renderDetail();
}

function toggleTopic(examId, topicId) {
    examId = Number(examId);
    topicId = Number(topicId);

    for (var i = 0; i < exams.length; i++) {
        if (exams[i].id === examId) {
            for (var j = 0; j < exams[i].topics.length; j++) {
                if (exams[i].topics[j].id === topicId) {
                    exams[i].topics[j].completed = !exams[i].topics[j].completed;
                    break;
                }
            }
            break;
        }
    }
    saveData();
    renderDetail();
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function renderCalendar() {
    var months = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    document.getElementById("calendar-month").innerHTML = months[currentMonth] + " " + currentYear;

    var grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    var weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    for (var w = 0; w < 7; w++) {
        var header = document.createElement("div");
        header.className = "calendar-header";
        header.innerHTML = weekDays[w];
        grid.appendChild(header);
    }

    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    if (firstDay == 0) firstDay = 7;
    firstDay--; 

    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (var i = 0; i < firstDay; i++) {
        var empty = document.createElement("div");
        empty.className = "calendar-day";
        empty.style.border = "none";
        grid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
        var dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        dayDiv.innerHTML = "<span class='bg-num'>" + d + "</span><span class='fg-num'>" + d + "</span>";

        var m = String(currentMonth + 1).padStart(2, '0');
        var dd = String(d).padStart(2, '0');
        var dateStr = currentYear + "-" + m + "-" + dd;

        for (var e = 0; e < exams.length; e++) {
            if (exams[e].date == dateStr) {
                dayDiv.classList.add("has-exam");
                dayDiv.title = exams[e].name;
            }
        }

        grid.appendChild(dayDiv);
    }
}

function renderStats() {
    var totalTopics = 0;
    var doneTopics = 0;

    for (var i = 0; i < exams.length; i++) {
        totalTopics += exams[i].topics.length;
        for (var j = 0; j < exams[i].topics.length; j++) {
            if (exams[i].topics[j].completed) doneTopics++;
        }
    }

    var totalProgress = 0;
    if (totalTopics > 0) {
        totalProgress = Math.round((doneTopics / totalTopics) * 100);
    }

    document.getElementById("total-progress").style.width = totalProgress + "%";
    document.getElementById("total-progress-text").innerHTML = totalProgress + "% (" + doneTopics + "/" + totalTopics + " тем)";

    var upcoming = document.getElementById("upcoming-exams");
    upcoming.innerHTML = "";

    var sorted = exams.slice();
    sorted.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });

    var count = 0;
    for (var k = 0; k < sorted.length; k++) {
        if (getDaysLeft(sorted[k].date) >= 0 && count < 5) {
            var p = document.createElement("p");
            p.innerHTML = sorted[k].name + " - " + sorted[k].date + " (через " + getDaysLeft(sorted[k].date) + " дн.)";
            upcoming.appendChild(p);
            count++;
        }
    }
    if (count == 0) {
        upcoming.innerHTML = "Нет предстоящих экзаменов";
    }
}

function checkNotifications() {
    var notif = document.getElementById("notification");
    var messages = [];

    for (var i = 0; i < exams.length; i++) {
        var days = getDaysLeft(exams[i].date);
        if (days <= 3 && days >= 0) {
            messages.push("Экзамен '" + exams[i].name + "' через " + days + " дн.!");
        }
    }

    if (messages.length > 0) {
        notif.innerHTML = messages.join("<br>");
        notif.style.display = "block";
        setTimeout(function() {
            notif.style.display = "none";
        }, 5000);
    }
}

loadData();
renderExams();
showSection('exams');