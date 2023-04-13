let moveLeft = false
let moveRight = false
let crouched = false
let jumping = false
let awaitFall = false
let window_height = window.screen.height
let window_width = window.screen.width
//effect how far the character is able to move along the x axis while in the air (greater number equals less movement in air)

export default class characterController {

    /**
     * @description controls how the character acts when a button is pressed as well as what animation is played
     * @param {Character} character character object linked to characterController
     * @param {number} jumpForce force applied when jump button is pressed is pressed
     * @param {boolean} flyingEnabled whether or not flying will be allowed
     * @param {number} speed 
     * @param {number} inAirResistance 
     */
    constructor(character, inAirResistance = 1.7, jumpForce = 150, speed = 5, flyingEnabled = false) {
        this.character = character
        this.character.isPlayer = true
        this.jumpForce = jumpForce
        this.speed = speed
        this.flyingEnabled = flyingEnabled
        this.inAirResistance = inAirResistance
        
        this.spriteMap = character.spriteMap
    }

    /**
     * @description gets the characters current spriteMap and sets it as this.spriteMap
     */
    updateSpriteMap() {
        this.spriteMap = this.character.spriteMap
    }

    /**
     * @description starts listening for controller input
     * @param {String} jump the button code to listen for when jumping
     * @param {String} left the button code to listen for when moving left
     * @param {String} right the button code to listen for when moving right
     */
    startControllerInput(jump = "Space", left = "KeyA", right = "KeyD", crouch = "ShiftLeft") {
        window.addEventListener("keydown", (event) => {
            //console.log(event.code)
            if (!this.character.disableInput) {
                if (event.code == jump && (this.character.isGrounded() || this.flyingEnabled)) {
                    this.character.applyVelocity(60, [0, this.jumpForce])
                    if (!(moveLeft || moveRight)) this.character.sprite = this.spriteMap.upFacing
                    else if (moveLeft) this.character.sprite = this.spriteMap.upLeftFacing
                    else if (moveRight) this.character.sprite = this.spriteMap.upRightFacing
                    //console.log(this.character.middleBottom.getY + ": " + window_height)
                    jumping = true
                    awaitFall = true
                }
                if (event.code == crouch) {
                    crouched = true
                    this.character.sprite = this.spriteMap.downFacing
                } 
                if (event.code == left) {
                    moveLeft = true
                    this.character.sprite = this.spriteMap.leftFacing
                }
                if (event.code == right) {
                    moveRight = true
                    this.character.sprite = this.spriteMap.rightFacing
                }
                
            }
            // else console.log("INput DiSABleD")
        }) 

        window.addEventListener("keyup", (event) => {
            //console.log(event.code)
            if (event.code == jump) {
                if (moveLeft && !awaitFall) {this.character.sprite = this.spriteMap.leftFacing}
                else if (moveRight && !awaitFall) {this.character.sprite = this.spriteMap.rightFacing}
                jumping = false
            }
            if (event.code == left) {
                moveLeft = false
                this.character.sprite = this.spriteMap.idle
            }
            if (event.code == right) {
                moveRight = false
                this.character.sprite = this.spriteMap.idle
            }
            if (event.code == crouch) {
                crouched = false
                this.character.sprite = this.spriteMap.idle
            }
        })

        let controllerOutput = () => {
            let appliedSpeed = this.speed
            if (this.character.isGrounded()) appliedSpeed = this.speed
            else appliedSpeed = this.speed / this.inAirResistance
            if (crouched) appliedSpeed = this.speed / 5
            if (moveLeft) {this.character.applyVelocity(1, [-appliedSpeed, 0])}
            if (moveRight) this.character.applyVelocity(1, [appliedSpeed, 0])
            if (!jumping && this.character.isGrounded() && awaitFall) {
                this.character.sprite = this.spriteMap.idle
                awaitFall = false
                // if (moveLeft) this.character.sprite = this.spriteMap.leftFacing
                // else if (moveRight) this.character.sprite = this.spriteMap.rightFacing
            }
            
            if (this.spriteMap != this.character.spriteMap) this.updateSpriteMap()
            requestAnimationFrame(controllerOutput)
            }
        
        controllerOutput()
    }
}