/**
 * Retrieves a random int, max being the max param passed.
 *
 * @param {int} max The max number to be generated.
 *
 * @return {int} returns a random number
 */
const rand_int = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Retrieves first element from passed parameter.
 *
 * @param {string} elem_to_select name of element to select.
 *
 * @return {html element} retrieves first element of what was passed.
 */
const select_element = (elem_to_select) => {
  return document.querySelector(elem_to_select);
};

/**
 * Makes the inner HTML of a selected element equal to a blank string.
 *
 * @param {string} ele_id The name of the element id to refresh
 *
 * @return {element} returns the refreshed html element
 */
const refresh_element = (ele_id) => {
  const elem = select_element(ele_id);
  elem.innerHTML = "";
  return elem;
};

/**
 * Creates an element of passed type, adds classes that were passed and content
 * to the element.
 *
 * @param {string} elem_type the type of element to make
 * @param {array} classes_list an array of strings with class names that are assigned to the new element
 * @param {string} html_content Will be assigned to the innerHTML of the element
 */
const create_element = (elem_type, classes_list = [], html_content = "") => {
  const elem = document.createElement(elem_type);

  for (let cls of classes_list) {
    elem.classList.add(cls);
  }

  elem.innerHTML = html_content;
  return elem;
};

/**
 * Appends an element to a specified element.
 *
 * @param {string} where_to_append Specifies the element to append a child element to.
 * @param {string} element_type The type of element to create.
 * @param {array} classes_list An array of strings that are class names to append to element.
 * @param {string} html_content The InnerHTML of the element.
 *
 * @return {element} Returns the created element that is appended to the parent.
 */
const append_element = (
  where_to_append,
  element_type,
  classes_list = [],
  html_content = ""
) => {
  const elem = create_element(element_type, classes_list, html_content);
  where_to_append.appendChild(elem);
  return elem;
};

/**
 * Brings up a pop-up window
 */
const display_modal_window = () => {
  const modal_window = select_element(".modal-window");
  const modal_shadow = select_element(".modal-shadow");
  modal_window.style.opacity = 1;
  modal_window.style.zIndex = 3;
  modal_shadow.style.display = "block";
};

/**
 * Hides the pop-up window
 */
const hide_modal_window = () => {
  const modal_window = select_element(".modal-window");
  const modal_shadow = select_element(".modal-shadow");
  modal_window.style.opacity = 0;
  modal_window.style.zIndex = -1;
  modal_shadow.style.display = "none";
};

/**
 * Makes an element pulse red
 *
 * @param {element} element_name name of element to have pulse red
 */
const make_pulse_red = (element_name) => {
  element_name.style.animation = "pulseRed 0.4s";
  setTimeout(() => {
    element_name.style.animation = "none";
  }, 400);
};

/**
 * Updates the diary entry with passed mood and date
 *
 * @param {string} mood your mood on the date
 * @param {string} date the date of the mood
 */
// ************************************************* Better parameter names? ************************************
const input_to_diary = (mood, date) => {
  let obj = {
    mood,
    date,
  };
  let current_data = JSON.parse(localStorage.getItem("diary-entries"));
  current_data.push(obj);
  localStorage.setItem("diary-entries", JSON.stringify(current_data));
};
// date for dashboard
/**
 * Sets up the date as 'month day, year'
 */
const date_format = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date_object = new Date();
  const day = String(date_object.getDate()).padStart(2, "0");
  const month = monthNames[date_object.getMonth()];
  const year = date_object.getFullYear();
  const formatted_date = month + " " + day + ", " + year;
  return formatted_date;
};
