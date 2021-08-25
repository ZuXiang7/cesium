/* This file is automatically rebuilt by the Cesium build process. */
define(['./Matrix2-c15d761a', './when-8ef61875', './EllipseGeometry-23d632d3', './RuntimeError-1a9cdd11', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './GeometryOffsetAttribute-aaee36ff', './Transforms-b6813718', './combine-f5ea46e8', './EllipseGeometryLibrary-7d76887c', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './GeometryInstance-0232480a', './GeometryPipeline-139fa09a', './AttributeCompression-f7ab1851', './EncodedCartesian3-92a0b8af', './IndexDatatype-69282ed3', './IntersectionTests-2e0b5a64', './Plane-3ee26c7f', './VertexFormat-e90f96e7'], function (Matrix2, when, EllipseGeometry, RuntimeError, ComponentDatatype, WebGLConstants, GeometryOffsetAttribute, Transforms, combine, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Matrix2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Matrix2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

});
