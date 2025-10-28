precision highp float;

in vec4 a_position;

void main()
{    
    //Transform my stuff!
    gl_Position = a_position;
}