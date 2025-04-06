const CourseInput = document.getElementById("Course");
const UsernameInput = document.getElementById("Username");
const YearInput = document.getElementById("Year");
const SectionInput = document.getElementById("Section");
const RoleInput = document.getElementById("Role");
const XBtn = document.getElementById("XBtn");
const MsgBox = document.getElementById("MsgBox")



RoleInput.onchange = () => {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ""


    if (RoleInput.value == "Student") {
        const newElement = document.createElement('div');
        newElement.className = 'inputRow';
        newElement.innerHTML = '\
            <div class="inputContainer Tri">\
                <label for="Course">Course:</label>\
                <select name="Course" id="Course" required>\
                    <option value=""></option>\
                    <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>\
                    <option value="Bachelor of Science in Accountancy">Bachelor of Science in Accountancy</option>\
                    <option value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</option>\
                    <option value="Bachelor of Arts in Journalism">Bachelor of Arts in Journalism</option>\
                    <option value="Bachelor of Arts in Public Administration">Bachelor of Arts in Public Administration</option>\
                </select>\
                <small>Required</small>\
            </div>\
            <div class="inputContainer Tri">\
                <label for="">Year:</label>\
                <input type="text" required name="Year" id="Year">\
                <small>Required</small>\
            </div>\
            <div class="inputContainer Tri">\
                <label for="">Section:</label>\
                <input type="text" required name="Section" id="Section">\
                <small>Required</small>\
            </div>';
        formContainer.appendChild(newElement);
    } else if (RoleInput.value == "Faculty") {
        const newElement = document.createElement('div');
        newElement.className = 'inputRow';
        newElement.innerHTML = '\
            <div class="inputRow">\
                <div class="inputContainer Uni">\
                    <label for="Department">Department:</label>\
                    <select name="Department" id="Department" required>\
                        <option value=""></option>\
                        <option value="College of Computer Studies">College of Computer Studies</option>\
                        <option value="College of Art and Science">College of Art and Science</option>\
                        <option value="College of Criminal Justice Education">College of Criminal Justice Education</option>\
                        <option value="College of Teacher Education">College of Teacher Education</option>\
                        <option value="College of Business and Accountancy">College of Business and Accountancy</option>\
                    </select>\
                </div>\
            </div>';
             
        formContainer.appendChild(newElement);
    }
}

XBtn.addEventListener("click", () => {
    MsgBox.classList.add("Hide");
});