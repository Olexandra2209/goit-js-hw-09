import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startButton = document.querySelector('button[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let countdownIntervalId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      Notiflix.Report.failure(
        'Error',
        'Please choose a date in the future',
        'OK'
      );
      document.querySelector('button[data-start]').disabled = true;
    } else {
      document.querySelector('button[data-start]').disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

startButton.addEventListener('click', () => {
  const selectedDate = flatpickr.parseDate(
    document.querySelector('#datetime-picker').value
  );

  if (selectedDate) {
    clearInterval(countdownIntervalId);
    startButton.disabled = true;

    countdownIntervalId = setInterval(() => {
      const currentDate = new Date();
      const timeDifference = selectedDate.getTime() - currentDate.getTime();

      if (timeDifference <= 0) {
        clearInterval(countdownIntervalId);
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        startButton.disabled = false;
        Notiflix.Report.success('Done', 'Countdown timer completed', 'OK');
      } else {
        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        daysElement.textContent = addLeadingZero(days);
        hoursElement.textContent = addLeadingZero(hours);
        minutesElement.textContent = addLeadingZero(minutes);
        secondsElement.textContent = addLeadingZero(seconds);
      }
    }, 1000);
  }
});
