"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcRating = void 0;
function calcRating(oldrating, newrating, oldresponse) {
    const updatedRating = ((oldrating * oldresponse) + newrating) / (oldresponse + 1);
    const rrating = (Math.floor(updatedRating * 2)) / 2;
    return rrating;
}
exports.calcRating = calcRating;
//# sourceMappingURL=rating.js.map