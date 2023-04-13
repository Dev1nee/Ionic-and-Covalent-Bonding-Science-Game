import Character from "./character/character.js"
import Compound from "./compound.js"
import { fps } from "./script.js"

let window_height = window.screen.height
let window_width = window.screen.width

/**
     * 
     * @param {*} context context of the canvas
     * @param {number} ionCharge charge of the ion version of that element
     * @param {number} electronegativity of the element
     * @param {spriteMap} spriteMap the spriteMap object that declares the different poses of the character
     * @param {Level} level the current level of the character
     * @param {number} xpos origin x position of the character
     * @param {number} ypos origin y position of the character
     * @param {number} width width of character, if not specified automatic width is used
     * @param {number} height height of character, if not specified automatic height is used
     * @param {number} gravity effects how fast or slow the character falls
     */
export default class Element extends Character {
    constructor(context, level, ionCharge, electronegativity, spriteMap, xpos, ypos, gravity = 0.03, width = -1, height = -1) {
        super(context, level, spriteMap, xpos, ypos, gravity, width, height)
        this.ionCharge = ionCharge
        if (ionCharge < 0) {
            this.positive = false
            this.negative = true
        }
        else if (ionCharge > 0) {
            this.positive = true
            this.negative = false
        }
        else {
            this.positive = false
            this.negative = false
        }

        this.electronegativity = electronegativity

        this.compound = undefined //points to the compound this element is a part of, undefined if it is not part of a compound
    }
    
    aroundElectron() {
        this.level.characters.forEach(character => {

            let x1 = this.middlePos.getX
            let y1 = this.middlePos.getY

            let x2 = character.middlePos.getX
            let y2 = character.middlePos.getY

            let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

            let MULTIPLIER = 200
            let k = MULTIPLIER * distance
            let acceleration = k / Math.pow(distance, 2)

            let vx, vy

            if (Math.abs(distance) > character.width) { 
                vx = acceleration * (x2 - x1) / distance
                vy = acceleration * (y2 - y1) / distance
            }
            else {
                vx = 0
                vy = 0
            }
            
            if (!this.moveUp && vy > 0) vy = 0


            let stopDistance = 10
            let xDistance = Math.abs(this.middlePos.getX - character.middlePos.getX)
            let yDistance = Math.abs(this.middlePos.getY - character.middlePos.getY)

            if (xDistance <= character.width && xDistance != 0 && !character.isPlayer) { //two non-player elements colliding physics
                //console.log(this instanceof Element)
                // let newCompund = new Compound(this, character)
                // this.compound = newCompund
                // character.compound = newCompund
                this.compound = new Compound(this, character)
                character.compound = this.compound
                return 0
            }
            else if (xDistance < 10 && xDistance != 0 && character.isPlayer) {
                //console.log("collided  with player")
                //put end game logic here <--
            }

            let range = 600
            const MUTLI_FACTOR = 100 //higher number makes the element move faster in general
            const EXPONENTIAL_FACTOR = 0.45 //lower number makes elements speed up as they get closer together
            const MOVING_FRAMES = 1 //the amount of animation frames the velocity is applied - more frames = smoother movement for more lag and faster movement

            // console.log(xDistance)
            // console.log(yDistance)
            if ((xDistance <= range && xDistance > 0) && (yDistance <= range)) { //checks if the electrons are within a certain range of pixels
                let pullTogether = false
                let pushApart = false
                let toLeft = this.middlePos.getX < character.middlePos.getX
                let toRight = this.middlePos.getX > character.middlePos.getX
                //console.log((toLeft) ? "left" : "right")


                if ((character.isPlayer || character instanceof Element) && (this.compound == undefined)) {
                    pullTogether = (character.isPlayer && this.positive) || ((character.negative && this.positive) || (character.positive && this.negative))
                    pushApart = (character.isPlayer && this.negative) || ((character.positive && this.positive) || (character.negative && this.negative))
                }
                if ((character.isPlayer || character instanceof Element) && (this.compound != undefined)) {
                    pullTogether = (toLeft && this.compound.leftSide.positive != character.negative) || (toRight && this.compound.rightSide.positive != character.negative)
                    pullTogether = (toLeft && this.compound.leftSide.positive == character.negative) || (toRight && this.compound.rightSide.positive == character.negative)
                }

                if (pullTogether) {
                    vx *= this.electronegativity
                    vy *= this.electronegativity

                    if ((this.middleBottom.getY > window_height - 20 || this.onLineFloor) && vy > 0) vy = 0

                    if (!(character.isGrounded() && vy > 0)) character.applyVelocity(1, [-vx, -vy / 2])
                    else character.applyVelocity(1, [-vx, 0])

                    if (character.compound == undefined) this.applyVelocity(MOVING_FRAMES, [vx, -vy])
                    else character.compound.applyVelocity(MOVING_FRAMES, [vx, vy])
                }
                else if (pushApart) {
                    if (!(character.isGrounded() && vy > 0)) character.applyVelocity(1, [vx, vy / 2])
                    else character.applyVelocity(1, [vx, 0])

                    if (distance < MULTIPLIER / 2) vx = -vx * distance

                    if ((this.middleBottom.getY > window_height - 20 || this.onLineFloor) && vy < 0) vy = 0

                    if (character.compound == undefined) this.applyVelocity(MOVING_FRAMES, [-vx, vy])
                    else character.compound.applyVelocity(MOVING_FRAMES, [-vx, vy])
                }
            }
        });
        
    }

    /**
     * @description method to be ran every frame
     */
    tickFunctions() {
        this.onGround = this.isGrounded()
        this.draw()
        this.applyGravity()
        this.collisionPhysics()
        this.aroundElectron()
    }
}