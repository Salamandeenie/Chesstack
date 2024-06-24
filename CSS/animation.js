// A utility to convert CSS color names to RGB values
function cssColorToRgb(color)
{
    console.log(color);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return { r: data[0], g: data[1], b: data[2] };
}

// A utility to convert RGB values to hex
function rgbToHex(r, g, b)
{
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Function to interpolate between two RGB colors
function interpolateRgb(color1, color2, factor)
{
    const r = Math.round(color1.r + factor * (color2.r - color1.r));
    const g = Math.round(color1.g + factor * (color2.g - color1.g));
    const b = Math.round(color1.b + factor * (color2.b - color1.b));
    return { r, g, b };
}

// Function to generate shades of a color
function generateShades(color)
{
    const rgb = cssColorToRgb(color);

    // Coin flip for the opposite color (black or white)
    const isWhite = Math.random() < 0.5;
    const oppositeColor = isWhite ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };

    // Calculate the shades
    const shade1 = interpolateRgb(rgb, oppositeColor, 1 / 3);
    const shade2 = interpolateRgb(rgb, oppositeColor, 2 / 3);

    // Convert all colors to hex
    const hexShades = [
        rgbToHex(rgb.r, rgb.g, rgb.b),        // Original color
        rgbToHex(shade1.r, shade1.g, shade1.b),
        rgbToHex(shade2.r, shade2.g, shade2.b),
        rgbToHex(oppositeColor.r, oppositeColor.g, oppositeColor.b)  // Opposite color
    ];

    return hexShades;
}

// Example usage
const colorShades = generateShades('blue');
console.log(colorShades);

//, Helper functions
function interpolateColor(color1, color2, factor)
{
    const result = color1.slice(1).match(/.{2}/g)
    .map((value, i) => Math.round(
        parseInt(value, 16) * (1 - factor) +
        parseInt(color2.slice(1).match(/.{2}/g)[i], 16) * factor).toString(16).padStart(2, '0'));
    return `#${result.join('')}`;
}

function cssVarGet(varString) 
{
    return getComputedStyle(document.documentElement).getPropertyValue(varString).trim() || null;
}

function cssVarSet(varString, newVal)
{
    document.documentElement.style.setProperty(varString, newVal) || null;
}

//, Animation functions
function animateColors(color1, color2, color3, color4, duration = 1000, stay = false) 
{
    let start = null;
    const initialColors = 
    [
        cssVarGet('--color1'),
        cssVarGet('--color2'),
        cssVarGet('--color3'),
        cssVarGet('--color4')
    ];

    const targetColors = stay ?
        [initialColors[0], initialColors[1], initialColors[2], initialColors[3]] :
        [color1, color2, color3, color4];

    function step(timestamp) 
    {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);

        cssVarSet('--color1', interpolateColor(initialColors[0], targetColors[0], progress));
        cssVarSet('--color2', interpolateColor(initialColors[1], targetColors[1], progress));
        cssVarSet('--color3', interpolateColor(initialColors[2], targetColors[2], progress));
        cssVarSet('--color4', interpolateColor(initialColors[3], targetColors[3], progress));

        if (progress < 1) 
        {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}

function fadeScreen(duration) 
{
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#000000';
    overlay.style.opacity = '0'; // Initially transparent
    overlay.style.pointerEvents = 'none'; // Initially allows clicks to pass through
    overlay.style.transition = 'opacity 0.5s ease'; // Transition effect
    overlay.style.zIndex = 100;

    // Append overlay to body
    document.body.appendChild(overlay);

    // Fade in overlay
    setTimeout(() => 
    {
        overlay.style.opacity = '1'; // Adjust opacity level if needed
        overlay.style.pointerEvents = 'none'; // Enable mouse events
    }, 100); // Delay to ensure element is ready

    // Fade out overlay after duration
    setTimeout(() => 
    {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'auto'; // Disable mouse events again
    }, duration + 100); // Add 100ms to duration for delay

    // Remove overlay after animation completes
    setTimeout(() => 
    {
        document.body.removeChild(overlay);
    }, duration + 600); // Adjust timing if necessary
}