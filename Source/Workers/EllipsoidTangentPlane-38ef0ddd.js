/* This file is automatically rebuilt by the Cesium build process. */
define(['exports', './AxisAlignedBoundingBox-293093d5', './Matrix2-c15d761a', './RuntimeError-1a9cdd11', './when-8ef61875', './IntersectionTests-2e0b5a64', './Plane-3ee26c7f', './Transforms-b6813718'], function (exports, AxisAlignedBoundingBox, Matrix2, RuntimeError, when, IntersectionTests, Plane, Transforms) { 'use strict';

  var scratchCart4 = new Matrix2.Cartesian4();
  /**
   * A plane tangent to the provided ellipsoid at the provided origin.
   * If origin is not on the surface of the ellipsoid, it's surface projection will be used.
   * If origin is at the center of the ellipsoid, an exception will be thrown.
   * @alias EllipsoidTangentPlane
   * @constructor
   *
   * @param {Cartesian3} origin The point on the surface of the ellipsoid where the tangent plane touches.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
   *
   * @exception {DeveloperError} origin must not be at the center of the ellipsoid.
   */
  function EllipsoidTangentPlane(origin, ellipsoid) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("origin", origin);
    //>>includeEnd('debug');

    ellipsoid = when.defaultValue(ellipsoid, Matrix2.Ellipsoid.WGS84);
    origin = ellipsoid.scaleToGeodeticSurface(origin);

    //>>includeStart('debug', pragmas.debug);
    if (!when.defined(origin)) {
      throw new RuntimeError.DeveloperError(
        "origin must not be at the center of the ellipsoid."
      );
    }
    //>>includeEnd('debug');

    var eastNorthUp = Transforms.Transforms.eastNorthUpToFixedFrame(origin, ellipsoid);
    this._ellipsoid = ellipsoid;
    this._origin = origin;
    this._xAxis = Matrix2.Cartesian3.fromCartesian4(
      Matrix2.Matrix4.getColumn(eastNorthUp, 0, scratchCart4)
    );
    this._yAxis = Matrix2.Cartesian3.fromCartesian4(
      Matrix2.Matrix4.getColumn(eastNorthUp, 1, scratchCart4)
    );

    var normal = Matrix2.Cartesian3.fromCartesian4(
      Matrix2.Matrix4.getColumn(eastNorthUp, 2, scratchCart4)
    );
    this._plane = Plane.Plane.fromPointNormal(origin, normal);
  }

  Object.defineProperties(EllipsoidTangentPlane.prototype, {
    /**
     * Gets the ellipsoid.
     * @memberof EllipsoidTangentPlane.prototype
     * @type {Ellipsoid}
     */
    ellipsoid: {
      get: function () {
        return this._ellipsoid;
      },
    },

    /**
     * Gets the origin.
     * @memberof EllipsoidTangentPlane.prototype
     * @type {Cartesian3}
     */
    origin: {
      get: function () {
        return this._origin;
      },
    },

    /**
     * Gets the plane which is tangent to the ellipsoid.
     * @memberof EllipsoidTangentPlane.prototype
     * @readonly
     * @type {Plane}
     */
    plane: {
      get: function () {
        return this._plane;
      },
    },

    /**
     * Gets the local X-axis (east) of the tangent plane.
     * @memberof EllipsoidTangentPlane.prototype
     * @readonly
     * @type {Cartesian3}
     */
    xAxis: {
      get: function () {
        return this._xAxis;
      },
    },

    /**
     * Gets the local Y-axis (north) of the tangent plane.
     * @memberof EllipsoidTangentPlane.prototype
     * @readonly
     * @type {Cartesian3}
     */
    yAxis: {
      get: function () {
        return this._yAxis;
      },
    },

    /**
     * Gets the local Z-axis (up) of the tangent plane.
     * @memberof EllipsoidTangentPlane.prototype
     * @readonly
     * @type {Cartesian3}
     */
    zAxis: {
      get: function () {
        return this._plane.normal;
      },
    },
  });

  var tmp = new AxisAlignedBoundingBox.AxisAlignedBoundingBox();
  /**
   * Creates a new instance from the provided ellipsoid and the center
   * point of the provided Cartesians.
   *
   * @param {Cartesian3[]} cartesians The list of positions surrounding the center point.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
   * @returns {EllipsoidTangentPlane} The new instance of EllipsoidTangentPlane.
   */
  EllipsoidTangentPlane.fromPoints = function (cartesians, ellipsoid) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesians", cartesians);
    //>>includeEnd('debug');

    var box = AxisAlignedBoundingBox.AxisAlignedBoundingBox.fromPoints(cartesians, tmp);
    return new EllipsoidTangentPlane(box.center, ellipsoid);
  };

  var scratchProjectPointOntoPlaneRay = new IntersectionTests.Ray();
  var scratchProjectPointOntoPlaneCartesian3 = new Matrix2.Cartesian3();

  /**
   * Computes the projection of the provided 3D position onto the 2D plane, radially outward from the {@link EllipsoidTangentPlane.ellipsoid} coordinate system origin.
   *
   * @param {Cartesian3} cartesian The point to project.
   * @param {Cartesian2} [result] The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided. Undefined if there is no intersection point
   */
  EllipsoidTangentPlane.prototype.projectPointOntoPlane = function (
    cartesian,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesian", cartesian);
    //>>includeEnd('debug');

    var ray = scratchProjectPointOntoPlaneRay;
    ray.origin = cartesian;
    Matrix2.Cartesian3.normalize(cartesian, ray.direction);

    var intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(
      ray,
      this._plane,
      scratchProjectPointOntoPlaneCartesian3
    );
    if (!when.defined(intersectionPoint)) {
      Matrix2.Cartesian3.negate(ray.direction, ray.direction);
      intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(
        ray,
        this._plane,
        scratchProjectPointOntoPlaneCartesian3
      );
    }

    if (when.defined(intersectionPoint)) {
      var v = Matrix2.Cartesian3.subtract(
        intersectionPoint,
        this._origin,
        intersectionPoint
      );
      var x = Matrix2.Cartesian3.dot(this._xAxis, v);
      var y = Matrix2.Cartesian3.dot(this._yAxis, v);

      if (!when.defined(result)) {
        return new Matrix2.Cartesian2(x, y);
      }
      result.x = x;
      result.y = y;
      return result;
    }
    return undefined;
  };

  /**
   * Computes the projection of the provided 3D positions onto the 2D plane (where possible), radially outward from the global origin.
   * The resulting array may be shorter than the input array - if a single projection is impossible it will not be included.
   *
   * @see EllipsoidTangentPlane.projectPointOntoPlane
   *
   * @param {Cartesian3[]} cartesians The array of points to project.
   * @param {Cartesian2[]} [result] The array of Cartesian2 instances onto which to store results.
   * @returns {Cartesian2[]} The modified result parameter or a new array of Cartesian2 instances if none was provided.
   */
  EllipsoidTangentPlane.prototype.projectPointsOntoPlane = function (
    cartesians,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesians", cartesians);
    //>>includeEnd('debug');

    if (!when.defined(result)) {
      result = [];
    }

    var count = 0;
    var length = cartesians.length;
    for (var i = 0; i < length; i++) {
      var p = this.projectPointOntoPlane(cartesians[i], result[count]);
      if (when.defined(p)) {
        result[count] = p;
        count++;
      }
    }
    result.length = count;
    return result;
  };

  /**
   * Computes the projection of the provided 3D position onto the 2D plane, along the plane normal.
   *
   * @param {Cartesian3} cartesian The point to project.
   * @param {Cartesian2} [result] The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
   */
  EllipsoidTangentPlane.prototype.projectPointToNearestOnPlane = function (
    cartesian,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesian", cartesian);
    //>>includeEnd('debug');

    if (!when.defined(result)) {
      result = new Matrix2.Cartesian2();
    }

    var ray = scratchProjectPointOntoPlaneRay;
    ray.origin = cartesian;
    Matrix2.Cartesian3.clone(this._plane.normal, ray.direction);

    var intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(
      ray,
      this._plane,
      scratchProjectPointOntoPlaneCartesian3
    );
    if (!when.defined(intersectionPoint)) {
      Matrix2.Cartesian3.negate(ray.direction, ray.direction);
      intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(
        ray,
        this._plane,
        scratchProjectPointOntoPlaneCartesian3
      );
    }

    var v = Matrix2.Cartesian3.subtract(
      intersectionPoint,
      this._origin,
      intersectionPoint
    );
    var x = Matrix2.Cartesian3.dot(this._xAxis, v);
    var y = Matrix2.Cartesian3.dot(this._yAxis, v);

    result.x = x;
    result.y = y;
    return result;
  };

  /**
   * Computes the projection of the provided 3D positions onto the 2D plane, along the plane normal.
   *
   * @see EllipsoidTangentPlane.projectPointToNearestOnPlane
   *
   * @param {Cartesian3[]} cartesians The array of points to project.
   * @param {Cartesian2[]} [result] The array of Cartesian2 instances onto which to store results.
   * @returns {Cartesian2[]} The modified result parameter or a new array of Cartesian2 instances if none was provided. This will have the same length as <code>cartesians</code>.
   */
  EllipsoidTangentPlane.prototype.projectPointsToNearestOnPlane = function (
    cartesians,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesians", cartesians);
    //>>includeEnd('debug');

    if (!when.defined(result)) {
      result = [];
    }

    var length = cartesians.length;
    result.length = length;
    for (var i = 0; i < length; i++) {
      result[i] = this.projectPointToNearestOnPlane(cartesians[i], result[i]);
    }
    return result;
  };

  var projectPointsOntoEllipsoidScratch = new Matrix2.Cartesian3();
  /**
   * Computes the projection of the provided 2D position onto the 3D ellipsoid.
   *
   * @param {Cartesian2} cartesian The points to project.
   * @param {Cartesian3} [result] The Cartesian3 instance to store result.
   * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
   */
  EllipsoidTangentPlane.prototype.projectPointOntoEllipsoid = function (
    cartesian,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesian", cartesian);
    //>>includeEnd('debug');

    if (!when.defined(result)) {
      result = new Matrix2.Cartesian3();
    }

    var ellipsoid = this._ellipsoid;
    var origin = this._origin;
    var xAxis = this._xAxis;
    var yAxis = this._yAxis;
    var tmp = projectPointsOntoEllipsoidScratch;

    Matrix2.Cartesian3.multiplyByScalar(xAxis, cartesian.x, tmp);
    result = Matrix2.Cartesian3.add(origin, tmp, result);
    Matrix2.Cartesian3.multiplyByScalar(yAxis, cartesian.y, tmp);
    Matrix2.Cartesian3.add(result, tmp, result);
    ellipsoid.scaleToGeocentricSurface(result, result);

    return result;
  };

  /**
   * Computes the projection of the provided 2D positions onto the 3D ellipsoid.
   *
   * @param {Cartesian2[]} cartesians The array of points to project.
   * @param {Cartesian3[]} [result] The array of Cartesian3 instances onto which to store results.
   * @returns {Cartesian3[]} The modified result parameter or a new array of Cartesian3 instances if none was provided.
   */
  EllipsoidTangentPlane.prototype.projectPointsOntoEllipsoid = function (
    cartesians,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("cartesians", cartesians);
    //>>includeEnd('debug');

    var length = cartesians.length;
    if (!when.defined(result)) {
      result = new Array(length);
    } else {
      result.length = length;
    }

    for (var i = 0; i < length; ++i) {
      result[i] = this.projectPointOntoEllipsoid(cartesians[i], result[i]);
    }

    return result;
  };

  exports.EllipsoidTangentPlane = EllipsoidTangentPlane;

});
