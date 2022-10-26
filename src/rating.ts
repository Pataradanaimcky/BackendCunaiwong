export function calcRating (oldrating: number, newrating: number, oldresponse: number) {
    const updatedRating = ((oldrating* oldresponse) + newrating) / (oldresponse + 1)
    const rrating = (Math.floor(updatedRating * 2))/2
    return rrating
}
