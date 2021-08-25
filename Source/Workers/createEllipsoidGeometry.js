/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-8ef61875', './EllipsoidGeometry-aa2ad180', './GeometryOffsetAttribute-aaee36ff', './RuntimeError-1a9cdd11', './Transforms-b6813718', './Matrix2-c15d761a', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './combine-f5ea46e8', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './IndexDatatype-69282ed3', './VertexFormat-e90f96e7'], function (when, EllipsoidGeometry, GeometryOffsetAttribute, RuntimeError, Transforms, Matrix2, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, IndexDatatype, VertexFormat) { 'use strict';

  function createEllipsoidGeometry(ellipsoidGeometry, offset) {
    if (when.defined(offset)) {
      ellipsoidGeometry = EllipsoidGeometry.EllipsoidGeometry.unpack(ellipsoidGeometry, offset);
    }
    return EllipsoidGeometry.EllipsoidGeometry.createGeometry(ellipsoidGeometry);
  }

  return createEllipsoidGeometry;

});
