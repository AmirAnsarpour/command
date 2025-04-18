$(document).ready(function () {
    let output = $('.output');
    let input = ($('input.input'));
    let toOutput;
    let userIP = $('#user-ip');
    let commandHistory = [];
    let historyIndex = -1;
    let typingAnimation = true; // Control if typing animation is on
    let typingSpeed = 10; // Default typing speed (ms)
    let isTyping = false; // Track if currently typing

    // Initial greeting
    setTimeout(() => {
        typeText(`<span class="text-blue-500">Welcome to Terminal! Type '<span class="text-primary">help</span>' to see available commands</span><br>`);
    }, 500);

    document.addEventListener("input", function (event) {
        let inputText = event.target.value;
        input.value = inputText;
    });

    // Command history navigation
    input.keydown(function (e) {
        if (e.which == 38) { // Up arrow
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.val(commandHistory[historyIndex]);
            }
            return false;
        } else if (e.which == 40) { // Down arrow
            if (historyIndex > 0) {
                historyIndex--;
                input.val(commandHistory[historyIndex]);
            } else if (historyIndex == 0) {
                historyIndex = -1;
                input.val('');
            }
            return false;
        } else if (e.which == 9) { // Tab key for autocomplete
            e.preventDefault();
            autocompleteCommand();
            return false;
        }
    });

    input.keypress(function (e) {
        if (e.which == 13) {
            let inputVal = $.trim(input.val());
            
            // Add to command history
            if (inputVal !== '') {
                commandHistory.unshift(inputVal);
                historyIndex = -1;
            }

            // Echo command
            if (inputVal !== "") {
                Output(`<span class="text-gray-400"><span class="text-primary">$</span> ${inputVal}</span><br>`);
            }

            if (inputVal == "help") {
                help();
                input.val('');
            } else if (inputVal == "about") {
                aboutMe();
                input.val('');
            } else if (inputVal == "contact") {
                contactMe();
                input.val('');
            } else if (inputVal == "clear") {
                clearConsole();
                input.val('');
            } else if (inputVal == "pajamas") {
                pajamas();
                input.val('');
            } else if (inputVal == "joke") {
                tellJoke();
                input.val('');
            } else if (inputVal.startsWith("say") === true) {
                sayThis(inputVal);
                input.val('');
            } else if (inputVal.startsWith("sudo") === true) {
                sudo(inputVal);
                input.val('');
            } else if (inputVal == "time") {
                getTime();
                input.val('');
            } else if (inputVal == "weather") {
                getWeather();
                input.val('');
            } else if (inputVal == "typing on") {
                typingAnimation = true;
                Output(`<span class="text-green-400">Typing animation enabled</span><br>`);
                input.val('');
            } else if (inputVal == "typing off") {
                typingAnimation = false;
                Output(`<span class="text-yellow-400">Typing animation disabled</span><br>`);
                input.val('');
            } else if (inputVal == "typing speed slow") {
                typingSpeed = 50;
                Output(`<span class="text-green-400">Typing speed set to slow</span><br>`);
                input.val('');
            } else if (inputVal == "typing speed normal") {
                typingSpeed = 10;
                Output(`<span class="text-green-400">Typing speed set to normal</span><br>`);
                input.val('');
            } else if (inputVal == "typing speed fast") {
                typingSpeed = 2;
                Output(`<span class="text-green-400">Typing speed set to fast</span><br>`);
                input.val('');
            } else if (inputVal == `whats that sound` || inputVal == `what's that sound` || inputVal == `whats that sound?`) {
                separator();
                typeText(`<span class="text-blue-500"> ${inputVal} </span></br><span class="text-red-500">Machine Broken!</span></br>`);
                separator();
                input.val('');
            } else if (inputVal.startsWith("exit") === true) {
                typeText(`<span class="text-blue-500">Goodbye! Comeback soon.</span>`);
                setTimeout(function () {
                    window.open(`https://Ansarpour.com`);
                }, 1000);
            } else if (inputVal !== "") {
                typeText(`<span class="text-red-400">command not found: ${inputVal}</span></br>`);
                input.val('');
            }
        }
    });

    // Auto-complete commands
    function autocompleteCommand() {
        const commands = [
            "help", "about", "contact", "clear", "pajamas", "joke", "time", "weather",
            "typing on", "typing off", "typing speed slow", "typing speed normal", "typing speed fast",
            "say", "sudo"
        ];
        
        const currentInput = input.val().toLowerCase();
        if (currentInput.length === 0) return;
        
        const matchingCommands = commands.filter(cmd => cmd.startsWith(currentInput));
        
        if (matchingCommands.length === 1) {
            // Exact match - replace with the command
            input.val(matchingCommands[0]);
        } else if (matchingCommands.length > 1) {
            // Multiple matches - show suggestions
            separator();
            Output(`<div class="text-primary">Autocomplete suggestions:</div>`);
            matchingCommands.forEach(cmd => {
                Output(`<div class="ml-4 text-gray-400">${cmd}</div>`);
            });
            separator();
        }
    }

    function separator() {
        Output(`<div class="my-2 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>`);
    }

    function clearConsole() {
        output.html("");
        Output(`<span class="text-green-400">Console cleared</span></br>`);
    }

    function help() {
        let commandsArray = [
            'Available commands:',
            '<span class="text-primary">help</span> - Show this help menu',
            '<span class="text-primary">about</span> - Learn about me',
            '<span class="text-primary">contact</span> - How to reach me',
            '<span class="text-primary">pajamas</span> - Learn about my pajama collection',
            '<span class="text-primary">joke</span> - Hear a random joke',
            '<span class="text-primary">time</span> - Check the time',
            '<span class="text-primary">weather</span> - Check local weather',
            '<span class="text-primary">typing on/off</span> - Toggle typing animation',
            '<span class="text-primary">typing speed slow/normal/fast</span> - Set typing speed',
            '<span class="text-primary">say [message]</span> - Echo a message',
            '<span class="text-primary">clear</span> - Clear the terminal',
            '<span class="text-primary">* Try using TAB key for command autocompletion</span>'
        ];
        
        separator();
        
        // Combine all commands into a single HTML string for typing animation
        let helpHTML = '';
        for (let i = 0; i < commandsArray.length; i++) {
            helpHTML += `<div class="mb-1" style="display: inline;">  ${commandsArray[i]} </div>`;
        }
        
        // Type the entire help menu as a single operation
        typeText(helpHTML, () => {
            separator();
        });
    }

    function sayThis(data) {
        data = data.substr(data.indexOf(' ') + 1);
        Output(`<span class="text-green-400">[Echo]:</span><span> ${data} </span></br>`);
    }

    function sudo(data) {
        data = data.substr(data.indexOf(' ') + 1);
        if (data.startsWith("apt-get") === true) {
            data = `<span class='text-green-400'>Updating...</span> The cake is a lie! There is nothing to update...`;
        } else if (data === "make me a sandwich") {
            data = `<span class='text-yellow-400'>Make it yourself!</span>`;
        } else {
            data = `The force is weak within you, my master you not be!`;
        }
        typeText(`<span> ${data} </span></br>`);
    }

    function getTime() {
        separator();
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        typeText(`<span>Current time: <span class="text-primary">${timeString}</span></span></br>`);
    }

    function aboutMe() {
        let aboutMeArray = [`
        <div class="bg-primary/10 p-3 rounded">
            <div class="text-primary font-bold mb-2">About Me:</div>
            <p class="mb-2">Hi, I’m Amir Ansarpour — a creative mind born in Shushtar, Iran, in 2003, shaped by code, curiosity, and a deep passion for pushing boundaries.</p>
            <p class="mb-2">By day, I craft elegant front-end experiences with React and wrangle Microsoft servers; by night, I compose melodies on the piano and train machines to think.</p>
            <p class="mb-2">I’m obsessed with AI, clean code, and meaningful design — and I believe that great ideas deserve to be built beautifully.</p>
            <p>If you're into blending art and logic to create something unforgettable, let’s build the future — one brilliant project at a time.</p>
        </div>`];
        separator();
        for (let i = 0; i < aboutMeArray.length; i++) {
            let out = `${aboutMeArray[i]}`;
            typeText(out);
        }
    }
    
    function pajamas() {
        const pajamaTypes = [
            "Blood-Stained Striped Pajamas – worn by the last one who begged too much.",
            "Torn Animal Onesies – the wolf costume still smells like fear.",
            "Silk Pajamas with Chains – luxury never felt so... restraining.",
            "Superhero Pajamas – because even heroes scream in the dark.",
            "Flannel Pajamas – soaked in cold sweat and locked in the attic since winter '97."
                  ];
        
        separator();
        typeText(`<div class="text-primary font-bold mb-2">My Pajama Collection:</div>`);
        typeText(`<div class="mb-2">Who doesn't love a good pajama talk? Here are my favorites:</div>`);
        
        for (let i = 0; i < pajamaTypes.length; i++) {
            typeText(`<div class="mb-1 ml-2">• <span class="text-yellow-400">${pajamaTypes[i]}</span></div>`);
        }
        
        typeText(`<div class="mt-3 text-gray-400">Fun fact: I've been known to code in pajamas for maximum creativity!</div>`);
    }
    
    function tellJoke() {
        const jokes = [
            "What's darker than a killer's soul? The basement where he keeps his trophies.",
            "I don't have skeletons in my closet. I keep them seated at the dinner table.",
            "She screamed, 'You're a monster!' I smiled. Finally, someone sees me.",
            "They said laughter is the best medicine. So I gave her a reason to scream, then laughed.",
            "I used to babysit. Then I realized dolls are quieter... and don't call the cops.",
            "He begged for mercy. I said, 'Wrong game. Try Heaven.'",
            "My therapist quit. Said I made her see things she can't unsee.",
            "They asked why I carry a shovel. I said, 'For closure.'",
            "I love puzzles. Especially the kind you bury piece by piece.",
            "He said 'no one will ever love you.' So I kept him. Forever.",
            "They screamed 'I don't want to die!' — like it was ever their choice.",
            "She said 'you wouldn't hurt me' — so I showed her page 47 of my journal.",
            "I don't collect trophies. I keep memories… in jars.",
            "He asked what the chains were for. I said, 'To stop the nightmares from leaving.'",
            "I used to dream of being loved. Now I dream of silence. And the basement provides.",
            "They said I'm a monster. Monsters don't hide under beds — they build them.",
            "He said 'you're sick.' I said 'no, I'm the cure. You're the infection.'",
            "Every time I blink, I see them. That's why I don't blink anymore.",
            "She cried and asked 'Why?' I whispered, 'Because I was born when you broke.'",
            "They buried me alive once. I learned two things: how to dig… and how to hate breathing things."          
        ];        
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        separator();
        typeText(`<div class="text-primary font-bold mb-2">Random Joke:</div>`);
        typeText(`<div class="bg-black/20 p-3 rounded text-yellow-300">${randomJoke}</div>`);
    }

    function contactMe() {
        separator();
        typeText(`<div class="text-primary font-bold mb-2">Contact Information:</div>`);
        Output(`<div class="grid grid-cols-1 md:grid-cols-2 gap-2 my-3">
            <a href="https://github.com/AmirAnsarpour" target="_blank" class="flex items-center gap-2 bg-primary/10 p-2 rounded hover:bg-primary/20 transition-colors">
                <span class="text-white">GitHub</span>
                <span class="text-xs text-gray-400">@AmirAnsarpour</span>
            </a>
            <a href="https://www.youtube.com/@AmirAnsarpour" target="_blank" class="flex items-center gap-2 bg-primary/10 p-2 rounded hover:bg-primary/20 transition-colors">
                <span class="text-white">Youtube</span>
                <span class="text-xs text-gray-400">@AmirAnsarpour</span>
            </a>
            <a href="https://instagram.com/AmirAnsarpour_" target="_blank" class="flex items-center gap-2 bg-primary/10 p-2 rounded hover:bg-primary/20 transition-colors">
                <span class="text-white">Instagram</span>
                <span class="text-xs text-gray-400">@AmirAnsarpour_</span>
            </a>
        </div>`);
    }

    // Weather integration
    function getWeather() {
        separator();
        typeText(`<div class="text-primary font-bold mb-2">Weather Information:</div>`);
        typeText(`<div class="mb-2">Fetching your local weather...</div>`);
        
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Make API call to OpenWeatherMap
                    // Using a free weather API that doesn't require API key
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                        .then(response => response.json())
                        .then(data => {
                            const weather = data.current_weather;
                            const temp = weather.temperature;
                            const windSpeed = weather.windspeed;
                            
                            // Get weather code description
                            let weatherDesc = "Clear";
                            const code = weather.weathercode;
                            if (code === 0) weatherDesc = "Clear sky";
                            else if (code === 1) weatherDesc = "Mainly clear";
                            else if (code === 2) weatherDesc = "Partly cloudy";
                            else if (code === 3) weatherDesc = "Overcast";
                            else if (code <= 49) weatherDesc = "Foggy";
                            else if (code <= 59) weatherDesc = "Drizzle";
                            else if (code <= 69) weatherDesc = "Rain";
                            else if (code <= 79) weatherDesc = "Snow";
                            else if (code <= 99) weatherDesc = "Thunderstorm";
                            
                            // Display weather info with markdown-like formatting
                            typeText(`
                            <div class="bg-primary/10 p-4 rounded">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-lg font-bold text-primary">${weatherDesc}</span>
                                    <span class="text-xl text-white">${temp}°C</span>
                                </div>
                                <div class="text-sm text-gray-400">Wind: ${windSpeed} km/h</div>
                                <div class="text-xs text-gray-500 mt-2">Location: Approx. ${lat.toFixed(2)}, ${lon.toFixed(2)}</div>
                            </div>
                            `);
                        })
                        .catch(error => {
                            typeText(`<div class="text-red-400 mb-2">Error fetching weather data: ${error.message}</div>`);
                            typeText(`<div class="text-gray-400">Try again later or check your internet connection.</div>`);
                        });
                },
                // Error
                (error) => {
                    typeText(`<div class="text-red-400 mb-2">Error: ${error.message}</div>`);
                    typeText(`<div class="text-gray-400">Unable to access your location. Please check your browser permissions.</div>`);
                }
            );
        } else {
            typeText(`<div class="text-red-400">Geolocation is not supported by this browser.</div>`);
        }
    }
    
    // Markdown-like formatter
    function parseMarkdown(text) {
        // Replace **bold**
        text = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>');
        
        // Replace *italic*
        text = text.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
        
        // Replace `code`
        text = text.replace(/`(.*?)`/g, '<span class="bg-black/40 px-1 rounded font-mono text-green-400">$1</span>');
        
        // Replace [link](url)
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-primary underline">$1</a>');
        
        // Replace # headers
        text = text.replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold mb-2 text-primary">$1</h1>');
        text = text.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold mb-2 text-primary">$1</h2>');
        
        // Replace --- horizontal rule
        text = text.replace(/^---$/gm, '<div class="my-2 h-px w-full bg-gray-700"></div>');
        
        return text;
    }

    // Typing animation
    function typeText(html, callback) {
        if (!typingAnimation || isTyping) {
            Output(html);
            if (callback) callback();
            return;
        }
        
        isTyping = true;
        
        // Create container for typing animation
        const container = $('<div></div>');
        Output(container);
        
        // Extract just the text content
        const tempDiv = $('<div></div>').html(html);
        const text = tempDiv.text();
        
        // If text is very short, output directly
        if (text.length < 5) {
            container.html(html);
            isTyping = false;
            if (callback) callback();
            return;
        }
        
        // Make a copy that will be used for typing
        const htmlContent = html;
        
        // Type each character
        let i = 0;
        
        function typeNextChar() {
            if (i < text.length) {
                // Create a typed version by showing only first i characters
                const visibleText = text.substring(0, i + 1);
                container.text(visibleText);
                i++;
                
                // Add a slight randomness to typing speed for more natural feel
                const randomDelay = Math.floor(typingSpeed * (0.8 + Math.random() * 0.4));
                setTimeout(typeNextChar, randomDelay);
            } else {
                // When done, show the full HTML with formatting
                container.html(htmlContent);
                isTyping = false;
                if (callback) callback();
            }
            
            // Scroll to bottom
            output.scrollTop(output[0].scrollHeight);
        }
        
        // Start typing
        typeNextChar();
    }

    function Output(data) {
        if (typeof data === 'string') {
            $(data).appendTo(output);
        } else {
            $(data).appendTo(output);
        }
        // Scroll to bottom
        output.scrollTop(output[0].scrollHeight);
    }

    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            userIP.html(data.ip);
        } catch (error) {
            userIP.html(`user`);
        }
    }
    getUserIP();
});