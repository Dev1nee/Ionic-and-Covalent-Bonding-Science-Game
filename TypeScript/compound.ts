import Element from "./element.js";

export default class Compound {
    /**
     * 
     * @param {Element} element1
     * @param {Element} element2 
     */
    constructor(element1, element2) {
        this.elementList = [element1, element2]
        element1.compound = this
        element2.compound = this
        this.totalElectronegativity = Math.abs(element1.electronegativity - element2.electronegativity)

        if (element1.positive && element2.negative) {
            this.posSide = element1
            this.negSide = element2
        }
        else if (element1.negative && element2.positive) {
            this.posSide = element2
            this.negSide = element1
        }

        if (element1.middlePos.getX > element2.middlePos.getX) {
            this.leftSide = element2
            this.rightSide = element1
        }
        else if (element1.middlePos.getX < element2.middlePos.getX) {
            this.leftSide = element1
            this.rightSide = element2
        }
    }

    applyVelocity(time, distance) {
        this.elementList.forEach((element) => {
            element.applyVelocity(time, distance)
        })
    }

    /**
     * @description adds an element to this compund object
     * @param {Element} element
     */
    addElement(element) {
        element.compound = this
        this.elementList.push(element)
    }
}