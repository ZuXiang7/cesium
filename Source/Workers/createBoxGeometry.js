/* This file is automatically rebuilt by the Cesium build process. */
define(['./BoxGeometry-65f24067', './when-8ef61875', './GeometryOffsetAttribute-aaee36ff', './RuntimeError-1a9cdd11', './Transforms-b6813718', './Matrix2-c15d761a', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './combine-f5ea46e8', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './VertexFormat-e90f96e7'], function (BoxGeometry, when, GeometryOffsetAttribute, RuntimeError, Transforms, Matrix2, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, VertexFormat) { 'use strict';

  function createBoxGeometry(boxGeometry, offset) {
    if (when.defined(offset)) {
      boxGeometry = BoxGeometry.BoxGeometry.unpack(boxGeometry, offset);
    }
    return BoxGeometry.BoxGeometry.createGeometry(boxGeometry);
  }

  return createBoxGeometry;

});
