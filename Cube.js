class Cube {
    constructor() {
        this.type = 'cube';
        this.color = color;
        this.matrix = new Matrix4()
    }

   
    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, ...rgba)

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        // Cubr front
        drawTriangle3D([0,0,0, 1,1,0, 1,0,0])
        drawTriangle3D([0,0,0, 0,1,0, 1,1,0])

        // Cubr back
        drawTriangle3D([0,0,1, 1,1,1, 1,0,1])
        drawTriangle3D([0,0,1, 0,1,1, 1,1,1])

        gl.uniform4f(u_FragColor, ...rgba.map(v => v*.8))
        
        // Cube right
        drawTriangle3D([1,0,0, 1,1,1, 1,1,0])
        drawTriangle3D([1,0,0, 1,1,1, 1,0,1])

        // Cube left
        drawTriangle3D([0,0,0, 0,1,1, 0,1,0])
        drawTriangle3D([0,0,0, 0,1,1, 0,0,1])
        

        gl.uniform4f(u_FragColor, ...rgba.map(v => v*.7))
        

        // Cube top
        drawTriangle3D([0,1,0, 0,1,1, 1,1,1])
        drawTriangle3D([0,1,0, 1,1,1, 1,1,0])


        // Cube bottom
        drawTriangle3D([0,0,0, 0,0,1, 1,0,1])
        drawTriangle3D([0,0,0, 1,0,1, 1,0,0])


        



    }
}
