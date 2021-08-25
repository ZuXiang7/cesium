/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-8ef61875', './FrustumGeometry-1bb858ea', './Transforms-b6813718', './Matrix2-c15d761a', './RuntimeError-1a9cdd11', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './combine-f5ea46e8', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './Plane-3ee26c7f', './VertexFormat-e90f96e7'], function (when, FrustumGeometry, Transforms, Matrix2, RuntimeError, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, Plane, VertexFormat) { 'use strict';

  function createFrustumGeometry(frustumGeometry, offset) {
    if (when.defined(offset)) {
      frustumGeometry = FrustumGeometry.FrustumGeometry.unpack(frustumGeometry, offset);
    }
    return FrustumGeometry.FrustumGeometry.createGeometry(frustumGeometry);
  }

  return createFrustumGeometry;

});
