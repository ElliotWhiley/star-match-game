import "./App.css";
import React from "react";

const App = () => {
	const [numberOfStars, setNumberOfStars] = React.useState(
		utils.random(1, 9)
	);
	const [candidateNumbers, setCandidateNumbers] = React.useState([]);
	const [availableNumbers, setAvailableNumbers] = React.useState(
		utils.range(1, 9)
	);
	const candidatesAreWrong = utils.sum(candidateNumbers) > numberOfStars;

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
		if (currentStatus === "used") {
			return;
		}

		const newCandidateNumbers =
			currentStatus == "available"
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
					<StarsDisplay count={numberOfStars} />
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
			<div className="timer">Time Remaining: 10</div>
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
