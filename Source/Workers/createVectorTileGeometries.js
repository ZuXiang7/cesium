/* This file is automatically rebuilt by the Cesium build process. */
define(['./Transforms-b6813718', './BoxGeometry-65f24067', './Matrix2-c15d761a', './Color-81fbd0ed', './CylinderGeometry-0f092eea', './when-8ef61875', './EllipsoidGeometry-aa2ad180', './IndexDatatype-69282ed3', './createTaskProcessorWorker', './RuntimeError-1a9cdd11', './ComponentDatatype-17e8f986', './WebGLConstants-cf1206a6', './combine-f5ea46e8', './GeometryOffsetAttribute-aaee36ff', './GeometryAttribute-68160f89', './GeometryAttributes-d3e6468f', './VertexFormat-e90f96e7', './CylinderGeometryLibrary-08182ca0'], function (Transforms, BoxGeometry, Matrix2, Color, CylinderGeometry, when, EllipsoidGeometry, IndexDatatype, createTaskProcessorWorker, RuntimeError, ComponentDatatype, WebGLConstants, combine, GeometryOffsetAttribute, GeometryAttribute, GeometryAttributes, VertexFormat, CylinderGeometryLibrary) { 'use strict';

  /**
   * Describes a renderable batch of geometry.
   *
   * @alias Vector3DTileBatch
   * @constructor
   *
   * @param {Object} options An object with the following properties:
   * @param {Number} options.offset The offset of the batch into the indices buffer.
   * @param {Number} options.count The number of indices in the batch.
   * @param {Color} options.color The color of the geometry in the batch.
   * @param {Number[]} options.batchIds An array where each element is the batch id of the geometry in the batch.
   *
   * @private
   */
  function Vector3DTileBatch(options) {
    /**
     * The offset of the batch into the indices buffer.
     * @type {Number}
     */
    this.offset = options.offset;
    /**
     * The number of indices in the batch.
     * @type {Number}
     */
    this.count = options.count;
    /**
     * The color of the geometry in the batch.
     * @type {Color}
     */
    this.color = options.color;
    /**
     * An array where each element is the batch id of the geometry in the batch.
     * @type {Number[]}
     */
    this.batchIds = options.batchIds;
  }

  var scratchCartesian = new Matrix2.Cartesian3();

  var packedBoxLength = Matrix2.Matrix4.packedLength + Matrix2.Cartesian3.packedLength;
  var packedCylinderLength = Matrix2.Matrix4.packedLength + 2;
  var packedEllipsoidLength = Matrix2.Matrix4.packedLength + Matrix2.Cartesian3.packedLength;
  var packedSphereLength = Matrix2.Cartesian3.packedLength + 1;

  var scratchModelMatrixAndBV = {
    modelMatrix: new Matrix2.Matrix4(),
    boundingVolume: new Transforms.BoundingSphere(),
  };

  function boxModelMatrixAndBoundingVolume(boxes, index) {
    var boxIndex = index * packedBoxLength;

    var dimensions = Matrix2.Cartesian3.unpack(boxes, boxIndex, scratchCartesian);
    boxIndex += Matrix2.Cartesian3.packedLength;

    var boxModelMatrix = Matrix2.Matrix4.unpack(
      boxes,
      boxIndex,
      scratchModelMatrixAndBV.modelMatrix
    );
    Matrix2.Matrix4.multiplyByScale(boxModelMatrix, dimensions, boxModelMatrix);

    var boundingVolume = scratchModelMatrixAndBV.boundingVolume;
    Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, boundingVolume.center);
    boundingVolume.radius = Math.sqrt(3.0);

    return scratchModelMatrixAndBV;
  }

  function cylinderModelMatrixAndBoundingVolume(cylinders, index) {
    var cylinderIndex = index * packedCylinderLength;

    var cylinderRadius = cylinders[cylinderIndex++];
    var length = cylinders[cylinderIndex++];
    var scale = Matrix2.Cartesian3.fromElements(
      cylinderRadius,
      cylinderRadius,
      length,
      scratchCartesian
    );

    var cylinderModelMatrix = Matrix2.Matrix4.unpack(
      cylinders,
      cylinderIndex,
      scratchModelMatrixAndBV.modelMatrix
    );
    Matrix2.Matrix4.multiplyByScale(cylinderModelMatrix, scale, cylinderModelMatrix);

    var boundingVolume = scratchModelMatrixAndBV.boundingVolume;
    Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, boundingVolume.center);
    boundingVolume.radius = Math.sqrt(2.0);

    return scratchModelMatrixAndBV;
  }

  function ellipsoidModelMatrixAndBoundingVolume(ellipsoids, index) {
    var ellipsoidIndex = index * packedEllipsoidLength;

    var radii = Matrix2.Cartesian3.unpack(ellipsoids, ellipsoidIndex, scratchCartesian);
    ellipsoidIndex += Matrix2.Cartesian3.packedLength;

    var ellipsoidModelMatrix = Matrix2.Matrix4.unpack(
      ellipsoids,
      ellipsoidIndex,
      scratchModelMatrixAndBV.modelMatrix
    );
    Matrix2.Matrix4.multiplyByScale(ellipsoidModelMatrix, radii, ellipsoidModelMatrix);

    var boundingVolume = scratchModelMatrixAndBV.boundingVolume;
    Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, boundingVolume.center);
    boundingVolume.radius = 1.0;

    return scratchModelMatrixAndBV;
  }

  function sphereModelMatrixAndBoundingVolume(spheres, index) {
    var sphereIndex = index * packedSphereLength;

    var sphereRadius = spheres[sphereIndex++];

    var sphereTranslation = Matrix2.Cartesian3.unpack(
      spheres,
      sphereIndex,
      scratchCartesian
    );
    var sphereModelMatrix = Matrix2.Matrix4.fromTranslation(
      sphereTranslation,
      scratchModelMatrixAndBV.modelMatrix
    );
    Matrix2.Matrix4.multiplyByUniformScale(
      sphereModelMatrix,
      sphereRadius,
      sphereModelMatrix
    );

    var boundingVolume = scratchModelMatrixAndBV.boundingVolume;
    Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, boundingVolume.center);
    boundingVolume.radius = 1.0;

    return scratchModelMatrixAndBV;
  }

  var scratchPosition = new Matrix2.Cartesian3();

  function createPrimitive(
    options,
    primitive,
    primitiveBatchIds,
    geometry,
    getModelMatrixAndBoundingVolume
  ) {
    if (!when.defined(primitive)) {
      return;
    }

    var numberOfPrimitives = primitiveBatchIds.length;
    var geometryPositions = geometry.attributes.position.values;
    var geometryIndices = geometry.indices;

    var positions = options.positions;
    var vertexBatchIds = options.vertexBatchIds;
    var indices = options.indices;

    var batchIds = options.batchIds;
    var batchTableColors = options.batchTableColors;
    var batchedIndices = options.batchedIndices;
    var indexOffsets = options.indexOffsets;
    var indexCounts = options.indexCounts;
    var boundingVolumes = options.boundingVolumes;

    var modelMatrix = options.modelMatrix;
    var center = options.center;

    var positionOffset = options.positionOffset;
    var batchIdIndex = options.batchIdIndex;
    var indexOffset = options.indexOffset;
    var batchedIndicesOffset = options.batchedIndicesOffset;

    for (var i = 0; i < numberOfPrimitives; ++i) {
      var primitiveModelMatrixAndBV = getModelMatrixAndBoundingVolume(
        primitive,
        i
      );
      var primitiveModelMatrix = primitiveModelMatrixAndBV.modelMatrix;
      Matrix2.Matrix4.multiply(modelMatrix, primitiveModelMatrix, primitiveModelMatrix);

      var batchId = primitiveBatchIds[i];

      var positionsLength = geometryPositions.length;
      for (var j = 0; j < positionsLength; j += 3) {
        var position = Matrix2.Cartesian3.unpack(geometryPositions, j, scratchPosition);
        Matrix2.Matrix4.multiplyByPoint(primitiveModelMatrix, position, position);
        Matrix2.Cartesian3.subtract(position, center, position);

        Matrix2.Cartesian3.pack(position, positions, positionOffset * 3 + j);
        vertexBatchIds[batchIdIndex++] = batchId;
      }

      var indicesLength = geometryIndices.length;
      for (var k = 0; k < indicesLength; ++k) {
        indices[indexOffset + k] = geometryIndices[k] + positionOffset;
      }

      var offset = i + batchedIndicesOffset;
      batchedIndices[offset] = new Vector3DTileBatch({
        offset: indexOffset,
        count: indicesLength,
        color: Color.Color.fromRgba(batchTableColors[batchId]),
        batchIds: [batchId],
      });
      batchIds[offset] = batchId;
      indexOffsets[offset] = indexOffset;
      indexCounts[offset] = indicesLength;
      boundingVolumes[offset] = Transforms.BoundingSphere.transform(
        primitiveModelMatrixAndBV.boundingVolume,
        primitiveModelMatrix
      );

      positionOffset += positionsLength / 3;
      indexOffset += indicesLength;
    }

    options.positionOffset = positionOffset;
    options.batchIdIndex = batchIdIndex;
    options.indexOffset = indexOffset;
    options.batchedIndicesOffset += numberOfPrimitives;
  }

  var scratchCenter = new Matrix2.Cartesian3();
  var scratchMatrix4 = new Matrix2.Matrix4();

  function unpackBuffer(buffer) {
    var packedBuffer = new Float64Array(buffer);

    var offset = 0;
    Matrix2.Cartesian3.unpack(packedBuffer, offset, scratchCenter);
    offset += Matrix2.Cartesian3.packedLength;

    Matrix2.Matrix4.unpack(packedBuffer, offset, scratchMatrix4);
  }

  function packedBatchedIndicesLength(batchedIndices) {
    var length = batchedIndices.length;
    var count = 0;
    for (var i = 0; i < length; ++i) {
      count += Color.Color.packedLength + 3 + batchedIndices[i].batchIds.length;
    }
    return count;
  }

  function packBuffer(indicesBytesPerElement, batchedIndices, boundingVolumes) {
    var numBVs = boundingVolumes.length;
    var length =
      1 +
      1 +
      numBVs * Transforms.BoundingSphere.packedLength +
      1 +
      packedBatchedIndicesLength(batchedIndices);

    var packedBuffer = new Float64Array(length);

    var offset = 0;
    packedBuffer[offset++] = indicesBytesPerElement;
    packedBuffer[offset++] = numBVs;

    for (var i = 0; i < numBVs; ++i) {
      Transforms.BoundingSphere.pack(boundingVolumes[i], packedBuffer, offset);
      offset += Transforms.BoundingSphere.packedLength;
    }

    var indicesLength = batchedIndices.length;
    packedBuffer[offset++] = indicesLength;

    for (var j = 0; j < indicesLength; ++j) {
      var batchedIndex = batchedIndices[j];

      Color.Color.pack(batchedIndex.color, packedBuffer, offset);
      offset += Color.Color.packedLength;

      packedBuffer[offset++] = batchedIndex.offset;
      packedBuffer[offset++] = batchedIndex.count;

      var batchIds = batchedIndex.batchIds;
      var batchIdsLength = batchIds.length;
      packedBuffer[offset++] = batchIdsLength;

      for (var k = 0; k < batchIdsLength; ++k) {
        packedBuffer[offset++] = batchIds[k];
      }
    }

    return packedBuffer;
  }

  function createVectorTileGeometries(parameters, transferableObjects) {
    var boxes = when.defined(parameters.boxes)
      ? new Float32Array(parameters.boxes)
      : undefined;
    var boxBatchIds = when.defined(parameters.boxBatchIds)
      ? new Uint16Array(parameters.boxBatchIds)
      : undefined;
    var cylinders = when.defined(parameters.cylinders)
      ? new Float32Array(parameters.cylinders)
      : undefined;
    var cylinderBatchIds = when.defined(parameters.cylinderBatchIds)
      ? new Uint16Array(parameters.cylinderBatchIds)
      : undefined;
    var ellipsoids = when.defined(parameters.ellipsoids)
      ? new Float32Array(parameters.ellipsoids)
      : undefined;
    var ellipsoidBatchIds = when.defined(parameters.ellipsoidBatchIds)
      ? new Uint16Array(parameters.ellipsoidBatchIds)
      : undefined;
    var spheres = when.defined(parameters.spheres)
      ? new Float32Array(parameters.spheres)
      : undefined;
    var sphereBatchIds = when.defined(parameters.sphereBatchIds)
      ? new Uint16Array(parameters.sphereBatchIds)
      : undefined;

    var numberOfBoxes = when.defined(boxes) ? boxBatchIds.length : 0;
    var numberOfCylinders = when.defined(cylinders) ? cylinderBatchIds.length : 0;
    var numberOfEllipsoids = when.defined(ellipsoids) ? ellipsoidBatchIds.length : 0;
    var numberOfSpheres = when.defined(spheres) ? sphereBatchIds.length : 0;

    var boxGeometry = BoxGeometry.BoxGeometry.getUnitBox();
    var cylinderGeometry = CylinderGeometry.CylinderGeometry.getUnitCylinder();
    var ellipsoidGeometry = EllipsoidGeometry.EllipsoidGeometry.getUnitEllipsoid();

    var boxPositions = boxGeometry.attributes.position.values;
    var cylinderPositions = cylinderGeometry.attributes.position.values;
    var ellipsoidPositions = ellipsoidGeometry.attributes.position.values;

    var numberOfPositions = boxPositions.length * numberOfBoxes;
    numberOfPositions += cylinderPositions.length * numberOfCylinders;
    numberOfPositions +=
      ellipsoidPositions.length * (numberOfEllipsoids + numberOfSpheres);

    var boxIndices = boxGeometry.indices;
    var cylinderIndices = cylinderGeometry.indices;
    var ellipsoidIndices = ellipsoidGeometry.indices;

    var numberOfIndices = boxIndices.length * numberOfBoxes;
    numberOfIndices += cylinderIndices.length * numberOfCylinders;
    numberOfIndices +=
      ellipsoidIndices.length * (numberOfEllipsoids + numberOfSpheres);

    var positions = new Float32Array(numberOfPositions);
    var vertexBatchIds = new Uint16Array(numberOfPositions / 3);
    var indices = IndexDatatype.IndexDatatype.createTypedArray(
      numberOfPositions / 3,
      numberOfIndices
    );

    var numberOfGeometries =
      numberOfBoxes + numberOfCylinders + numberOfEllipsoids + numberOfSpheres;
    var batchIds = new Uint16Array(numberOfGeometries);
    var batchedIndices = new Array(numberOfGeometries);
    var indexOffsets = new Uint32Array(numberOfGeometries);
    var indexCounts = new Uint32Array(numberOfGeometries);
    var boundingVolumes = new Array(numberOfGeometries);

    unpackBuffer(parameters.packedBuffer);

    var options = {
      batchTableColors: new Uint32Array(parameters.batchTableColors),
      positions: positions,
      vertexBatchIds: vertexBatchIds,
      indices: indices,
      batchIds: batchIds,
      batchedIndices: batchedIndices,
      indexOffsets: indexOffsets,
      indexCounts: indexCounts,
      boundingVolumes: boundingVolumes,
      positionOffset: 0,
      batchIdIndex: 0,
      indexOffset: 0,
      batchedIndicesOffset: 0,
      modelMatrix: scratchMatrix4,
      center: scratchCenter,
    };

    createPrimitive(
      options,
      boxes,
      boxBatchIds,
      boxGeometry,
      boxModelMatrixAndBoundingVolume
    );
    createPrimitive(
      options,
      cylinders,
      cylinderBatchIds,
      cylinderGeometry,
      cylinderModelMatrixAndBoundingVolume
    );
    createPrimitive(
      options,
      ellipsoids,
      ellipsoidBatchIds,
      ellipsoidGeometry,
      ellipsoidModelMatrixAndBoundingVolume
    );
    createPrimitive(
      options,
      spheres,
      sphereBatchIds,
      ellipsoidGeometry,
      sphereModelMatrixAndBoundingVolume
    );

    var packedBuffer = packBuffer(
      indices.BYTES_PER_ELEMENT,
      batchedIndices,
      boundingVolumes
    );
    transferableObjects.push(
      positions.buffer,
      vertexBatchIds.buffer,
      indices.buffer
    );
    transferableObjects.push(
      batchIds.buffer,
      indexOffsets.buffer,
      indexCounts.buffer
    );
    transferableObjects.push(packedBuffer.buffer);

    return {
      positions: positions.buffer,
      vertexBatchIds: vertexBatchIds.buffer,
      indices: indices.buffer,
      indexOffsets: indexOffsets.buffer,
      indexCounts: indexCounts.buffer,
      batchIds: batchIds.buffer,
      packedBuffer: packedBuffer.buffer,
    };
  }
  var createVectorTileGeometries$1 = createTaskProcessorWorker(createVectorTileGeometries);

  return createVectorTileGeometries$1;

});
