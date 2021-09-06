const DEBUG = false;

/**
 *  Clears an elements innerHTML.
 * @returns {element} element with cleared innerHTML.
 */
const content_clear = () => {
	const content = select_element(".content");
	content.innerHTML = "";
	return content;
};

/**
 * Retrieves quotes/tasks.
 * @returns {obj} object with tasks/quotes.
 */
const get_tasks = () => {
	return JSON.parse(localStorage.getItem("quotes"));
};

/**
 * Updates and renders tasks.
 * @param {*} task_holder Holds a task.
 * @param {*} new_task Task to be added.
 */
const update_tasks = (task_holder, new_task) => {
	const tasks = get_tasks();
	tasks.push(new_task);
	localStorage.setItem("quotes", JSON.stringify(tasks));
	render_tasks(task_holder);
};

/**
 * Renders tasks.
 * @param {*} task_holder Holds a task.
 */
const render_tasks = (task_holder) => {
	const background_colors = [
		"#e97e40",
		"#deadac",
		"#f4dd65",
		"#86c753",
		"#6fa0b2",
		"#e6bfb9",
	];
	task_holder.innerHTML = "";
	get_tasks().forEach((taskData, i) => {
		const task = append_element(task_holder, "div", ["task-block"]);
		const quoteWrapper = append_element(task, "div", ["task-name-wrapper"]);
		append_element(quoteWrapper, "span", ["task-name"], taskData.name);
		const icon = append_element(quoteWrapper, "img", ["task-img"]);
		let num = rand_int(6) + 1;

		icon.src = "img/icons/icon" + num + ".png";

		task.style.backgroundColor =
			background_colors[i % background_colors.length];
	});
};

/**
 * Initializes welcome page.
 */
const initialize_welcome_page = () => {
	const welcome_content = select_element(".content");
	welcome_content.classList.add("center-mode");
	welcome_content.innerHTML = "";
	const buttons_container = select_element(".nav-buttons-container");
	buttons_container.innerHTML = "";

	const reg_wrap = append_element(welcome_content, "div", [
		"registration-wrapper",
	]);

	// WELCOME HEADER
	append_element(
		reg_wrap,
		"p",
		["slight-header", "big-header"],
		"Greetings! Please, introduce yourself"
	);
	// set username
	append_element(reg_wrap, "p", [], "What should we call you?");
	const name_input = append_element(reg_wrap, "input", ["input-general"], "");

	// kinda controversial ... swapped from male and female to banana and peach LOL
	append_element(reg_wrap, "p", [], "Pick an avatar !");
	const radio_wrapper = append_element(reg_wrap, "div", ["gender-wrapper"]);
	["banana", "peach"].forEach((gender) => {
		const label = append_element(radio_wrapper, "label", ["container"], gender);
		const input = append_element(label, "input", ["radio-gender"]);
		input.type = "radio";
		input.name = "gender";
		input.value = gender;
		append_element(label, "span", ["checkmark"]);
	});

	// sign me up ! lets fix my brain please c:
	const register_button = append_element(
		reg_wrap,
		"div",
		["action-button"],
		"Let's get going!"
	);
	register_button.addEventListener("click", () => {
		register_user(name_input.value);
	});
};

/**
 * Sets all localStorage properties and the diary to blank.
 */
const clean_local_storage = () => {
	let to_null = ["userName", "userAge", "userGender", "quotes"];
	to_null.forEach((prop_name) => {
		localStorage.setItem(prop_name, "");
	});
	localStorage.setItem("diary-entries", "[]");
};

// -----------------------------------CREATE PROFILE-----------------------------------
/**
 * Initializes profile.
 * @param {String} inputted_username A string of the inputted username.
 */
const initialize_profile = (inputted_username) => {
	let user_gender = localStorage.getItem("userGender");
	// PNG UNDER MY PROFILE ->
	if (!user_gender) {
		user_gender = "fluffle";
	}

	const profile = select_element(".profile");
	profile.innerHTML = "";

	append_element(profile, "p", ["profile__title"], "My profile");
	append_element(profile, "p", ["profile__username"], inputted_username);
	const pic_wrapper = create_element("div", ["profile__avatar-wrapper"]);
	const pic = create_element("img", ["profile__avatar-picture"]);
	pic.setAttribute("src", "img/" + user_gender + ".png");
	pic_wrapper.appendChild(pic);
	profile.appendChild(pic_wrapper);

	if (inputted_username !== "Who are you?") {
		const add_mood_form = append_element(profile, "div", ["profile__add-mood"]);
		append_element(add_mood_form, "p", ["slight-header"], "Add note");
		const add_mood_img = append_element(add_mood_form, "img", [
			"profile__add-mood-image",
		]);
		add_mood_img.setAttribute("src", "img/note.png");

		add_mood_form.addEventListener("click", () => {
			display_modal_window();
			init_modal_window();
		});
	}
};

/**
 * "Registers" the user.
 * @param {String} name inputtedname.
 * @param {int} age Age.
 */
const register_user = (name, age) => {
	localStorage.setItem("userName", name);
	localStorage.setItem("userAge", age);
	localStorage.setItem(
		"userGender",
		select_element(".radio-gender:checked").value
	);
	select_element(".content").classList.remove("center-mode");
	initialize_navbar();
	initialize_homepage();
	initialize_profile(name);
};

// -----------------------------------QUOTES-----------------------------------
/**
 * Initializes the other initializer functions and sets up the page
 * after the initial welcome page.
 */
const central_initializer = () => {
	let quotes = [{
			name: "I possess the qualities needed to be extremely successful",
		},
		{
			name: "My ability to conquer my challenges is limitless; my potential to succeed is infinite",
		},
		{
			name: "My thoughts are filled with positivity and my life is plentiful with prosperity",
		},
	];

	clean_local_storage();
	localStorage.setItem("quotes", JSON.stringify(quotes));

	if (DEBUG) {
		testEntry();
	} else {
		let userName = localStorage.getItem("userName");
		if (userName) {
			initialize_navbar();
			initialize_profile(userName);
			initialize_homepage();
			select_element(".home").classList.add("cur-section");
		} else {
			initialize_profile("Who are you?");
			initialize_welcome_page();
		}
	}
	document.querySelector(".logout-wrapper").addEventListener("click", () => {
		clean_local_storage();
		localStorage.setItem("quotes", JSON.stringify(quotes));
		initialize_profile("Who are you?");
		initialize_welcome_page();
	});
};

document.addEventListener("DOMContentLoaded", central_initializer);

// -----------------------------------NEW MOOD NOTE-----------------------------------

/**
 * Select mood - angy, neutral, or happy.
 */
const init_modal_window = () => {
	const modal_window = refresh_element(".modal-window");
	append_element(modal_window, "p", ["slight-header"], "How was your day?");
	// displays emotes
	const emoticons_holder = append_element(modal_window, "div", [
		"emoticons-holder",
	]);

	let selected = null;
	let selected_val = null;
	["bad", "neutral", "good"].forEach((name) => {
		const emote_wrapper = append_element(emoticons_holder, "div", ["emoticon"]);
		const emote_image = append_element(emote_wrapper, "img", [
			"emoticon-image",
			"emoticon-" + name,
		]);
		emote_image.src = "img/emotes/" + name + ".png";
		emote_wrapper.addEventListener("click", () => {
			if (selected == emote_wrapper) {
				emote_wrapper.classList.remove("selected-emoticon");
				selected = null;
			} else {
				if (selected) {
					selected.classList.remove("selected-emoticon");
				}
				emote_wrapper.classList.add("selected-emoticon");
				selected = emote_wrapper;
				selected_val = name;
			}
		});
	});
	// journal entry
	append_element(
		modal_window,
		"p",
		["slight-header", "on-your-mind"],
		"Here are some prompts to get you started !"
	);
	append_element(
		modal_window,
		"p",
		["gray-text"],
		"What are 5 things I am grateful for today ? "
	);
	append_element(
		modal_window,
		"p",
		["gray-text"],
		"What is my goal for today and how will I achieve it ? "
	);
	append_element(
		modal_window,
		"p",
		["gray-text"],
		"After a long day, the kindest thing that I can do your myself is ..? "
	);

	// text bubble for user input
	const note_area = append_element(modal_window, "textarea", ["note-area"]);
	// select date for graph
	const cal = append_element(modal_window, "input", ["datepicker"]);
	cal.setAttribute("type", "date");
	console.log(cal.value);

	// discard or save
	const submit_container = append_element(modal_window, "div", [
		"submit-container",
	]);
	append_element(
		submit_container,
		"p",
		["gray-text"],
		"We'll take your note from there!"
	);
	const discard = append_element(
		submit_container,
		"div",
		["action-button"],
		"Discard"
	);
	const submit_note = append_element(
		submit_container,
		"div",
		["action-button"],
		"Save"
	);

	discard.addEventListener("click", () => {
		hide_modal_window();
	});

	submit_note.addEventListener("click", () => {
		let good = true;
		if (cal.value == "") {
			make_pulse_red(cal);
			good = false;
		}

		if (selected == null) {
			make_pulse_red(emoticons_holder);
			good = false;
		}

		if (good) {
			process_note_data(selected_val, note_area.value, cal.value);
			hide_modal_window();
		}
	});
};

// <-----------------------------------DASHBOARD----------------------------------->

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GREETING BUBBLE : SHOULD OUTPUT AS -. Hi, *user* endl Don't worry, you'll get throught it! endl we prepared ...etc
/**
 * Initializes the homepage
 */
const initialize_homepage = () => {
	const home_content = content_clear();
	append_element(
		home_content,
		"p",
		["slight-header"],
		"Welcome to your personal haven " + localStorage.getItem("userName")
	);
	append_element(home_content, "p", [], date_format());
	const welcome_block = append_element(home_content, "div", ["hi-block"]);
	append_element(
		welcome_block,
		"p",
		["slight-header"],
		"Hi, " + localStorage.getItem("userName")
	);
	append_element(
		welcome_block,
		"p",
		["gray-text"],
		"How has your day been so far ?"
	);
	append_element(
		welcome_block,
		"p",
		["gray-text"],
		"Here are some positive affirmations to make your day even better !"
	);
	// avatar for the hi user
	const hug = append_element(welcome_block, "img", ["hug"]);
	hug.src = "img/hug.png";
	// ------------------------------

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Section to add new quotes !
	const taskHolder = create_element("div", ["task-holder"]);
	render_tasks(taskHolder);
	home_content.appendChild(taskHolder);

	// cute shit uwu
	const taskAdder = append_element(home_content, "div", ["task-adder"]);
	const addTask = append_element(taskAdder, "div", ["task-block", "task-add"]);
	// input for new quote if wanted
	append_element(
		addTask,
		"p",
		["task-prompt"],
		"Post Your Favorite Quotes Here !"
	);
	const taskNameInput = append_element(addTask, "input", ["task-name-input"]);
	// button to upload quote
	const addTaskButton = append_element(
		addTask,
		"div",
		["action-button"],
		"ADD NEW QUOTE"
	);
	addTaskButton.addEventListener("click", () => {
		let name = taskNameInput.value;
		update_tasks(taskHolder, {
			name: name,
		});
	});
};
// ------------------------------
// <-----------------------------------GRAPH OF EMOTIONS----------------------------------->
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/**
 * Absolute val to correctly display graph.
 * @param {*} a New value.
 * @param {*} b Level in graph.
 * @returns {boolean} Depending on height of graph it will return a boolean.
 */
const graph_mood_check = (a, b) => {
	return Math.abs(a - b) < 1e-5;
};

/**
 * Initialize Graph.
 */
const initialize_graph = () => {
	const graph_content = content_clear();
	append_element(graph_content, "p", ["slight-header"], "Graph of emotions");
	const graphHolder = append_element(graph_content, "div", ["graph-holder"]);

	let diary = JSON.parse(localStorage.getItem("diary-entries"));
	console.log(diary);
	const graph_data = {
		chart: {
			type: "area",
			colors: ["#e0b389"],
			toolbar: {
				show: false,
			},
		},

		// <-----------------------------------https://apexcharts.com/docs/options/theme/----------------------------------->
		theme: {
			palette: "palette5",
			monochrome: {
				enabled: true,
				color: "#F9A3A4",
				shadeTo: "light",
				shadeIntensity: 0.65,
			},
		},
		series: [],
		xaxis: {
			categories: [],
		},
		yaxis: {
			labels: {
				formatter: function(value) {
					if (graph_mood_check(value, 3)) {
						return "good  ";
					}
					if (graph_mood_check(value, 2)) {
						return "neutral  ";
					}
					if (graph_mood_check(value, 1)) {
						return "bad  ";
					}
					return "";
				},
			},
		},
		fill: {
			type: "gradient",
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.9,
				stops: [0, 90, 100],
			},
		},
		stroke: {
			curve: "smooth",
		},
	};

	const series_obj = {
		name: "mood",
		data: [],
	};

	const mood_map = {
		good: 3,
		neutral: 2,
		bad: 1,
	};

	// diary submissions
	let sorted_diary = diary.sort((x, y) => {
		let dx = new Date(x.date);
		let dy = new Date(y.date);
		return dx.getTime() < dy.getTime();
	});

	sorted_diary.forEach((entry) => {
		series_obj.data.push(mood_map[entry.mood]);
		graph_data.xaxis.categories.push(entry.date);
	});

	graph_data.series.push(series_obj);

	const apex_chart = new ApexCharts(graphHolder, graph_data);

	apex_chart.render();
};
// ------------------------------

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// -----------------------------------LINK BREATHING SHIT HERE-----------------------------------
/**
 * Initializes breathing content.
 */
const initialize_test = () => {
	const test_content = content_clear();
	append_element(test_content, "p", ["big-header"], "Meditation");
	append_element(test_content, "p", ["gray-text"], "Zen out c: !");
	const article_wrap = append_element(test_content, "div", ["article-wrapper"]);
	const iframe_src = "src/breatheHoe.html";
	const iframe = append_element(article_wrap, "iframe", ["iframe"]);
	// return one element [0] , cant set att on arr
	// SHOUTOUT TO ANDREA FOR HELPING ME HERE <333
	document.getElementsByClassName("iframe")[0].setAttribute("src", iframe_src);
};
// ------------------------------

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// -----------------------------------HOTLINE NUMBERS-----------------------------------
/**
 * Initializes hotline page content.
 */
const initialize_hotline = () => {
	const content = content_clear();
	const articleContent = [];
	// depression / suicide
	append_element(content, "p", ["slight-header"], "Information + Resources !");
	append_element(content, "p", ["slight-header"], "DEPRESSION HOTLINE NUMBERS");
	append_element(
		content,
		"p",
		["gray-text"],
		"National Suicide Prevention Lifeline - 800-273-8255"
	);
	append_element(content, "p", ["gray-text"], "SAMHSA - 800-662-4357");
	append_element(content, "p", ["gray-text"], "Samaritans - 877-870-4673");
	append_element(
		content,
		"p",
		["gray-text"],
		"Veterans Crisis Line - Call 800-273-8255 or Text 838255"
	);
	append_element(
		content,
		"p",
		["gray-text"],
		'Crisis Text Line - Text "HOME" to 741741'
	);
	// anxiety
	append_element(content, "p", ["slight-header"], "ANXIETY HOTLINE NUMBERS");
	append_element(
		content,
		"p",
		["gray-text"],
		"National Alliance on Mental Illness Helpline - 800-950-6264"
	);
	append_element(content, "p", ["gray-text"], "Teen Line - 310-855-4673");
	// eating disorders
	append_element(
		content,
		"p",
		["slight-header"],
		"EATING DISORDER HOTLINE NUMBERS"
	);
	append_element(
		content,
		"p",
		["gray-text"],
		"Multi-Service Eating Disorders Association - 617-558-1881"
	);
	append_element(
		content,
		"p",
		["gray-text"],
		"National Association of Anorexia Nervosa and Associated Disorders - 630-577-1330"
	);
	// drug / alc abuse
	append_element(
		content,
		"p",
		["slight-header"],
		"ALCOHOL / DRUG ABUSE HOTLINE NUMBERS"
	);
	append_element(
		content,
		"p",
		["gray-text"],
		"Alcoholics Anonymous - 212-870-3400"
	);
	append_element(
		content,
		"p",
		["gray-text"],
		"National Council on Alcoholism and Drug Dependence - 800-622-2255"
	);

	articleContent.forEach((text) => {
		append_element(content, "p", ["about-text"], text);
	});
};
// ------------------------------
// -----------------------------------NAV BAR-----------------------------------
/**
 * Initializes navbar.
 */
const initialize_navbar = () => {
	const nav_buttons = ["home", "graph", "test", "about"];
	const initers = [
		initialize_homepage,
		initialize_graph,
		initialize_test,
		initialize_hotline,
	];
	const buttons_container = select_element(".nav-buttons-container");

	nav_buttons.forEach((button, i) => {
		// let curButton = appendElem(buttonsContainer, 'div', ['nav-button', button]);
		let cur_button = append_element(buttons_container, "div", [
			"nav-button",
			button,
		]);
		let nav_icon = append_element(cur_button, "img", ["nav-icon"]);
		nav_icon.src = "./img/nav-icons/" + button + ".png";
		cur_button.addEventListener("click", () => {
			const previous = select_element(".cur-section");
			if (previous) {
				previous.classList.remove("cur-section");
			}
			cur_button.classList.add("cur-section");
			initers[i]();
		});
	});
};

/**
 * Processes the data from notes.
 * @param {*} badGoodNeutral Mood chosen by user.
 * @param {String} noteText Any text inputted by user.
 * @param {*} dateString The date chosen by user.
 */
const process_note_data = (badGoodNeutral, noteText, dateString) => {
	input_to_diary(badGoodNeutral, dateString);
};
// ------------------------------