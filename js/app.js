
const commentBtns = document.querySelectorAll(".fa-commenting");
const commentDiv =  document.querySelector(".comment-section");



for (const commentBtn of commentBtns) {
    commentBtn.addEventListener("click", showComments)
}

function showComments(e){
    if(commentDiv.getAttribute("style").includes("none")){
        commentDiv.style.display = "block";
    }
    else{
        commentDiv.style.display = "none";
    }

    e.preventDefault();
}