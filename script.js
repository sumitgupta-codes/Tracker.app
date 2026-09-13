/* =========================================================
   HABITFLOW
   Complete Habit Tracker
   ========================================================= */


/* ================= DOM ================= */

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");

const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");

const openModal = document.getElementById("openModal");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const modalOverlay = document.getElementById("modalOverlay");

const habitForm = document.getElementById("habitForm");
const habitName = document.getElementById("habitName");

const calendarPrev = document.getElementById("prevMonth");
const calendarNext = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");

const navItems = document.querySelectorAll(".nav-item");

const dashboardPage = document.getElementById("dashboardPage");
const statisticsPage = document.getElementById("statisticsPage");


/* ================= DATA ================= */

let habits =
    JSON.parse(localStorage.getItem("habitFlowHabits")) || [];


let currentDate = new Date();


let selectedEmoji = "📚";


/* =========================================================
   STORAGE
   ========================================================= */

function saveHabits() {

    localStorage.setItem(
        "habitFlowHabits",
        JSON.stringify(habits)
    );

}


/* =========================================================
   DATE FUNCTIONS
   ========================================================= */

function dateKey(year, month, day) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

}


function getTodayKey() {

    const today = new Date();

    return dateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

}


function getDateObject(key) {

    const parts = key.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function showModal() {

    modalOverlay.classList.add("show");

    setTimeout(() => {

        habitName.focus();

    }, 100);

}


function hideModal() {

    modalOverlay.classList.remove("show");

    habitForm.reset();

    selectedEmoji = "📚";

    document.querySelectorAll(".emoji").forEach(
        (button, index) => {

            button.classList.toggle(
                "active",
                index === 0
            );

        }
    );

}


openModal.addEventListener(
    "click",
    showModal
);


emptyAddBtn.addEventListener(
    "click",
    showModal
);


closeModal.addEventListener(
    "click",
    hideModal
);


cancelModal.addEventListener(
    "click",
    hideModal
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (event.target === modalOverlay) {

            hideModal();

        }

    }
);


/* =========================================================
   EMOJI PICKER
   ========================================================= */

document.querySelectorAll(".emoji").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".emoji")
                    .forEach(btn => {

                        btn.classList.remove("active");

                    });


                button.classList.add("active");

                selectedEmoji =
                    button.textContent;

            }
        );

    }
);


/* =========================================================
   ADD HABIT
   ========================================================= */

habitForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            habitName.value.trim();


        if (!name) {

            return;

        }


        const newHabit = {

            id: Date.now(),

            name: name,

            emoji: selectedEmoji,

            completed: {}

        };


        habits.push(newHabit);


        saveHabits();

        hideModal();

        renderAll();

    }
);


/* =========================================================
   DELETE HABIT
   ========================================================= */

function deleteHabit(id) {

    const confirmed =
        confirm("Are you sure you want to delete this habit?");


    if (!confirmed) {

        return;

    }


    habits =
        habits.filter(
            habit => habit.id !== id
        );


    saveHabits();

    renderAll();

}


/* =========================================================
   TOGGLE HABIT
   ========================================================= */

function toggleHabitDay(
    habitId,
    key
) {

    const habit =
        habits.find(
            habit => habit.id === habitId
        );


    if (!habit) {

        return;

    }


    if (habit.completed[key]) {

        delete habit.completed[key];

    } else {

        habit.completed[key] = true;

    }


    saveHabits();

    renderAll();

}


/* =========================================================
   MONTH INFO
   ========================================================= */

function getMonthInfo() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    return {
        year,
        month,
        totalDays,
        firstDay
    };

}


/* =========================================================
   CALENDAR
   ========================================================= */

function renderCalendar() {

    calendar.innerHTML = "";


    const {
        year,
        month,
        totalDays,
        firstDay
    } = getMonthInfo();


    const monthName =
        currentDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    monthTitle.textContent =
        `${monthName} ${year}`;


    const weekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    weekdays.forEach(
        day => {

            const element =
                document.createElement("div");


            element.className =
                "weekday";


            element.textContent =
                day;


            calendar.appendChild(element);

        }
    );


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");


        empty.className =
            "day empty";


        calendar.appendChild(empty);

    }


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const key =
            dateKey(
                year,
                month,
                day
            );


        const element =
            document.createElement("div");


        element.className =
            "day";


        element.textContent =
            day;


        if (key === getTodayKey()) {

            element.classList.add("today");

        }


        const completedCount =
            habits.filter(
                habit =>
                    habit.completed[key]
            ).length;


        if (
            completedCount > 0 &&
            habits.length > 0
        ) {

            element.classList.add(
                "has-progress"
            );


            const dot =
                document.createElement("span");


            dot.className =
                "progress-dot";


            element.appendChild(dot);

        }


        calendar.appendChild(element);

    }

}


/* =========================================================
   HABIT DAYS
   ========================================================= */

function createHabitDays(habit) {

    const container =
        document.createElement("div");


    container.className =
        "days-container";


    const {
        year,
        month,
        totalDays
    } = getMonthInfo();


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const key =
            dateKey(
                year,
                month,
                day
            );


        const button =
            document.createElement("button");


        button.className =
            "habit-day";


        if (habit.completed[key]) {

            button.classList.add(
                "completed"
            );

        }


        if (key === getTodayKey()) {

            button.classList.add(
                "today"
            );

        }


        const small =
            document.createElement("small");


        const date =
            new Date(
                year,
                month,
                day
            );


        small.textContent =
            date.toLocaleDateString(
                "default",
                {
                    weekday: "short"
                }
            ).slice(0, 2);


        button.appendChild(small);


        button.append(
            document.createTextNode(day)
        );


        button.title =
            habit.completed[key]
                ? "Mark incomplete"
                : "Mark complete";


        button.addEventListener(
            "click",
            () => {

                toggleHabitDay(
                    habit.id,
                    key
                );

            }
        );


        container.appendChild(button);

    }


    return container;

}


/* =========================================================
   HABIT COMPLETION
   ========================================================= */

function getHabitCompletion(
    habit,
    year = currentDate.getFullYear(),
    month = currentDate.getMonth()
) {

    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    let completed = 0;


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const key =
            dateKey(
                year,
                month,
                day
            );


        if (habit.completed[key]) {

            completed++;

        }

    }


    if (totalDays === 0) {

        return 0;

    }


    return Math.round(
        (completed / totalDays) * 100
    );

}


/* =========================================================
   CURRENT STREAK
   ========================================================= */

function getCurrentStreak(habit) {

    let streak = 0;


    const date =
        new Date();


    while (true) {

        const key =
            dateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );


        if (!habit.completed[key]) {

            break;

        }


        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;

}


/* =========================================================
   BEST STREAK
   ========================================================= */

function getBestStreak(habit) {

    const dates =
        Object.keys(
            habit.completed
        )
        .filter(
            key =>
                habit.completed[key]
        )
        .sort();


    if (dates.length === 0) {

        return 0;

    }


    let best = 1;

    let current = 1;


    for (
        let i = 1;
        i < dates.length;
        i++
    ) {

        const previous =
            getDateObject(
                dates[i - 1]
            );


        const currentDateObject =
            getDateObject(
                dates[i]
            );


        const difference =
            (
                currentDateObject -
                previous
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (difference === 1) {

            current++;

            best =
                Math.max(
                    best,
                    current
                );

        } else {

            current = 1;

        }

    }


    return best;

}


/* =========================================================
   HABIT LIST
   ========================================================= */

function renderHabits() {

    habitList.innerHTML = "";


    if (habits.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    habits.forEach(
        habit => {

            const wrapper =
                document.createElement("div");


            wrapper.className =
                "habit-wrapper";


            /* HEADER */

            const header =
                document.createElement("div");


            header.className =
                "habit-header";


            const info =
                document.createElement("div");


            info.className =
                "habit-info";


            const icon =
                document.createElement("div");


            icon.className =
                "habit-icon";


            icon.textContent =
                habit.emoji;


            const text =
                document.createElement("div");


            const name =
                document.createElement("div");


            name.className =
                "habit-name";


            name.textContent =
                habit.name;


            const subtitle =
                document.createElement("div");


            subtitle.className =
                "habit-subtitle";


            subtitle.textContent =
                `${getHabitCompletion(habit)}% completed this month`;


            text.appendChild(name);

            text.appendChild(subtitle);


            info.appendChild(icon);

            info.appendChild(text);


            /* ACTIONS */

            const actions =
                document.createElement("div");


            actions.className =
                "habit-actions";


            const streak =
                document.createElement("div");


            streak.className =
                "habit-streak";


            streak.textContent =
                `🔥 ${getCurrentStreak(habit)} day streak`;


            const deleteButton =
                document.createElement("button");


            deleteButton.className =
                "delete-btn";


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Delete habit";


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteHabit(
                        habit.id
                    );

                }
            );


            actions.appendChild(streak);

            actions.appendChild(
                deleteButton
            );


            header.appendChild(info);

            header.appendChild(actions);


            /* DAYS */

            const days =
                createHabitDays(
                    habit
                );


            wrapper.appendChild(header);

            wrapper.appendChild(days);


            habitList.appendChild(
                wrapper
            );

        }
    );

}


/* =========================================================
   GLOBAL DASHBOARD STATS
   ========================================================= */

function renderDashboardStats() {

    const currentStreak =
        habits.length === 0
            ? 0
            : Math.max(
                ...habits.map(
                    habit =>
                        getCurrentStreak(habit)
                )
            );


    const bestStreak =
        habits.length === 0
            ? 0
            : Math.max(
                ...habits.map(
                    habit =>
                        getBestStreak(habit)
                )
            );


    const {
        year,
        month,
        totalDays
    } = getMonthInfo();


    let totalPossible =
        habits.length * totalDays;


    let totalCompleted = 0;


    habits.forEach(
        habit => {

            for (
                let day = 1;
                day <= totalDays;
                day++
            ) {

                const key =
                    dateKey(
                        year,
                        month,
                        day
                    );


                if (habit.completed[key]) {

                    totalCompleted++;

                }

            }

        }
    );


    const completion =
        totalPossible === 0
            ? 0
            : Math.round(
                (
                    totalCompleted /
                    totalPossible
                ) * 100
            );


    document.getElementById(
        "currentStreak"
    ).textContent =
        `${currentStreak} days`;


    document.getElementById(
        "bestStreak"
    ).textContent =
        `${bestStreak} days`;


    document.getElementById(
        "completion"
    ).textContent =
        `${completion}%`;


    document.getElementById(
        "totalHabits"
    ).textContent =
        habits.length;

}


/* =========================================================
   STATISTICS
   ========================================================= */

function renderStatistics() {

    const currentStreak =
        habits.length === 0
            ? 0
            : Math.max(
                ...habits.map(
                    habit =>
                        getCurrentStreak(habit)
                )
            );


    const bestStreak =
        habits.length === 0
            ? 0
            : Math.max(
                ...habits.map(
                    habit =>
                        getBestStreak(habit)
                )
            );


    /* MONTH COMPLETION */

    const {
        year,
        month,
        totalDays
    } = getMonthInfo();


    const totalPossible =
        habits.length *
        totalDays;


    let completed =
        0;


    habits.forEach(
        habit => {

            for (
                let day = 1;
                day <= totalDays;
                day++
            ) {

                const key =
                    dateKey(
                        year,
                        month,
                        day
                    );


                if (habit.completed[key]) {

                    completed++;

                }

            }

        }
    );


    const overall =
        totalPossible === 0
            ? 0
            : Math.round(
                (
                    completed /
                    totalPossible
                ) * 100
            );


    document.getElementById(
        "statsCompletion"
    ).textContent =
        `${overall}%`;


    document.getElementById(
        "statsCurrentStreak"
    ).textContent =
        `${currentStreak} days`;


    document.getElementById(
        "statsBestStreak"
    ).textContent =
        `${bestStreak} days`;


    document.getElementById(
        "statsTotalHabits"
    ).textContent =
        habits.length;


    renderWeekChart();

    renderPerformance();

}


/* =========================================================
   WEEKLY CHART
   ========================================================= */

function renderWeekChart() {

    const chart =
        document.getElementById(
            "weekChart"
        );


    chart.innerHTML = "";


    const today =
        new Date();


    const dayOfWeek =
        today.getDay();


    const sunday =
        new Date(today);


    sunday.setDate(
        today.getDate() - dayOfWeek
    );


    const labels = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(sunday);


        date.setDate(
            sunday.getDate() + i
        );


        const key =
            dateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );


        let completed = 0;


        habits.forEach(
            habit => {

                if (habit.completed[key]) {

                    completed++;

                }

            }
        );


        const percentage =
            habits.length === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        habits.length
                    ) * 100
                );


        const column =
            document.createElement("div");


        column.className =
            "week-day-column";


        const percent =
            document.createElement("div");


        percent.className =
            "week-percentage";


        percent.textContent =
            `${percentage}%`;


        const barContainer =
            document.createElement("div");


        barContainer.className =
            "week-bar-container";


        const bar =
            document.createElement("div");


        bar.className =
            "week-bar";


        bar.style.height =
            `${percentage}%`;


        barContainer.appendChild(bar);


        const dayName =
            document.createElement("div");


        dayName.className =
            "week-day-name";


        dayName.textContent =
            labels[i];


        const dayNumber =
            document.createElement("div");


        dayNumber.className =
            "week-day-number";


        dayNumber.textContent =
            date.getDate();


        column.appendChild(percent);

        column.appendChild(
            barContainer
        );

        column.appendChild(dayName);

        column.appendChild(dayNumber);


        chart.appendChild(column);

    }

}


/* =========================================================
   PERFORMANCE
   ========================================================= */

function renderPerformance() {

    const container =
        document.getElementById(
            "statisticsHabitList"
        );


    container.innerHTML = "";


    if (habits.length === 0) {

        container.innerHTML = `
            <div class="empty-performance">
                No habits available yet.
            </div>
        `;

        document.getElementById(
            "bestHabitName"
        ).textContent = "—";


        document.getElementById(
            "worstHabitName"
        ).textContent = "—";


        document.getElementById(
            "bestHabitPercent"
        ).textContent =
            "Create a habit to see statistics.";


        document.getElementById(
            "worstHabitPercent"
        ).textContent =
            "Create a habit to see statistics.";


        return;

    }


    const performance =
        habits.map(
            habit => ({
                habit,
                percentage:
                    getHabitCompletion(
                        habit
                    )
            })
        );


    performance.sort(
        (a, b) =>
            b.percentage -
            a.percentage
    );


    performance.forEach(
        item => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "performance-row";


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "performance-name";


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "performance-icon";


            icon.textContent =
                item.habit.emoji;


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                item.habit.name;


            name.appendChild(icon);

            name.appendChild(text);


            const progress =
                document.createElement(
                    "div"
                );


            progress.className =
                "performance-progress";


            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "performance-bar";


            const fill =
                document.createElement(
                    "div"
                );


            fill.className =
                "performance-fill";


            fill.style.width =
                `${item.percentage}%`;


            bar.appendChild(fill);

            progress.appendChild(bar);


            const percent =
                document.createElement(
                    "div"
                );


            percent.className =
                "performance-percent";


            percent.textContent =
                `${item.percentage}%`;


            row.appendChild(name);

            row.appendChild(progress);

            row.appendChild(percent);


            container.appendChild(row);

        }
    );


    const best =
        performance[0];


    const worst =
        performance[
            performance.length - 1
        ];


    document.getElementById(
        "bestHabitName"
    ).textContent =
        best.habit.name;


    document.getElementById(
        "bestHabitPercent"
    ).textContent =
        `${best.percentage}% completion this month`;


    document.getElementById(
        "worstHabitName"
    ).textContent =
        worst.habit.name;


    document.getElementById(
        "worstHabitPercent"
    ).textContent =
        `${worst.percentage}% completion this month`;

}


/* =========================================================
   NAVIGATION
   ========================================================= */

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                navItems.forEach(
                    nav => {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                const page =
                    item.dataset.page;


                if (page === "dashboard") {

                    dashboardPage.classList.add(
                        "active-page"
                    );

                    statisticsPage.classList.remove(
                        "active-page"
                    );

                }


                if (page === "statistics") {

                    dashboardPage.classList.remove(
                        "active-page"
                    );

                    statisticsPage.classList.add(
                        "active-page"
                    );

                    renderStatistics();

                }

            }
        );

    }
);


/* =========================================================
   MONTH NAVIGATION
   ========================================================= */

calendarPrev.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderAll();

    }
);


calendarNext.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderAll();

    }
);


todayBtn.addEventListener(
    "click",
    () => {

        currentDate =
            new Date();

        renderAll();

    }
);


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderAll() {

    renderCalendar();

    renderHabits();

    renderDashboardStats();

    renderStatistics();

}


/* =========================================================
   START APPLICATION
   ========================================================= */

renderAll();