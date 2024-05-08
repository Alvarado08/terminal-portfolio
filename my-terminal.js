// Shell commands
const root = "~";
let cwd = root;
const user = "guest";
const server = "jorgealvarado.dev";
const url = "https://v2.jokeapi.dev/joke/Programming";

// Directories
const directories = {
  contact: [
    "",
    [
      ["LinkedIn", "https://linkedin/in/jorgep-alvarado.com"],
      ["Github", "https://github.com/alvarado08"],
      ["Hashnode", "https://jpalvarado.hashnode.dev"],
      ["X", "https://twitter.com/th3ja"],
    ].map(([name, url = ""]) => {
      return `* <a href="${url}">${name}</a>`;
    }),
    "",
  ].flat(),
  education: [
    "",
    "<white>education</white>",

    '* <a href="https://www.itsva.edu.mx/">Insituto Tecnológico Superior de Valladolid</a> <yellow>"Computer Systems Engineering"</yellow> 2017-2022',
    "",
  ],
  projects: [
    "",
    [
      [
        "Iglesia Bautista Dios Proveera",
        "https://iglesiadiosproveera.com",
        "Local church blog-focused website",
        "Astro, Tailwind CSS, JavaScript",
      ],
      [
        "Minimalist Weather Forecast",
        "https://alvarado08.github.io/weather-app/",
        "A minimalist version of the weather app",
        "TypeScript, Tailwind CSS",
      ],
      [
        "Library",
        "https://alvarado08.github.io/library/",
        "A digital bookshelf",
        "JavaScript, Tailwind CSS",
      ],
    ].map(([name, url, description, stack = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>. <yellow>${stack}</yellow>`;
    }),
    "",
  ].flat(),
  skills: [
    "",
    "<white>languages</white>",

    ["JavaScript", "TypeScript", "PHP", "SQL"].map(
      (lang) => `* <yellow>${lang}</yellow>`
    ),
    "",
    "<white>frameworks</white>",
    ["Bootstrap", "Tailwind CSS", "Laravel"].map(
      (lib) => `* <green>${lib}</green>`
    ),
    "",
    "<white>libraries</white>",
    ["React.js", "Alpine.js", "Jest"].map((lib) => `* <green>${lib}</green>`),
    "",
    "<white>tools</white>",
    ["Astro", "MySQL", "SQLite", "Git", "Figma", "WordPress"].map(
      (lib) => `* <blue>${lib}</blue>`
    ),
    "",
  ].flat(),
};

const dirs = Object.keys(directories);

$.terminal.xml_formatter.tags.green = (attrs) => {
  return `[[;#44D544;]`;
};

$.terminal.xml_formatter.tags.blue = (attrs) => {
  return `[[;#55F;;${attrs.class}]`;
};

function print_directories() {
  term.echo(
    dirs
      .map((dir) => {
        return `<blue class="directory">${dir}</blue>`;
      })
      .join("\n")
  );
}

const commands = {
  help() {
    term.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    if (args.length > 0) {
      term.echo(args.join(" "));
    }
  },
  cd(dir = null) {
    if (dir === null || (dir === ".." && cwd !== root)) {
      cwd = root;
    } else if (dir.startsWith("~/") && dirs.includes(dir.substring(2))) {
      cwd = dir;
    } else if (dirs.includes(dir)) {
      cwd = root + "/" + dir;
    } else {
      this.error("Wrong directory");
    }
  },
  ls(dir = null) {
    if (dir) {
      if (dir.startsWith("~/")) {
        const path = dir.substring(2);
        const dirs = path.split("/");
        if (dirs.length > 1) {
          this.error("Invalid directory");
        } else {
          const dir = dirs[0];
          this.echo(directories[dir].join("\n"));
        }
      } else if (cwd === root) {
        if (dir in directories) {
          this.echo(directories[dir].join("\n"));
        } else {
          this.error("Invalid directory");
        }
      } else if (dir === "..") {
        print_directories();
      } else {
        this.error("Invalid directory");
      }
    } else if (cwd === root) {
      print_directories();
    } else {
      const dir = cwd.substring(2);
      this.echo(directories[dir].join("\n"));
    }
  },
  async joke() {
    const res = await fetch(url);
    const data = await res.json();
    (async () => {
      if (data.type == "twopart") {
        // we set clear the prompt to don't have any
        // flashing between animations
        const prompt = this.get_prompt();
        this.set_prompt("");
        // as said before in every function, passed directly
        // to terminal, you can use `this` object
        // to reference terminal instance
        await this.echo(`Q: ${data.setup}`, {
          delay: 50,
          typing: true,
        });
        await this.echo(`A: ${data.delivery}`, {
          delay: 50,
          typing: true,
        });
        // we restore the prompt
        this.set_prompt(prompt);
      } else if (data.type === "single") {
        await this.echo(data.joke, {
          delay: 50,
          typing: true,
        });
      }
    })();
  },
  bio() {
    return [
      "",
      "Former professional soccer player, Full Stack Developer with a Front End focus proficient in leveraging technologies such as",
      "React, Astro and JavaScript with knowledge in PHP, Laravel and MySQL to develop dynamic and user-centric web applications.",
      "Committed to delivering high-quality work, creating seamless user experiences and achieving measurable results.",
      "",
    ].join("\n");
  },
  credits() {
    return [
      "",
      "<white>Used libraries:</white>",
      '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
      '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
      '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
      '* <a href="https://jokeapi.dev/">Joke API</a>',
      "",
    ].join("\n");
  },
};

function prompt() {
  return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const command_list = ["clear"].concat(Object.keys(commands));
const formatted_list = command_list.map((cmd) => {
  return `<white class="command">${cmd}</white>`;
});

const help = formatter.format(formatted_list);

// Initialize terminal
const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false,
  completion: true,
  prompt,
  completion() {
    // in every function we can use `this` to reference term object
    const cmd = this.get_command();
    // we process the command to extract the command name
    // at the rest of the command (the arguments as one string)
    const { name, rest } = $.terminal.parse_command(cmd);
    if (["cd", "ls"].includes(name)) {
      if (rest.startsWith("~/")) {
        return dirs.map((dir) => `~/${dir}`);
      }
      if (cwd === root) {
        return dirs;
      }
    }
    return Object.keys(commands);
  },
});

// Loading and Initializing figlet
const font = "Sub-Zero";

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

term.pause();

function render(text) {
  const cols = term.cols();
  return trim(
    figlet.textSync(text, {
      font: font,
      width: cols,
      whitespaceBreak: true,
    })
  );
}

function trim(str) {
  return str.replace(/[\n\s]+$/, "");
}

// lolCat for terminal colors
function rainbow(string) {
  return lolcat
    .rainbow(function (char, color) {
      char = $.terminal.escape_brackets(char);
      return `[[;${hex(color)};]${char}]`;
    }, string)
    .join("\n");
}

// Random seed to fix a color
function hex(color) {
  return (
    "#" +
    [color.red, color.green, color.blue]
      .map((n) => {
        return n.toString(16).padStart(2, "0");
      })
      .join("")
  );
}

function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function ready() {
  const seed = rand(256);
  term
    .echo(() => rainbow(render("Jorge Alvarado"), seed))
    .echo(
      () => `<white class="welcome">Welcome to my terminal portfolio!</white>\n`
    )
    .resume();
}

function rainbow(string, seed) {
  return lolcat
    .rainbow(
      function (char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
      },
      string,
      seed
    )
    .join("\n");
}

// click event
term.on("click", ".command", function () {
  const command = $(this).text();
  term.exec(command);
});

term.on("click", ".directory", function () {
  const dir = $(this).text();
  term.exec(`cd ~/${dir}`);
});

// Syntax highlighting
const re = new RegExp(`^\s*(${command_list.join("|")})(\s?.*)`);

$.terminal.new_formatter([
  re,
  function (_, command, args) {
    return `<white class="command">${command}</white><magenta>${args}</magenta>`;
  },
]);

term.exec("help", { typing: true, delay: 100 });
