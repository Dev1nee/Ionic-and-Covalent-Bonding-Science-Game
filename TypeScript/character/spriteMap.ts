export default class spriteMap {
    idle: boolean;
    scale: number = 1;
    leftFacing: boolean;
    rightFacing: boolean;
    upFacing: boolean;
    downFacing: boolean;
    upLeftFacing: boolean;
    upRightFacing: boolean;

    constructor(idle: boolean, scale = 1, leftFacing = idle, rightFacing = idle, upFacing = idle, downFacing = idle, upLeftFacing = upFacing, upRightFacing = upFacing) {
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