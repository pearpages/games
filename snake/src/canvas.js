export const CANVAS = {
    createCanvas: function (canvasOptions) {
        const { cols, rows, id, resolution, bgColor } = canvasOptions;
        const canvas = document.createElement(id);
        canvas.width = cols * resolution;
        canvas.height = rows * resolution;
        document.body.append(canvas);
        this.background(canvas, bgColor);
        return canvas.getContext('2d');
    },

    background: function (canvas, color) {
        const context = canvas.getContext('2d');
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    },

    deleteCanvas: function (canvasOptions) {
        const { id } = canvasOptions;
        !!document.querySelector(id)
            ? document.querySelector(id).remove()
            : 0;
    },

    draw: function (cbs, canvasOptions) {
        this.deleteCanvas(canvasOptions);
        const context = this.createCanvas(canvasOptions);
        cbs.forEach(cb => cb(context));
    }

};
