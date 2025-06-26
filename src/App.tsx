// import { useReducer, ChangeEvent } from "react";

import { useReducer } from "react";

import "./App.css";

type GameState = {
  playerGuess: string;
  secretNumber: number | null;
  feedback: string | null;
  numTrials: number;
  guessButtonIsDisabled: boolean;
  inputReadOnly: boolean;
  newGameButtonIsDisabled: boolean;
};

type GameAction =
  | { type: "NEW_GAME" }
  | { type: "UPDATE_PLAYER_GUESS"; payload: string }
  | { type: "PLAYER_GUESS" };

const initialState: GameState = {
  playerGuess: "",
  secretNumber: null,
  feedback: null,
  numTrials: 0,
  guessButtonIsDisabled: true,
  inputReadOnly: true,
  newGameButtonIsDisabled: false,
};

function generateSecretNumber(): number {
  return Math.trunc(Math.random() * 100);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "NEW_GAME") {
    return {
      ...state,
      secretNumber: generateSecretNumber(),
      feedback: "Secret number generated. Good luck guessing it!",
      numTrials: 10,
      guessButtonIsDisabled: false,
      inputReadOnly: false,
      newGameButtonIsDisabled: true,
      playerGuess: "",
    };
  }

  if (action.type === "UPDATE_PLAYER_GUESS") {
    return {
      ...state,
      playerGuess: action.payload,
    };
  }

  if (action.type === "PLAYER_GUESS") {
    const guess = Number(state.playerGuess);
    const secret = state.secretNumber!;
    const trialsLeft = state.numTrials - 1;

    if (guess === secret) {
      return {
        ...state,
        feedback: `You win! Score: ${trialsLeft * 10}`,
        guessButtonIsDisabled: true,
        inputReadOnly: true,
        newGameButtonIsDisabled: false,
        numTrials: trialsLeft,
      };
    }

    if (trialsLeft === 0) {
      return {
        ...state,
        feedback: `You lost. The secret number was ${secret}`,
        guessButtonIsDisabled: true,
        inputReadOnly: true,
        newGameButtonIsDisabled: false,
        numTrials: 0,
      };
    }

    return {
      ...state,
      feedback:
        guess > secret
          ? `${guess} is greater than the secret number`
          : `${guess} is less than the secret number`,
      numTrials: trialsLeft,
    };
  }

  return state;
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "UPDATE_PLAYER_GUESS", payload: e.target.value });
  }

  return (
    <>
      {/* <h1>Houston!! Guessing Game</h1> */}

      <div className="myWholeGameBox">
        <header className="myTopPart">
          <h2 className="myGameTitle">Houston!! Guess a number between 0 and 100</h2>
          <button
            className="myNewGameButton"
            disabled={state.newGameButtonIsDisabled}
            onClick={() => dispatch({ type: "NEW_GAME" })}
          >
            New Game
          </button>
        </header>

        <form className="myMiddlePart">
          <h2 className="myCounterArea">
            {state.numTrials} trials remaining
          </h2>

          <input
            className="myGuessInputChoice"
            type="number"
            placeholder="00"
            value={state.playerGuess}
            readOnly={state.inputReadOnly}
            onChange={handleChange}
          />

          {state.feedback && (
            <h2 className="myResultOutput">{state.feedback}</h2>
          )}

          <button
            type="button"
            className="myGuessButton"
            disabled={state.guessButtonIsDisabled}
            onClick={() => {
              if (state.playerGuess === "") {
                alert("Houston!! type a number!! yikes .....");
                return;
              }
              dispatch({ type: "PLAYER_GUESS" });
            }}
          >
            Guess
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
