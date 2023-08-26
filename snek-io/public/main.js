import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const database = getDatabase();
const canvas = document.getElementById("canvas");
const scoreBoard = document.getElementsByClassName("score")[0];
const hiscoreBoard = document.getElementsByClassName("hiscore")[0];

const table = document.getElementById("table")
const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");

//audio
const eat = new Audio("sfx/eat.wav");
const dead= new Audio("sfx/dead.wav");
const hs = new Audio("sfx/hs.wav");
const move = new Audio("sfx/move.mp3");


let obj
onValue(ref(database),(snapshot)=>{
  obj = Object.entries(snapshot.val()).sort((a,b)=>b[1]-a[1]);
  table.innerHTML = `<thead>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                </thead>`;
  let x=1;
  obj.forEach(element => {
    let le = document.createElement("tbody");
    le.innerHTML = `<td>${x}</td>
                    <td>${element[0]}</td>
                    <td>${element[1]}</td>`;
    table.append(le)
    x++
  });

})

let head = document.createElement("div");
head.classList = "head";
head.style.gridArea = "11/11/12/12";
canvas.appendChild(head);

let snake = [head];

let food = document.createElement("div");
food.classList = "food";
food.style.gridArea = "6/6/7/7";
canvas.appendChild(food);

//frameRate manage
let previousTime = 0;

if (localStorage.getItem("hiscore") === null) {
  localStorage.setItem("hiscore", 0);
}
if (localStorage.getItem("username") === null) {
  localStorage.setItem("username", "nill");
}

let highscore = localStorage.getItem("hiscore");
hiscoreBoard.innerHTML = `HighScore:${highscore}`;

// game variables
const speed = 6;
let score = 0;
let changeDir = true;
let direction = {
  x: 0,
  y: 0,
};

function frame(currentTime) {
  if (!isColided()) {
    
    if ((currentTime - previousTime) / 1000 >= 1 / speed) {
      if (isConsumed()) {
        eat.play()
        //adding body at the last of the the snake
        let b = document.createElement("div");
        b.classList = "snake";
        b.style.gridArea = snake[snake.length - 1].style.gridArea;
        snake.push(b);
        canvas.appendChild(b);

        //changing the position of food
        let y = Math.round(1 + 20 * Math.random());
        let x = Math.round(1 + 20 * Math.random());
        food.style.gridArea = `${x}/${y}/${x + 1}/${y + 1}`;

        //score upadate
        score++;
        scoreBoard.innerHTML = `Score:${score}`;
      }
      //moving the body
      for (let i = snake.length - 2; i >= 0; i--) {
        snake[i + 1].style.gridArea = snake[i].style.gridArea;
      }

      //moving the head
      head.style.gridRowStart =
        Number.parseInt(head.style.gridRowStart) + direction.y;
      head.style.gridRowEnd =
        Number.parseInt(head.style.gridRowEnd) + direction.y;
      head.style.gridColumnStart =
        Number.parseInt(head.style.gridColumnStart) + direction.x;
      head.style.gridColumnEnd =
        Number.parseInt(head.style.gridColumnEnd) + direction.x;

      //unlocking direction
      changeDir = true;

      previousTime = currentTime;
    }
  } else {
    if (score <= highscore) {dead.play();}
    let userName = localStorage.getItem("username");
    while (userName == "nill" || userName == "" || userName == null) {
      userName = prompt("Enter your Name");
    }
    localStorage.setItem("username", userName);
    alert("Game ended.");
    if (score > highscore) {
      hs.play()
      highscore = score;
      localStorage.setItem("hiscore", highscore);
      hiscoreBoard.innerHTML = `HighScore:${highscore}`;
      set(ref(database, `/${userName}`), highscore);
    }


    head.style.gridArea = "11/11/12/12";
    direction = { x: 0, y: 0 };
    snake = [head];
    canvas.innerHTML = "";
    canvas.appendChild(head);
    canvas.appendChild(food);
    score = 0;
    head.style.transform = "rotate(0deg) scale(1.5)";
    scoreBoard.innerHTML = `Score:${score}`;
  }
  window.requestAnimationFrame(frame);
}
function isColided() {
  for (let i = 1; i < snake.length; i++) {
    if (head.style.gridArea === snake[i].style.gridArea) {
      return true;
    }
  }
  return (
    head.style.gridRowStart > 21 ||
    head.style.gridColumnStart > 21 ||
    head.style.gridRowEnd <= 1 ||
    head.style.gridColumnEnd <= 1
  );
}
function isConsumed() {
  return head.style.gridArea === food.style.gridArea;
}

window.requestAnimationFrame(frame);



up.addEventListener("click", (e) => {
  move.play();
  if (direction.y !== 0) {
  } else {
    head.style.transform = "rotate(180deg) scale(1.5)";
    direction.x = 0;
    direction.y = -1;
    changeDir = false;
  }

  console.log("up");
});
down.addEventListener("click", (e) => {
  move.play();
  if (direction.y !== 0) {
  } else {
    head.style.transform = "rotate(0deg) scale(1.5)";
    direction.x = 0;
    direction.y = 1;
    changeDir = false;
  }

  console.log("down");
});
left.addEventListener("click", (e) => {
  move.play();
  if (direction.x !== 0) {
  } else {
    head.style.transform = "rotate(90deg) scale(1.5)";
    direction.x = -1;
    direction.y = 0;
    changeDir = false;
  }

  console.log("left");
});
right.addEventListener("click", (e) => {
  move.play();
  if (direction.x !== 0) {
  } else {
    head.style.transform = "rotate(-90deg) scale(1.5)";
    direction.x = 1;
    direction.y = 0;
    changeDir = false;
  }

  console.log("right");
});

addEventListener("keydown", (e) => {
  move.play();
  if (changeDir == true) {
    switch (e.key) {
      case "ArrowUp":
        if (direction.y !== 0) {
          break;
        }
        head.style.transform = "rotate(180deg) scale(1.5)";
        direction.x = 0;
        direction.y = -1;
        changeDir = false;
        break;

      case "ArrowDown":
        if (direction.y !== 0) {
          break;
        }
        head.style.transform = "rotate(0deg) scale(1.5)";
        direction.x = 0;
        direction.y = 1;
        changeDir = false;
        break;

      case "ArrowLeft":
        if (direction.x !== 0) {
          break;
        }
        head.style.transform = "rotate(90deg) scale(1.5)";
        direction.x = -1;
        direction.y = 0;
        changeDir = false;
        break;

      case "ArrowRight":
        if (direction.x !== 0) {
          break;
        }
        head.style.transform = "rotate(-90deg) scale(1.5)";
        direction.x = 1;
        direction.y = 0;
        changeDir = false;
        break;

      default:
        break;
    }
  }
});
