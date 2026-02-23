document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // --- 1. Banner Slideshow Logic (SMOOTH) ---
    // ==========================================
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlideIndex = 0;
    const slideIntervalTime = 4000; // Change image every 4 seconds

    function nextSlide() {
        if (slides.length > 0) {
            // Remove 'previous' class from all slides
            slides.forEach(slide => slide.classList.remove('previous'));
            
            // Turn the currently active slide into the background 'previous' slide
            slides[currentSlideIndex].classList.remove('active');
            slides[currentSlideIndex].classList.add('previous');
            
            // Move to the next image in line
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            // Fade the new image in on top
            slides[currentSlideIndex].classList.add('active');
        }
    }

    // Start auto-timer for the banner
    if (slides.length > 0) {
        setInterval(nextSlide, slideIntervalTime);
    }

    // ==========================================
    // --- 2. Element Selection (Chatbot) ---
    // ==========================================
    const chatBubble = document.getElementById("chat-bubble");
    const chatWindow = document.getElementById("chat-window");
    const closeChat = document.getElementById("close-chat");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const chatBody = document.getElementById("chat-body");
    const welcomeBubble = document.getElementById("chat-welcome-bubble");
    const quickButtons = document.querySelectorAll(".quick-options button");

    // --- 3. Welcome Bubble Animation ---
    // Show after 2 seconds, hide after 7 seconds
    setTimeout(() => { if(welcomeBubble) welcomeBubble.classList.add("visible"); }, 2000);
    setTimeout(() => { if(welcomeBubble) welcomeBubble.classList.remove("visible"); }, 7000);

    // --- 4. Toggle Chat Window ---
    if(chatBubble) {
        chatBubble.addEventListener("click", () => {
            chatWindow.classList.toggle("visible");
            if(welcomeBubble) welcomeBubble.classList.remove("visible");
        });
    }

    if(closeChat) {
        closeChat.addEventListener("click", () => {
            chatWindow.classList.remove("visible");
        });
    }

    // --- 5. Messaging Logic ---
    if(sendBtn) sendBtn.addEventListener("click", () => sendMessage());
    if(chatInput) {
        chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
    }

    // Handle Quick Option Buttons
    quickButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const question = btn.getAttribute("data-question");
            sendMessage(question); 
        });
    });

    // Initial Greeting (Only once per session)
    let initialGreetingSent = false;
    if(chatBubble) {
        chatBubble.addEventListener("click", () => {
            if (!initialGreetingSent) {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    displayMessage("Hello! I'm MCET Buddy. Ask me about courses, timings, fees, or our faculty!", "bot");
                }, 900);
                initialGreetingSent = true;
            }
        });
    }

    function sendMessage(messageText) {
        const userMessage = messageText || chatInput.value.trim();
        if (userMessage === "") return;

        // Show User Message
        displayMessage(userMessage, "user");
        if (!messageText) chatInput.value = "";

        // Show Typing Animation
        showTyping();

        // Delay Response for realism
        setTimeout(() => {
            removeTyping();
            const botResponse = getBotResponse(userMessage);
            displayMessage(botResponse, "bot");
        }, 900);
    }

    function displayMessage(message, sender) {
        const row = document.createElement("div");
        row.classList.add("message-row", sender);

        if (sender === "bot") {
            const avatar = document.createElement("div");
            avatar.classList.add("chat-avatar");
            row.appendChild(avatar);
        }

        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", sender);
        messageElement.innerHTML = `<p>${message}</p>`; 
        
        row.appendChild(messageElement);
        chatBody.appendChild(row);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to bottom
    }

    // --- 6. Typing Animation Functions ---
    function showTyping() {
        const row = document.createElement("div");
        row.classList.add("message-row", "bot", "typing-indicator-row");
        
        const avatar = document.createElement("div");
        avatar.classList.add("chat-avatar");
        row.appendChild(avatar);

        const bubble = document.createElement("div");
        bubble.classList.add("chat-message", "bot", "typing-bubble");
        bubble.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        row.appendChild(bubble);
        chatBody.appendChild(row);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTyping() {
        const typingRow = document.querySelector(".typing-indicator-row");
        if(typingRow) {
            typingRow.remove();
        }
    }

    // --- 7. THE BRAIN: Advanced Bot Responses ---
    function getBotResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // -- GREETINGS --
        if (input.match(/\b(hi|hello|hey|greetings)\b/)) {
            return "Hello! How can I assist you today? You can ask about courses, timings, fees, sports, or faculty.";
        }
        if (input.match(/\b(bye|goodbye|cya)\b/)) {
            return "Goodbye! Feel free to come back if you have more questions.";
        }

        // -- EVENTS, SPORTS & HACKATHON --
        if (input.includes("event") || input.includes("hackathon") || input.includes("activity") || input.includes("culture")) {
            return "We host vibrant annual events like the <b>Annual Hackathon</b> for tech innovation and a grand <b>Sports Day</b>. Check our Gallery for photos!";
        }
        if (input.includes("sport") || input.includes("game") || input.includes("cricket") || input.includes("football")) {
            return "Our <b>Sports Day</b> highlight includes Cricket, Football, Volleyball, Chess, and Carrom.";
        }

        // -- FACULTY & ADMINISTRATION (UPDATED) --
        if (input.includes("principal") || input.includes("vice") || input.includes("coordinator") || input.includes("faculty") || input.includes("admin") || input.includes("sir") || input.includes("aziz") || input.includes("rakesh") || input.includes("majid")) {
            return "<b>Meet our Administration:</b><br>• <b>Principal (Engineering):</b> Dr. Azizuddin (+91 92473 41412)<br>• <b>Principal (Degree & Inter):</b> Dr. Rakesh (+91 73867 75942)<br>• <b>Coordinator:</b> Mr. Majid (+91 96401 96201)";
        }

        // -- COLLEGE INFO (UPDATED) --
        if (input.includes("about") || input.includes("college info") || input.includes("founded") || input.includes("enrollment") || input.includes("student")) {
            return "Founded in <b>2008</b>, Mumtaz College is AICTE approved and affiliated with JNTU Hyderabad. Our enrollment is 40 students (2025).";
        }
        if (input.includes("location") || input.includes("where") || input.includes("address")) {
            return "<b>Address:</b> Security Room, Mumtaz College, 2-737, Malakpet Rd, Hyderabad. <a href='https://www.google.com/maps/search/?api=1&query=17.368732240805393,78.50827290105367' target='_blank' style='color:blue;'>View on Map</a>";
        }

        // -- SPECIFIC COURSES --
        if (input.includes("cse") || input.includes("computer science")) {
            return "<b>B.Tech CSE:</b> 4 Years, 60 Seats. <a href='cse.html' style='color:blue;'>Read More</a>";
        }
        if (input.includes("ai") || input.includes("ml") || input.includes("artificial")) {
            return "<b>B.Tech AI & ML:</b> 4 Years, 60 Seats.";
        }

        // -- ADMISSIONS & ELIGIBILITY (2026 UPDATED) --
        if (input.includes("admission") || input.includes("apply") || input.includes("process")) {
            return "Admissions use TS EAMCET (B.Tech) and TS ICET (MBA). Visit our <a href='admissions.html' style='color:blue;'>Admissions Page</a>.";
        }
        if (input.includes("date") || input.includes("deadline")) {
            return "<b>Important 2026 Dates:</b><br>• EAMCET Exam: May 15-20<br>• Phase 1 Counselling: June 25<br>• Reporting: July 05";
        }

        // -- FEES & SCHOLARSHIPS --
        if (input.includes("fee") || input.includes("cost") || input.includes("price")) {
            return "<b>Annual Fees:</b> B.Tech ₹45,000 | MBA ₹25,000.";
        }

        // -- CONTACT & TIMINGS (UPDATED) --
        if (input.includes("contact") || input.includes("phone") || input.includes("email") || input.includes("number") || input.includes("time") || input.includes("timing") || input.includes("hours")) {
            return "📞 <b>Phone:</b> 78421 38122<br>🕒 <b>Timings:</b> 9:00 AM to 3:30 PM";
        }

        // -- DEFAULT FALLBACK --
        return "I'm not sure about that. Try asking about <b>courses</b>, <b>timings</b>, <b>faculty</b>, or <b>admissions</b>.";
    }

    // --- 8. Lightbox Logic (Gallery) ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-grid img');

    if (lightboxModal && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxModal.style.display = 'flex';
                lightboxImage.src = img.src;
            });
        });
        
        if(lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.style.display = 'none';
            });
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
            }
        });
    }
});