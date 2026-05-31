$(document).ready(function () {
  /* ── STATE ───────────────────────────────── */
  const output = $("#output");
  const input = $("input.input");
  const userIP = $("#user-ip");

  let commandHistory = [];
  let historyIndex = -1;
  let lineDelay = true; // line-by-line output (toggle with "output fast/normal")

  /* ── MOTD ────────────────────────────────── */
  var motdLines = [
    "",
    '<span class="c-bright">  System Control Interface  v2.0.0</span>',
    '  Amir Ansarpour — <a href="https://amiransarpour.ir" target="_blank">amiransarpour.ir</a>',
    "  ─────────────────────────────────────",
    '  Type <span class="c-green">help</span> to list available commands.',
    "",
  ];
  outputLines(motdLines);

  /* ── KEYBOARD ────────────────────────────── */
  input.keydown(function (e) {
    if (e.which === 38) {
      // up arrow — history back
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.val(commandHistory[historyIndex]);
      }
      return false;
    }
    if (e.which === 40) {
      // down arrow — history forward
      if (historyIndex > 0) {
        historyIndex--;
        input.val(commandHistory[historyIndex]);
      } else if (historyIndex === 0) {
        historyIndex = -1;
        input.val("");
      }
      return false;
    }
    if (e.which === 9) {
      // Tab — autocomplete
      e.preventDefault();
      autocomplete();
      return false;
    }
  });

  /* ── COMMAND DISPATCH ────────────────────── */
  input.keypress(function (e) {
    if (e.which !== 13) return;

    const val = $.trim(input.val());
    input.val("");

    if (val !== "") {
      commandHistory.unshift(val);
      historyIndex = -1;
      // echo the command with a prompt prefix
      appendLine(
        `<span class="out-cmd"><span class="ps">$</span> ${escapeHtml(val)}</span>`,
      );
    }

    if (val === "help") help();
    else if (val === "about") aboutMe();
    else if (val === "contact") contactMe();
    else if (val === "clear") clearConsole();
    else if (val === "pajamas") pajamas();
    else if (val === "joke") tellJoke();
    else if (val === "time") getTime();
    else if (val === "weather") getWeather();
    else if (val === "output fast") {
      lineDelay = false;
      appendLine('<span class="c-green">output: instant mode</span>');
    } else if (val === "output normal") {
      lineDelay = true;
      appendLine('<span class="c-green">output: line mode</span>');
    } else if (val.startsWith("say ")) sayThis(val);
    else if (val.startsWith("sudo ")) sudo(val);
    else if (val === "whats that sound" || val === "what's that sound") {
      appendLine(
        '<span class="c-red">DIAGNOSTIC_FAULT: subsystem unresponsive</span>',
      );
    } else if (val.startsWith("exit")) {
      appendLine('<span class="c-dim">session terminated — goodbye.</span>');
      setTimeout(function () {
        window.open("https://amiransarpour.ir");
      }, 800);
    } else if (val !== "") {
      appendLine(
        `<span class="c-red">bash: ${escapeHtml(val)}: command not found</span>`,
      );
    }
  });

  /* ── COMMANDS ────────────────────────────── */

  function help() {
    outputLines([
      "",
      '<span class="c-bright">Usage:  command &lt;name&gt; [args]</span>',
      "",
      '<span class="c-dim">INFORMATION</span>',
      '  <span class="c-green">help</span>                  show this reference',
      '  <span class="c-green">about</span>                 operator profile',
      '  <span class="c-green">contact</span>               communication endpoints',
      "",
      '<span class="c-dim">SYSTEM</span>',
      '  <span class="c-green">time</span>                  query system clock',
      '  <span class="c-green">weather</span>               fetch atmospheric data',
      '  <span class="c-green">clear</span>                 flush terminal buffer',
      '  <span class="c-green">exit</span>                  terminate session',
      "",
      '<span class="c-dim">UTILITIES</span>',
      '  <span class="c-green">say</span> &lt;text&gt;            write to stdout',
      '  <span class="c-green">sudo</span> &lt;cmd&gt;           privilege escalation',
      '  <span class="c-green">joke</span>                  retrieve random entry',
      '  <span class="c-green">pajamas</span>               classified inventory',
      '  <span class="c-green">output fast|normal</span>    toggle render mode',
      "",
      '<span class="c-dim">KEYBOARD</span>',
      '  <span class="c-bright">↑ ↓</span>    command history',
      '  <span class="c-bright">Tab</span>    autocomplete',
      '  <span class="c-bright">^L</span>     clear screen',
      '  <span class="c-bright">F1</span>     show help',
      "",
    ]);
  }

  function aboutMe() {
    Output(`
            <div class="out-panel">
                <div class="out-panel-hdr">OPERATOR PROFILE</div>
                <div class="out-panel-body">
                    <div class="out-kv"><span class="out-kv-k">name</span><span class="out-kv-v c-bright">Amir Ansarpour</span></div>
                    <div class="out-kv"><span class="out-kv-k">origin</span><span class="out-kv-v">Shushtar, IR  /  2003</span></div>
                    <div class="out-kv"><span class="out-kv-k">role</span><span class="out-kv-v">Frontend Engineer</span></div>
                    <div class="out-kv"><span class="out-kv-k">stack</span><span class="out-kv-v">React · TypeScript · Python · ML</span></div>
                    <div class="out-kv"><span class="out-kv-k">env</span><span class="out-kv-v">MS Server · Linux · AI integration</span></div>
                    <br>
                    <div style="color:var(--text);font-size:12px;line-height:1.8;border-left:1px solid var(--bv);padding-left:10px">
                        Builds interfaces that feel deliberate. Equally at home<br>
                        in pixel-precise frontend work and server environments.<br>
                        Parallel pursuits: classical piano, ML research.
                    </div>
                    <br>
                    <div class="c-dim" style="font-size:11px">"Great ideas deserve to be built beautifully."</div>
                </div>
            </div>
        `);
  }

  function contactMe() {
    outputLines([
      "",
      '<span class="c-dim">communication endpoints:</span>',
      "",
    ]);
    Output(`
            <div style="margin-bottom:10px">
                <a class="ep-link" href="https://github.com/AmirAnsarpour" target="_blank">
                    <span class="ep-site">github</span>
                    <span class="ep-url">github.com/AmirAnsarpour</span>
                </a>
                <a class="ep-link" href="https://www.youtube.com/@AmirAnsarpour" target="_blank">
                    <span class="ep-site">youtube</span>
                    <span class="ep-url">youtube.com/@AmirAnsarpour</span>
                </a>
                <a class="ep-link" href="https://instagram.com/AmirAnsarpour_" target="_blank">
                    <span class="ep-site">instagram</span>
                    <span class="ep-url">instagram.com/AmirAnsarpour_</span>
                </a>
            </div>
        `);
  }

  function clearConsole() {
    output.html("");
    appendLine('<span class="c-dim">buffer flushed.</span>');
  }

  function getTime() {
    const n = new Date();
    const ts = n.toLocaleTimeString("en-GB", { hour12: false });
    const ds = n.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    outputLines([
      "",
      `  time    <span class="c-bright" style="font-size:15px">${ts}</span>`,
      `  date    ${ds}`,
      "",
    ]);
  }

  function pajamas() {
    const items = [
      "Blood-Stained Striped — worn by the last one who begged too much.",
      "Torn Animal Onesie — the wolf costume still smells like fear.",
      "Silk with Chains — luxury never felt so restraining.",
      "Superhero — because even heroes scream in the dark.",
      "Flannel — soaked in cold sweat. Locked in the attic since winter '97.",
    ];
    var lines = [
      "",
      '<span class="c-dim">classified inventory — pajama division:</span>',
      "",
    ];
    items.forEach(function (item, i) {
      lines.push(
        '  <span class="c-green">[' +
          String(i + 1).padStart(2, "0") +
          ']</span>  <span class="c-amber">' +
          item +
          "</span>",
      );
    });
    lines.push("");
    lines.push(
      '<span class="c-dim">  field note: optimal coding attire. productivity confirmed.</span>',
    );
    lines.push("");
    outputLines(lines);
  }

  function tellJoke() {
    const jokes = [
      "What's darker than a killer's soul? The basement where he keeps his trophies.",
      "I don't have skeletons in my closet. I keep them seated at the dinner table.",
      "She screamed, 'You're a monster!' I smiled. Finally, someone sees me.",
      "They said laughter is the best medicine. So I gave her a reason to scream, then laughed.",
      "I used to babysit. Then I realized dolls are quieter… and don't call the cops.",
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
      "They buried me alive once. I learned two things: how to dig… and how to hate breathing things.",
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    Output(`
            <div style="margin:4px 0 8px">
                <div class="c-dim" style="font-size:10px;margin-bottom:4px">random payload:</div>
                <div class="joke-body">${joke}</div>
            </div>
        `);
  }

  function sayThis(val) {
    const msg = val.substring(4);
    appendLine('<span class="c-dim">stdout:</span> ' + escapeHtml(msg));
  }

  function sudo(val) {
    const cmd = val.substring(5);
    if (cmd.startsWith("apt-get")) {
      appendLine(
        '<span class="c-green">Reading package lists...</span> Nothing to upgrade. System is current.',
      );
    } else if (cmd === "make me a sandwich") {
      appendLine(
        '<span class="c-red">EPERM: operation not permitted.</span> Make it yourself.',
      );
    } else {
      appendLine(
        '<span class="c-red">sudo:</span> ' +
          escapeHtml(cmd) +
          ": command not found or privilege insufficient.",
      );
    }
  }

  function getWeather() {
    appendLine('<span class="c-dim">fetching geolocation…</span>');

    if (!navigator.geolocation) {
      appendLine(
        '<span class="c-red">error:</span> geolocation not available.',
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        appendLine('<span class="c-dim">querying open-meteo.com…</span>');

        fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=" +
            lat +
            "&longitude=" +
            lon +
            "&current_weather=true",
        )
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            const w = data.current_weather;
            const code = w.weathercode;
            let cond = "clear";
            if (code === 0) cond = "clear sky";
            else if (code === 1) cond = "mainly clear";
            else if (code === 2) cond = "partly cloudy";
            else if (code === 3) cond = "overcast";
            else if (code <= 49) cond = "fog";
            else if (code <= 59) cond = "drizzle";
            else if (code <= 69) cond = "rain";
            else if (code <= 79) cond = "snow";
            else if (code <= 99) cond = "thunderstorm";
            Output(`
                        <div class="wx-card">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                                <span class="c-bright">${cond}</span>
                                <span class="wx-temp">${w.temperature}°C</span>
                            </div>
                            <div style="font-size:11px;color:var(--dim)">wind&nbsp;&nbsp; ${w.windspeed} km/h</div>
                            <div style="font-size:11px;color:var(--dim)">coords&nbsp;${lat.toFixed(3)}, ${lon.toFixed(3)}</div>
                        </div>
                    `);
          })
          .catch(function (err) {
            appendLine(
              '<span class="c-red">fetch error:</span> ' + err.message,
            );
          });
      },
      function (err) {
        appendLine(
          '<span class="c-red">geolocation error:</span> ' + err.message,
        );
      },
    );
  }

  /* ── AUTOCOMPLETE ────────────────────────── */
  function autocomplete() {
    const cmds = [
      "help",
      "about",
      "contact",
      "clear",
      "pajamas",
      "joke",
      "time",
      "weather",
      "exit",
      "output fast",
      "output normal",
      "say",
      "sudo",
    ];
    const cur = input.val().toLowerCase();
    if (!cur.length) return;
    const matches = cmds.filter(function (c) {
      return c.startsWith(cur);
    });

    if (matches.length === 1) {
      input.val(matches[0]);
    } else if (matches.length > 1) {
      appendLine(
        '<span class="c-dim">completions:</span>  ' +
          matches
            .map(function (c) {
              return '<span class="c-green">' + c + "</span>";
            })
            .join("  "),
      );
    }
  }

  /* ── OUTPUT ENGINE ───────────────────────── */

  // Append a pre-built HTML string as a block (instant)
  function Output(html) {
    const el = $('<div class="out-line"></div>').html(html);
    el.appendTo(output);
    output.scrollTop(output[0].scrollHeight);
  }

  // Append a single line of HTML
  function appendLine(html) {
    Output(html);
  }

  // Output an array of strings line by line with a small delay between each
  function outputLines(lines) {
    if (!lineDelay) {
      lines.forEach(function (l) {
        appendLine(l);
      });
      return;
    }
    var i = 0;
    function next() {
      if (i >= lines.length) return;
      appendLine(lines[i]);
      i++;
      setTimeout(next, 22);
    }
    next();
  }

  /* ── UTILITIES ───────────────────────────── */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── IP RESOLUTION ───────────────────────── */
  async function resolveIP() {
    try {
      const r = await fetch("https://api.ipify.org?format=json");
      const data = await r.json();
      userIP.text(data.ip);
      const sip = document.getElementById("sb-ip");
      if (sip) sip.textContent = data.ip;
      if (tbu) tbu.textContent = data.ip + "@ansarpour";
    } catch (_) {
      userIP.text("root");
    }
  }
  resolveIP();
});
