/* This file is automatically rebuilt by the Cesium build process. */
define(['./CylinderGeometry-0f092eea', './when-8ef61875', './GeometryOffsetAttribute-aaee36ff', './RuntimeError-1a9cdd11', './Transforms-b6813718', './Matrix2-c15d761a', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './combine-f5ea46e8', './CylinderGeometryLibrary-08182ca0', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './IndexDatatype-69282ed3', './VertexFormat-e90f96e7'], function (CylinderGeometry, when, GeometryOffsetAttribute, RuntimeError, Transforms, Matrix2, ComponentDatatype, WebGLConstants, combine, CylinderGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype, VertexFormat) { 'use strict';

  function createCylinderGeometry(cylinderGeometry, offset) {
    if (when.defined(offset)) {
      cylinderGeometry = CylinderGeometry.CylinderGeometry.unpack(cylinderGeometry, offset);
    }
    return CylinderGeometry.CylinderGeometry.createGeometry(cylinderGeometry);
  }

  return createCylinderGeometry;

});
