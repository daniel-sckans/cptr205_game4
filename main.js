// SAMPLING OF THINGS WE CAN CHANGE
// * ENEMY
// * COLLECTIBLES 
// * GOAL CONDITION
// * LOSS CONDITION
// * NEW GAME SCREEN

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    
    // CANVAS INIT
    const render = document.querySelector('canvas').getContext('2d'); 
    let w, h, unit; 
    const resize = () => {
        w = render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio; 
        h = render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio; 
        unit = h / 2; 
    }; 
    resize(); 
    window.addEventListener('resize', resize); 

    // APPLY PHYSICS
    let player_x = 0, player_y = 0; 
    let player_r = 0.2; 
    let player_vx = 0, player_vy = 0; 
    let player_ax = 0, player_ay = 0; 
    let arrow_right = false; 
    let arrow_left = false; 
    document.addEventListener('keydown', keydown => {
        if(keydown.key === 'ArrowRight') {
            arrow_right = true; 
        }
        if(keydown.key === 'ArrowLeft') {
            arrow_left = true; 
        }
        if(keydown.key === 'ArrowUp') {
            player_ay += 0.01; 
        }
    }); 
    document.addEventListener('keyup', keyup => {
        if(keyup.key === 'ArrowRight') {
            arrow_right = false; 
        }
        if(keyup.key === 'ArrowLeft') {
            arrow_left = false; 
        }
    }); 

    // PLATFORM
    class Platform {
        constructor(x, y, w, h) {
            this.x = x; 
            this.y = y; 
            this.w = w; 
            this.h = h; 
        }
    }
    const platforms = []; 
    platforms.push(new Platform(-0.25, -0.25, 3, 0.25)); 
    platforms.push(new Platform(0.125, 0.25, 4, 0.125)); 

    // COINS
    class Coin {
        constructor(x, y, w, h) {
            this.x = x; 
            this.y = y; 
            this.w = w; 
            this.h = h; 
        }
    }
    const coins = []; 
    coins.push(new Coin(0.25, 0.5, 0.1, 0.1)); 
    coins.push(new Coin(0.5, 0.5, 0.1, 0.1)); 
    let points = 0; 
    
    // ANIMATION LOOP
    const animation = timestamp => {

        // PHYSICS ENGINE
        const PLAYER_ACCELERATION_X = 0.001; 
        if(arrow_right) {
            player_ax += PLAYER_ACCELERATION_X; 
        }
        if(arrow_left) {
            player_ax -= PLAYER_ACCELERATION_X; 
        }
        player_vx += player_ax; 
        player_x += player_vx; 
        player_ax = 0; 
        player_vx *= 0.98; 
        player_vy += player_ay; 
        player_ay -= 0.00098; 
        let player_grounded = false; 
        platforms.forEach(platform => {
            if(platform.x <= player_x && player_x <= platform.x + platform.w && platform.y <= player_y && player_y + player_vy <= platform.y) {
                player_grounded = true; 
                player_ay = 0; 
                player_vy = 0; 
                player_y = platform.y; 
                return; 
            }
        }); 
        if(!player_grounded) {
            player_y += player_vy; 
        }

        // LOSS CONDITION
        if(player_y < -30) {
            player_y = 0; 
            player_x = 0; 
        }
    
        // RENDER INIT
        render.save(); 
        render.translate(-player_x * unit, player_y * unit); 
        render.clearRect(player_x * unit, -player_y * unit, render.canvas.width, render.canvas.height); 

        // RENDER PLATFORMS
        render.fillStyle = '#00f'; 
        platforms.forEach(platform => {
            render.fillRect(platform.x * unit + w / 2, -platform.y * unit + unit, platform.w * unit, platform.h * unit); 
        }); 

        // RENDER COINS AND DETECT/HANDLE COLLISIONS
        coins.forEach((coin, i) => {
            const cx = coin.x + coin.w / 2, cy = coin.y - coin.h / 2; 
            const px = player_x, py = player_y + player_r; 
            if(Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) * unit < player_r * unit) {
                coins.splice(i, 1); 
                points++; 
                return; 
            }
            render.fillStyle = '#ff0'; 
            render.fillRect(coin.x * unit + w / 2, -coin.y * unit + unit, coin.w * unit, coin.h * unit); 
        }); 
        
        // DRAW THE PLAYER
        render.fillStyle = '#f00'; 
        render.beginPath(); 
        render.arc(player_x * unit + w / 2, -player_y * unit + unit - player_r * unit, player_r * unit, 0, 2 * Math.PI); 
        render.fill(); 

        // FINISHED DRAWING SCENE
        render.restore(); 
        
        // DRAW POINTS
        render.fillStyle = '#f0f'; 
        render.font = 'bold 64px sans-serif'; 
        render.fillText(`${points} POINTS`, 50, 114); 

        window.requestAnimationFrame(animation); 
    }; 
    window.requestAnimationFrame(animation); 
}); 