const DropdownBtn = document.getElementById("DropdownBtn");
const DropdownContent = document.getElementById("DropdownContent");

DropdownBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent immediate closing when clicked
    DropdownContent.classList.toggle("show");
});