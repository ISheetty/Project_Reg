// Хранилище списков, привязанных к датам
let listsByDate = {};

// Элементы календаря
let calendarElement = document.getElementById('calendar');
let yearSelector = document.getElementById('year-selector');
let monthSelector = document.getElementById('month-selector');
let prevYearBtn = document.getElementById('prev-year');
let nextYearBtn = document.getElementById('next-year');
let prevMonthBtn = document.getElementById('prev-month');
let nextMonthBtn = document.getElementById('next-month');
let dateButton = document.querySelector('.date-btn');

// Текущая выбранная дата
let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

// Инициализация селекторов года
for (let i = year - 50; i <= year + 50; i++) {
    let option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === year) option.selected = true;
    yearSelector.append(option);
}

// Обновление кнопки с выбранной датой
function updateDateButton(day, month, year) {
    const formattedDate = `${day}.${month < 10 ? '0' + month : month}.${year}`;
    dateButton.innerHTML = formattedDate;
    loadListsForDate(formattedDate);
    updateDayColor(formattedDate); // Обновляем цвет выбранного дня
}

// Генерация календаря
function generateCalendar(year, month) {
    let date = new Date(year, month, 1);
    let grid = calendarElement.querySelector('.grid');
    grid.innerHTML = '';

    let startDay = (date.getDay() + 6) % 7; // Сдвиг начала недели на понедельник
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // Пустые ячейки до начала месяца
    for (let i = 0; i < startDay; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.classList.add('grid-item');
        grid.append(emptyCell);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        let dayCell = document.createElement('div');
        dayCell.classList.add('grid-item');
        dayCell.textContent = day;

        // Событие для выбора дня
        dayCell.addEventListener('click', function () {
            updateDateButton(day, month + 1, year);
        });

        grid.append(dayCell);
    }
}

// Изменение месяца
function changeMonth(delta) {
    let month = parseInt(monthSelector.value);
    let year = parseInt(yearSelector.value);

    month += delta;

    if (month < 1) {
        month = 12;
        year -= 1;
    } else if (month > 12) {
        month = 1;
        year += 1;
    }

    monthSelector.value = month;
    yearSelector.value = year;

    updateDateButton(day, month, year);
    generateCalendar(year, month - 1);
}

// Изменение года
function changeYear(delta) {
    let year = parseInt(yearSelector.value);
    year += delta;
    yearSelector.value = year;
    updateDateButton(day, parseInt(monthSelector.value), year);
    generateCalendar(year, parseInt(monthSelector.value) - 1);
}

// Обработчики переключения месяца и года
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));
prevYearBtn.addEventListener('click', () => changeYear(-1));
nextYearBtn.addEventListener('click', () => changeYear(1));

// Изменение года и месяца через селекторы
yearSelector.addEventListener('change', () => {
    generateCalendar(parseInt(yearSelector.value), parseInt(monthSelector.value) - 1);
});
monthSelector.addEventListener('change', () => {
    generateCalendar(parseInt(yearSelector.value), parseInt(monthSelector.value) - 1);
});

// Инициализация календаря
updateDateButton(day, month, year);
generateCalendar(year, month - 1);

// Функция для изменения цвета дня
function updateDayColor(date) {
    const selectedStatus = document.getElementById("statusSelector").value;
    const days = document.querySelectorAll(".calendar-container .grid .grid-item");

    days.forEach(dayCell => {
        // Очистка цвета перед изменением
        dayCell.style.backgroundColor = '';
        if (dayCell.textContent.trim() === date.split('.')[0]) {
            // Изменение цвета для выбранного дня
            if (selectedStatus === "hard") {
                dayCell.style.backgroundColor = "red";  // Красный для сложного дня
            } else if (selectedStatus === "medium") {
                dayCell.style.backgroundColor = "yellow";  // Желтый для среднего дня
            } else if (selectedStatus === "easy") {
                dayCell.style.backgroundColor = "green";  // Зеленый для легкого дня
            }
        }
    });
}

// Обработчик изменения статуса дня
document.getElementById("statusSelector").addEventListener("change", () => {
    updateDayColor(dateButton.innerHTML); // Обновляем цвет дня при изменении статуса
});

// Зберігання статусу в localStorage (при оновленні)
function saveToLocalStorage() {
    localStorage.setItem('dayStatuses', JSON.stringify(dayStatuses));
}

// Завантаження статусів при завантаженні сторінки
function loadFromLocalStorage() {
    const savedStatuses = JSON.parse(localStorage.getItem('dayStatuses'));
    if (savedStatuses) {
        dayStatuses = savedStatuses;
    }
    changeDayColor();
}

// Завантаження статусів при завантаженні сторінки
window.onload = function() {
    loadFromLocalStorage();
};


// Работа с вкладками
let tabButtons = document.querySelectorAll('.tab-button');
let tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        tabContents[index].classList.add('active');
    });
});
tabButtons[0].classList.add('active');
tabContents[0].classList.add('active');

// Модальное окно для списков
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Добавление файла в список
let fileList = document.getElementById('fileList');
let fileInput = document.getElementById('fileInput');

function addFile() {
    let fileName = fileInput.value.trim();
    if (!fileName) {
        alert('Please enter a file name.');
        return;
    }

    let li = createListItem(fileName);
    fileList.appendChild(li);
    fileInput.value = '';
}

// Создание элемента списка
function createListItem(fileName) {
    let li = document.createElement('li');

    let textSpan = document.createElement('span');
    textSpan.textContent = fileName;
    li.appendChild(textSpan);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => fileList.removeChild(li));

    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        let newName = prompt("Edit item:", textSpan.textContent);
        if (newName) textSpan.textContent = newName;
    });

    li.appendChild(deleteButton);
    li.appendChild(editButton);

    return li;
}

// Загрузка списков для выбранной даты
function loadListsForDate(date) {
    let activeTabContent = getActiveTabContent();
    if (!activeTabContent) return;

    activeTabContent.innerHTML = '';
    if (listsByDate[date]) {
        listsByDate[date].forEach(list => {
            let listContainer = document.createElement('div');
            let title = document.createElement('div');
            title.textContent = list.name;

            let content = document.createElement('div');
            list.items.forEach(item => {
                let li = createListItem(item);
                content.appendChild(li);
            });

            listContainer.appendChild(title);
            listContainer.appendChild(content);
            activeTabContent.appendChild(listContainer);
        });
    }
}

// Сохранение списка
function saveListToActiveTab() {
    let listItems = fileList.querySelectorAll('li');
    if (listItems.length === 0) {
        alert('No items to save.');
        return;
    }

    let listNameInput = document.getElementById('listNameInput');
    let listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter a list name.');
        return;
    }

    const selectedDate = dateButton.innerHTML;
    if (!listsByDate[selectedDate]) listsByDate[selectedDate] = [];

    let newList = {
        name: listName,
        items: Array.from(listItems).map(item => item.querySelector('span').textContent)
    };

    listsByDate[selectedDate].push(newList);

    listNameInput.value = '';
    fileList.innerHTML = '';
    closeModal();
    loadListsForDate(selectedDate);
}

function getActiveTabContent() {
    return document.querySelector('.tab-content.active');
}

// Модальное окно выбора действия
function openActionModal() {
    document.getElementById('action-modal').style.display = 'block';
}

function closeActionModal() {
    document.getElementById('action-modal').style.display = 'none';
}

function openListModal() {
    closeActionModal();
    openModal();
}

// Модальное окно для заметок
let notes = [];
function openNoteModal() {
    closeActionModal();
    document.getElementById('note-modal').style.display = 'block';
}

function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
}
// Сохранение заметки
function saveNote() {
    let title = document.getElementById('noteTitleInput').value.trim();
    let text = document.getElementById('noteTextInput').value.trim();
    if (!title || !text) {
        alert('Заповніть всі поля.');
        return;
    }

    const selectedDate = dateButton.innerHTML;
    const activeTab = document.querySelector('.tab-button.active').textContent;

    if (!listsByDate[selectedDate]) listsByDate[selectedDate] = {};
    if (!listsByDate[selectedDate][activeTab]) listsByDate[selectedDate][activeTab] = { lists: [], notes: [] };

    listsByDate[selectedDate][activeTab].notes.push({ title, text });

    document.getElementById('noteTitleInput').value = '';
    document.getElementById('noteTextInput').value = '';

    saveToLocalStorage();
    updateNoteList();
    closeNoteModal();
}



// Обновление списка заметок
function updateNoteList() {
    let noteList = document.getElementById('noteList');
    noteList.innerHTML = '';

    const selectedDate = dateButton.innerHTML; // Текущая выбранная дата
    const activeTab = document.querySelector('.tab-button.active').textContent; // Название активной вкладки

    // Проверяем, есть ли заметки для текущей даты и вкладки
    if (listsByDate[selectedDate] && listsByDate[selectedDate][activeTab]) {
        const notes = listsByDate[selectedDate][activeTab].notes;

        notes.forEach((note, index) => {
            let noteContainer = document.createElement('div');
            noteContainer.classList.add('note-container');

            let titleElement = document.createElement('h3');
            titleElement.textContent = note.title;

            let textElement = document.createElement('p');
            textElement.textContent = note.text;

            let actionsContainer = document.createElement('div');
            actionsContainer.classList.add('note-actions');

            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editNote(index));

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteNote(index));

            actionsContainer.appendChild(editButton);
            actionsContainer.appendChild(deleteButton);

            noteContainer.appendChild(titleElement);
            noteContainer.appendChild(textElement);
            noteContainer.appendChild(actionsContainer);

            noteList.appendChild(noteContainer);
        });
    }
}

// Редактирование заметки
function editNote(index) {
    const selectedDate = dateButton.innerHTML;
    const activeTab = document.querySelector('.tab-button.active').textContent;

    let note = listsByDate[selectedDate][activeTab].notes[index];
    document.getElementById('noteTitleInput').value = note.title;
    document.getElementById('noteTextInput').value = note.text;

    deleteNote(index); // Удаляем старую версию заметки
    openNoteModal();
}

// Удаление заметки
function deleteNote(index) {
    const selectedDate = dateButton.innerHTML;
    const activeTab = document.querySelector('.tab-button.active').textContent;

    listsByDate[selectedDate][activeTab].notes.splice(index, 1); // Удаляем заметку
    saveToLocalStorage(); // Сохраняем изменения
    updateNoteList(); // Обновляем список заметок
}

// Загрузка списков для выбранной даты
function loadListsForDate(date) {
    let activeTabContent = getActiveTabContent();
    if (!activeTabContent) return;

    activeTabContent.innerHTML = ''; // Очищаем содержимое вкладки

    if (listsByDate[date]) {
        listsByDate[date].forEach(list => {
            let listContainer = document.createElement('div');
            listContainer.classList.add('saved-list');

            let title = document.createElement('div');
            title.classList.add('list-title');
            title.textContent = list.name;

            let content = document.createElement('div');
            content.classList.add('list-content');
            content.style.border = '1px solid #ccc'; // Добавляем обводку

            list.items.forEach(item => {
                let li = createListItem(item); // Используем функцию создания элемента списка
                content.appendChild(li);
            });

            // Скрытие/показ содержимого
            title.addEventListener('click', () => {
                content.classList.toggle('hidden');
                content.style.border = content.classList.contains('hidden') ? '1px solid #aaa' : '1px solid #ccc';
            });

            listContainer.appendChild(title);
            listContainer.appendChild(content);
            activeTabContent.appendChild(listContainer);
        });
    }
}
// колір дня

// Создание элемента списка (обновлено)
function createListItem(fileName) {
    let li = document.createElement('li');

    let textSpan = document.createElement('span');
    textSpan.textContent = fileName;
    li.appendChild(textSpan);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        li.remove(); // Удаляем элемент списка
    });

    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        let newName = prompt("Edit item:", textSpan.textContent);
        if (newName) textSpan.textContent = newName;
    });

    li.appendChild(deleteButton);
    li.appendChild(editButton);

    return li;
}

// Хранилище списков, привязанных к датам
// listsByDate = {
//     "21.12.2024": {
//         "Tab1": { lists: [], notes: [] },
//         "Tab2": { lists: [], notes: [] },
//     }
// };

// Обновление localStorage
function saveToLocalStorage() {
    localStorage.setItem('listsByDate', JSON.stringify(listsByDate));
}

// Обновление кнопки с выбранной датой
function updateDateButton(day, month, year) {
    const formattedDate = `${day}.${month < 10 ? '0' + month : month}.${year}`;
    dateButton.innerHTML = formattedDate;
    loadListsForDate(formattedDate);
}

// Загрузка списков для выбранной даты
function loadListsForDate(date) {
    let activeTabContent = getActiveTabContent();
    if (!activeTabContent) return;

    activeTabContent.innerHTML = ''; // Очищаем содержимое вкладки

    if (listsByDate[date]) {
        listsByDate[date].forEach((list, index) => {
            let listContainer = document.createElement('div');
            listContainer.classList.add('saved-list');

            let title = document.createElement('div');
            title.classList.add('list-title');
            title.textContent = list.name;

            let content = document.createElement('div');
            content.classList.add('list-content');
            content.style.border = '1px solid #ccc';

            list.items.forEach(item => {
                let li = createListItem(item, date, index);
                content.appendChild(li);
            });

            // Удаление пустого списка
            const deleteListIfEmpty = () => {
                if (content.children.length === 0) {
                    listsByDate[date].splice(index, 1);
                    if (listsByDate[date].length === 0) {
                        delete listsByDate[date];
                    }
                    saveToLocalStorage();
                    loadListsForDate(date);
                }
            };

            // Скрытие/показ содержимого
            title.addEventListener('click', () => {
                content.classList.toggle('hidden');
                content.style.border = content.classList.contains('hidden') ? '1px solid #aaa' : '1px solid #ccc';
            });

            listContainer.appendChild(title);
            listContainer.appendChild(content);
            activeTabContent.appendChild(listContainer);

            // Проверка на пустоту списка при загрузке
            deleteListIfEmpty();
        });
    }
}

// Создание элемента списка
function createListItem(fileName, date, listIndex) {
    let li = document.createElement('li');

    let textSpan = document.createElement('span');
    textSpan.textContent = fileName;
    li.appendChild(textSpan);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        li.remove(); // Удаляем элемент списка
        listsByDate[date][listIndex].items = listsByDate[date][listIndex].items.filter(item => item !== fileName);
        saveToLocalStorage(); // Сохраняем изменения
        loadListsForDate(date); // Перезагружаем список
    });
let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        let newName = prompt("Edit item:", textSpan.textContent);
        if (newName) {
            let items = listsByDate[date][listIndex].items;
            items[items.indexOf(fileName)] = newName;
            textSpan.textContent = newName;
            saveToLocalStorage(); // Сохраняем изменения
        }
    });

    li.appendChild(deleteButton);
    li.appendChild(editButton);

    return li;
}

// Сохранение списка
function saveListToActiveTab() {
    let listItems = fileList.querySelectorAll('li');
    if (listItems.length === 0) {
        alert('No items to save.');
        return;
    }

    let listNameInput = document.getElementById('listNameInput');
    let listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter a list name.');
        return;
    }

    const selectedDate = dateButton.innerHTML;
    if (!listsByDate[selectedDate]) listsByDate[selectedDate] = [];

    let newList = {
        name: listName,
        items: Array.from(listItems).map(item => item.querySelector('span').textContent)
    };

    listsByDate[selectedDate].push(newList);
    saveToLocalStorage();

    listNameInput.value = '';
    fileList.innerHTML = '';
    closeModal();
    loadListsForDate(selectedDate);
}


document.querySelector('.add-btn').onclick = openActionModal;