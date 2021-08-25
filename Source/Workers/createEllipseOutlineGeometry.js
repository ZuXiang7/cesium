/* This file is automatically rebuilt by the Cesium build process. */
define(['./Matrix2-c15d761a', './when-8ef61875', './EllipseOutlineGeometry-c32d273d', './RuntimeError-1a9cdd11', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './GeometryOffsetAttribute-aaee36ff', './Transforms-b6813718', './combine-f5ea46e8', './EllipseGeometryLibrary-7d76887c', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './IndexDatatype-69282ed3'], function (Matrix2, when, EllipseOutlineGeometry, RuntimeError, ComponentDatatype, WebGLConstants, GeometryOffsetAttribute, Transforms, combine, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype) { 'use strict';

  function createEllipseOutlineGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseOutlineGeometry.EllipseOutlineGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Matrix2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Matrix2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseOutlineGeometry.EllipseOutlineGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseOutlineGeometry;

});
