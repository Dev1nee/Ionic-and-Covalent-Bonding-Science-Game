let moveLeft: boolean;
let moveRight: boolean;
let crouched: boolean;
let jumping: boolean;
let awaitFall: boolean;
let window_height: number = window.screen.height
let window_width: number = window.screen.width
//effect how far the character is able to move along the x axis while in the air (greater number equals less movement in air)

export default class characterController {
    
    character
    spriteMap
    inAirResistance: number
    jumpForce: number
    speed: number
    flyingEnabled: boolean

    constructor(character, inAirResistance = 1.7, jumpForce = 150, speed = 5, flyingEnabled = false) {
        this.character = character
        this.character.isPlayer = true
        this.jumpForce = jumpForce
        this.speed = speed
        this.flyingEnabled = flyingEnabled
        this.inAirResistance = inAirResistance
        
        this.spriteMap = character.spriteMap
    }

    updateSpriteMap() {
        this.spriteMap = this.character.spriteMap
    }

    startControllerInput(jump: string = "Space", left: string = "KeyA", right: string = "KeyD", crouch: string = "ShiftLeft") {
        window.addEventListener("keydown", (event) => {
            if (this.character.disableInput) return
            switch (event.code) {
                case jump:
                    if (this.character.isGrounded || this.flyingEnabled)
                        this.character.applyVelocity(60, [0, this.jumpForce]); 
                        if (!(moveLeft || moveRight))
                            this.character.sprite = this.spriteMap.upFacing
                        else if (moveLeft)
                            this.character.sprite = this.spriteMap.upLeftFacing
                        else if (moveRight)
                            this.character.sprite = this.spriteMap.upRightFacing;
                    
                    jumping = true
                    awaitFall = true
                    break

                case crouch:
                    crouched = !crouched
                    this.character.sprite = this.spriteMap.downFacing
                    break

                case left:
                    moveLeft = true
                    this.character.sprite = this.spriteMap.leftFacing
                    break

                case right:
                    moveRight = true
                    this.character.sprite = this.spriteMap.rightFacing
                    break
            }
            // else console.log("INput DiSABleD")
        }) 

        window.addEventListener("keyup", (event) => {
            
            switch (event.code) {
                case jump:
                    if (moveLeft && !awaitFall) 
                        this.character.sprite = this.spriteMap.leftFacing;
                    else if (moveRight &&!awaitFall)
                    this.character.sprite = this.spriteMap.rightFacing;
                    jumping = false
                    break

                case crouch:
                    crouched = false
                    this.character.sprite = this.spriteMap.idle
                    break

                case left:
                    moveLeft = false
                    this.character.sprite = this.spriteMap.idle
                    break

                case right:
                    moveRight = false
                    this.character.sprite = this.spriteMap.idle
                    break
                
            }
        })



        let controllerOutput = () => {
            let appliedSpeed = this.character.isGrounded() ? this.speed : this.speed / this.inAirResistance
            if (crouched)
                appliedSpeed = this.speed / 5; 
                
            if (moveLeft)
                this.character.applyVelocity(1, [-appliedSpeed, 0]);
                
            if (moveRight)
                this.character.applyVelocity(1, [appliedSpeed, 0]);

            if (!jumping && this.character.isGrounded() && awaitFall) 
                this.character.sprite = this.spriteMap.idle
                awaitFall = false

            this.updateSpriteMap()
            requestAnimationFrame(controllerOutput)
        }

        controllerOutput()
    }
}