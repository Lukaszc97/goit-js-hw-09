import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval;

flatpickr(dateTimePicker, {
  enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
    defaultDate: new Date(),
        minuteIncrement: 1,
  onClose: function(selectedDates) {
    let selectedDate = selectedDates[0];

    if (!selectedDate) {
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      window.alert('Please choose a date in the future.');
      startButton.disabled = true;
      return;
    }

    startButton.disabled = false;
  }
});

startButton.addEventListener('click', () => {
  const selectedDate = dateTimePicker._flatpickr.selectedDates[0];

  if (!selectedDate) {
    window.alert('Please choose a date first.');
    return;
  }

  startButton.disabled = true;

  let remainingTime = selectedDate.getTime() - Date.now();

  countdownInterval = setInterval(() => {
    const { days, hours, minutes, seconds } = convertMs(remainingTime);

    daysValue.textContent = days.toString().padStart(2, '0');
    hoursValue.textContent = hours.toString().padStart(2, '0');
    minutesValue.textContent = minutes.toString().padStart(2, '0');
    secondsValue.textContent = seconds.toString().padStart(2, '0');

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      startButton.disabled = false;
    } else {
      remainingTime -= 1000;
    }
  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
