let alarmTime = null;
let alarmCheckerInterval = null;
let isRinging = false;

const alarmAudio = new Audio("alarm.wav");
alarmAudio.loop = true; 

setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour12: false });
    document.getElementById('clockDisplay').innerText = timeString;
}, 1000);


function toggleAlarm() {
    const input = document.getElementById('alarmTimeInput');
    const status = document.getElementById('statusMessage');
    const actionBtn = document.getElementById('actionBtn');

    if (alarmTime) {
        clearExistingAlarm();
        status.innerText = "Alarm cancelled.";
        actionBtn.innerText = "Set Alarm";
        actionBtn.style.background = "#38bdf8";
        return;
    }

    if (!input.value) {
        status.innerText = "Please select a valid time first!";
        return;
    }

    alarmTime = input.value; 
    status.innerText = `Alarm set for ${alarmTime}`;
    actionBtn.innerText = "Cancel Alarm";
    actionBtn.style.background = "#9fbae0";
    

    alarmCheckerInterval = setInterval(() => {
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        if (currentTime === alarmTime && !isRinging) {
            triggerAlarm();
        }
    }, 1000);
}

function triggerAlarm() {
    isRinging = true;
    clearExistingAlarm(); 

    document.getElementById('statusMessage').innerText = "⏰ WAKE UP! ALARM IS RINGING!";
    document.getElementById('ringControls').style.display = "flex";
    document.getElementById('actionBtn').style.display = "none";

    alarmAudio.play().catch(error => {
        console.log("Audio play blocked by browser. Click anywhere on the screen first.");
    });
}

function snoozeAlarm() {
    alarmAudio.pause(); 
    alarmAudio.currentTime = 0; 
    isRinging = false;

    document.getElementById('ringControls').style.display = "none";
    document.getElementById('statusMessage').innerText = "💤 Snoozed for 5 minutes...";

    setTimeout(() => {
        if (!alarmTime && !isRinging) {
            triggerAlarm();
        }
    }, 5 * 60 * 1000); 
}

function dismissAlarm() {
    isRinging = false;
    alarmAudio.pause();
    alarmAudio.currentTime = 0;

    document.getElementById('ringControls').style.display = "none";
    document.getElementById('actionBtn').style.display = "block";
    document.getElementById('actionBtn').innerText = "Set Alarm";
    document.getElementById('actionBtn').style.background = "#38bdf8";
    document.getElementById('statusMessage').innerText = "Alarm dismissed.";
    document.getElementById('alarmTimeInput').value = "";
    alarmTime = null;
}

function clearExistingAlarm() {
    if (alarmCheckerInterval) {
        clearInterval(alarmCheckerInterval);
    }
}
