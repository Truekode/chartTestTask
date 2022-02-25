class DrawLinearChart {
    constructor(canvasEl) {
        this.canvas = canvasEl;
        this.ctx = canvasEl.getContext("2d");
        this.width = canvasEl.width;
        this.height = canvasEl.height;
    }

    init() {
        this.points = this.generatePoints();
        this.draw();

        this.canvas.addEventListener('click', () => {
            let newPoints = this.generatePoints();
            let movePoints = this.getMovesPoints(newPoints);
            this.drawAnimation(newPoints, movePoints);
        })
    }

    drawAnimation(newPoints, movePoints) {
        let frame = 0;
        const fps = 15; //fps
        let interval = setInterval(() => {
            if(frame == fps) clearInterval(interval);
            this.ctx.clearRect(0, 0, 800, 400);
            for(let i = 0; i < movePoints.length; i++){
                this.ctx.beginPath();
                this.ctx.moveTo(movePoints[i][0][0][0] + (movePoints[i][0][1][0] - movePoints[i][0][0][0]) * frame / fps, movePoints[i][0][0][1] + (movePoints[i][0][1][1] - movePoints[i][0][0][1]) * frame / fps);
                this.ctx.lineTo(movePoints[i][1][0][0] + (movePoints[i][1][1][0] - movePoints[i][1][0][0]) * frame / fps, movePoints[i][1][0][1] + (movePoints[i][1][1][1] - movePoints[i][1][0][1]) * frame / fps);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(movePoints[i][0][0][0] + (movePoints[i][0][1][0] - movePoints[i][0][0][0]) * frame / fps, movePoints[i][0][0][1] + (movePoints[i][0][1][1] - movePoints[i][0][0][1]) * frame / fps, 8, 0, 2 * Math.PI);
                this.ctx.fillStyle = "white";
                this.ctx.fill();
                this.ctx.stroke();
            }
            let i = movePoints.length - 1;
            this.ctx.beginPath();
            this.ctx.arc(movePoints[i][1][0][0] + (movePoints[i][1][1][0] - movePoints[i][1][0][0]) * frame / fps, movePoints[i][1][0][1] + (movePoints[i][1][1][1] - movePoints[i][1][0][1]) * frame / fps, 8, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.stroke();
            frame++;
        }, 20);
        this.points = newPoints;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.points.length; i++) {
            let item = this.points[i];
            this.ctx.beginPath();
            this.ctx.moveTo(item[0], item[1]);
            if (i !== this.points.length - 1) {
                this.ctx.lineTo(this.points[i+1][0], this.points[i+1][1]);
                this.ctx.stroke();
            }
            this.ctx.beginPath();
            this.ctx.arc(item[0], item[1], 8, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.stroke();
            this.ctx.fill();
        }
    }

    randInt(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    generatePoints() {
        const n = this.randInt(2, 10);
        const x = Math.floor(700 / (n - 1));
        let result = [];
        for(let i = 0; i < n; i++){
            result.push([50 + x * i, this.randInt(50, this.height - 50)])
        }
        return result;
    }

    getMovesPoints(newPoints) {
        let oldPoints = this.points;
        let other = newPoints.length - oldPoints.length;
        let moves = [];
        if(other < 0){
            let i = 0;
            let newI = 0;
            if(other * -1 >= newPoints.length){
                const shift = other * -1 - newPoints.length + 2;
                while(i < shift){
                    moves.push([[[oldPoints[i][0], oldPoints[i][1]], [newPoints[0][0], newPoints[0][1]]], [[oldPoints[i + 1][0], oldPoints[i + 1][1]], [newPoints[0][0], newPoints[0][1]]]]);
                    i++;
                }
                newI++;
                other += shift;
            }
            while(newI < other * -1){
                if(moves.length == 0) moves.push([[[oldPoints[i][0], oldPoints[i][1]], [newPoints[newI][0], newPoints[newI][1]]], [[oldPoints[i + 1][0], oldPoints[i + 1][1]], [newPoints[newI][0], newPoints[newI][1]]]]);
                else moves.push([moves[moves.length - 1][1], [[oldPoints[i + 1][0], oldPoints[i + 1][1]], [newPoints[newI][0], newPoints[newI][1]]]]);
                moves.push([moves[moves.length - 1][1], [[oldPoints[i + 2][0], oldPoints[i + 2][1]], [newPoints[newI + 1][0], newPoints[newI + 1][1]]]]);
                i += 2;
                newI++;
            }
            while(newI < newPoints.length - 1){
                moves.push([moves[moves.length - 1][1], [[oldPoints[i][0], oldPoints[i][1]], [newPoints[newI][0], newPoints[newI][1]]]]);
                i++;
                newI++;
            }
            moves.push([moves[moves.length - 1][1], [[oldPoints[oldPoints.length - 1][0], oldPoints[oldPoints.length - 1][1]], [newPoints[newPoints.length - 1][0], newPoints[newPoints.length - 1][1]]]]);
        }
        else if(other > 0){
            moves.push([[[oldPoints[0][0], oldPoints[0][1]], [newPoints[0][0], newPoints[0][1]]], [[oldPoints[0][0], oldPoints[0][1]], [newPoints[1][0], newPoints[1][1]]]]);
            for(let i = 1; i < newPoints.length - 2; i++){
                let x = i;
                if(x > oldPoints.length - 1) x = oldPoints.length - 1;
                moves.push([moves[moves.length - 1][1], [[oldPoints[x][0], oldPoints[x][1]], [newPoints[i + 1][0], newPoints[i + 1][1]]]]);
            }
            moves.push([moves[moves.length - 1][1], [[oldPoints[oldPoints.length - 1][0], oldPoints[oldPoints.length - 1][1]], [newPoints[newPoints.length - 1][0], newPoints[newPoints.length - 1][1]]]]);
        }
        else{ // ===
            for(let i = 0; i < oldPoints.length - 1; i++){
                moves.push([[[oldPoints[i][0], oldPoints[i][1]], [newPoints[i][0], newPoints[i][1]]], [[oldPoints[i + 1][0], oldPoints[i + 1][1]], [newPoints[i + 1][0], newPoints[i + 1][1]]]]);
            }
        }

        return moves;
    }
}
