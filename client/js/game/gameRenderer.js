// Constants
var paddleColor = "#0095DD";
var ballColor = "#FF9933";

var s;
var GameRenderer = {

    settings: {
        paddleColor: "#0095DD"
    },

    init: function () {
        s = this.settings;
    },

    drawCanvasBorders: function() {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = paddleColor;
        ctx.stroke();
        ctx.closePath();
    },

    drawPaddle: function(paddle) {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = paddleColor;
        ctx.fill();
        ctx.closePath();
    },

    drawBall: function(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = ballColor;
        ctx.fill();
        ctx.closePath();
    },

    render: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        GameRenderer.drawCanvasBorders();

        GameRenderer.drawPaddle(game.leftPaddle);
        GameRenderer.drawPaddle(game.rightPaddle);

        GameRenderer.drawBall(game.ball);

        // Score
        if (game.winner !== null) {
            ctx.fillStyle = paddleColor;
            ctx.font = "22px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            var winnerSideText = (game.winner === PlayerSide.LEFT) ? "1" : "2";
            ctx.fillText("GAME OVER", canvas.width / 2, 42);
            ctx.fillText("Player " + winnerSideText + " wins !", canvas.width / 2, canvas.height / 2);
        }
    }



};