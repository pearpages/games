export const FOOD = {
    draw: function (scale, { x, y }, context) {
        context.fillStyle = '#F00';
        context.fillRect(x * scale, y * scale, scale, scale);
    },

    move: function ({ cols, rows }, tail) {
        function getX(notValidXs = tail.map(p => p.x), max = cols) {
            return nextValue(notValidXs, max);
        }

        function getY(notValidYs = tail.map(p => p.y), max = rows) {
            return nextValue(notValidYs, max);
        }

        function nextValue(notValids, max) {
            const nextCanidate = max => Math.floor(Math.random() * max);
            let foundNext = false;
            let candidate;
            while (!foundNext) {
                candidate = nextCanidate(max);
                foundNext = !notValids.includes(candidate);
                return candidate;
            }
        }

        return {
            x: getX(),
            y: getY()
        }
    }
};
