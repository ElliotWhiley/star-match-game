import "./App.css";
import { useState, useEffect } from "react";

const App = () => {
	const [gameId, setGameId] = useState(1);

	return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
};

const Game = (props) => {
	const [numberOfStars, setNumberOfStars] = useState(utils.random(1, 9));
	const [candidateNumbers, setCandidateNumbers] = useState([]);
	const [availableNumbers, setAvailableNumbers] = useState(utils.range(1, 9));
	const [secondsLeft, setSecondsLeft] = useState(10);
	useEffect(() => {
		if (secondsLeft > 0 && availableNumbers.length > 0) {
			const timerId = setTimeout(
				() => setSecondsLeft(secondsLeft - 1),
				1000
			);
			return () => clearTimeout(timerId);
		}
	});

	const candidatesAreWrong = utils.sum(candidateNumbers) > numberOfStars;
	const gameStatus =
		availableNumbers.length === 0
			? "won"
			: secondsLeft === 0
			? "lost"
			: "active";

	const numberStatus = (number) => {
		if (!availableNumbers.includes(number)) {
			return "used";
		}
		if (candidateNumbers.includes(number)) {
			return candidatesAreWrong ? "wrong" : "candidate";
		}
		return "available";
	};

	const onNumberClick = (numberClicked, currentStatus) => {
		if (currentStatus === "used" || gameStatus !== "active") {
			return;
		}

		const newCandidateNumbers =
			currentStatus === "available"
				? [...candidateNumbers, numberClicked]
				: candidateNumbers.filter((x) => x !== numberClicked);

		if (utils.sum(newCandidateNumbers) !== numberOfStars) {
			setCandidateNumbers(newCandidateNumbers);
		} else {
			const newAvailableNumbers = availableNumbers.filter(
				(x) => !newCandidateNumbers.includes(x)
			);
			setNumberOfStars(utils.randomSumIn(newAvailableNumbers, 9));
			setAvailableNumbers(newAvailableNumbers);
			setCandidateNumbers([]);
		}
	};

	return (
		<div className="game">
			<div className="help">
				Pick 1 or more numbers that sum to the number of stars
			</div>
			<div className="body">
				<div className="left">
					{gameStatus !== "active" ? (
						<PlayAgain
							onClick={props.startNewGame}
							gameStatus={gameStatus}
						/>
					) : (
						<StarsDisplay count={numberOfStars} />
					)}
				</div>
				<div className="right">
					{utils.range(1, 9).map((number) => (
						<GridNumber
							key={number}
							number={number}
							status={numberStatus(number)}
							onClick={onNumberClick}
						/>
					))}
				</div>
			</div>
			<div className="timer">Time Remaining: {secondsLeft}</div>
		</div>
	);
};

const StarsDisplay = (props) => {
	return (
		<>
			{utils.range(1, props.count).map((starId) => (
				<div key={starId} className="star" />
			))}
		</>
	);
};

const PlayAgain = (props) => {
	return (
		<div className="game-done">
			<div
				className="message"
				style={{ color: props.gameStatus === "lost" ? "red" : "green" }}
			>
				{props.gameStatus == "lost" ? "Game over" : "Nice!!"}
			</div>
			<button onClick={props.onClick}>Play Again</button>
		</div>
	);
};

const GridNumber = (props) => {
	return (
		<button
			className="number"
			style={{ backgroundColor: colors[props.status] }}
			onClick={() => props.onClick(props.number, props.status)}
		>
			{props.number}
		</button>
	);
};

// Color Theme
const colors = {
	available: "lightgray",
	used: "lightgreen",
	wrong: "lightcoral",
	candidate: "deepskyblue",
};

// Math science
const utils = {
	// Sum an array
	sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

	// create an array of numbers between min and max (edges included)
	range: (min, max) =>
		Array.from({ length: max - min + 1 }, (_, i) => min + i),

	// pick a random number between min and max (edges included)
	random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

	// Given an array of numbers and a max...
	// Pick a random sum (< max) from the set of all available sums in arr
	randomSumIn: (arr, max) => {
		const sets = [[]];
		const sums = [];
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0, len = sets.length; j < len; j++) {
				const candidateSet = sets[j].concat(arr[i]);
				const candidateSum = utils.sum(candidateSet);
				if (candidateSum <= max) {
					sets.push(candidateSet);
					sums.push(candidateSum);
				}
			}
		}
		return sums[utils.random(0, sums.length - 1)];
	},
};

export default App;
