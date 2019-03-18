var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

window.addEventListener('click', function(e){
    
});

window.addEventListener('mousemove', function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
})

var colors = ['#105B63', '#FFFAD5', '#FFD34E', '#DB9E36', '#BD4932'];

function Particle(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
    this.velocity = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
    };
}

Particle.prototype.update = function(particles) {
    this.draw();

    for(let i = 0; i < particles.length; i++){
        if(this === particles[i]) continue;
        if(distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 <= 0){
            resolveCollision(this, particles[i]);
        }
    }

    if(this.x - this.radius <= 0 || this.x + this.radius >= window.innerWidth){
        this.velocity.x = -this.velocity.x;
    }

    if(this.y - this.radius <= 0 || this.y + this.radius >= window.innerWidth){
        this.velocity.y = -this.velocity.y;
    }

    if(distance(mouse.x, mouse.y, this.x, this.y) < 100 && this.opacity < 0.8 ){
        this.opacity += 0.8;
    }else if(this.opacity >= 0.8){
        this.opacity = 0;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

Particle.prototype.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
}

function randomIntFromRange(min, max){
   return Math.floor( Math.random() * (max - min + 1) + min );
}

function distance(x1, y1, x2, y2){
    return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

var particles;
function init(){
    particles = [];
    let radius = 30;

    for(let i = 0; i < 90; i++){
        let x = randomIntFromRange(radius, window.innerWidth - radius);
        let y = randomIntFromRange(radius, window.innerHeight - radius);

        for(let j = 0; j < particles.length; j++){

            if(distance(x, y , particles[j].x, particles[j].y) - radius * 2 < 1){
                x = randomIntFromRange(radius, window.innerWidth - radius);
                y = randomIntFromRange(radius, window.innerHeight - radius);

                j = -1;
            }
        }

        let color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, radius, color));
    }
}

function animate(){
    requestAnimationFrame(animate);

    c.fillStyle = 'rgba(0, 0, 0, 0.05)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update(particles);
    })
}

init();
animate();