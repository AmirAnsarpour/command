$(document).ready(function () {
    let output = $('.output');
    let input = $('input.input');
    let toOutput;
    let userIP = $('#user-ip');

    document.addEventListener("input", function (event) {
        let inputText = event.target.value;
        input.value = inputText;
    });

    input.keypress(function (e) {
        if (e.which == 13) {
            let inputVal = $.trim(input.val());

            if (inputVal == "help") {
                help();
                input.val('');
            } else if (inputVal == "ping") {
                pong();
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
            } else if (inputVal.startsWith("say") === true) {
                sayThis(inputVal);
                input.val('');
            } else if (inputVal.startsWith("sudo") === true) {
                sudo(inputVal);
                input.val('');
            } else if (inputVal == "time") {
                getTime();
                input.val('');
            } else if (inputVal == `whats that sound` || inputVal == `what's that sound` || inputVal == `whats that sound?`) {
                seperator();
                Output(`<span class="blue"> ${inputVal} </span></br><span class="red">Machine Broken!</span></br>`);
                seperator();
                input.val('');
            } else if (inputVal.startsWith("exit") === true) {
                Output(`<span class="blue">Goodbye! Comeback soon.</span>`);
                setTimeout(function () {
                    window.open(`https://amiransarpour.ir`);
                }, 1000);
            } else {
                Output(`<span>command not found</span></br>`);
                input.val('');
            }
        }
    });
    function seperator() {
        Output(`<span class="seperator">== == == == == == == == == == == == == == == == == ==</span></br>`);
    }
    function clearConsole() {
        output.html("");
        Output(`<span>clear</span></br>`);
    }
    function help() {
        let commandsArray = ['Help: List of available commands', '>help', '>about', '>contact', '>ping', '>time', '>clear', '>say'];
        for (let i = 0; i < commandsArray.length; i++) {
            let out = `<span>  ${commandsArray[i]} </span><br/>`
            Output(out);
        }
    }
    function pong() {
        Output(`<span>pong</span></br><span class="pong"><b class="left">|</b><b class="right">|</b></span></br>`);
    }
    function sayThis(data) {
        data = data.substr(data.indexOf(' ') + 1);
        Output(`<span class="green">[Me]:</span><span> ${data} </span></br>`);
    }
    function sudo(data) {
        data = data.substr(data.indexOf(' ') + 1);
        if (data.startsWith("say") === true) {
            data = `Not gona   ${data} +  to you, you don't own me!`
        } else if (data.startsWith("apt-get") === true) {
            data = `<span class='green'>Updating...</span> The cake is a lie! There is nothing to update...`
        } else {
            data = `The force is week within you, my master you not be!`
        }
        Output(`<span> ${data} </span></br>`);
    }
    function getTime() {
        Output(`<span>It's the 21st century man! Get a Watch.</span></br>`);
    }
    function aboutMe() {
        let aboutMeArray = [`About:<br>
        Hey there!
         I'm AmirAnsarpour, a web wizard who loves to craft beautiful digital experiences. Front-end development is my jam, especially with React. I also dabble with Microsoft servers. Born in Dezful, Iran, in '2003, I've been blessed with a creative mind.<br> My friends call me a creative genius, but I'll leave that up to you to decide. Let's team up and create something extraordinary together!`];
        seperator();
        for (let i = 0; i < aboutMeArray.length; i++) {
            let out = `<span>  ${aboutMeArray[i]} '</span><br/>`
            Output(out);
        }
        seperator();
    }
    function contactMe() {
        let contactArray = ['>Contact:', '(<a href="https://github.com/AmirAnsarpour">GitHub</a>)', '(<a href="https://www.linkedin.com/in/amiransarpour">linkedin</a>)', '(<a href="https://instagram.com/Amrix.Sf">instagram</a>)'];
        seperator();
        for (let i = 0; i < contactArray.length; i++) {
            let out = '<span>' + contactArray[i] + '</span><br/>'
            Output(out);
        }
        seperator();
    }
    function Output(data) {
        $(data).appendTo(output);
    }

    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            userIP.html(data.ip)

        } catch (error) {
            userIP.html(`user`)
        }
    }
    getUserIP()


});