//This file is automatically rebuilt by the Cesium build process.
export default "precision highp float;\n\
\n\
void main() \n\
{\n\
    vec3 position = vec3(0.0);  \n\
\n\
    position = processGeometry(position);\n\
\n\
    #ifdef HAS_INSTANCING\n\
    position = instancingStage(position);\n\
    #endif\n\
\n\
    gl_Position = czm_modelViewProjection * vec4(position, 1.0);\n\
\n\
    #ifdef PRIMITIVE_TYPE_POINTS\n\
    processPoints();\n\
    #endif\n\
}";
