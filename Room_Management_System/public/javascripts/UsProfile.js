const NewPassword = document.getElementById("NewPassword")
const NewPasswordSmall = document.querySelector("#NewPassword + small");

const ConfirmPassword = document.getElementById("ConfirmPassword");
const ConfirmPasswordSmall = document.querySelector("#ConfirmPassword + small");


NewPassword.addEventListener("change", ()=>{
    isStrong(NewPassword, NewPasswordSmall)
});

ConfirmPassword.addEventListener("change", ()=>{
    isStrong(ConfirmPassword, ConfirmPasswordSmall)
});

const ChangePassContainer = document.getElementById("ChangePassContainer")
ChangePassContainer.addEventListener("submit", function(event){
    if(!isStrong(NewPassword, NewPasswordSmall) || !isStrong(ConfirmPassword, ConfirmPasswordSmall) || !(NewPassword.value === ConfirmPassword.value)){
        event.preventDefault();

        ConfirmPasswordSmall.classList.add("Active")
        ConfirmPassword.classList.add("Invalid")
        ConfirmPasswordSmall.innerText = "Password not match."

        NewPasswordSmall.classList.add("Active")
        NewPassword.classList.add("Invalid")
        NewPasswordSmall.innerText = "Password not match."
    }else{

    }
})

function isStrong(Input, Small){
    if(Input.value.length < 8){
        Small.innerText = "Password must contain at least 12 Characters."
        Small.classList.add("Active")
        Input.classList.add("Invalid")
        return false

    }else if(!containsSpecialCharacters(Input.value)){
        Small.innerText = "Password must contain a special characters (@, !, $, e.g.)."
        Small.classList.add("Active")
        Input.classList.add("Invalid")
        return false

    }else if(!containLower(Input.value)){
        Small.innerText = "Password must contain a lowercase letter."
        Small.classList.add("Active")
        Input.classList.add("Invalid")
        return false

    }else if(!containUpper(Input.value)){
        Small.innerText = "Password must contain a uppercase letter."
        Small.classList.add("Active")
        Input.classList.add("Invalid")
        return false

    }else if(!containNumber(Input.value)){
        Small.innerText = "Password must contain a number."
        Small.classList.add("Active")
        Input.classList.add("Invalid")
        return false

    }else{
        Small.classList.remove("Active")
        Input.classList.remove("Invalid")
        return true

    }
}

function containsSpecialCharacters(str) {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
    return specialCharPattern.test(str);
}

function containLower(str){
    const isContain = /[a-z]/.test(str);
    return isContain
}

function containUpper(str){
    const isContain = /[A-Z]/.test(str);
    return isContain
}

function containNumber(str){
    const isContain = /[1-9]/.test(str);
    return isContain
}
