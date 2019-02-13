import CANVAS_OPTIONS from './config.json';

export const CANVAS = {
    createCanvas: function () {
        const { cols, rows, id, resolution } = CANVAS_OPTIONS;
        const canvas = document.createElement(id);
        canvas.width = cols * resolution;
        canvas.height = rows * resolution;
        document.body.append(canvas);
        return canvas.getContext('2d');
    },

    background: function (color) {
        return context => {
            const canvas =  document.querySelector(CANVAS_OPTIONS.id);
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    },

    deleteCanvas: function () {
        const { id } = CANVAS_OPTIONS;
        !!document.querySelector(id)
            ? document.querySelector(id).remove()
            : 0;
    },

    draw: function (cbs) {
        this.deleteCanvas(CANVAS_OPTIONS);
        const context = this.createCanvas(CANVAS_OPTIONS);
        cbs.forEach(cb => cb(context));
    }

};
