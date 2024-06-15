const daysContainer = document.getElementById('days');
const monthYear = document.getElementById('monthYear');
const eventForm = document.getElementById('eventForm');
const eventIdInput = document.getElementById('eventId');
const eventDateInput = document.getElementById('eventDate');
const eventTitleInput = document.getElementById('eventTitle');

const holidays = ['2023-12-25', '2024-01-01', '2024-07-04']; // Example holidays

let events = JSON.parse(localStorage.getItem('events')) || [];
let currentDate = new Date();

function renderCalendar() {
    currentDate.setDate(1);
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    const firstDayIndex = currentDate.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    monthYear.innerText = `${months[month]} ${year}`;
    let days = '';
    
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }
    
    for (let i = 1; i <= lastDay; i++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isHoliday = holidays.includes(date);
        const event = events.find(event => event.date === date);
        days += `<div class="${isHoliday ? 'holiday' : ''}" onclick="editEvent('${date}')">
            ${i}${event ? `<span>${event.title}</span>` : ''}
        </div>`;
    }
    
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
    }
    
    daysContainer.innerHTML = days;
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

function saveEvent(event) {
    event.preventDefault();
    
    const eventId = eventIdInput.value;
    const eventDate = eventDateInput.value;
    const eventTitle = eventTitleInput.value;
    
    if (eventId) {
        const eventIndex = events.findIndex(event => event.id === eventId);
        events[eventIndex] = { id: eventId, date: eventDate, title: eventTitle };
    } else {
        events.push({ id: Date.now().toString(), date: eventDate, title: eventTitle });
    }
    
    localStorage.setItem('events', JSON.stringify(events));
    renderCalendar();
    clearForm();
}

function editEvent(date) {
    const event = events.find(event => event.date === date);
    
    if (event) {
        eventIdInput.value = event.id;
        eventDateInput.value = event.date;
        eventTitleInput.value = event.title;
    } else {
        eventDateInput.value = date;
        eventTitleInput.value = '';
    }
}

function clearForm() {
    eventIdInput.value = '';
    eventDateInput.value = '';
    eventTitleInput.value = '';
}

eventForm.addEventListener('submit', saveEvent);
renderCalendar();
