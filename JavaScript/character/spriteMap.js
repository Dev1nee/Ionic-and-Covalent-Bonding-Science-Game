export default class spriteMap {
    /**
     * @description a simple class that stores data about character sprite behavior
     * @param {String} idle the default or beginning pose
     * @param {number} scale the scale multiplied to each dimesions of the sprite, no scale = 1
     * @param {String} leftFacing the sprite to be loaded when the character faces the left
     * @param {String} rightFacing the sprite to be loaded when the character faces the right
     * @param {String} upFacing the sprite to be loaded when the character faces up
     * @param {String} downFacing the sprite to be loaded when the character faces down
     * @param {String} upLeftFacing the sprite to be loaded when the character faces up and to the left
     * @param {String} upRightFacing the sprite to be loaded when the character faces up and to the right
     */
    constructor(idle, scale = 1, leftFacing = idle, rightFacing = idle, upFacing = idle, downFacing = idle, upLeftFacing = upFacing, upRightFacing = upFacing) {
        this.scale = scale

        this.idle = idle
        this.leftFacing = leftFacing
        this.rightFacing = rightFacing
        this.upFacing = upFacing
        this.downFacing = downFacing
        this.upLeftFacing = upLeftFacing
        this.upRightFacing = upRightFacing
    }
}