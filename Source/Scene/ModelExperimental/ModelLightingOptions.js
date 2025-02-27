import defaultValue from "../../Core/defaultValue.js";
import LightingModel from "./LightingModel.js";

/**
 * Options for configuring the {@link LightingPipelineStage}
 *
 * @param {Object} options An object containing the following options
 * @param {LightingModel} [options.lightingModel=LightingModel.UNLIT] The lighting model to use
 *
 * @alias ModelLightingOptions
 * @constructor
 *
 * @private
 */
export default function ModelLightingOptions(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  /**
   * The lighting model to use, such as UNLIT or PBR.
   *
   * @type {LightingModel}
   *
   * @private
   */
  this.lightingModel = defaultValue(options.lightingModel, LightingModel.UNLIT);
}
