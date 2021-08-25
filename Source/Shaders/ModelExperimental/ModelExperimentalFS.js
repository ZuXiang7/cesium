//This file is automatically rebuilt by the Cesium build process.
export default "vec4 handleAlpha(vec3 color, float alpha)\n\
{\n\
    #ifdef ALPHA_MODE_MASK\n\
    if (alpha < u_alphaCutoff) {\n\
        discard;\n\
    }\n\
    return vec4(color, 1.0);\n\
    #elif defined(ALPHA_MODE_BLEND)\n\
    return vec4(color, alpha);\n\
    #else // OPAQUE\n\
    return vec4(color, 1.0);\n\
    #endif\n\
}\n\
\n\
void main() \n\
{\n\
    czm_modelMaterial material = defaultModelMaterial();\n\
\n\
    material = materialStage(material);\n\
    material = lightingStage(material);\n\
\n\
    vec4 color = handleAlpha(material.diffuse, material.alpha);\n\
    gl_FragColor = color;\n\
}";
