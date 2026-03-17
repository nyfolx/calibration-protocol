const buttonContainer = document.getElementById("button-container")
const choicesContainer = document.getElementById("choices-container")
const calibrationButton = document.getElementById("calibration-button")
const divTemplate = document.createElement("div")

addEventListener("load", (event) => {
	calibrationButton.addEventListener("click", () =>
		startCalibration(baseDiff, baseImgNb),
	)
})

const IMAGES_SRC = [
	"CUTE.webp",
	"DRONE.jpg",
	"TAIL.png",
	"PEN.jpg",
	"RAWR.jpg",
	"ROCKET.jpg",
	"SUB.WEBP",
	"SWIM.jpg",
]

const WORDS = [
	"VIDE",
	"SERVIR",
	"OBÉIR",
	"DOCILE",
	"APPRENDRE",
	"REGARDER",
	"ECOUTER",
	"ASSIMILER",
]

const associations = {}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i

		// swap elements array[i] and array[j]
		// we use "destructuring assignment" syntax to achieve that
		// you'll find more details about that syntax in later chapters
		// same can be written as:
		// let t = array[i]; array[i] = array[j]; array[j] = t
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

const baseDiff = 5
const baseImgNb = 3
const nbMaxTurns = 10

const overseer = {}

async function startCalibration(diff, imgNb) {
	console.log("clic")
	overseer["imgNb"] = imgNb
	// Tuto

	let imgWithoutRemise = [...IMAGES_SRC]

	let wordWithoutRemise = [...WORDS]

	overseer["associations"] = {}

	// Making the associations
	for (let nbImage = 0; nbImage < imgNb; nbImage++) {
		shuffle(imgWithoutRemise)
		shuffle(wordWithoutRemise)
		overseer["associations"][imgWithoutRemise.pop()] = wordWithoutRemise.pop()
	}

	console.log(overseer["associations"])

	for (let i = 0; i < Object.keys(overseer["associations"]).length; i++) {
		document.getElementById("choices-container").innerHTML = ""
		let bgStyle = document.getElementById("background").style
		bgStyle.backgroundImage =
			"url('" + Object.keys(overseer["associations"])[i] + "')"
		bgStyle.backgroundSize = "cover"

		let textDiv = document.createElement("span")
		textDiv.style.height = "100vh"
		textDiv.style.width = "50vw"
		textDiv.innerText =
			overseer["associations"][Object.keys(overseer["associations"])[i]]
		textDiv.style.fontSize = "20vh"
		textDiv.style.fontFamily = "Impact"
		textDiv.style.color = "rgba(146, 33, 76, 1)"
		textDiv.style.padding = "5px"

		document.getElementById("choices-container").style.textAlign = "center"
		document.getElementById("choices-container").style.paddingTop = "70vh"

		document.getElementById("choices-container").appendChild(textDiv)

		await new Promise((r) => setTimeout(r, 3000))
	}

	document.getElementById("choices-container").style =
		"display: flex; flex-direction: row"

	let difficulty = diff
	// Setting the loop
	overseer["attempt"] = ["starting"]
	nextCalibrate(nbMaxTurns, 0, difficulty, "starting")
}

async function clearChoices() {
	document.getElementById("choices-container").innerHTML = ""
	let bgStyle = document.getElementById("background").style
	bgStyle.backgroundImage = "none"
	bgStyle.backgroundColor = "black"
	await new Promise((r) => setTimeout(r, 1000))
}

async function nextCalibrate(maxTurns, currTurn, difficulty, correctWord) {
	// Check if attempt is correct
	if (overseer["attempt"][0] == correctWord) {
		overseer["attempt"] = []
		console.log(maxTurns, currTurn, difficulty / (0.3 * (currTurn + 1 + 5)))
		await clearChoices()

		if (currTurn == maxTurns) {
			startCalibration(difficulty - 1, overseer["imgNb"] + 1)
		} else {
			let currImage = Object.keys(overseer["associations"])[
				parseInt(Math.random() * Object.keys(overseer["associations"]).length)
			]

			displayChoice(currImage)

			setTimeout(
				() =>
					nextCalibrate(
						maxTurns,
						currTurn + 1,
						difficulty,
						overseer["associations"][currImage],
					),
				(difficulty / (0.3 * (currTurn / 2 + 1 + 3))) * 1000,
			)
		}
	} else {
		await clearChoices()

		alert("Failed ! " + difficulty + " | " + currTurn)
	}
}

function displayChoice(currImage) {
	buttonContainer.hidden = true
	choicesContainer.hidden = false

	// Background is the image that should be known
	let bgStyle = document.getElementById("background").style
	bgStyle.backgroundImage = "url('" + currImage + "')"
	bgStyle.backgroundSize = "cover"

	let choicesWords = []
	let correctWord = overseer["associations"][currImage]
	choicesWords.push(correctWord)
	// Choose random choices
	let nbChoices = 2
	let remainingWords = [...WORDS].filter((x) => x != correctWord)
	for (let i = 0; i < nbChoices - 1; i++) {
		shuffle(remainingWords)
		choicesWords.push(remainingWords.pop())
	}
	shuffle(choicesWords)
	console.log(choicesWords)

	// Populate choices container (should be in calibration loop)
	for (let i = 0; i < nbChoices; i++) {
		let choiceDivToInsert = document.createElement("div")
		choiceDivToInsert.style.width = 50 / nbChoices + "vw"
		choiceDivToInsert.style.height = "100vh"
		choiceDivToInsert.onmouseover = function () {
			this.style.background = "rgba(255, 255, 255, 0.2)"
		}
		choiceDivToInsert.onmouseout = function () {
			this.style.background = "none"
		}
		choiceDivToInsert.onmousedown = function () {
			this.style.background = "rgba(255, 255, 255, 0.8)"
			overseer["attempt"].push(choicesWords[i])
			console.log(overseer)
			window.setTimeout(function () {
				choiceDivToInsert.style.background = "none"
			}, 200)
		}

		let textDiv = document.createElement("span")

		textDiv.innerText = choicesWords[i]
		textDiv.style.fontSize = "10vh"
		textDiv.style.fontFamily = "Impact"
		textDiv.style.color = "rgba(25, 43, 58, 1)"
		textDiv.style.backgroundColor = "rgba(121, 121, 121, 0.77)"
		textDiv.style.padding = "5px"

		choiceDivToInsert.appendChild(textDiv)
		choiceDivToInsert.style.textAlign = "center"
		choiceDivToInsert.style.paddingTop = "70vh"

		choicesContainer.appendChild(choiceDivToInsert)
	}
}
