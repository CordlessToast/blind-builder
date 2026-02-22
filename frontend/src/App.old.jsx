document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const createRoomBtn = document.getElementById('create-room-btn');
    const showJoinBtn = document.getElementById('show-join-btn');
    const joinRoomSection = document.getElementById('join-room-section');
    const roomCodeInput = document.getElementById('room-code');
    const joinRoomBtn = document.getElementById('join-room-btn');

    function getUsername() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a username first.');
            return null;
        }
        return username;
    }

    createRoomBtn.addEventListener('click', () => {
        const username = getUsername();
        if (username) {
            // Replace with your backend room creation logic
            console.log(`${username} is creating a room...`);
            alert(`Room created for ${username}!`);
        }
    });

    showJoinBtn.addEventListener('click', () => {
        joinRoomSection.classList.toggle('hidden');
    });

    joinRoomBtn.addEventListener('click', () => {
        const username = getUsername();
        const roomCode = roomCodeInput.value.trim();
        
        if (username) {
            if (!roomCode) {
                alert('Please enter a room code.');
                return;
            }
            // Replace with your backend room joining logic
            console.log(`${username} is joining room ${roomCode}...`);
            alert(`${username} joined room ${roomCode}!`);
        }
    });
});