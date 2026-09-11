(function() {
    const canvas = document.getElementById('sceneCanvas');
    const ctx = canvas.getContext('2d');
    const toggleBtn = document.getElementById('toggleBtn');

    let isLightOn = false;
    let lightAlpha = 0;       
    let shadowAlpha = 0;      
    let animating = false;
    let animationTimer = null;

    const lampX = 330;
    const lampY = 130;

    function drawBackground() {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
        skyGrad.addColorStop(0, '#0b0b2e');
        skyGrad.addColorStop(0.7, '#1a1a4a');
        skyGrad.addColorStop(1, '#2a2a5a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, 300);

        ctx.fillStyle = '#ffffff';
        const stars = [
            [50,30], [150,70], [250,20], [400,50], [500,80],
            [550,40], [100,120], [300,60], [470,90], [200,40],
            [80,150], [520,130], [30,100], [580,20], [140,90]
        ];
        stars.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 1.8 + 0.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#1f3a1f';
        ctx.fillRect(0, 300, canvas.width, 100);
        ctx.fillStyle = '#2f2f2f';
        ctx.fillRect(0, 320, canvas.width, 15);
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, 335, canvas.width, 65);

        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(canvas.width, 300);
        ctx.stroke();
    }

    function drawLightAndShadow() {
        if (lightAlpha <= 0 && shadowAlpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = lightAlpha;
        const coneGrad = ctx.createLinearGradient(lampX, lampY + 10, lampX, 320);
        coneGrad.addColorStop(0, 'rgba(255, 255, 120, 0.75)');
        coneGrad.addColorStop(1, 'rgba(255, 255, 120, 0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(lampX - 35, lampY + 15);
        ctx.lineTo(lampX - 90, 320);
        ctx.lineTo(lampX + 90, 320);
        ctx.lineTo(lampX + 35, lampY + 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 180, 0.4)';
        ctx.beginPath();
        ctx.arc(lampX, lampY + 10, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = shadowAlpha;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.ellipse(lampX, 328, 55, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.ellipse(lampX, 328, 25, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawLightAndShadow();
    }

    function animateLight(targetState) {
        if (animating) {
            clearTimeout(animationTimer);
            animating = false;
            isLightOn = targetState;
            lightAlpha = targetState ? 1 : 0;
            shadowAlpha = targetState ? 1 : 0;
            drawScene();
            updateButtonText();
            return;
        }

        animating = true;
        const steps = targetState 
            ? [0, 0.7, 0.1, 0.9, 0.3, 1]   
            : [1, 0.4, 0.9, 0.2, 0];        
        let i = 0;

        function nextStep() {
            if (i < steps.length) {
                const alpha = steps[i];
                lightAlpha = alpha;
                shadowAlpha = alpha;
                drawScene();
                i++;
                animationTimer = setTimeout(nextStep, 140);
            } else {
                isLightOn = targetState;
                lightAlpha = targetState ? 1 : 0;
                shadowAlpha = targetState ? 1 : 0;
                drawScene();
                animating = false;
                updateButtonText();
            }
        }
        nextStep();
    }

    function toggleLight() {
        if (animating) return;
        animateLight(!isLightOn);
    }

    function updateButtonText() {
        toggleBtn.textContent = isLightOn ? 'Выключить свет' : 'Включить свет';
    }

    drawScene();
    updateButtonText();
    toggleBtn.addEventListener('click', toggleLight);
})();