const commentBtn = document.querySelector(".fa-commenting");
const commentDiv = document.querySelector(".comment-section");
const btnNext = document.querySelector(".carousel-control-next");
const btnPrev = document.querySelector(".carousel-control-prev");
const imgSlider = document.querySelector("#slide");
const reactBtn = document.querySelector(".likeBtn");
const sendCommentBtn = document.querySelector("#comment-btn");

let imgPath,
	k = 0,
	canChange = false,
	currentImgDetail,
	imageDetails = [];

//Add all event listeners
window.addEventListener("DOMContentLoaded", getImageDetails);
btnNext.addEventListener("click", handleNext);
btnNext.addEventListener("mouseleave", resumeImageChange);
btnPrev.addEventListener("click", handlePrev);
btnPrev.addEventListener("mouseleave", resumeImageChange);
reactBtn.addEventListener("click", handleReaction);
commentBtn.addEventListener("click", showComments);
sendCommentBtn.addEventListener("click", handleComment);

function showComments(e) {
	if (commentDiv.getAttribute("style").includes("none")) {
		commentDiv.style.display = "block";
		canChange = false;
	} else {
		commentDiv.style.display = "none";
		canChange = true;
	}
	e.preventDefault();
}

function handleNext() {
	//sets the next image and it's properties
	canChange = false;
	k = k + 1 >= imgPath.length ? 0 : k + 1;
	setImageValues(imgPath[k]);
}
function handlePrev() {
	//sets the previous image and it's properties
	canChange = false;
	k = k - 1 < 0 ? imgPath.length - 1 : k - 1;
	setImageValues(imgPath[k]);
}

function resumeImageChange() {
	if (commentDiv.getAttribute("style").includes("none")) canChange = true;
}

function changeImage() {
	if (canChange) {
		k++;
		if (k >= imgPath.length) k = 0;
		setImageValues(imgPath[k]);
	}
}

function getImageDetails() {
	imgPath = [
		"./img/slider1.png",
		"./img/slider2.jpg",
		"./img/slider3.jpg",
		"./img/slider4.jpg",
		"./img/slider5.jpg",
		"./img/slider6.jpg",
		"./img/slider7.jpg",
		"./img/slider8.jpg",
		"./img/slider9.jpg",
	];
	fetchImageDetails();

	//Set the initial Image
	setImageValues(imgPath[k]);
	// k++;
	canChange = true;
	//Timer for image slide
	setInterval(changeImage, 5000);
}

function setImageValues(currPath) {
	//look for the details of currPath in imageDetails
	let notFound = true;
	for (const imageDetail of imageDetails) {
		if (imageDetail.imgSource == currPath) {
			currentImgDetail = imageDetail;
			notFound = false;
			break;
		}
	}

	if (notFound) {
		currentImgDetail = {
			imgSource: currPath,
			comments: [],
			reactions: 0,
		};
	}

	imgSlider.setAttribute("src", currPath);
	document.querySelector("#likes").textContent = currentImgDetail.reactions;
	document.querySelector("#comments-count").textContent =
		currentImgDetail.comments.length;

	let comments = "";
	if (currentImgDetail.comments.length > 0) {
		for (const comment of currentImgDetail.comments) {
			comments += `<li class="list-group-item">${comment.comment}</li>`;
		}
	}
	document.querySelector(".comment-list").innerHTML = comments;
	let { isAlreadyLiked } = saveLikes();
	if (isAlreadyLiked) reactBtn.style.backgroundColor = "#b45460";
	else reactBtn.style.backgroundColor = "transparent";
}

function handleReaction(e) {
	//CHECKED IF ALREADY LIKED... if image src is in the list of liked images
	//if true, do nothing
	//else save in the list of liked image src and post
	let likedImage = imgPath[k];
	let { isAlreadyLiked, imgLikes } = saveLikes();
	if (!isAlreadyLiked) {
		reactBtn.style.backgroundColor = "#b45460";
		postImageDetail({
			imgSource: likedImage,
			reaction: {
				isLiked: true,
			},
		});

		//add the img src to already liked images and save back to db
		imgLikes.push(likedImage);
		localStorage.setItem("aipalbot-image-likes", JSON.stringify(imgLikes));
	}
	e.preventDefault();
}

const email = document.querySelector("#email-input"),
	comment = document.querySelector("#comment-input");

function handleComment() {
	postImageDetail({
		imgSource: imgPath[k],
		comment: {
			email: email.value,
			comment: comment.value,
		},
		reaction: {
			isLiked: false,
		},
	});
}

function fetchImageDetails() {
	axios
		.get("https://aipalbotinfotech.herokuapp.com/imageDetail")
		.then((response) => {
			imageDetails = response.data;
			setImageValues(imgPath[k]);
		})
		.catch((error) => {
			if (error.response) {
				window.alert(error.response);
			} else if (error.request) {
				window.alert(error.request);
			} else {
				console.log("Error", error.message);
			}
		});
}

function postImageDetail(data) {
	axios
		.post("https://aipalbotinfotech.herokuapp.com/imageDetail", data)
		.then((response) => {
			imageDetails = response.data;
			setImageValues(imgPath[k]);
			if (!data.reaction.isLiked) {
				email.value = "";
				comment.value = "";
			}
		})
		.catch((error) => {
			if (error.response) {
				if (!data.reaction.isLiked) {
					showAlert(error.response.data);
				}
			} else if (error.request) {
				if (!data.reaction.isLiked) {
					showAlert(error.message);
				}
			} else {
				console.log("Error", error.message);
			}
		});
}

function showAlert(msg) {
	const alertDiv = document.createElement("div");
	alertDiv.classList += `alert-danger text-center h5 py-2 alertDiv`;
	alertDiv.textContent = msg;
	commentDiv.insertBefore(alertDiv, sendCommentBtn);

	setTimeout(() => {
		const alertDiv = document.querySelector(".alertDiv");
		if (alertDiv) {
			alertDiv.remove();
		}
	}, 5000);
}

function saveLikes(likedImage) {
	let imgLikes = [],
		isAlreadyLiked = false;
	const likes = localStorage.getItem("aipalbot-image-likes");
	if (likes) {
		imgLikes = JSON.parse(likes);
	}
	imgLikes.forEach((imgLike) => {
		if (imgLike == likedImage) return (isAlreadyLiked = true);
	});

	return { isAlreadyLiked, imgLikes };
}
