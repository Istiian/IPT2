const DropdownBtn = document.getElementById("DropdownBtn");
        const DropdownContent = document.getElementById("DropdownContent");
        const BarBtn = document.getElementById("BarBtn");
        const SideNavContainer = document.getElementById("SideNavContainer");

        // Toggle Dropdown
        DropdownBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent immediate closing when clicked
            DropdownContent.classList.toggle("show");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!DropdownBtn.contains(event.target) && !DropdownContent.contains(event.target)) {
                DropdownContent.classList.remove("show");
            }
        });

        // Toggle Sidebar
        BarBtn.addEventListener("click", () => {
            SideNavContainer.classList.toggle("active");
        });

        // Prevent Sidebar hover conflict
        SideNavContainer.addEventListener("mouseover", () => {
            if (!SideNavContainer.classList.contains("active")) {
                SideNavContainer.classList.add("hover");
            }
        });

        SideNavContainer.addEventListener("mouseout", () => {
            if (!SideNavContainer.classList.contains("active")) {
                SideNavContainer.classList.remove("hover");
            }
        });
