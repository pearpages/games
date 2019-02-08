function createCanvas({ cols, rows, id, resolution, bgColor } = CANVAS_OPTIONS) {
    const canvas = document.createElement(id);
    canvas.width = cols * resolution;
    canvas.height = rows * resolution;
    document.body.append(canvas);
    background(canvas, bgColor);
    return context = canvas.getContext('2d');
}

function background(canvas, color) {
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function deleteCanvas({ id } = CANVAS_OPTIONS) {
    !!document.querySelector(id)
        ? document.querySelector(id).remove()
        : 0;
}

function draw(cbs) {
    deleteCanvas();
    const context = createCanvas();
    cbs.forEach(cb => cb(context));
}
