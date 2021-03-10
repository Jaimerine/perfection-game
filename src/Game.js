import { useState, useEffect } from 'react';
// import { CSSTransition } from "react-transition-group"; //animations
import { useSpring, animated } from 'react-spring' //animations
import ShapeComponent from './ShapeComponent' //shape svgs
import outerTimerImg from './outer-timer.svg'; //timer image
import innerTimerImg from './inner-timer.svg'; //timer image
import LeaderBoard from './LeaderBoard' //modal component (sets to db)
import { placeholderShapesArrayStart, draggableShapesArrayStart } from './shapeArrays' //shape arrays

export default function Game() {

//||||||||||| HELPER FUNCTIONS |||||||||||

    const shuffleArray = (array) => {
        const arrayCopy = JSON.parse(JSON.stringify(array));
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }

        return arrayCopy;
    }


//||||||||||| GLOBAL VARS + STATE |||||||||||

    let draggingItem = {};
    let dragOverItem = {};
    const timeout = 2000;
    const winningCount = 13;

    const animateProps = useSpring({ transform: 'translateZ(1000px)', from: { transform: 'translateZ(0px)' } });


    const [placeholderShapesArray, setPlaceholderShapesArray] = useState(JSON.parse(JSON.stringify(placeholderShapesArrayStart)));
    const [draggableShapesArray, setDraggableShapesArray] = useState(JSON.parse(JSON.stringify(draggableShapesArrayStart)));
    const [gameStatus, setGameStatus] = useState(null); //on, off, playing
    const [isPlayMode, setIsPlayMode] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [shapeCount, setShapeCount] = useState(0);
    const [isWinner, setIsWinner] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [time, setTime] = useState(null);

    // isGameOff == true ===> game is off
    // isGameOff = false ===> game turned on
    // isGameOff = null ==> playing


//||||||||||| EFFECT FUNCTIONS |||||||||||

    //GAME STARTED/RESET: shuffle arrays and start timer when game started
    useEffect( () => {
        
        //if started, start timer
        if (gameStatus === 'on') {

            //reset variables
            setGameStatus('playing');
            setIsPlayMode('true')
            setShapeCount(0);
            setIsWinner(false);
            setTime(0);
            
            //set start time
            const timeNow = new Date().getTime();
            setStartTime(timeNow);

            //set timeout
            setTimeout(() => {
                //show modal with result
                setIsGameOver(true);
            }, timeout * 1000);

        } else if (gameStatus === 'off') {
            //clear timer
            const highestTimeoutId = setInterval(() => { ";" });
            for (let i = 0; i < highestTimeoutId; i++) {
                clearInterval(i);
            }
            
            //stop timer animation
            setStartTime(0); 

            //turn off shape drag functionality, show start arrow
            setIsPlayMode(false);
        }

    }, [isGameOver, gameStatus, startTime, draggableShapesArray, placeholderShapesArray])

    //GAME OVER: show modal and trigger reset
    useEffect(() => {
        if (isGameOver) {

            //triger reset useEffect
            setGameStatus("off");

            //set original arrays to move pieces back to tray
            setDraggableShapesArray(shuffleArray(JSON.parse(JSON.stringify(placeholderShapesArrayStart))));
            setPlaceholderShapesArray(shuffleArray(JSON.parse(JSON.stringify(draggableShapesArrayStart))));
        }
    }, [isGameOver, gameStatus])

    //TIMER: begin timer when game started
    // useEffect(() => {
        
    //     let interval;
    //     if (gameStatus) {
    //         interval = setInterval(() => {
    //             setTimer(timer => timer + 1);
    //         }, 1000);
    //     } else if (!gameStatus && timer !== 0) {
    //         clearInterval(interval);
    //     }

    //     if (gameStatus && timer === timeout) {
    //         //show modal with result
    //         setIsWinner(false)
    //         setIsGameOver(true);
    //         setGameStatus(false);
    //     }

    //     return () => {
    //         clearInterval(interval);
    //     }

    // }, [gameStatus, timer]);


//||||||||||| DRAG + DROP HANDLERS |||||||||||

    //store dragged item on drag
    const handleDragStart = (item) => {
        draggingItem = item;
    };

    //store placeholder item on drag over
    const handleDragOver = (event, item) => {
        event.preventDefault() //prevent default (does not allow dropping an element in another)
        dragOverItem = item;
    }

    //if dropped item is a match for drop placeholder, update placeholder and draggable arrays
    const handleDrop = (item) => {

        //check if last two digits in identifiers match
        if (draggingItem.id === dragOverItem.id) {

            //set dropped to true (dropped shape is added to placeholder)
            const placeholderShapesArrayCopy = [...placeholderShapesArray];
            for (let i = 0; i < placeholderShapesArrayCopy.length; i++) {
                const shape = placeholderShapesArrayCopy[i];
                if (shape === item) {
                    shape.shapeDropped = true;
                    break;
                }
            }
            setPlaceholderShapesArray(placeholderShapesArrayCopy);

            //set moved to true (an empty div will be added in it's place)
            const draggableShapesArrayCopy = [...draggableShapesArray];
            for (let i = 0; i < draggableShapesArrayCopy.length; i++) {
                const shape = draggableShapesArrayCopy[i];
                if (shape.id === draggingItem.id) {
                    shape.shapeMoved = true;
                    break;
                }
            }
            setDraggableShapesArray(draggableShapesArrayCopy);

            //increment shape count + check if won
            const count = shapeCount + 1;
            setShapeCount(count)

            console.log("shapeCnt:", shapeCount, " count:", count)

            if (count === winningCount) {
                //calculate time difference since start
                const timeDifference = Math.round(Math.abs((new Date().getTime() - startTime) / 1000));
                setTime(timeDifference)

                setIsWinner(true);
                setIsGameOver(true);
            }
        }
    };


//||||||||||| DOM |||||||||||

    return (
        <>
        {/* game section */}
        <section className="top-container wrapper">
            <div className="game">
                <div className="outer-game">
                    <header>
                        <h1>PERFECTION</h1>
                        <div className="timer">
                            <img src={outerTimerImg} alt="outside of timer with painted ticks for each second" />
                            <img src={innerTimerImg} className={startTime ? "start" : null} alt="inside of timer with ticking animation on game start" />
                        </div>
                        <div className="flex-container">
                            <button onClick={() => setGameStatus('on')}>Start</button>
                            { 
                                isPlayMode 
                                    ? null
                                    : <ShapeComponent name="Arrow" />
                            }
                            <nav>
                                <ul>
                                    <li><a href="#instructions">INSTRUCTIONS</a></li>
                                    <li><a href="#leader-board">LEADERBOARD</a></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                    
                        

                    <div className="drop-elements">
                        {
                            //loop through placeholder shapes array, render on page
                            placeholderShapesArray.map((item) => (
                                <div key={"drop_" + item.id}>
                                    {
                                        //add dropped shape, if dropped
                                        item.shapeDropped
                                            ?  <div className="drop-container dropped" onDragOver={(event) => handleDragOver(event, item)} onDrop={() => handleDrop(item)} >
                                                    
                                                    {/* <ShapeComponent name={item.shape} className="drop dropped" /> */}

                                                    {/* <animated.div style={animateProps}> */}
                                                        <div className="dropped" >
                                                            <div className="drag-container">
                                                                    <ShapeComponent name={item.shape} className="drag dropped" />
                                                                    <ShapeComponent name="Handle" />
                                                            </div>
                                                        </div>
                                                    {/* </animated.div> */}
                                                </div>

                                            : <div className="drop-container" onDragOver={(event) => handleDragOver(event, item)} onDrop={() => handleDrop(item)} >
                                                <ShapeComponent name={item.shape} className="drop" />
                                            </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="drag-tray">
                <div className="drag-elements">
                    {
                        //loop through draggable shapes array, render on page
                        draggableShapesArray.map((item) => (

                            //add shape, if not yet moved, else leave empty div to avoid shapes moving
                            //**************************styleApplied={{ rotate: '0deg' }}
                            !item.shapeMoved

                                ? <div key={"drag_" + item.id}>
                                    <div className="drag-container" draggable={isPlayMode ? true : false} onDragStart={() => handleDragStart(item)} key={"drag_" + item.id} aria-label={item.shape + " piece"}>
                                        <ShapeComponent name={item.shape} styleApplied={{ transform: 'rotate(0deg)' }} />
                                        <ShapeComponent name="Handle" /> 
                                    </div>
                                </div>
                                : <div key={"empty_" + item.id}></div>
                        ))
                    }
                </div>
            </div>
        </section>


        {/* show modal on game over */}
        {
            // isGameOver
                <LeaderBoard isWinner={isWinner} time={time} isGameOver={isGameOver} setIsGameOverFn={setIsGameOver} setGameStatusFn={setGameStatus} />
                // : null
        }
        </>
    );
};
