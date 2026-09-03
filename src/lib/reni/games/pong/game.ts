import { Main } from "../../core/main"
import { PongPlayer } from "./player"
import { PongEnemy } from "./enemy"
import { PongBall } from "./ball"

export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => { };

  const main = new Main(canvas, 60);


  main.clearColor = "skyblue";

  const player = new PongPlayer(main);
  player.position.x = 100;
  player.position.y = canvas.height / 2;
  player.teleport();
  main.root.addChild(player);

  const enemy = new PongEnemy(main);
  enemy.position.x = canvas.width - 100;
  enemy.position.y = canvas.height / 2;
  enemy.teleport();
  main.root.addChild(enemy);

  const ball = new PongBall(main);
  ball.position.x = canvas.width / 2;
  ball.position.y = canvas.height / 2;
  ball.teleport();
  main.root.addChild(ball);

  player.ball = ball;
  enemy.ball = ball;

  // Cleanup function to remove event listeners when component is destroyed
  return () => { main.cleanUp() };
}

