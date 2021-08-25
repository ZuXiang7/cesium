/* This file is automatically rebuilt by the Cesium build process. */
define(['./PrimitivePipeline-11dbeb27', './createTaskProcessorWorker', './Transforms-b6813718', './Matrix2-c15d761a', './RuntimeError-1a9cdd11', './when-8ef61875', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './combine-f5ea46e8', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './GeometryPipeline-139fa09a', './AttributeCompression-f7ab1851', './EncodedCartesian3-92a0b8af', './IndexDatatype-69282ed3', './IntersectionTests-2e0b5a64', './Plane-3ee26c7f', './WebMercatorProjection-cebe272e'], function (PrimitivePipeline, createTaskProcessorWorker, Transforms, Matrix2, RuntimeError, when, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, WebMercatorProjection) { 'use strict';

  function combineGeometry(packedParameters, transferableObjects) {
    var parameters = PrimitivePipeline.PrimitivePipeline.unpackCombineGeometryParameters(
      packedParameters
    );
    var results = PrimitivePipeline.PrimitivePipeline.combineGeometry(parameters);
    return PrimitivePipeline.PrimitivePipeline.packCombineGeometryResults(
      results,
      transferableObjects
    );
  }
  var combineGeometry$1 = createTaskProcessorWorker(combineGeometry);

  return combineGeometry$1;

});
